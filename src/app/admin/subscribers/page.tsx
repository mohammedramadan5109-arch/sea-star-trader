import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Newsletter subscribers — Admin',
};

export default async function AdminSubscribersPage() {
  const supabase = await createClient();

  const { data: subs, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, status, source, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--admin-text)' }}>
        Newsletter subscribers
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--admin-text-muted)' }}>
        Everyone who subscribed through the site&apos;s newsletter form.
      </p>

      {error ? (
        <p className="text-red-400 text-sm">Couldn&apos;t load subscribers: {error.message}</p>
      ) : !subs || subs.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
          No subscribers yet.
        </p>
      ) : (
        <div
          className="rounded-lg border overflow-x-auto"
          style={{ borderColor: 'var(--admin-border)', backgroundColor: 'var(--admin-surface)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: 'var(--admin-text-muted)' }}>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr
                  key={s.id}
                  className="border-t"
                  style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                >
                  <td className="px-5 py-3">{s.email}</td>
                  <td className="px-5 py-3 capitalize">{s.status}</td>
                  <td className="px-5 py-3">{s.source}</td>
                  <td className="px-5 py-3">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
