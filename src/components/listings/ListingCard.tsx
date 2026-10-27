'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { Listing } from '@/queries/useListings';

/** A listing is "Just in" for 14 days after it goes live, then plain Available. */
const JUST_IN_DAYS = 14;

export function ListingCard({ listing, className = '' }: { listing: Listing; className?: string }) {
  const photo = listing.photos?.[0];
  const title = `${listing.year ? listing.year + ' ' : ''}${listing.make} ${listing.model}`;
  const href = `/listings/${listing.id}`;

  const parsedDate = new Date(listing.created_at);
  const isJustIn =
    !Number.isNaN(parsedDate.getTime()) &&
    Date.now() - parsedDate.getTime() < JUST_IN_DAYS * 24 * 60 * 60 * 1000;
  const statusLabel = isJustIn ? 'Just in' : 'Available';


  return (
    <div
      className={`relative flex flex-col rounded-md overflow-hidden border hover:shadow-xl transition-all duration-200 ${className}`}
      style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
    >
      {/* Photo area (also links) */}
      <Link href={href} className="block relative w-full aspect-[16/10] bg-[#22334A]">
        {photo ? (
          <Image src={photo} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-[#8FA3B5] uppercase tracking-widest">
            Photo: {listing.equipment_type}
          </span>
        )}
      </Link>

      {/* Status tag */}
      <span
        className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded"
        style={{ backgroundColor: 'var(--orange)', color: 'var(--navy-solid)' }}
      >
        {statusLabel}
      </span>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        <Link href={href}>
          <h3 className="font-bold text-sm sm:text-base leading-snug" style={{ color: 'var(--ink)' }}>
            {title}
          </h3>
        </Link>

        <p className="text-xs" style={{ color: 'var(--slate)' }}>
          {listing.hours ? `${listing.hours.toLocaleString()} hrs` : 'Hours: —'}
          {listing.location ? ` · ${listing.location}` : ''}
          {listing.condition ? ` · ${listing.condition}` : ''}
        </p>

        {/* Price */}
        {listing.asking_price ? (
          <p className="text-sm sm:text-base font-extrabold" style={{ color: 'var(--orange)' }}>
            ${Number(listing.asking_price).toLocaleString()}{' '}
            <span className="text-xs font-semibold" style={{ color: 'var(--slate)' }}>
              USD
            </span>
          </p>
        ) : (
          <p className="text-sm font-semibold" style={{ color: 'var(--orange)' }}>
            Price on request
          </p>
        )}

        {/* Buttons */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          <Link
            href={href}
            className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-md transition-transform duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--navy-solid)' }}
          >
            View details
          </Link>
          <Link
            href={`${href}#inquire`}
            className="flex-1 text-center px-3 py-2 text-xs font-bold rounded-md border transition-transform duration-150 active:scale-[0.97]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            Inquire
          </Link>
        </div>
      </div>
    </div>
  );
}
