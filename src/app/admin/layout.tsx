import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is admin
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  console.log('Admin Layout Check:', {
    userId: user.id,
    profile,
    error: error?.message,
  });

  if (error) {
    console.error('Profile fetch error:', error);
    redirect('/');
  }

  if (!profile || profile.role !== 'admin') {
    console.log('Not admin, role is:', profile?.role);
    redirect('/');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
      <header className="border-b" style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold" style={{ color: 'var(--ink)' }}>
            Sea<span style={{ color: 'var(--orange)' }}>Star</span>Trader
            <span className="ml-2 text-xs px-2 py-1 rounded-sm bg-[var(--orange)] text-white">ADMIN</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--slate)' }}>{user.email}</span>
            <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
              View Site
            </Link>
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
              href="/admin"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Users
            </Link>
            <Link
              href="/admin/valuation-requests"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Valuation Requests
            </Link>
            <Link
              href="/admin/listings"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Listings
            </Link>
            <Link
              href="/admin/auctions"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Auctions
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 text-sm font-medium rounded-sm hover:bg-[var(--off-white)]"
              style={{ color: 'var(--navy)' }}
            >
              Orders
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