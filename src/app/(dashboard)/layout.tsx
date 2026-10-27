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

  // Grab the current user's profile so we can display a friendly name.
  const { data: profile } = user
    ? await supabase.from('profiles').select('name').eq('id', user.id).single()
    : { data: null };

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
      <header className="border-b" style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/" className="text-xl sm:text-2xl font-extrabold shrink-0" style={{ color: 'var(--ink)' }}>
            Sea<span style={{ color: 'var(--orange)' }}>Star</span>Trader
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="text-sm truncate" style={{ color: 'var(--slate)' }}>
              {profile?.name ?? user.email}
            </span>
            <form action="/auth/signout" method="post" className="shrink-0">
              <button type="submit" className="text-sm font-semibold" style={{ color: 'var(--orange)' }}>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile nav: horizontal scroll strip the sidebar becomes on small screens. */}
      <div
        className="lg:hidden border-b overflow-x-auto"
        style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
      >
        <nav className="flex items-center gap-1 px-4 py-2 whitespace-nowrap">
          <Link
            href="/dashboard"
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--line)]"
            style={{ color: 'var(--navy)' }}
          >
            Dashboard
          </Link>
          <Link
            href="/my-listings"
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--line)]"
            style={{ color: 'var(--navy)' }}
          >
            My Listings
          </Link>
          <Link
            href="/my-bids"
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--line)]"
            style={{ color: 'var(--navy)' }}
          >
            My Bids
          </Link>
          <Link
            href="/service-requests"
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--line)]"
            style={{ color: 'var(--navy)' }}
          >
            Service Requests
          </Link>
          <Link
            href="/orders"
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--line)]"
            style={{ color: 'var(--navy)' }}
          >
            Orders
          </Link>
          <Link
            href="/settings"
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--line)]"
            style={{ color: 'var(--navy)' }}
          >
            Settings
          </Link>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Sidebar only on lg+: on small screens the strip above takes over. */}
        <div className="flex gap-8">
          <aside className="w-64 shrink-0 hidden lg:block">
            <nav className="space-y-1">
              <Link
                href="/"
                className="block px-4 py-2 text-sm font-semibold rounded-sm hover:bg-[var(--off-white)]"
                style={{ color: 'var(--orange)' }}
              >
                ← Back to Homepage
              </Link>
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
                href="/service-requests"
                className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
                style={{ color: 'var(--navy)' }}
              >
                My Service Requests
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

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}