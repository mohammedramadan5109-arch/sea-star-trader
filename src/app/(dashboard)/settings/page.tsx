import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';
import { EmailPreferencesForm } from '@/components/settings/EmailPreferencesForm';
import {
  parseEmailPreferences,
  DEFAULT_EMAIL_PREFERENCES,
} from '@/lib/validations/settings';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // The dashboard layout already guards this, but TypeScript needs the check.
  if (!user) {
    redirect('/login');
  }

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
          <ProfileForm
            userId={user.id}
            userEmail={user.email ?? ''}
            initialName={profile?.name ?? ''}
            initialCompanyName={profile?.company_name ?? ''}
            initialPhone={profile?.phone ?? null}
          />
        </div>

        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
            Change Password
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
            You&apos;ll be asked for your current password first. After changing it,
            you&apos;ll be signed out and need to log in again.
          </p>
          <ChangePasswordForm userEmail={user.email ?? ''} />
        </div>

        <div className="p-6 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy)' }}>
            Email Preferences
          </h2>
          <EmailPreferencesForm
            userId={user.id}
            initialPreferences={parseEmailPreferences(
              profile?.email_preferences,
              DEFAULT_EMAIL_PREFERENCES
            )}
          />
        </div>
      </div>
    </div>
  );
}