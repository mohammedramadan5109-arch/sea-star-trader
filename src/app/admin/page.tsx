import { createClient } from '@/lib/supabase/server';
import { StatsCards } from '@/components/admin/StatsCards';
import { ListingsChart } from '@/components/admin/RevenueChart';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { TopListings } from '@/components/admin/TopListings';

function monthsAgo(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
}

function pct(curr: number, prev: number) {
  if (prev > 0) return Math.round(((curr - prev) / prev) * 100);
  return curr > 0 ? 100 : 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: usersCount },
    { count: usersLast30 },
    { count: usersPrev30 },
    { count: listingsCount },
    { count: pendingListings },
    { count: valuationRequests },
    { data: allListings },
    { data: recentListings },
    { data: topListings },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', monthsAgo(1)),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', monthsAgo(2)).lt('created_at', monthsAgo(1)),
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('valuation_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('listings').select('created_at'),
    supabase.from('listings').select('id, make, model, year, status, created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('listings').select('id, make, model, year, asking_price, status').eq('status', 'active').order('asking_price', { ascending: false }).limit(5),
  ]);

  const listingsThisMonth = (allListings ?? []).filter((l) => new Date(l.created_at) >= new Date(monthsAgo(1))).length;
  const listingsPrevMonth = (allListings ?? []).filter(
    (l) => new Date(l.created_at) >= new Date(monthsAgo(2)) && new Date(l.created_at) < new Date(monthsAgo(1))
  ).length;

  // Listings submitted per month, last 6 months
  const listingsByMonth = Array.from({ length: 6 }).map((_, i) => {
    const idx = 5 - i;
    const start = new Date(monthsAgo(idx + 1));
    const end = new Date(monthsAgo(idx));
    const count = (allListings ?? []).filter(
      (l) => new Date(l.created_at) >= start && new Date(l.created_at) < end
    ).length;
    return { label: start.toLocaleString('en-US', { month: 'short' }), value: count };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--admin-text)' }}>
        Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--admin-text-muted)' }}>
        Overview of your marketplace
      </p>

      <StatsCards
        stats={{
          users: usersCount || 0,
          usersTrend: pct(usersLast30 || 0, usersPrev30 || 0),
          listings: listingsCount || 0,
          listingsTrend: pct(listingsThisMonth, listingsPrevMonth),
          pendingListings: pendingListings || 0,
          valuationRequests: valuationRequests || 0,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ListingsChart data={listingsByMonth} />
        </div>
        <RecentActivity listings={recentListings ?? []} />
      </div>

      <div className="mt-6">
        <TopListings listings={topListings ?? []} />
      </div>
    </div>
  );
}
