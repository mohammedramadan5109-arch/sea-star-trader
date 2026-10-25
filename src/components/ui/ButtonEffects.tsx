'use client';

import { useEffect } from 'react';

/**
 * Site-wide button effects engine — glow + a restrained magnetic lean.
 *
 * A single document-level pointermove listener + one rAF loop drives:
 *
 *  - the cursor-following glow (writes --fx-x/--fx-y consumed by .fx-btn::before)
 *  - the magnetic lean: buttons drift a LITTLE (max 8px) toward the cursor,
 *    via the `translate` property so it composes with other transform effects
 *    like .btn-3d's lift instead of overriding them. The lean is clamped so a
 *    button can never cross over an adjacent button: if the moved rectangle
 *    would intersect another fx button on an axis, that axis is zeroed.
 *
 * Target elements (tagged without touching their styles):
 *   [data-fx-btn], .btn-3d, and generic padded CTA links (`a`/`[role="button"]`
 *   with px-5/px-6 + py-* classes). Opt-out any element with data-fx-skip.
 */
const MAGNET_PAD = 40; // px beyond the button edge where the lean kicks in
const MAGNET_STRENGTH = 0.25; // fraction of the cursor offset from center
const MAGNET_MAX = 8; // hard cap on the lean, px — "just a little bit"
const HALO_GRACE = 6; // settle-out distance so a resting button isn't twitchy
const LERP = 0.16; // per-frame easing factor
const SETTLE = 0.05; // motion below which the loop pauses

const SELECTOR =
  '[data-fx-btn], .btn-3d, a[class*="px-5"][class*="py-"], a[class*="px-6"][class*="py-"], [role="button"][class*="px-5"][class*="py-"], [role="button"][class*="px-6"][class*="py-"]';

interface LeanState {
  x: number;
  y: number;
}

