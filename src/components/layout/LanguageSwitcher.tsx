'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Locale } from '@/lib/i18n/translations';

const LANGUAGES: { code: Locale; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'ar', native: 'العربية' },
  { code: 'fr', native: 'Français' },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale } = useLanguage();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-transform duration-150 active:scale-[0.97]"
        style={{
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,0.35)',
          color: '#FFFFFF',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.native}`}
      >
        <Globe size={15} />
        <span>{current.native}</span>
      </button>

      <div
        className="absolute right-0 mt-2 w-44 rounded-lg border overflow-hidden shadow-xl z-50"
        style={{
          backgroundColor: 'var(--off-white)',
          borderColor: 'var(--line)',
          display: open ? 'block' : 'none',
        }}
        role="listbox"
        aria-label="Choose language"
      >
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            role="option"
            aria-selected={l.code === locale}
            onClick={() => {
              setLocale(l.code);
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: 'var(--ink)',
              backgroundColor: l.code === locale ? 'rgba(14,34,51,0.06)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (l.code !== locale) e.currentTarget.style.backgroundColor = 'rgba(14,34,51,0.10)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                l.code === locale ? 'rgba(14,34,51,0.06)' : 'transparent';
            }}
          >
            <span>{l.native}</span>
            {l.code === locale && <Check size={16} style={{ color: 'var(--orange)' }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
