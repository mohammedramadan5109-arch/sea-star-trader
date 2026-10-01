'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/listings?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl mx-auto">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2"
        style={{ color: 'var(--steel-light)' }}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('nav.searchPlaceholder')}
        className="w-full pl-10 pr-4 py-2 text-sm rounded-sm border focus:outline-none focus:ring-2 focus:ring-orange-500"
        style={{
          backgroundColor: 'var(--paper)',
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      />
    </form>
  );
}