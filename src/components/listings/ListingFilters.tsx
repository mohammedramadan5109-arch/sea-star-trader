'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_STRUCTURE } from '@/lib/constants/categories';
import { slugify } from '@/lib/utils/slugify';
import { useLanguage } from '@/components/providers/LanguageProvider';

// Number parser shared by the price input: keeps digits only so typed
// values like "12,000" never break the URL query.
function toNumber(value: string): number | undefined {
  const digits = value.replace(/[^\d]/g, '');
  if (!digits) return undefined;
  return parseInt(digits, 10);
}

export function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, tc, tk } = useLanguage();

  const currentCategory = searchParams.get('category') || '';
  const currentSubcategory = searchParams.get('subcategory') || '';
  const currentHours = searchParams.get('max-hours') || '';
  const currentPrice = searchParams.get('max-price') || '';

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`/listings?${params.toString()}`);
  };

  const handleCategoryChange = (categorySlug: string) => {
    pushParams((params) => {
      if (categorySlug) {
        params.set('category', categorySlug);
        params.delete('subcategory');
      } else {
        params.delete('category');
        params.delete('subcategory');
      }
    });
  };

  const handleSubcategoryChange = (subcategorySlug: string) => {
    pushParams((params) => {
      if (subcategorySlug) {
        params.set('subcategory', subcategorySlug);
      } else {
        params.delete('subcategory');
      }
    });
  };

  const handleHoursChange = (value: string) => {
    pushParams((params) => {
      if (value) params.set('max-hours', value);
      else params.delete('max-hours');
    });
  };

  const currentCategoryName = Object.keys(CATEGORY_SLUGS).find(
    (key) => CATEGORY_SLUGS[key] === currentCategory
  );
  const subcategories = currentCategoryName ? CATEGORY_STRUCTURE[currentCategoryName] : [];

  const selectClass = 'w-full px-3 py-2 text-sm rounded-sm border focus:outline-none';
  const selectStyle = {
    borderColor: 'var(--line)',
    backgroundColor: 'var(--off-white)',
    color: 'var(--ink)',
  } as React.CSSProperties;
  const headingClass = 'text-sm font-bold uppercase tracking-wide mb-3';

  return (
    <aside className="w-full lg:w-64 shrink-0 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-[var(--line)] lg:pr-6">
      {/* Category */}
      <div className="mb-6">
        <h3 className={headingClass} style={{ color: 'var(--navy)' }}>
          {t('listings.category')}
        </h3>
        <select
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">{t('listings.allCategories')}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={CATEGORY_SLUGS[cat]}>
              {tc(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h3 className={headingClass} style={{ color: 'var(--navy)' }}>
            {t('listings.subcategory')}
          </h3>
          <select
            value={currentSubcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className={selectClass}
            style={selectStyle}
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

      {/* Hours */}
      <div className="mb-6">
        <h3 className={headingClass} style={{ color: 'var(--navy)' }}>
          Hours
        </h3>
        <select
          value={currentHours}
          onChange={(e) => handleHoursChange(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">Any hours</option>
          <option value="1000">Under 1,000 hrs</option>
          <option value="5000">Under 5,000 hrs</option>
          <option value="10000">Under 10,000 hrs</option>
          <option value="20000">Under 20,000 hrs</option>
        </select>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h3 className={headingClass} style={{ color: 'var(--navy)' }}>
          {t('listings.location')}
        </h3>
        <input
          type="text"
          placeholder={t('listings.locationPlaceholder')}
          defaultValue={searchParams.get('location') || ''}
          onBlur={(e) => {
            pushParams((params) => {
              if (e.target.value.trim()) params.set('location', e.target.value.trim());
              else params.delete('location');
            });
          }}
          className={selectClass}
          style={selectStyle}
        />
      </div>

      {/* Max price */}
      <div className="mb-6">
        <h3 className={headingClass} style={{ color: 'var(--navy)' }}>
          Max price (USD)
        </h3>
        <input
          type="number"
          min={0}
          placeholder="e.g. 150000"
          defaultValue={currentPrice}
          onBlur={(e) => {
            const value = toNumber(e.target.value);
            pushParams((params) => {
              if (value) params.set('max-price', String(value));
              else params.delete('max-price');
            });
          }}
          className={selectClass}
          style={selectStyle}
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
