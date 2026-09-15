'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useListings } from '@/queries/useListings';
import Image from 'next/image';

export function LatestEquipmentBento() {
  const { data: listings, isLoading } = useListings({ limit: 6, orderBy: 'created_at' });

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center py-12 text-[var(--slate)]">Loading latest equipment...</div>
      </section>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center py-12 text-[var(--slate)]">No equipment available yet.</div>
      </section>
    );
  }

  // Assign sizes: first item gets large, second gets tall, rest get small
  const getSizeClass = (index: number) => {
    if (index === 0) return 'md:col-span-2 md:row-span-2'; // Large
    if (index === 1) return 'md:row-span-2'; // Tall
    return ''; // Small (1x1)
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
            Latest Equipment
          </h2>
          <p className="text-sm max-w-md" style={{ color: 'var(--slate)' }}>
            Newly listed heavy equipment from verified sellers worldwide.
          </p>
        </div>
        <Link
          href="/listings"
          className="flex items-center gap-1 text-sm font-semibold shrink-0"
          style={{ color: 'var(--orange)' }}
        >
          View all listings <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
        {listings.map((listing, index) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className={`block rounded-sm overflow-hidden border border-[var(--line)] hover:shadow-lg transition-shadow ${getSizeClass(
              index
            )}`}
          >
            <div className="relative h-full">
              {listing.photos && listing.photos.length > 0 ? (
                <Image
                  src={listing.photos[0]}
                  alt={`${listing.make} ${listing.model}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--off-white)' }}
                >
                  <span className="text-sm text-[var(--slate)]">No image</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-bold text-white mb-1">
                  {listing.year} {listing.make} {listing.model}
                </h3>
                <p className="text-sm text-white/90">{listing.location}</p>
                {listing.asking_price && (
                  <p className="text-sm font-bold text-[var(--orange)] mt-1">
                    ${listing.asking_price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}