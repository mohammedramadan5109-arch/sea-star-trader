import { Users, ListChecks, ClipboardList, FileSearch } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    users: number;
    usersTrend: number;
    listings: number;
    listingsTrend: number;
    pendingListings: number;
    valuationRequests: number;
  };
}

function Trend({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={`text-xs font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
      {positive ? '↑' : '↓'} {Math.abs(value)}% from last month
    </span>
  );
}

function Card({
  label,
  value,
  icon,
  trend,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        backgroundColor: 'var(--admin-surface)',
        borderColor: highlight ? 'var(--admin-accent)' : 'var(--admin-border)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>{label}</span>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ backgroundColor: 'rgba(242,169,59,0.12)', color: 'var(--admin-accent)' }}
        >
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--admin-text)' }}>{value}</div>
      {trend !== undefined && <Trend value={trend} />}
    </div>
  );
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card label="Total users" value={stats.users.toLocaleString()} icon={<Users size={16} />} trend={stats.usersTrend} />
      <Card label="Total listings" value={stats.listings.toLocaleString()} icon={<ListChecks size={16} />} trend={stats.listingsTrend} />
      <Card
        label="Pending listings"
        value={stats.pendingListings.toLocaleString()}
        icon={<ClipboardList size={16} />}
        highlight={stats.pendingListings > 0}
      />
      <Card
        label="Valuation requests"
        value={stats.valuationRequests.toLocaleString()}
        icon={<FileSearch size={16} />}
        highlight={stats.valuationRequests > 0}
      />
    </div>
  );
}
