interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-semibold" style={{ color: 'var(--slate)' }}>
          {title}
        </div>
        {icon && <div style={{ color: 'var(--steel-light)' }}>{icon}</div>}
      </div>
      <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
        {value}
      </div>
      {trend && (
        <div className={`text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
        </div>
      )}
    </div>
  );
}

interface StatsCardsProps {
  stats: {
    users: number;
    listings: number;
    pendingListings: number;
    valuationRequests: number;
    revenue?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Users" value={stats.users} />
      <StatCard title="Total Listings" value={stats.listings} />
      <StatCard title="Pending Listings" value={stats.pendingListings} />
      <StatCard title="Valuation Requests" value={stats.valuationRequests} />
    </div>
  );
}