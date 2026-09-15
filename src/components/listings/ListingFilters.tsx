'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_STRUCTURE } from '@/lib/constants/categories';
import { slugify } from '@/lib/utils/slugify';

export function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  const currentSubcategory = searchParams.get('subcategory') || '';

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set('category', categorySlug);
      params.delete('subcategory'); // Reset subcategory when category changes
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

  // Get subcategories for current category
  const currentCategoryName = Object.keys(CATEGORY_SLUGS).find(
    (key) => CATEGORY_SLUGS[key] === currentCategory
  );
  const subcategories = currentCategoryName ? CATEGORY_STRUCTURE[currentCategoryName] : [];

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--line)] pr-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
          Category
        </h3>
        <select
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-sm border focus:outline-none"
          style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={CATEGORY_SLUGS[cat]}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
            Subcategory
          </h3>
          <select
            value={currentSubcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-sm border focus:outline-none"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}
          >
            <option value="">All Subcategories</option>
            {subcategories.map((sub) => (
              <option key={sub} value={slugify(sub)}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
          Location
        </h3>
        <input
          type="text"
          placeholder="City, country"
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
          style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}
        />
      </div>

      <button
        onClick={() => router.push('/listings')}
        className="w-full px-4 py-2 text-sm font-semibold rounded-sm border"
        style={{ borderColor: 'var(--line)', color: 'var(--navy)' }}
      >
        Clear All Filters
      </button>
    </aside>
  );
}