import { createClient } from '@/lib/supabase/server';
import { UsersTable } from '@/components/admin/UsersTable';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
        Users
      </h1>

      <UsersTable users={users || []} />
    </div>
  );
}