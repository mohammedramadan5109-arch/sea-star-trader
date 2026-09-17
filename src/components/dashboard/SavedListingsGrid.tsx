'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SavedListingItem {
  savedId: string;
  listing: {
    id: string;
    make: string;
    model: string;
    year: string | null;
    asking_price: number | null;
    photos: string[] | null;
    location: string | null;
    status: string;
  } | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending review',
  active: 'Available',
  rejected: 'No longer available',
  sold: 'Sold',
};

export function SavedListingsGrid({ items }: { items: SavedListingItem[] }) {
  const supabase = createClient();
  const [savedItems, setSavedItems] = useState(items);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleRemove(savedId: string) {
    setRemovingId(savedId);
    const { error } = await supabase.from('saved_listings').delete().eq('id', savedId);
    if (!error) {
      setSavedItems((prev) => prev.filter((item) => item.savedId !== savedId));
    }
    setRemovingId(null);
  }

  if (savedItems.length === 0) {
    return (
      <div
        className="rounded-sm border p-10 text-center"
        style={{ borderColor: 'var(--line)', backgroundColor: 'var(--off-white)' }}
      >
        <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
          You haven&apos;t saved any listings yet.
        </p>
        <Link
          href="/listings"
          className="inline-block px-5 py-2 text-sm font-semibold rounded-sm"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
        >
          Browse listings
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedItems.map(({ savedId, listing }) => {
        if (!listing) return null;
        const photo = listing.photos?.[0];
        const isRemoving = removingId === savedId;

        return (
          <div
            key={savedId}
            className="rounded-sm border overflow-hidden"
            style={{ borderColor: 'var(--line)' }}
          >
            <Link href={`/listings/${listing.id}`} className="block relative h-44 w-full">
              {photo ? (
                <Image src={photo} alt={`${listing.make} ${listing.model}`} fill className="object-cover" />
              ) : (
                <div
                  className="h-full w-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--off-white)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--slate)' }}>
                    No image
                  </span>
                </div>
              )}
            </Link>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <Link href={`/listings/${listing.id}`}>
                  <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--navy)' }}>
                    {listing.year ? `${listing.year} ` : ''}
                    {listing.make} {listing.model}
                  </h3>
                </Link>
                <button
                  onClick={() => handleRemove(savedId)}
                  disabled={isRemoving}
                  className="shrink-0 p-1 rounded-sm hover:bg-black/5 disabled:opacity-50"
                  aria-label="Remove from saved"
                  title="Remove from saved"
                >
                  <X size={16} style={{ color: 'var(--slate)' }} />
                </button>
              </div>

              {listing.asking_price && (
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--orange)' }}>
                  ${listing.asking_price.toLocaleString()}
                </div>
              )}

              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--slate)' }}>
                <span>{listing.location ?? ''}</span>
                <span>{STATUS_LABEL[listing.status] ?? listing.status}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
