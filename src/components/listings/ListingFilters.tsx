'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_STRUCTURE } from '@/lib/constants/categories';
import { slugify } from '@/lib/utils/slugify';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, tc, tk } = useLanguage();

  const currentCategory = searchParams.get('category') || '';
  const currentSubcategory = searchParams.get('subcategory') || '';

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set('category', categorySlug);
      params.delete('subcategory');
    } else {
      params.delete('category');
      params.delete('subcategory');
    }
    router.push(`/listings?${params.toString()}`);
  };

  const handleSubcategoryChange = (subcategorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (subcategorySlug) {
      params.set('subcategory', subcategorySlug);
    } else {
      params.delete('subcategory');
    }
    router.push(`/listings?${params.toString()}`);
  };

  const currentCategoryName = Object.keys(CATEGORY_SLUGS).find(
    (key) => CATEGORY_SLUGS[key] === currentCategory
  );
  const subcategories = currentCategoryName ? CATEGORY_STRUCTURE[currentCategoryName] : [];

  return (
    <aside
      className="w-full lg:w-64 shrink-0 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-[var(--line)] lg:pr-6"
    >
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
          {t('listings.category')}
        </h3>
        <select
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-sm border focus:outline-none"
          style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
        >
          <option value="">{t('listings.allCategories')}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={CATEGORY_SLUGS[cat]}>
              {tc(cat)}
            </option>
          ))}
        </select>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
          {t('listings.subcategory')}
        </h3>
          <select
            value={currentSubcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-sm border focus:outline-none"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
          >
            <option value="">{t('listings.allSubcategories')}</option>
            {subcategories.map((sub) => (
              <option key={sub} value={slugify(sub)}>
                {tk('subcategories', sub)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
          {t('listings.location')}
        </h3>
        <input
          type="text"
          placeholder={t('listings.locationPlaceholder')}
          defaultValue={searchParams.get('location') || ''}
          onBlur={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) {
              params.set('location', e.target.value);
            } else {
              params.delete('location');
            }
            router.push(`/listings?${params.toString()}`);
          }}
          className="w-full px-3 py-2 text-sm rounded-sm border focus:outline-none"
          style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
        />
      </div>

      <button
        onClick={() => router.push('/listings')}
        className="w-full px-4 py-2 text-sm font-semibold rounded-lg border"
        style={{ borderColor: 'var(--line)', color: 'var(--navy)' }}
      >
        {t('listings.clearFilters')}
      </button>
    </aside>
  );
}