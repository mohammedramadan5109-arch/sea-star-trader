interface TopListing {
  id: string;
  make: string;
  model: string;
  year: string | null;
  asking_price: number | null;
  status: string;
}

export function TopListings({ listings }: { listings: TopListing[] }) {
  return (
    <div
      className="rounded-lg border"
      style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--admin-border)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>
          Top active listings
        </h2>
        <a
          href="/admin/listings?status=active"
          className="text-xs font-medium"
          style={{ color: 'var(--admin-accent)' }}
        >
          View all →
        </a>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {listings.map((item, i) => (
            <tr key={item.id} className="border-t" style={{ borderColor: 'var(--admin-border)' }}>
              <td className="px-5 py-3 w-8" style={{ color: 'var(--admin-text-muted)' }}>
                {i + 1}
              </td>
              <td className="px-5 py-3" style={{ color: 'var(--admin-text)' }}>
                {item.year ? `${item.year} ` : ''}
                {item.make} {item.model}
              </td>
              <td className="px-5 py-3 text-right font-medium" style={{ color: 'var(--admin-text)' }}>
                {item.asking_price ? `$${item.asking_price.toLocaleString()}` : '—'}
              </td>
            </tr>
          ))}
          {listings.length === 0 && (
            <tr>
              <td colSpan={3} className="px-5 py-8 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                No active listings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
