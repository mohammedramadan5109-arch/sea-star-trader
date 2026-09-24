import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { Listing } from '@/queries/useListings';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending review',
  active: 'Available',
  rejected: 'Not available',
  sold: 'Sold',
};

export function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos?.[0];
  const title = `${listing.year ? listing.year + ' ' : ''}${listing.make} ${listing.model}`;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-sm overflow-hidden border hover:shadow-lg transition-shadow"
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="relative w-full aspect-[4/3]">
        {photo ? (
          <Image src={photo} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--off-white)' }}
          >
            <span className="text-sm" style={{ color: 'var(--slate)' }}>
              No image
            </span>
          </div>
        )}
        {listing.status && listing.status !== 'active' && (
          <span
            className="absolute top-2 left-2 px-2 py-1 text-[11px] font-semibold rounded-sm"
            style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}
          >
            {STATUS_LABEL[listing.status] ?? listing.status}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm sm:text-base mb-1 truncate" style={{ color: 'var(--navy)' }}>
          {title}
        </h3>

        {listing.location && (
          <div className="flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--slate)' }}>
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
        )}

        {listing.asking_price ? (
          <p className="text-sm sm:text-base font-bold" style={{ color: 'var(--orange)' }}>
            ${Number(listing.asking_price).toLocaleString()}
          </p>
        ) : (
          <p className="text-sm font-semibold" style={{ color: 'var(--slate)' }}>
            Price on request
          </p>
        )}
      </div>
    </Link>
  );
}