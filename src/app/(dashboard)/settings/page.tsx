import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
        Account Settings
      </h1>

      <div className="space-y-6">
        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
            Profile Information
          </h2>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            Update form will be implemented here.
          </p>
        </div>

        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
            Change Password
          </h2>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            Password change form will be implemented here.
          </p>
        </div>

        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
            Email Preferences
          </h2>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            Notification settings will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}