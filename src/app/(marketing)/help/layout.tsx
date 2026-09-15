
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Support - SeaStarTrader',
  description: 'Find answers about buying, selling, shipping heavy equipment. Get help with auctions, payments, logistics, and account management.',
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}