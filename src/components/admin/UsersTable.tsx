import { Badge } from '@/components/ui/Badge';

interface User {
  id: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="border border-[var(--line)] rounded-sm overflow-hidden">
      <table className="w-full">
        <thead style={{ backgroundColor: 'var(--off-white)' }}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--navy)' }}>
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--navy)' }}>
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--navy)' }}>
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--navy)' }}>
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--navy)' }}>
              Joined
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase" style={{ color: 'var(--navy)' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: 'var(--paper)' }}>
          {users.map((user) => (
            <tr key={user.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
              <td className="px-6 py-4 text-sm" style={{ color: 'var(--navy)' }}>
                {user.email}
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: 'var(--slate)' }}>
                {user.company_name || '—'}
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: 'var(--slate)' }}>
                {user.phone || '—'}
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge variant={user.role === 'admin' ? 'default' : 'success'}>
                  {user.role}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: 'var(--slate)' }}>
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <button className="text-[var(--orange)] font-semibold hover:underline">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}