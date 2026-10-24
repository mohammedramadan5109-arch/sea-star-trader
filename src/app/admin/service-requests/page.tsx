import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  AdminServiceRequestsQueue,
  type AdminServiceRequest,
} from '@/components/services/AdminServiceRequestsQueue';

interface ServiceRequestRow {
  id: string;
  user_id: string;
  service_type: string;
  status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  created_at: string;
  listing_id: string | null;
  details: Record<string, unknown> | null;
  admin_notes: string | null;
}

interface ValuationRequestRow {
  id: string;
  user_id: string;
  status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  created_at: string;
  make: string | null;
  model: string | null;
  year: string | null;
  condition: string | null;
  location: string | null;
  hours: number | null;
  purpose: string | null;
  notes: string | null;
  admin_notes: string | null;
}

interface ProfileRow {
  id: string;
  name: string | null;
  company_name: string | null;
}

function fmt(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

/** Compact key: value summary for the details cell. */
function detailsSummary(details: Record<string, unknown> | null): string {
  if (!details) return '—';
  const lines: string[] = [];
  const push = (label: string, key: string) => {
    const v = fmt(details[key]);
    if (v) lines.push(`${label}: ${v.replace('_', ' ')}`);
  };
  push('Equipment', 'equipment_description');
  push('Pickup', 'pickup_city');
  push('Destination', 'destination');
  push('Method', 'shipping_method');
  push('Ready', 'ready_date');
  push('Inspect level', 'inspection_level');
  push('Location', 'location_city');
  push('Condition', 'current_condition');
  push('Work needed', 'work_needed');
  const rawWork = details['work_needed'];
  if (Array.isArray(rawWork)) lines.push(`Work needed: ${rawWork.join(', ').replace(/_/g, ' ')}`);
  push('Budget', 'budget');
  push('Notes', 'notes');
  return lines.length ? lines.join('\n') : '—';
}

/** The pre-colored AdminServiceRequestsQueue needs one unified array. */
function mapServiceRow(
  row: ServiceRequestRow,
  profiles: Map<string, ProfileRow>,
  listings: Map<string, string>
): AdminServiceRequest {
  return {
    table: 'service_requests',
    id: row.id,
    service: row.service_type as AdminServiceRequest['service'],
    status: row.status,
    contact_name: row.contact_name,
    contact_email: row.contact_email,
    contact_phone: row.contact_phone,
    created_at: row.created_at,
    listing_id: row.listing_id,
    listingLabel: row.listing_id ? listings.get(row.listing_id) ?? null : null,
    userName: profiles.get(row.user_id)?.name ?? null,
    details: detailsSummary(row.details),
    admin_notes: row.admin_notes,
  };
}

function mapValuationRow(
  row: ValuationRequestRow,
  profiles: Map<string, ProfileRow>
): AdminServiceRequest {
  const lines: string[] = [];
  if (row.make || row.model) {
    lines.push(`Machine: ${[row.year, row.make, row.model].filter(Boolean).join(' ')}`);
  }
  if (row.condition) lines.push(`Condition: ${row.condition}`);
  if (row.hours !== null) lines.push(`Hours: ${row.hours}`);
  if (row.location) lines.push(`Location: ${row.location}`);
  if (row.purpose) lines.push(`Purpose: ${row.purpose}`);
  if (row.notes) lines.push(`Notes: ${row.notes}`);

  return {
    table: 'valuation_requests',
    id: row.id,
    service: 'appraisal',
    status: row.status,
    contact_name: row.contact_name,
    contact_email: row.contact_email,
    contact_phone: row.contact_phone,
    created_at: row.created_at,
    listing_id: null,
    listingLabel: null,
    userName: profiles.get(row.user_id)?.name ?? null,
    details: lines.length ? lines.join('\n') : '—',
    admin_notes: row.admin_notes,
  };
}

export default async function AdminServiceRequestsPage() {
  const supabase = await createClient();

  const [serviceRes, valuationRes] = await Promise.all([
    supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<ServiceRequestRow[]>(),
    supabase
      .from('valuation_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<ValuationRequestRow[]>(),
  ]);

  // Names for the contact column + labels for linked listings.
  const userIds = [
    ...new Set([
      ...(serviceRes.data ?? []).map((r) => r.user_id),
      ...(valuationRes.data ?? []).map((r) => r.user_id),
    ]),
  ];
  const profiles = new Map<string, ProfileRow>();
  if (userIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, name, company_name')
      .in('id', userIds)
      .returns<ProfileRow[]>();
    for (const p of data ?? []) profiles.set(p.id, p);
  }

  const listingIds = (serviceRes.data ?? [])
    .map((r) => r.listing_id)
    .filter((id): id is string => !!id);
  const listings = new Map<string, string>();
  if (listingIds.length > 0) {
    const { data } = await supabase
      .from('listings')
      .select('id, year, make, model')
      .in('id', listingIds);
    for (const l of data ?? []) {
      listings.set(l.id, `${l.year ? `${l.year} ` : ''}${l.make ?? '?'} ${l.model ?? ''}`);
    }
  }

  const requests: AdminServiceRequest[] = [
    ...(serviceRes.data ?? []).map((row) => mapServiceRow(row, profiles, listings)),
    ...(valuationRes.data ?? []).map((row) => mapValuationRow(row, profiles)),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>
          Service requests
        </h1>
        <Link
          href="/admin/valuation-requests"
          className="text-xs underline"
          style={{ color: 'var(--admin-accent)' }}
        >
          Legacy valuation queue →
        </Link>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--admin-text-muted)' }}>
        Shipping, inspection, refurbishing and appraisal requests submitted from the service pages.
      </p>

      <AdminServiceRequestsQueue requests={requests} />
    </div>
  );
}
