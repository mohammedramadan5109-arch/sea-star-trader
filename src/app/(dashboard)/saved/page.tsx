// src/app/(dashboard)/dashboard/saved/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { SaveButton } from '@/components/listings/SaveButton';

export default async function SavedListingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: savedListings, error } = await supabase
    .from('saved_listings')
    .select(`
      id,
      created_at,
      listing:listings (
        id,
        year,
        make,
        model,
        asking_price,
        location,
        condition,
        hours,
        photos
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
          Saved Listings
        </h1>
        <p style={{ color: 'var(--slate)' }}>
          Equipment you've saved for later
        </p>
      </div>

      {savedListings && savedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((saved: any) => {
            const listing = saved.listing;
            if (!listing) return null;

            return (
              <div
                key={saved.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                style={{ borderColor: 'var(--line)' }}
              >
                <Link href={`/listings/${listing.id}`}>
                  <div className="relative h-48 bg-gray-100">
                    {listing.photos && listing.photos.length > 0 ? (
                      <Image
                        src={listing.photos[0]}
                        alt={`${listing.make} ${listing.model}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/listings/${listing.id}`}>
                    <h3 className="font-bold text-lg mb-2 hover:text-orange-600" style={{ color: 'var(--navy)' }}>
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: 'var(--slate)' }}>
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: 'var(--slate)' }}>
                    <Calendar className="h-4 w-4" />
                    <span>{listing.hours ? `${listing.hours.toLocaleString()} hrs` : 'N/A'}</span>
                    <span>•</span>
                    <span>{listing.condition}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
                      {listing.asking_price
                        ? `$${listing.asking_price.toLocaleString()}`
                        : 'Contact for Price'}
                    </div>

                    <SaveButton
                      listingId={listing.id}
                      isLoggedIn={true}
                      initialSaved={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
            No saved listings yet
          </h2>
          <p className="mb-6" style={{ color: 'var(--slate)' }}>
            Start saving equipment you're interested in
          </p>
          <Link
            href="/listings"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: 'var(--orange)' }}
          >
            Browse Equipment
          </Link>
        </div>
      )}
    </div>
  );
}