import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, BadgeCheck, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageGallery } from '@/components/listings/ImageGallery';
import { ListingActions } from '@/components/listings/ListingActions';
import { SaveButton } from '@/components/listings/SaveButton';
import { ListingSpecBar } from '@/components/listings/ListingSpecBar';

// Dark theme scoped to this page only — your global light theme is untouched.
const LISTING_THEME = {
  '--lst-bg': '#0A1520',
  '--lst-surface': '#0F1E2D',
  '--lst-border': '#1C3040',
  '--lst-text': '#E8EDF2',
  '--lst-text-muted': '#8FA3B5',
  '--lst-accent': '#F5B324',
  '--lst-success': '#3FCF8E',
} as React.CSSProperties;

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*, profiles:user_id (company_name, is_verified)')
    .eq('id', id)
    .single();

  if (error || !listing) notFound();

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

  // Previous / next listing within the same category
  const [{ data: prevRows }, { data: nextRows }] = await Promise.all([
    supabase
      .from('listings')
      .select('id')
      .eq('status', 'active')
      .lt('created_at', listing.created_at)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('listings')
      .select('id')
      .eq('status', 'active')
      .gt('created_at', listing.created_at)
      .order('created_at', { ascending: true })
      .limit(1),
  ]);
  const prevId = prevRows?.[0]?.id;
  const nextId = nextRows?.[0]?.id;

  const seller = listing.profiles as any;
  const isVerified = !!seller?.is_verified;

  const title = `${listing.year ? listing.year + ' ' : ''}${listing.make} ${listing.model}`;
  const emailSubject = encodeURIComponent(`Inquiry: ${title}`);
  const emailBody = encodeURIComponent(
    `Hi,\n\nI'm interested in this ${listing.equipment_type} listed on SeaStarTrader:\n\n${title}\nListing ID: ${listing.reference_code ?? id}\nLocation: ${listing.location ?? ''}\n${listing.asking_price ? 'Price: $' + Number(listing.asking_price).toLocaleString() : ''}\n\nPlease let me know if this is still available.\n\nThank you!`
  );
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${title} (${listing.reference_code ?? id}) on SeaStarTrader. Is it still available?`
  );

  const mapsHref =
    listing.latitude && listing.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location ?? '')}`;

  const specs: Array<[string, string]> = [
    ['Make', listing.make],
    ['Model', listing.model],
    listing.year && ['Year', listing.year],
    listing.hours !== null && listing.hours !== undefined && [
      'Hours',
      `${Number(listing.hours).toLocaleString()} hrs`,
    ],
    listing.serial_number && ['Serial Number', listing.serial_number],
    listing.net_weight && ['Net Weight', `${Number(listing.net_weight).toLocaleString()} lbs`],
    listing.engine_model && ['Engine Model', listing.engine_model],
    listing.engine_power && ['Engine Power', `${listing.engine_power} hp`],
    listing.fuel_type && ['Fuel Type', listing.fuel_type],
    listing.transmission && ['Transmission', listing.transmission],
    listing.bucket_capacity && ['Bucket Capacity', listing.bucket_capacity],
    listing.tire_size && ['Tire Size', listing.tire_size],
    listing.condition && ['Condition', listing.condition],
  ].filter(Boolean) as Array<[string, string]>;

  const isAvailable = listing.status === 'active';

  return (
    <div style={{ ...LISTING_THEME, backgroundColor: 'var(--lst-bg)' }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumbs + prev/next */}
        <div className="flex items-center justify-between mb-6 text-sm flex-wrap gap-3">
          <nav className="flex items-center gap-2" style={{ color: 'var(--lst-text-muted)' }}>
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/listings">Browse Equipment</Link>
            {listing.category && (
              <>
                <span>›</span>
                <Link href={`/listings?category=${encodeURIComponent(listing.category)}`}>
                  {listing.category}
                </Link>
              </>
            )}
            <span>›</span>
            <span style={{ color: 'var(--lst-text)' }}>{title}</span>
          </nav>

          <div className="flex items-center gap-4" style={{ color: 'var(--lst-text-muted)' }}>
            {prevId ? (
              <Link href={`/listings/${prevId}`} className="flex items-center gap-1">
                <ChevronLeft size={16} /> Previous
              </Link>
            ) : (
              <span className="flex items-center gap-1 opacity-40">
                <ChevronLeft size={16} /> Previous
              </span>
            )}
            {nextId ? (
              <Link href={`/listings/${nextId}`} className="flex items-center gap-1">
                Next <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="flex items-center gap-1 opacity-40">
                Next <ChevronRight size={16} />
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
          {/* Gallery */}
          <div className="relative">
            {isVerified && (
              <div
                className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
                style={{ backgroundColor: 'var(--lst-success)', color: '#062A1A' }}
              >
                <BadgeCheck size={14} />
                Verified Seller
              </div>
            )}
            <ImageGallery images={listing.photos ?? []} alt={title} />
          </div>

          {/* Summary panel */}
          <aside
            className="rounded-xl border p-5 h-fit"
            style={{ backgroundColor: 'var(--lst-surface)', borderColor: 'var(--lst-border)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-bold leading-snug" style={{ color: 'var(--lst-text)' }}>
                {title}
              </h1>
              <SaveButton listingId={id} isLoggedIn={!!currentUser} initialSaved={initialSaved} />
            </div>

            <div className="flex items-center justify-between mb-5 text-xs">
              <span style={{ color: 'var(--lst-text-muted)' }}>
                Listing ID: {listing.reference_code ?? id.slice(0, 8)}
              </span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--lst-text-muted)' }}>
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: isAvailable ? 'var(--lst-success)' : '#8FA3B5' }}
                />
                {isAvailable ? 'In Stock' : listing.status}
              </span>
            </div>

            {listing.asking_price && (
              <div className="mb-1">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--lst-text)' }}>
                  ${Number(listing.asking_price).toLocaleString()}
                </span>
                <span className="ml-2 text-sm" style={{ color: 'var(--lst-text-muted)' }}>
                  USD
                </span>
              </div>
            )}
            {listing.is_negotiable && (
              <div className="text-xs mb-5" style={{ color: 'var(--lst-text-muted)' }}>
                Negotiable
              </div>
            )}

            {listing.location && (
              <div
                className="flex items-center gap-2 mb-5 text-sm"
                style={{ color: 'var(--lst-text)' }}
              >
                <MapPin size={16} style={{ color: 'var(--lst-text-muted)' }} />
                {listing.location}
              </div>
            )}

            <ListingActions
              emailSubject={emailSubject}
              emailBody={emailBody}
              whatsappMessage={whatsappMessage}
            />
          </aside>
        </div>

        {/* Spec bar */}
        <div className="mb-6">
          <ListingSpecBar
            inspectionScore={listing.inspection_score ?? null}
            hours={listing.hours ?? null}
            condition={listing.condition ?? null}
            year={listing.year ?? null}
            netWeight={listing.net_weight ?? null}
            fuelType={listing.fuel_type ?? null}
          />
        </div>

        {/* Overview */}
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: 'var(--lst-surface)', borderColor: 'var(--lst-border)' }}
        >
          <div
            className="pb-3 mb-6 border-b text-sm font-bold w-fit"
            style={{ borderColor: 'var(--lst-accent)', color: 'var(--lst-text)' }}
          >
            Overview
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              {listing.description && (
                <>
                  <h2 className="text-base font-bold mb-3" style={{ color: 'var(--lst-text)' }}>
                    Description
                  </h2>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line mb-5"
                    style={{ color: 'var(--lst-text-muted)' }}
                  >
                    {listing.description}
                  </p>
                </>
              )}

              {listing.highlights?.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {listing.highlights.map((point: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: 'var(--lst-text)' }}
                    >
                      <Check size={16} style={{ color: 'var(--lst-success)' }} className="mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {listing.location && (
                <>
                  <h2 className="text-base font-bold mb-3" style={{ color: 'var(--lst-text)' }}>
                    Location
                  </h2>
                  <div
                    className="rounded-lg border p-4"
                    style={{ borderColor: 'var(--lst-border)', backgroundColor: 'var(--lst-bg)' }}
                  >
                    <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--lst-text)' }}>
                      <MapPin size={16} style={{ color: 'var(--lst-accent)' }} />
                      <span className="text-sm font-semibold">{listing.location}</span>
                    </div>
                    <a
                      href={mapsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                      style={{ color: '#5AA9F5' }}
                    >
                      View on Google Maps
                    </a>
                  </div>
                </>
              )}
            </div>

            <div>
              <h2 className="text-base font-bold mb-3" style={{ color: 'var(--lst-text)' }}>
                Key Specifications
              </h2>
              <dl>
                {specs.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3 border-b text-sm"
                    style={{ borderColor: 'var(--lst-border)' }}
                  >
                    <dt style={{ color: 'var(--lst-text-muted)' }}>{label}</dt>
                    <dd className="font-medium" style={{ color: 'var(--lst-text)' }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Why buy from us */}
        <div
          className="rounded-xl border p-6 mt-6"
          style={{ backgroundColor: 'var(--lst-surface)', borderColor: 'var(--lst-border)' }}
        >
          <h2 className="text-base font-bold mb-5" style={{ color: 'var(--lst-text)' }}>
            Why Buy From SeaStarTrader?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {['Secure Transactions', 'Verified Sellers', 'Global Shipping', 'Trusted Support'].map(
              (item) => (
                <div key={item} className="flex flex-col items-center gap-2">
                  <BadgeCheck size={22} style={{ color: 'var(--lst-accent)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--lst-text-muted)' }}>
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}