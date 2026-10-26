'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface Suggestion {
  id: string;
  make: string | null;
  model: string | null;
  year: string | null;
  equipment_type: string;
}

const RECENT_KEY = 'sst_recent_searches';
const MAX_RECENT = 5;

// Fallback popular terms shown when the search_logs table has no data yet.
const DEFAULT_TOP_SEARCHED = ['Excavator', 'Wheel Loader', 'Bulldozer', 'Crane', 'Tractor'];

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(list) ? list.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  try {
    const updated = [term, ...readRecent().filter((t) => t !== term)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private mode etc.) — non-blocking.
  }
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [topSearched, setTopSearched] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  // Close the panel on outside click.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lighter-than-page input + recently-added border color, per design feedback.
  const inputStyle = {
    backgroundColor: 'var(--paper-solid)',
    borderColor: 'var(--steel-light)',
    color: 'var(--navy-solid)',
  } as React.CSSProperties;

  // Suggestions while typing (debounced).
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('listings')
          .select('id, make, model, year, equipment_type')
          .in('status', ['active', 'approved'])
          .or(
            `equipment_type.ilike.%${term}%,make.ilike.%${term}%,model.ilike.%${term}%`
          )
          .limit(6);
        setSuggestions((data || []) as Suggestion[]);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  // Clicking the (empty) input shows top searches + this user's recent ones.
  useEffect(() => {
    if (!open || query.trim()) return;
    setRecent(readRecent());
    (async () => {
      try {
        const supabase = createClient();
        // RLS exposes only the term column semantics we need; count client-side.
        const { data } = await supabase
          .from('search_logs')
          .select('term')
          .order('created_at', { ascending: false })
          .limit(500);
        const counts = new Map<string, number>();
        for (const row of data || []) {
          const name = (row as { term: string }).term;
          counts.set(name, (counts.get(name) || 0) + 1);
        }
        const top = [...counts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([term]) => term);
        setTopSearched(top.length ? top : DEFAULT_TOP_SEARCHED);
      } catch {
        setTopSearched(DEFAULT_TOP_SEARCHED);
      }
    })();
  }, [open, query]);

  const logSearch = (term: string) => {
    createClient()
      .from('search_logs')
      .insert({ term })
      .then(() => undefined, () => undefined);
  };

  const runSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    saveRecent(clean);
    logSearch(clean);
    setOpen(false);
    router.push(`/listings?search=${encodeURIComponent(clean)}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const showDefaultPanel = open && !query.trim() && (topSearched.length > 0 || recent.length > 0);
  const showSuggestions = open && query.trim().length >= 2 && suggestions.length > 0;

  return (
    <div ref={rootRef} className="relative flex-1 max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          style={{ color: 'var(--steel-light)' }}
        />
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('nav.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
          style={inputStyle}
        />
      </form>

      {/* Suggestions while typing */}
      {showSuggestions && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-md border shadow-xl z-50 overflow-hidden"
          style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
        >
          {suggestions.map((s) => {
            const label = `${s.year ? s.year + ' ' : ''}${s.make ?? ''} ${s.model ?? ''} · ${s.equipment_type}`
              .replace(/\s+/g, ' ')
              .trim();
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => runSearch(`${s.make ?? ''} ${s.model ?? ''} ${s.equipment_type}`)}
                className="w-full text-left px-4 py-2.5 text-sm border-b last:border-b-0 hover:bg-white/5 transition-colors"
                style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              >
                <Search size={13} className="inline mr-2 -mt-0.5" style={{ color: 'var(--slate)' }} />
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Idle panel: top searched + recent */}
      {showDefaultPanel && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-md border shadow-xl z-50 overflow-hidden p-4 space-y-4"
          style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
        >
          {recent.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--slate)' }}>
                <Clock size={13} /> Recently searched
              </p>
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => runSearch(term)}
                    className="px-3 py-1 text-xs rounded-full border"
                    style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          {topSearched.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--slate)' }}>
                <TrendingUp size={13} /> Top searched
              </p>
              <div className="flex flex-wrap gap-2">
                {topSearched.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => runSearch(term)}
                    className="px-3 py-1 text-xs rounded-full"
                    style={{ backgroundColor: 'rgba(245, 179, 36, 0.15)', color: 'var(--orange)' }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
