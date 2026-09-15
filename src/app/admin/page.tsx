import { createClient } from '@/lib/supabase/server';
import { StatsCards } from '@/components/admin/StatsCards';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: listingsCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true });

  const { count: pendingListings } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: valuationRequests } = await supabase
    .from('valuation_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
        Admin Dashboard
      </h1>

      <StatsCards
        stats={{
          users: usersCount || 0,
          listings: listingsCount || 0,
          pendingListings: pendingListings || 0,
          valuationRequests: valuationRequests || 0,
        }}
      />
    </div>
  );
}