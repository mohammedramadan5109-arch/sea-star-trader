import { createClient } from '@/lib/supabase/server';
import { UsersTable } from '@/components/admin/UsersTable';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, company_name, phone, role, is_verified, created_at')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--admin-text)' }}>
        Users
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--admin-text-muted)' }}>
        Mark a seller as verified to show the Verified Seller badge on their listings.
      </p>

      {error ? (
        <p className="text-red-400 text-sm">Couldn&apos;t load users: {error.message}</p>
      ) : (
        <UsersTable users={users ?? []} />
      )}
    </div>
  );
}