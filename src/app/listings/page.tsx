'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useListings } from '@/queries/useListings';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingFilters } from '@/components/listings/ListingFilters';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/components/providers/LanguageProvider';

type SortOption = NonNullable<Parameters<typeof useListings>[0]>['orderBy'];

const SORT_OPTIONS: Record<string, { orderBy: SortOption }> = {
  newest: { orderBy: 'created_at' },
  'price-asc': { orderBy: 'price' },
  'price-desc': { orderBy: 'price_desc' },
  'hours-asc': { orderBy: 'hours_asc' },
  'hours-desc': { orderBy: 'hours_desc' },
};

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, tf } = useLanguage();

  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  const search = searchParams.get('search') || undefined;
  const location = searchParams.get('location') || undefined;
  const maxHours = parseInt(searchParams.get('max-hours') || '', 10) || undefined;
  const maxPrice = parseInt(searchParams.get('max-price') || '', 10) || undefined;
  const sort = searchParams.get('sort') || 'newest';

  const { data: listings, isLoading } = useListings({
    category,
    subcategory,
    search,
    location,
    maxHours,
    maxPrice,
    orderBy: SORT_OPTIONS[sort]?.orderBy,
  });

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'newest') params.delete('sort');
    else params.set('sort', value);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
          {search ? tf('listings.searchResults', { query: search }) : t('listings.title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          {isLoading ? t('listings.loading') : tf('listings.itemsAvailable', { count: listings?.length || 0 })}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <ListingFilters />

        <div className="flex-1 min-w-0">
          {/* Sort by — top right of the grid */}
          <div className="flex items-center justify-end mb-4">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--slate)' }}>
              Sort by
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 text-sm rounded-md border focus:outline-none"
                style={{ borderColor: 'var(--line)', backgroundColor: 'var(--off-white)', color: 'var(--ink)' }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="hours-asc">Hours: lowest first</option>
                <option value="hours-desc">Hours: highest first</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size={40} />
            </div>
          ) : (
            <ListingGrid listings={listings || []} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner size={40} /></div>}>
      <ListingsContent />
    </Suspense>
  );
}