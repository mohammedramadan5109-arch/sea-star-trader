import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/bidding-requests', label: 'Bidding requests' },
  { href: '/admin/valuation-requests', label: 'Valuation requests' },
  { href: '/admin/listings', label: 'Listings' },
  { href: '/admin/auctions', label: 'Auctions' },
  { href: '/admin/orders', label: 'Orders' },
];

const ADMIN_THEME = {
  '--admin-bg': '#0B0F17',
  '--admin-surface': '#121A28',
  '--admin-border': '#1E2836',
  '--admin-text': '#EAEDF2',
  '--admin-text-muted': '#8A94A6',
  '--admin-accent': '#F2A93B',
} as React.CSSProperties;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Same admin check as actions.ts — see the TODO there if this
  // doesn't match how your app flags admins.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/dashboard');

  return (
    <div
      className="min-h-screen flex"
      style={{ ...ADMIN_THEME, backgroundColor: 'var(--admin-bg)' }}
    >
      <aside
        className="w-60 shrink-0 border-r px-4 py-6 hidden md:block"
        style={{ borderColor: 'var(--admin-border)' }}
      >
        <div className="text-lg font-bold px-2 mb-8" style={{ color: 'var(--admin-text)' }}>
          SeaStarTrader
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium hover:opacity-80"
              style={{ color: 'var(--admin-text-muted)' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
