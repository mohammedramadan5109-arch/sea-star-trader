# SeaStarTrader — Launch Readiness Audit

**Date:** Oct 19, 2026 · **Commit:** `1cee221` (main) · **Tested:** production build (`next build` exit 0 + `next start`) on localhost:63799

> Method note: all tests ran against **localhost** (per your rules). Nothing was tested against the live Vercel URL and nothing in your repo was modified. Numbers for Vercel will differ (usually better TTFB on the edge) — see "what a local test cannot tell you."
>
> **No 3D on this site.** There is no Three.js (or any WebGL code) in the codebase (`package.json` dependencies + full src search: zero matches). So all Three.js-specific and WebGL-fallback checks don't apply — this is a standard Next.js + Supabase marketplace. Hero/equipment visuals are regular JPEGs and CSS backgrounds, so there is no WebGL failure fallback to design for. That means one less launch risk for you.

---

## 1. Launch verdict

### 🟡 Ready with fixes

The core marketplace works end-to-end on the production build: all 24 public pages serve 200 with real content, protected routes correctly redirect to login (307), the admin area is properly role-guarded *and* its server actions double-check `role = 'admin'`, every API input is server-validated with rate limiting, security headers are strong and verified live, listing detail pages server-render their content for Google, and the site survived 250→1000 concurrent users and a 10-minute soak with **zero errors**. What blocks a comfortable launch is (a) **1 critical + 2 high severity dependency vulnerabilities including the Next.js framework itself**, (b) **contact and newsletter forms that accept submissions but silently discard them** (your only customer contact channel is a black hole), (c) **no sitemap.xml / robots.txt and almost no per-page SEO metadata**, and (d) several user-facing "Coming soon…" dead ends. None of these are architecture problems — they're a dependency upgrade, one integration, and two small files.

---

## 2. Issues table

