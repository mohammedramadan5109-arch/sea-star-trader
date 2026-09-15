import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  // Fetch user's listings count
  const { count: listingsCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--slate)' }}>
            Active Listings
          </div>
          <div className="text-3xl font-extrabold" style={{ color: 'var(--navy)' }}>
            {listingsCount || 0}
          </div>
        </div>

        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--slate)' }}>
            Active Bids
          </div>
          <div className="text-3xl font-extrabold" style={{ color: 'var(--navy)' }}>
            0
          </div>
        </div>

        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--slate)' }}>
            Total Orders
          </div>
          <div className="text-3xl font-extrabold" style={{ color: 'var(--navy)' }}>
            0
          </div>
        </div>
      </div>

      <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
          Profile Information
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--slate)' }}>Email:</span>
            <span style={{ color: 'var(--navy)' }}>{user?.email}</span>
          </div>
          {profile?.company_name && (
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--slate)' }}>Company:</span>
              <span style={{ color: 'var(--navy)' }}>{profile.company_name}</span>
            </div>
          )}
          {profile?.phone && (
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--slate)' }}>Phone:</span>
              <span style={{ color: 'var(--navy)' }}>{profile.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}