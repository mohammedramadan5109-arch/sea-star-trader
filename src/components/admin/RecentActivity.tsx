interface RecentListing {
  id: string;
  make: string;
  model: string;
  year: string | null;
  status: string;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const STATUS_TEXT: Record<string, string> = {
  pending: 'submitted, awaiting review',
  active: 'published',
  rejected: 'rejected',
  sold: 'sold',
};

export function RecentActivity({ listings }: { listings: RecentListing[] }) {
  return (
    <div className="rounded-lg border p-5" style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>
        Recent listings
      </h2>
      <ul className="space-y-4">
        {listings.map((item) => (
          <li key={item.id} className="text-sm">
            <p style={{ color: 'var(--admin-text)' }}>
              {item.year ? `${item.year} ` : ''}
              {item.make} {item.model} — {STATUS_TEXT[item.status] ?? item.status}
            </p>
            <p className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
              {timeAgo(item.created_at)}
            </p>
          </li>
        ))}
        {listings.length === 0 && (
          <li className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
            No listings yet.
          </li>
        )}
      </ul>
    </div>
  );
}
