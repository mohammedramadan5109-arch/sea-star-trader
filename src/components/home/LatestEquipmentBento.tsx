'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useListings } from '@/queries/useListings';
import { ListingCard } from '@/components/listings/ListingCard';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function LatestEquipmentBento() {
  const { t } = useLanguage();
  const { data: listings, isLoading } = useListings({ limit: 8, orderBy: 'created_at', featured: true });

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center py-12 text-[var(--slate)]">{t('latest.loading')}</div>
      </section>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center py-12 text-[var(--slate)]">{t('latest.empty')}</div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
            {t('latest.title')}
          </h2>
          <p className="text-sm max-w-md" style={{ color: 'var(--slate)' }}>
            {t('latest.subtitle')}
          </p>
        </div>
        <Link
          href="/listings"
          data-fx-btn
          className="fx-btn flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-md transition-all duration-150 active:scale-[0.97] self-start sm:self-auto shrink-0"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
        >
          {t('latest.viewAll')} <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}