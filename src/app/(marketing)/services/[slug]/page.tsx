import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Ship, ClipboardCheck, Banknote, Wrench, ImageOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import {
  SERVICE_PAGES,
  type ServicePageContent,
} from '@/lib/constants/service-content';
import { SERVICE_SLUGS } from '@/lib/constants/services';
import { ServicePageBase } from '@/components/services/ServicePageBase';
import { ShippingRequestForm } from '@/components/services/ShippingRequestForm';
import { InspectionRequestForm } from '@/components/services/InspectionRequestForm';
import { AppraisalRequestForm } from '@/components/services/AppraisalRequestForm';
import { RefurbishingRequestForm } from '@/components/services/RefurbishingRequestForm';
import type { ListingOption, ServiceContactPrefill } from '@/components/services/types';

const ICONS = {
  shipping: Ship,
  inspection: ClipboardCheck,
  appraisal: Banknote,
  refurbishing: Wrench,
} as const;

export function generateStaticParams() {
  return Object.entries(SERVICE_SLUGS)
    .filter(([name]) => name !== 'Financial services')
    .map(([, slug]) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = (SERVICE_PAGES as Record<string, ServicePageContent | undefined>)[slug];

  if (!content) {
    return { title: 'Service not found | SeaStarTrader' };
  }

  return {
    title: `${content.keyword} | SeaStarTrader Services`,
    description: content.tagline,
  };
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ listing?: string }>;
}) {
  const { slug } = await params;

  // "Financial services" has its own full page at /financing.
  if (slug === SERVICE_SLUGS['Financial services']) {
    redirect('/financing');
  }

  const content = (SERVICE_PAGES as Record<string, ServicePageContent | undefined>)[slug];
  if (!content) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let signedIn = false;
  let contact: ServiceContactPrefill | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, phone')
      .eq('id', user.id)
      .single();

    signedIn = true;
    contact = {
      name: profile?.name ?? '',
      email: user.email ?? '',
      phone: profile?.phone ?? '',
    };
  }

  const { listing: listingParam } = await searchParams;

  // Optional dropdown: the visitor's own listings plus active public ones.
  let listingOptions: ListingOption[] = [];
  if (signedIn && user && contact) {
    const [own, active] = await Promise.all([
      supabase
        .from('listings')
        .select('id, year, make, model, location')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('listings')
        .select('id, year, make, model, location')
        .in('status', ['active', 'approved'])
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    const seen = new Set<string>();
    const toOption = (l: { id: string; year: string | null; make: string | null; model: string | null; location: string | null }): ListingOption => ({
      id: l.id,
      label: `${l.year ? `${l.year} ` : ''}${l.make ?? '?'} ${l.model ?? ''} — ${l.location ?? 'location not set'}`,
    });
    for (const row of [...(own.data ?? []), ...(active.data ?? [])]) {
      if (!seen.has(row.id)) {
        seen.add(row.id);
        listingOptions.push(toOption(row));
      }
    }
  }

  // ?listing=<id> — prefill coming from a listing page. Verified against the
  // DB so a stale or made-up id silently falls back to a normal form.
  let initialListingId: string | null = null;
  if (listingParam) {
    const { data: target } = await supabase
      .from('listings')
      .select('id, year, make, model, location')
      .eq('id', listingParam)
      .maybeSingle();

    if (target) {
      initialListingId = target.id;
      const label = `${target.year ? `${target.year} ` : ''}${target.make ?? '?'} ${target.model ?? ''} — ${target.location ?? 'location not set'}`;
      if (!listingOptions.some((o) => o.id === target.id)) {
        listingOptions = [{ id: target.id, label }, ...listingOptions];
      }
    }
  }

  const Icon = ICONS[content.slug];

  const form = (() => {
    if (!signedIn || !contact) return null; // RequestFormSection shows the gate instead
    switch (content.slug) {
      case 'shipping':
        return (
          <ShippingRequestForm
            contact={contact}
            listingOptions={listingOptions}
            initialListingId={initialListingId}
          />
        );
      case 'inspection':
        return (
          <InspectionRequestForm
            contact={contact}
            listingOptions={listingOptions}
            initialListingId={initialListingId}
          />
        );
      case 'appraisal':
        return <AppraisalRequestForm contact={contact} />;
      case 'refurbishing':
        return (
          <RefurbishingRequestForm
            contact={contact}
            listingOptions={listingOptions}
            initialListingId={initialListingId}
          />
        );
    }
  })();

  const specialSection = (() => {
    switch (content.slug) {
      case 'inspection':
        return (
          <section className="max-w-4xl mx-auto px-6 py-10">
            <div className="glass-card backdrop-blur-md rounded-lg p-6 sm:p-8 card-tilt">
              <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
                Example inspection report
              </h2>
              <p className="text-sm mb-5" style={{ color: 'var(--slate)' }}>
                Every report uses the same 120-point standard that produces the
                inspection score shown on SeaStarTrader listings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  'Engine — start-up, oil condition, blow-by, hours and serial verification',
                  'Hydraulics — pressures, cycle times, cylinder drift',
                  'Undercarriage — track wear %, rollers, idlers, sprockets',
                  'Structure — welds, cracks, repair history on boom, stick and frame',
                  'Cab & electrics — controls, displays, safety devices',
                  'Photos & video — full walk-around evidence attached',
                ].map((item) => (
                  <p key={item} className="text-sm" style={{ color: 'var(--ink)' }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>
        );
      case 'refurbishing':
        return (
          <section className="max-w-6xl mx-auto px-6 py-10">
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
              Before &amp; after
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--slate)' }}>
              Real workshop results from recent refurbishing projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['before', 'after'] as const).map((slot) => (
                <div
                  key={slot}
                  className="rounded-lg border p-6 flex flex-col items-center justify-center text-center min-h-52"
                  style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
                >
                  <ImageOff size={28} className="mb-3" style={{ color: 'var(--slate)' }} />
                  <p className="text-sm font-bold capitalize" style={{ color: 'var(--navy)' }}>
                    {slot} photo
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--slate)' }}>
                    Recent project images are being uploaded — check back soon, or ask us to see finished work.
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  })();

  return (
    <ServicePageBase
      content={content}
      icon={<Icon size={32} style={{ color: 'var(--orange)' }} aria-hidden="true" />}
      form={form}
      signedIn={signedIn}
      requestPath={`/services/${slug}${initialListingId ? `?listing=${initialListingId}` : ''}`}
      specialSection={specialSection}
    />
  );
}
