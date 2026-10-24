import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';

const SERVICE_LABELS: Record<string, string> = {
  shipping: 'Shipping quote',
  inspection: 'Inspection',
  refurbishing: 'Refurbishing',
};

/** Compact summary line of what was requested. */
function requestSummary(serviceType: string, details: Record<string, unknown> | null): string {
  if (!details) return '';
  const val = (key: string) =>
    typeof details[key] === 'string' || typeof details[key] === 'number'
      ? String(details[key]).replace(/_/g, ' ')
      : null;

  switch (serviceType) {
    case 'shipping':
      return [
        val('equipment_description'),
        val('pickup_city') && val('destination') && `${val('pickup_city')} → ${val('destination')}`,
        val('shipping_method'),
      ]
        .filter(Boolean)
        .join(' • ');
    case 'inspection':
      return [val('location_city'), val('inspection_level')].filter(Boolean).join(' • ');
    case 'refurbishing': {
      const work = Array.isArray(details['work_needed'])
        ? (details['work_needed'] as unknown[]).map(String).join(', ')
        : null;
      return [`${details['make'] ?? ''} ${details['model'] ?? ''}`.trim(), work]
        .filter(Boolean)
        .join(' • ');
    }
    default:
      return '';
  }
}

export default async function MyServiceRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [serviceRes, valuationRes] = await Promise.all([
    supabase
      .from('service_requests')
      .select('id, service_type, status, created_at, details, listing_id')
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false }),
    supabase
      .from('valuation_requests')
      .select('id, status, created_at, make, model, year')
      .order('created_at', { ascending: false }),
  ]);

  const requests = [
    ...(serviceRes.data ?? []).map((row: Record<string, unknown>) => {
      const serviceType = String(row.service_type);
      return {
        id: String(row.id),
        serviceLabel: SERVICE_LABELS[serviceType] ?? serviceType,
        title: serviceLabelTitle(serviceType, row.details as Record<string, unknown> | null),
        summary: requestSummary(serviceType, row.details as Record<string, unknown> | null),
        status: String(row.status),
        created_at: String(row.created_at),
        listingId: row.listing_id ? String(row.listing_id) : null,
      };
    }),
    ...(valuationRes.data ?? []).map((row: Record<string, unknown>) => ({
      id: String(row.id),
      serviceLabel: 'Appraisal',
      title: [row.year, row.make, row.model].filter(Boolean).join(' ') || 'Equipment appraisal',
      summary: '',
      status: String(row.status),
      created_at: String(row.created_at),
      listingId: null,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--navy)' }}>
          My Service Requests
        </h1>
        <Link
          href="/services"
          className="px-5 py-2.5 text-sm font-semibold rounded-sm"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
        >
          Request a service
        </Link>
      </div>

      {requests.length === 0 ? (
        <div
          className="text-center py-12 border border-[var(--line)] rounded-sm"
          style={{ backgroundColor: 'var(--off-white)' }}
        >
          <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
            You haven&apos;t requested any services yet — shipping quotes, inspections, appraisals
            and refurbishing work all appear here once requested.
          </p>
          <Link
            href="/services"
            className="inline-block px-5 py-2.5 text-sm font-semibold rounded-sm"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Browse our services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={`${request.serviceLabel}-${request.id}`}
              className="p-6 rounded-sm border border-[var(--line)]"
              style={{ backgroundColor: 'var(--off-white)' }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--orange)' }}>
                    {request.serviceLabel}
                  </p>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--navy)' }}>
                    {request.title}
                  </h3>
                  {request.summary && (
                    <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>
                      {request.summary}
                    </p>
                  )}
                  <p className="text-xs" style={{ color: 'var(--slate)' }}>
                    Requested {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      request.status === 'completed' || request.status === 'converted'
                        ? 'success'
                        : request.status === 'pending'
                          ? 'warning'
                          : request.status === 'rejected'
                            ? 'error'
                            : 'default'
                    }
                  >
                    {request.status.replace('_', ' ')}
                  </Badge>
                  {request.listingId && (
                    <Link
                      href={`/listings/${request.listingId}`}
                      className="text-sm font-semibold"
                      style={{ color: 'var(--orange)' }}
                    >
                      View listing →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function serviceLabelTitle(
  serviceType: string,
  details: Record<string, unknown> | null
): string {
  const val = (key: string) => (details ? String(details[key] ?? '') : '');
  switch (serviceType) {
    case 'shipping':
      return val('equipment_description') || 'Shipping request';
    case 'inspection':
      return [val('equipment_make'), val('equipment_model')].filter(Boolean).join(' ') || 'Inspection request';
    case 'refurbishing':
      return `${val('make')} ${val('model')}`.trim() || 'Refurbishing request';
    default:
      return 'Service request';
  }
}
