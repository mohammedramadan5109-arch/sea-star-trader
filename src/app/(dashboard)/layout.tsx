import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
      <header className="border-b" style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold" style={{ color: 'var(--ink)' }}>
            Sea<span style={{ color: 'var(--orange)' }}>Star</span>Trader
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--slate)' }}>{user.email}</span>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm font-semibold" style={{ color: 'var(--orange)' }}>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-64 shrink-0">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Dashboard
            </Link>
            <Link
              href="/my-listings"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              My Listings
            </Link>
            <Link
              href="/my-bids"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              My Bids
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Orders
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}