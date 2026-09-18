'use client';

import { useState, useTransition } from 'react';
import { BadgeCheck } from 'lucide-react';
import { setSellerVerified } from '@/app/admin/listings/[id]/edit/actions';

interface UserRow {
  id: string;
  email: string | null;
  company_name: string | null;
  phone: string | null;
  role: string | null;
  is_verified: boolean;
  created_at: string;
}

export function UsersTable({ users }: { users: UserRow[] }) {
  const [rows, setRows] = useState(users);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleToggleVerified(id: string, next: boolean) {
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      try {
        await setSellerVerified(id, next);
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, is_verified: next } : r)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div
      className="rounded-lg border overflow-x-auto"
      style={{ borderColor: 'var(--admin-border)', backgroundColor: 'var(--admin-surface)' }}
    >
      {error && (
        <div className="px-5 py-3 text-sm text-red-400 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          {error}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left" style={{ color: 'var(--admin-text-muted)' }}>
            <th className="px-5 py-3 font-medium">User</th>
            <th className="px-5 py-3 font-medium">Company</th>
            <th className="px-5 py-3 font-medium">Phone</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Verified</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((user) => {
            const busy = isPending && pendingId === user.id;
            return (
              <tr
                key={user.id}
                className="border-t"
                style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
              >
                <td className="px-5 py-4">{user.email ?? '—'}</td>
                <td className="px-5 py-4">{user.company_name ?? '—'}</td>
                <td className="px-5 py-4">{user.phone ?? '—'}</td>
                <td className="px-5 py-4 capitalize">{user.role ?? 'user'}</td>
                <td className="px-5 py-4">
                  {user.is_verified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: '#3FCF8E' }}>
                      <BadgeCheck size={14} /> Verified
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                      Not verified
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    disabled={busy}
                    onClick={() => handleToggleVerified(user.id, !user.is_verified)}
                    className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                    style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                  >
                    {user.is_verified ? 'Remove verification' : 'Mark verified'}
                  </button>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}