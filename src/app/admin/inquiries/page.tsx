import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Inquiries — Admin',
};

export default async function AdminInquiriesPage() {
  const supabase = await createClient();

  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('id, name, email, phone, subject, message, inquiry_type, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--admin-text)' }}>
        Inquiries
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--admin-text-muted)' }}>
        Messages submitted through the site contact form.
      </p>

      {error ? (
        <p className="text-red-400 text-sm">Couldn&apos;t load inquiries: {error.message}</p>
      ) : !inquiries || inquiries.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>
          No inquiries yet.
        </p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="rounded-lg border p-5"
              style={{ borderColor: 'var(--admin-border)', backgroundColor: 'var(--admin-surface)' }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold" style={{ color: 'var(--admin-text)' }}>
                    {inq.subject}
                    <span
                      className="ml-2 text-xs font-normal px-2 py-0.5 rounded uppercase"
                      style={{ backgroundColor: 'var(--admin-border)', color: 'var(--admin-accent)' }}
                    >
                      {inq.inquiry_type ?? 'general'}
                    </span>
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--admin-text-muted)' }}>
                    {inq.name} · {inq.email}
                    {inq.phone ? ` · ${inq.phone}` : ''} ·{' '}
                    {new Date(inq.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-sm mt-3 whitespace-pre-line" style={{ color: 'var(--admin-text)' }}>
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
