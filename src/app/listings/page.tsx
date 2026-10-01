'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useListings } from '@/queries/useListings';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingFilters } from '@/components/listings/ListingFilters';
import { Spinner } from '@/components/ui/Spinner';
import { useLanguage } from '@/components/providers/LanguageProvider';

function ListingsContent() {
  const searchParams = useSearchParams();
  const { t, tf } = useLanguage();

  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  const search = searchParams.get('search') || undefined;
  const location = searchParams.get('location') || undefined;

  const { data: listings, isLoading } = useListings({
    category,
    subcategory,
    search,
    location,
  });

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