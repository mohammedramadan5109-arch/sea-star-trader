import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

export default async function MyListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--navy)' }}>
          My Listings
        </h1>
        <Link
          href="/sell"
          className="px-5 py-2.5 text-sm font-semibold rounded-sm"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
        >
          + Add New Listing
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <div className="text-center py-12 border border-[var(--line)] rounded-sm" style={{ backgroundColor: 'var(--off-white)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
            You haven't submitted any equipment yet.
          </p>
          <Link
            href="/sell"
            className="inline-block px-5 py-2.5 text-sm font-semibold rounded-sm"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Sell Your Equipment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="p-6 rounded-sm border border-[var(--line)] flex items-center justify-between"
              style={{ backgroundColor: 'var(--off-white)' }}
            >
              <div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--navy)' }}>
                  {listing.year && `${listing.year} `}
                  {listing.make} {listing.model}
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>
                  {listing.equipment_type} • {listing.location}
                </p>
                {listing.asking_price && (
                  <p className="text-sm font-bold" style={{ color: 'var(--orange)' }}>
                    ${listing.asking_price.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    listing.status === 'active' ? 'success' :
                    listing.status === 'pending' ? 'warning' :
                    listing.status === 'rejected' ? 'error' : 'default'
                  }
                >
                  {listing.status}
                </Badge>
                <Link
                  href={`/listings/${listing.id}`}
                  className="text-sm font-semibold"
                  style={{ color: 'var(--orange)' }}
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}