export function ButtonEffects() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const anyHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!anyHover.matches || reduced.matches) return; // touch devices / motion off: stay inert

    let elements: HTMLElement[] = [];
    const states = new Map<HTMLElement, LeanState>();
    const tagged = new Set<HTMLElement>(); // elements we added fx-btn visuals to
    const pointer = { x: -99999, y: -99999 };
    let raf = 0;

    const collect = () => {
      elements = Array.from(
        document.querySelectorAll<HTMLElement>(SELECTOR)
      ).filter((el) => !el.hasAttribute('data-fx-skip'));
      for (const el of elements) {
        if (!el.classList.contains('fx-btn')) {
          el.classList.add('fx-btn');
          tagged.add(el);
        }
      }
      for (const key of states.keys()) {
        if (!key.isConnected) {
          states.delete(key);
          key.classList.remove('fx-btn');
          tagged.delete(key);
        }
      }
    };

    /** Resting rect of an element: current rect minus its active lean (so
     *  overlap checks aren't polluted by the lean we're animating right now). */
    const restingRect = (el: HTMLElement, rects: WeakMap<HTMLElement, DOMRect>) => {
      const r = rects.get(el);
      if (r) return r;
      const live = el.getBoundingClientRect();
      const st = states.get(el) ?? { x: 0, y: 0 };
      const rest = new DOMRect(live.x - st.x, live.y - st.y, live.width, live.height);
      rects.set(el, rest);
      return rest;
    };

    const intersects = (a: DOMRect, b: DOMRect, pad = 2) =>
      a.left - pad < b.right + pad &&
      a.right + pad > b.left - pad &&
      a.top - pad < b.bottom + pad &&
      a.bottom + pad > b.top - pad;

    const frame = () => {
      raf = 0;
      let moving = false;
      const rects = new WeakMap<HTMLElement, DOMRect>();

      // Pass 1 — cache resting rects + set glow coordinates.
      const resting = new Map<HTMLElement, DOMRect>();
      for (const el of elements) {
        resting.set(el, restingRect(el, rects));
      }

      // Pass 2 — compute tentative leans, clamped for no button-on-button overlap.
      const targets = new Map<HTMLElement, { x: number; y: number }>();
      for (const el of elements) {
        const r = resting.get(el);
        if (!r || !r.width || !r.height) continue;

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        // Glow coordinates — wherever the cursor currently sits inside the button.
        if (
          pointer.x >= r.left &&
          pointer.x <= r.right &&
          pointer.y >= r.top &&
          pointer.y <= r.bottom
        ) {
          el.style.setProperty('--fx-x', `${(((pointer.x - r.left) / r.width) * 100).toFixed(1)}%`);
          el.style.setProperty('--fx-y', `${(((pointer.y - r.top) / r.height) * 100).toFixed(1)}%`);
        }

        // Magnetic lean — active inside an elastic halo around the button.
        const inHalo =
          pointer.x >= r.left - MAGNET_PAD &&
          pointer.x <= r.right + MAGNET_PAD &&
          pointer.y >= r.top - MAGNET_PAD &&
          pointer.y <= r.bottom + MAGNET_PAD;

        let tx = 0;
        let ty = 0;
        if (inHalo) {
          tx = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (pointer.x - cx) * MAGNET_STRENGTH));
          ty = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (pointer.y - cy) * MAGNET_STRENGTH));

          // Never let a button lean over another button: test the moved
          // rectangle against every other fx button's resting rect. If the
          // combined lean intersects, try x-only, then y-only, then none.
          const movedRect = (nx: number, ny: number) =>
            new DOMRect(r.x + nx, r.y + ny, r.width, r.height);
          const blocked = (nx: number, ny: number) => {
            const cand = movedRect(nx, ny);
            for (const [other, or] of resting) {
              if (other === el || !or.width || !or.height) continue;
              if (intersects(cand, or)) return true;
            }
            return false;
          };
          if (blocked(tx, ty)) {
            if (!blocked(tx, 0)) ty = 0;
            else if (!blocked(0, ty)) tx = 0;
            else {
              tx = 0;
              ty = 0;
            }
          }
        }

        targets.set(el, { x: tx, y: ty });
      }

      // Pass 3 — lerp current leans toward targets and apply.
      for (const el of elements) {
        // Elements that left the layout this frame (display:none, unmounted,
        // width/height 0) got no entry in pass 2 — skip them silently.
        const target = targets.get(el);
        if (!target) continue;
        const st = states.get(el) ?? { x: 0, y: 0 };
        const nx = st.x + (target.x - st.x) * LERP;
        const ny = st.y + (target.y - st.y) * LERP;

        if (Math.abs(nx - st.x) > SETTLE || Math.abs(ny - st.y) > SETTLE) {
          states.set(el, { x: nx, y: ny });
          el.style.translate = `${nx.toFixed(2)}px ${ny.toFixed(2)}px`;
          moving = true;
        } else if (
          (target.x === 0 && target.y === 0) ||
          (Math.abs(nx) < HALO_GRACE && Math.abs(ny) < HALO_GRACE && target.x === 0)
        ) {
          if (st.x !== 0 || st.y !== 0 || el.style.translate !== '') {
            states.delete(el);
            el.style.translate = ''; // back to its natural spot
            moving = true; // one more frame to confirm settle
          }
        }
      }

      if (moving) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      collectThrottled();
      kick();
    };

    const onLeave = () => {
      pointer.x = -99999;
      pointer.y = -99999;
      kick();
    };

    // Cheap re-scan when the router swaps in new pages/elements.
    let scanTimer: ReturnType<typeof setTimeout> | null = null;
    const collectThrottled = () => {
      if (scanTimer) return;
      scanTimer = setTimeout(() => {
        scanTimer = null;
        collect();
      }, 500);
    };
    const observer = new MutationObserver(collectThrottled);

    collect();
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (scanTimer) clearTimeout(scanTimer);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      for (const el of states.keys()) el.style.translate = '';
      for (const el of tagged) el.classList.remove('fx-btn');
    };
  }, []);

  return null;
}
