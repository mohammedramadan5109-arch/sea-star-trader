import Link from 'next/link';
import Image from 'next/image';
import type { Listing } from '@/queries/useListings';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.photos && listing.photos.length > 0 
    ? listing.photos[0] 
    : '/placeholder-equipment.jpg';

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-sm overflow-hidden border border-[var(--line)] hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`${listing.make} ${listing.model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-2" style={{ color: 'var(--navy)' }}>
          {listing.year && `${listing.year} `}
          {listing.make} {listing.model}
        </h3>
        <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>
          {listing.equipment_type}
        </p>
        <div className="flex items-center justify-between text-sm mb-3">
          <span style={{ color: 'var(--slate)' }}>{listing.location}</span>
          {listing.condition && (
            <span className="text-xs px-2 py-0.5 rounded-sm bg-[var(--off-white)]" style={{ color: 'var(--navy)' }}>
              {listing.condition}
            </span>
          )}
        </div>
        {listing.asking_price && (
          <div style={{ borderTop: '1px solid var(--line)' }} className="pt-3">
            <span className="text-sm font-bold" style={{ color: 'var(--orange)' }}>
              ${listing.asking_price.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}