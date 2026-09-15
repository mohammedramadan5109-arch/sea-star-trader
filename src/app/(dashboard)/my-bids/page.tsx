export default function MyBidsPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
        My Bids
      </h1>
      <div className="text-center py-12 border border-[var(--line)] rounded-sm" style={{ backgroundColor: 'var(--off-white)' }}>
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          You haven't placed any bids yet. Browse auctions to get started.
        </p>
      </div>
    </div>
  );
}