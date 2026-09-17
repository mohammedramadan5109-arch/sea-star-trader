import { createClient } from '@/lib/supabase/server';
import { EquipmentListingsQueue } from '@/components/admin/EquipmentListingsQueue';

const TABS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
];

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = 'pending' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select('id, make, model, year, equipment_type, asking_price, status, location, created_at')
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: listings, error } = await query;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--admin-text)' }}>
        Listings
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => (
          <a
            key={tab.value}
            href={`/admin/listings?status=${tab.value}`}
            className="rounded-md px-3 py-1.5 text-sm font-medium border"
            style={{
              borderColor: 'var(--admin-border)',
              backgroundColor: status === tab.value ? 'var(--admin-accent)' : 'transparent',
              color: status === tab.value ? '#000' : 'var(--admin-text-muted)',
            }}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {error ? (
        <p className="text-red-400 text-sm">Couldn&apos;t load listings: {error.message}</p>
      ) : (
        <EquipmentListingsQueue listings={listings ?? []} />
      )}
    </div>
  );
}
