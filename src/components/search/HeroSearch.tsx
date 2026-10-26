'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_STRUCTURE } from '@/lib/constants/categories';
import { slugify } from '@/lib/utils/slugify';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function HeroSearch() {
  const { t, tc, tk } = useLanguage();
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');

  const categoryName = Object.keys(CATEGORY_SLUGS).find(
    (key) => CATEGORY_SLUGS[key] === category
  );
  const subcategories = categoryName ? CATEGORY_STRUCTURE[categoryName] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (brand.trim()) params.set('search', brand.trim());
    router.push(params.toString() ? `/listings?${params.toString()}` : '/listings');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row rounded-lg overflow-hidden max-w-3xl mb-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.25)',
      }}
    >
      {/* Category */}
      <label
        className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r"
        style={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {t('hero.category')}
        </span>
        <select
          name="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory('');
          }}
          className="w-full text-sm bg-transparent focus:outline-none [&>option]:text-black"
          style={{ color: '#FFFFFF' }}
        >
          <option value="">{t('hero.allCategories')}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={CATEGORY_SLUGS[c]}>
              {tc(c)}
            </option>
          ))}
        </select>
      </label>

      {/* Subcategory */}
      <label
        className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r"
        style={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Subcategory
        </span>
        <select
          name="subcategory"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          disabled={subcategories.length === 0}
          className="w-full text-sm bg-transparent focus:outline-none disabled:opacity-50 [&>option]:text-black"
          style={{ color: '#FFFFFF' }}
        >
          <option value="">Any subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub} value={slugify(sub)}>
              {tk('subcategories', sub)}
            </option>
          ))}
        </select>
      </label>

      {/* Brand */}
      <label
        className="flex-1 px-4 py-3 border-b md:border-b-0"
        style={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Brand
        </span>
        <input
          name="brand"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g. Caterpillar, Komatsu"
          className="w-full text-sm bg-transparent focus:outline-none placeholder-white/50"
          style={{ color: '#FFFFFF' }}
        />
      </label>

      <button
        type="submit"
        className="btn-3d px-8 py-3 md:py-0 font-semibold text-sm"
        style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
      >
        {t('hero.search')}
      </button>
    </form>
  );
}
