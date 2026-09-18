import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ListingEditForm } from '@/components/admin/ListingEditForm';

export default async function AdminEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !listing) notFound();

  return (
    <div>
      <Link
        href="/admin/listings"
        className="inline-flex items-center gap-1 text-sm mb-4"
        style={{ color: 'var(--admin-text-muted)' }}
      >
        <ChevronLeft size={16} />
        Back to listings
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>
            Edit listing
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--admin-text-muted)' }}>
            {listing.reference_code ?? id.slice(0, 8)} · status: {listing.status}
          </p>
        </div>
        <Link
          href={`/listings/${id}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold"
          style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
        >
          <ExternalLink size={14} />
          View public page
        </Link>
      </div>

      <ListingEditForm listingId={id} listing={listing} />
    </div>
  );
}