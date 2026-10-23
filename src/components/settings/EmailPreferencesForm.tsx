'use client';

import { useState } from 'react';
import {
  emailPreferencesSchema,
  type EmailPreferencesData,
} from '@/lib/validations/settings';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const PREFERENCE_ROWS: {
  key: keyof EmailPreferencesData;
  title: string;
  description: string;
}[] = [
  {
    key: 'orderUpdates',
    title: 'Order updates',
    description: 'Invoices, shipping milestones, and delivery confirmations for your orders.',
  },
  {
    key: 'listingActivity',
    title: 'Listing activity',
    description: 'Alerts when someone requests a valuation or asks about one of your listings.',
  },
  {
    key: 'bidAlerts',
    title: 'Bid alerts',
    description: 'Notifications when you are outbid or an auction you follow starts.',
  },
  {
    key: 'marketingEmails',
    title: 'Marketing & newsletter',
    description: 'Occasional platform news, product updates, and curated equipment offers.',
  },
];

export function EmailPreferencesForm({
  userId,
  initialPreferences,
}: {
  userId: string;
  initialPreferences: EmailPreferencesData;
}) {
  const [prefs, setPrefs] = useState<EmailPreferencesData>(initialPreferences);
  const [saving, setSaving] = useState(false);

  const toggle = (key: keyof EmailPreferencesData) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const onSubmit = async () => {
    setSaving(true);
    try {
      // Server-side double-check through zod keeps the DB payload clean even
      // if the component state is ever corrupted.
      const parsed = emailPreferencesSchema.safeParse(prefs);
      if (!parsed.success) {
        toast.error('Invalid preference data. Please refresh the page and try again.');
        return;
      }

      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ email_preferences: parsed.data })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Email preferences saved');
    } catch (error) {
      console.error('Email preferences save error:', error);
      toast.error('Failed to save email preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {PREFERENCE_ROWS.map((row) => (
        <label
          key={row.key}
          className="flex items-start justify-between gap-4 p-4 rounded-sm border cursor-pointer hover:bg-[var(--paper)] transition-colors"
          style={{ borderColor: 'var(--line)' }}
        >
          <span>
            <span className="block text-sm font-bold" style={{ color: 'var(--navy)' }}>
              {row.title}
            </span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--slate)' }}>
              {row.description}
            </span>
          </span>
          {/* Peer-checked switch: input is visually hidden; the sibling span
              renders the track/knob and reacts to :checked. */}
          <span className="relative inline-block shrink-0 mt-0.5">
            <input
              type="checkbox"
              role="switch"
              checked={prefs[row.key]}
              onChange={() => toggle(row.key)}
              className="peer sr-only"
              aria-label={row.title}
            />
            <span
              className="block w-10 h-6 rounded-full transition-colors peer-checked:bg-[var(--orange)] bg-[var(--line)]"
              onClick={(e) => e.preventDefault()}
              aria-hidden="true"
            />
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"
              onClick={(e) => e.preventDefault()}
              aria-hidden="true"
            />
          </span>
        </label>
      ))}

      <Button type="button" onClick={onSubmit} disabled={saving}>
        {saving ? 'Saving…' : 'Save Preferences'}
      </Button>
    </div>
  );
}