| ID | Page / file | Description | Severity | Recommended fix |
|----|-------------|-------------|----------|-----------------|
| CRIT-1 | `package.json` | `next 16.3.4` falls in the advisory range **16.0.0–16.3.7 (Severity: CRITICAL, `npm audit --omit=dev`)**. Latest is **16.4.2**. Ships on every request in production. | **Critical** | `npm install next@16.4.2 eslint-config-next@16.4.2` → `npm run build` → deploy. |
| HIGH-1 | `src/app/api/contact/route.ts:34` | Contact form returns `{success:true}` but **discards the message** (TODO at line 34: "Create an 'inquiries' table / send via Resend"). Every customer inquiry is silently lost. | **High** | Create `inquiries` table + insert `parsed.data`, or wire Resend; add admin page to view them. |
| HIGH-2 | `src/app/api/newsletter/subscribe/route.ts:38` | Same: subscribers accepted then dropped (TODO line 38). You'll never know who subscribed. | **High** | Same as above — table `newsletter_subscribers` or provider integration. |
| HIGH-3 | `package.json` | `sharp` < 0.35.5 — **high** (CVE-2026-96889, librsvg). `source-map-js` ≤1.2.1 — **high** (event-loop DoS). | **High** | `npm audit fix` for both (non-breaking). |
| HIGH-4 | `src/proxy.ts:53-63` | Middleware admin check is **commented out** ("TEMPORARILY DISABLED FOR TESTING"). Not exploitable today (admin layout + both actions re-check `role`), but the `/*` marker says "for testing" and someone may re-enable or refactor wrongly. | High | Delete the dead block or restore the check; never leave security layers "temporarily" off. |
| MED-1 | All 52 routes | **No sitemap.xml** (404 live) and **no robots.txt**. Google has nothing guiding it to 32 live listings. | Medium | Add `src/app/sitemap.ts` + `src/app/robots.ts` (10 lines each, Next generates them). |
| MED-2 | All routes except 1 | No `generateMetadata` (only `careers/apply/[id]` has metadata). Every page ships the same root title; listing pages show `<title>SeaStarTrader…</title>` even on "1980 Caterpillar 920". **No OpenGraph/Twitter/canonical anywhere** — links shared on WhatsApp/LinkedIn/Facebook render as a bare URL, which kills your free marketing channel. | Medium | Add `generateMetadata` to listings/[id], auctions/[id], and the top 5 landing pages. |
| MED-3 | `/auctions`, `/auctions/[id]`, `/auctions/results`, `/help/guides/buyers-guide`, `/help/search`, `/admin/bidding-requests` | User-facing **"Coming soon…"** pages. `/auctions` is in your main nav — visitors click "Auctions" and get a dead end while your whole positioning includes auctions. | Medium | Ship the auction pages or remove/hide the nav entry + badge them "notify me" until ready. |
| MED-4 | `Hero.tsx:15` | Hero background = **raw `1,004,716-byte` JPEG via CSS** — no `next/image`, no responsive sizes, no WebP/AVIF. Mobile users on 3G eat ~1 MB before FCP; this is your LCP element. | Medium | Move to `<Image priority>` with a blurred placeholder; Next will emit WebP/AVIF (~100–150 KB from 1 MB). |
| LOW-1 | `src/components/careers/JobApplicationForm.tsx:32` | Job applications: same silent TODO drop as contact/newsletter. | Low | Wire to storage bucket + email, or hide careers until wired. |
| LOW-2 | `package.json` | `zustand` is used only by `src/store/useUIStore.ts`, which itself is imported nowhere (both a store crate and an unused dead file). | Low | Drop both (2-line change) or start using the store. |
| LOW-3 | `tailwind.config.ts.backup`, `postcss.config.js`, `postcss.config.mjs` (two PostCSS configs), `tsconfig.tsbuildinfo` committed to repo. | Repo hygiene; `postcss.config.js` vs `.mjs` is confusing for tooling. | Low | Delete backup + one postcss config; gitignore `*.tsbuildinfo` (it's already in .gitignore — the one present predates it, so just delete). |
| LOW-4 | Blog/docs style routes (`press/releases/[slug]`, `services/[slug]`) | These target dynamic slugs but have no data source wired — confirm they return real content for the slugs you link from Footer, not bare shells. (Verified `/services/inspection-certification`, `/insurance`, `/shipping-logistics` all 200 with content, so this is lower risk than the auctions dead ends.) | Low | Spot-check each footer slug in staging after deploy. |
| MED-5 | Global | **No analytics** (no GA/Plausible/PostHog anywhere). At launch you cannot tell where users drop off, and you'll be blind during marketing experiments. | Medium | Add Plausible or GA4 (10 min). |

---

## 3. Performance and load results

### Load tests (autocannon, against local production build — `next start`)

| Test | Concurrency | req/s | avg | p99 | errors | time-outs |
|------|------------|-------|-----|-----|--------|-----------|
| Ramp  | 10  | 345 | 28.5 ms  | 45 ms    | 0 | 0 |
| Ramp  | 50  | 340 | 145.8 ms | 190 ms   | 0 | 0 |
| Ramp  | 100 | 330 | 297.4 ms | 596 ms   | 0 | 0 |
| Ramp  | 250 | 354 | 686.6 ms | 825 ms   | 0 | 0 |
| Ramp  | 500 | 340 | 1364 ms  | 2198 ms  | 0 | 0 |
| Ramp  | 1000| 311 | 2996 ms  | 4658 ms  | 0 | 0 |
| Spike | 0→800 instantaneous | 343 | 2331 ms | 4088 ms | 0 | 0 |
| Soak  | 50 × 10 min | 256 | 195 ms | 502 ms | 0 | 0 |

**Where it breaks first:** throughput pins at ~**330–350 req/s** regardless of concurrency. Latency rises linearly after ~100 users but never errors — the box queues rather than fails. DNS hiccups aside, this is a healthy HTTP-limiter pattern, not a crash pattern.

**What this means for traffic:**
- **Realistic ceiling:** ~350 req/s = **~30 M requests/day** raw. At a typical 5–8 requests per page view, that's **~4–6 M page views/day** — far above your 2 000/day target.
- **Your launch target (100–2 000/day):** needs only ~0.2 req/s average, peaking maybe 2 req/s. This app will not be your bottleneck.
- **Vercel is the real limit, not the app.** Hobby plan: no commercial use officially, daily function limits; Pro plan: ~$20/mo, includes bandwidth you won't come close to at 2 000/day (heavy pages are text+images, no 3D models).
- **Bandwidth estimate:** avg page download ~80 KB gzipped (~59 KB HTML+JS for `/`, images cached). 1 000 visitors × ~8 pages × 80 KB ≈ **640 MB per 1 000 visitors**. Vercel Hobby gives 100 GB/month → ~150 000 visits/mo free; Pro ($20) gives 1 TB → ~1.5 M visits/mo before overage billing.
- **In-memory rate limiter caveat:** `checkRateLimit` uses a module-scope `Map`. On Vercel, each serverless instance has its own Map, so limits are per-instance, effectively raising your limit above 3 by however many cold-start instances see the same traffic. Fine for launch; swap to Upstash Redis if you need hard guarantees.

**What a single-machine local test cannot tell us:** (1) Vercel's edge + cold-start latency (p99 will look better there but cold starts add ~200–500 ms on first hit per region); (2) multiplayer contention on the DB (load tests hit one Supabase endpoint trivially — real bidding storms on `/auctions/[id]` need a seeded production-like DB); (3) CDN cache-hit ratios; (4) ISP-level latency to real users in Egypt/EU/US; (5) your actual connection quality to Supabase from the deployed region.

### Page weight & delivery

| Metric | Value |
|---|---|
| HTML `/` | 43.4 KB → **7.9 KB gzipped** (5.5× compression verified) |
| HTML `/listings` | 9.3 KB (small — client fetch happens after) |
| HTML `/login` | 12.5 KB |
| JS (largest chunk) | 256 KB → 224 KB → 128 KB → 112 KB → 96 KB → … |
| `.next/static` total | 1.6 MB (typical Next.js app, small) |
| Hero image | **1004 KB raw JPEG** (unoptimized — see MED-4) |
| Equipment photos | Served via `next/image` with `sizes`+`alt` (att. auto WebP/AVIF on Vercel) ✓ |
| Fonts | Self-hosted Cairo woff2 subsets ✓ |
| Compression | gzip verified live ✓ (brotli handled by Vercel automatically) |
| Security headers on `/` | CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, HSTS ✓ |

### Lighthouse

I did **not** run Lighthouse: Chrome's built-in panel requires Chrome DevTools Protocol, and the available preview browser exposes only page logs/screenshots — no crash/eval/a11y-scoring hooks. Honest limit. Given the measured 43 KB→7.9 KB HTML, 1.6 MB total JS, and the 1 MB hero image, expected scores are roughly:
- **Performance (desktop):** 90+ — big risk is only the hero image (MED-4).
- **Performance (mobile slow 4G):** 50–70 — hero image dominates; after MED-4 fix likely 85+.
- **Accessibility:** 90+ (alt text present, aria-labels present, reduced-motion CSS present, form labels use real `<label>`).
- **Best practices:** 90+ (HSTS, CSP, no mixed content, HTTPS handled by Vercel).
- **SEO:** ~55 today (no sitemap, no robots, no per-page titles/OG) → 95+ after MED-1+MED-2.

---

## 4. Top fixes in priority order (with effort)

| # | Fix | Why | Effort |
|---|-----|-----|--------|
| 1 | Upgrade `next` 16.3.4 → 16.4.2 (+ `eslint-config-next` match); run `npm audit fix` for sharp/source-map-js | Critical framework advisory shipping in production | 15 min |
| 2 | Contact form → store in `inquiries` table (or Resend) + admin view | Your only inbound sales channel currently vanishes | 2–3 h |
| 3 | Newsletter → `newsletter_subscribers` table or provider | Same silent-drop class as above | 1–2 h |
| 4 | Add `src/app/sitemap.ts` + `src/app/robots.ts` | Sitemap 404 today; zero discoverability for 32 listings | 30 min |
| 5 | Add `generateMetadata` to `/listings/[id]` + top landing pages (title/description/OG/canonical) | Every page currently shares one title; social shares are bare URLs | 2–3 h |
| 6 | Restore or delete the commented-out admin middleware check | Security hygiene — "temporarily disabled" checks become permanent holes | 15 min |
| 7 | Wire JobApplicationForm (LOW-1) or hide /careers | Dead-ends the second-most-likely contact intent | 1–2 h |
| 8 | Hero image → `<Image priority>` | LCP on mobile is eating ~1 MB JPEG | 30 min |
| 9 | Fix or temporarily hide `/auctions*` "Coming soon" pages | In main nav; breaks brand promise of auctions | 2–4 h (or 10 min to hide nav entry) |
| 10 | Add analytics (Plausible/GA4) + cookie notice if not EU/US audience-friendly | Blind during launch marketing; MED-5 | 30 min |

---

## 5. Launch checklist — what's still left before going live (not code)

**Must-do before live URL:**
1. ☐ Supabase Dashboard → Site URL + Redirect URLs → your **production** domain (`/auth/callback` path). Otherwise password reset emails open localhost (the exact bug you had before — it'll resurface).
2. ☐ hCaptcha dashboard → Hostnames → add production domain (plus `localhost` if you still test locally). The preview browser showed "**Warning: localhost detected**" on this sitekey — production will fail captcha too until the hostname is allowlisted.
3. ☐ Password rotation: your own password was exposed earlier in chat; rotate via reset flow once checklist item 1 is done.
4. ☐ DB migration still pending: push `supabase/migrations/20240111000000_add_name_to_profiles.sql` (and confirm `20240110000000` ✅ is applied).
5. ☐ Vercel env vars — all 5 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Sensitive), `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` (Plain), `CRON_SECRET` (Sensitive, when cron goes in)).
6. ☐ Set `CRON_SECRET` before real auction-close logic goes into the cron route (it's currently a TODO placeholder that returns success harmlessly).
7. ☐ `npm install next@16.4.2 && npm audit fix` → run build → deploy (fix #1 above).

**Should-do within a week of launch:**
8. ☐ Custom SMTP on Supabase (free tier = ~2 emails/hour → real users will hit 429 on password resets and email confirmation).
9. ☐ Attack protection: enable Captcha + leaked-password protection in Supabase Auth settings; min password length 8.
10. ☐ Stripe webhook signature verification the day before payments go live (currently a TODO stub, safe while no traffic flows).
11. ☐ Privacy policy references: confirm `/legal/privacy` and `/legal/terms` content matches what you actually do (analytics, cookies, data region — low effort, avoids launch-day rewrites).
12. ☐ Analytics + cookie consent if any EU/UK/CCPA-targeted users.

**DW not-required / N/A:**
- ☐ WebGL fallback — N/A (no WebGL anywhere on this site).
- ☐ 3D model budgets (polygon/texture/draw-call/memory-leak review) — N/A.

**Tested clean, no action needed:**
- All 24 public pages: HTTP 200; protected routes redirect 307 to `/login`; invalid routes 404 with branded styled page; hCaptcha on login renders (needs hostname fix to verify); register uses proper zod client+server checks; server actions all verify `role='admin'`; admin users table has Name/Company/Email/Phone columns; alternative ports, curl-based security headers verification; git history contains **no committed secrets** (only code references to env vars, and `password-reset-link.txt`/`dev-server.log` are gitignored and untracked); responsive 375 and 1366 render clean with no horizontal overflow, hamburger nav works, console is error-free; soak test 0 errors/0 timeouts across 10 min; gzip works; fonts self-hosted woff2; images via next/image with alt + sizes; reduced-motion CSS present (`globals.css:125`, `::173`); footer links all 200 (`/services/inspection-certification`, `/insurance`, `/shipping-logistics` verified); placeholder-equipment.jpg fallback works.

**I could not test (and why):**
- Real Supabase-hosted DB load under true concurrency (would need seeded production-like data + production project).
- Lighthouse accessibility/performance scoring (available preview browser has no Lighthouse hooks; only page logs + screenshots).
- Real email delivery E2E (would consume your ~2/hour quota).
- Good Safari/Firefox/Edge rendering (this environment runs Chromium only; the specific Safari/Firefox layout checks need real browser instances).
- WebGL failure behavior — N/A, no WebGL present.
- Paid-plan limits from Vercel (would need Vercel API token; documented from public plan info instead).

---

*Test artifacts saved in `.audit/` (autocannon JSON: ramp 10/50/100/250/500/1000, spike, soak). Nothing in your source tree was modified — all findings are report-only awaiting your approval.*
