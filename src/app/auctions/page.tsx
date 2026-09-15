
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auctions - SeaStarTrader',
  description: 'Browse upcoming and live equipment auctions on SeaStarTrader.',
};

export default function AuctionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--navy)' }}>
        Auctions
      </h1>
      <p style={{ color: 'var(--slate)' }}>
        Coming soon...
      </p>
    </div>
  );
}