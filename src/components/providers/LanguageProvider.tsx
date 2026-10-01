'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DICTIONARIES, type Dictionary, type Locale } from '@/lib/i18n/translations';

const STORAGE_KEY = 'sst.locale';

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'ar' || value === 'fr';
}

/**
 * Nested key lookup with dot paths, e.g. t('hero.title').
 * Falls back to the English dictionary when a key is missing.
 */
function lookup(dict: Dictionary, path: string): string {
  const parts = path.split('.');
  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      current = undefined;
      break;
    }
  }
  if (typeof current === 'string') return current;
  // Fallback to English
  let fallback: unknown = DICTIONARIES.en;
  for (const part of parts) {
    if (fallback && typeof fallback === 'object' && part in (fallback as Record<string, unknown>)) {
      fallback = (fallback as Record<string, unknown>)[part];
    } else {
      return path; // last resort: show the key itself
    }
  }
  return typeof fallback === 'string' ? fallback : path;
}

type LanguageContextValue = {
  locale: Locale;
  dict: Dictionary;
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  /** Translate a dot-path key, e.g. t('hero.title') */
  t: (path: string) => string;
  /** Translate a top-level category name (keys are the English names) */
  tc: (category: string) => string;
  /** Translate a subcategory/service/menu-item name (keys are the English names) */
  tk: (scope: 'subcategories' | 'services' | 'howItWorks', name: string) => string;
  /** Translate with {placeholder} interpolation, e.g. tf('listings.itemsAvailable', { count: 12 }) */
  tf: (path: string, params: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Restore persisted choice after mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
    } catch {
      // storage unavailable — keep default
    }
  }, []);

  // Keep <html lang/dir> in sync (also covers SSR default of en/ltr)
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = DICTIONARIES[locale];
    return {
      locale,
      dict,
      isRTL: locale === 'ar',
      setLocale: (next: Locale) => {
        setLocaleState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // storage unavailable — choice applies for this session only
        }
      },
      t: (path: string) => lookup(dict, path),
      tc: (category: string) => dict.categories[category] ?? DICTIONARIES.en.categories[category] ?? category,
      tk: (scope, name) => dict[scope][name] ?? DICTIONARIES.en[scope][name] ?? name,
      tf: (path, params) =>
        lookup(dict, path).replace(/\{(\w+)\}/g, (_, key: string) =>
          key in params ? String(params[key]) : `{${key}}`
        ),
    };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
