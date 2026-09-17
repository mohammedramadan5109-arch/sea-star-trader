import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ImageGallery } from '@/components/listings/ImageGallery';
import { ListingActions } from '@/components/listings/ListingActions';
import { CONTACT_PHONE_DISPLAY } from '@/lib/constants/contact';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id (
        email,
        company_name,
        phone
      )
    `)
    .eq('id', id)
    .single();

  if (error || !listing) {
    notFound();
  }

  // Check if the current user has this listing saved
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  let initialSaved = false;
  if (currentUser) {
    const { data: savedRow } = await supabase
      .from('saved_listings')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('listing_id', id)
      .maybeSingle();
    initialSaved = !!savedRow;
  }

  // Seller company name is still shown for reference — contact always
  // goes through the fixed site email/WhatsApp, not the seller's own info.
  const seller = listing.profiles as any;
  const sellerCompany = seller?.company_name || 'SeaStarTrader Seller';

  // Create email subject and body
  const emailSubject = encodeURIComponent(
    `Inquiry: ${listing.year ? listing.year + ' ' : ''}${listing.make} ${listing.model}`
  );
  const emailBody = encodeURIComponent(
    `Hi,\n\nI'm interested in your ${listing.equipment_type} listed on SeaStarTrader:\n\n${listing.year ? listing.year + ' ' : ''}${listing.make} ${listing.model}\nLocation: ${listing.location}\n${listing.asking_price ? 'Price: $' + listing.asking_price.toLocaleString() : ''}\n\nPlease let me know if this is still available.\n\nThank you!`
  );
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${listing.year ? listing.year + ' ' : ''}${listing.make} ${listing.model} listed on SeaStarTrader. Is it still available?`
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-sm font-semibold mb-6"
        style={{ color: 'var(--orange)' }}
      >
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery — now using the actual working component */}
        <div>
          <ImageGallery
            images={listing.photos ?? []}
            alt={`${listing.make} ${listing.model}`}
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
            {listing.year && `${listing.year} `}
            {listing.make} {listing.model}
          </h1>

          {listing.asking_price && (
            <div className="text-2xl font-bold mb-6" style={{ color: 'var(--orange)' }}>
              ${listing.asking_price.toLocaleString()}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between py-3 border-b border-[var(--line)]">
              <span className="font-semibold" style={{ color: 'var(--slate)' }}>
                Equipment Type
              </span>
              <span style={{ color: 'var(--navy)' }}>{listing.equipment_type}</span>
            </div>

            {listing.condition && (
              <div className="flex items-center justify-between py-3 border-b border-[var(--line)]">
                <span className="font-semibold" style={{ color: 'var(--slate)' }}>
                  Condition
                </span>
                <span style={{ color: 'var(--navy)' }}>{listing.condition}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-b border-[var(--line)]">
              <span className="font-semibold" style={{ color: 'var(--slate)' }}>
                Location
              </span>
              <span style={{ color: 'var(--navy)' }}>{listing.location}</span>
            </div>
          </div>

          {listing.description && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
                Description
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--slate)' }}>
                {listing.description}
              </p>
            </div>
          )}

          {/* Seller Info */}
          <div className="mb-8 p-4 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--navy)' }}>
              Seller Information
            </h3>
            <div className="space-y-1 text-sm">
              <div style={{ color: 'var(--slate)' }}>
                <span className="font-semibold">Company:</span> {sellerCompany}
              </div>
              <div style={{ color: 'var(--slate)' }}>
                <span className="font-semibold">Contact:</span> {CONTACT_PHONE_DISPLAY}
              </div>
            </div>
          </div>

          <ListingActions
            listingId={id}
            emailSubject={emailSubject}
            emailBody={emailBody}
            whatsappMessage={whatsappMessage}
            isLoggedIn={!!currentUser}
            initialSaved={initialSaved}
          />
        </div>
      </div>
    </div>
  );
}
