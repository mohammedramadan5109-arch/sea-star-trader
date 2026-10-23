import { z } from 'zod';

/**
 * Change-password form (account settings). The current password is required
 * so the form can re-authenticate the user before a credential change.
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/** Toggle set stored in profiles.email_preferences (see the email_preferences migration). */
export const emailPreferencesSchema = z.object({
  orderUpdates: z.boolean(),
  listingActivity: z.boolean(),
  marketingEmails: z.boolean(),
  bidAlerts: z.boolean(),
});

export type EmailPreferencesData = z.infer<typeof emailPreferencesSchema>;

/** Shape stored in the JSONB column — top-level unknown, validated above. */
export function parseEmailPreferences(
  stored: unknown,
  fallback: EmailPreferencesData
): EmailPreferencesData {
  const result = emailPreferencesSchema.safeParse(stored);
  return result.success ? result.data : fallback;
}

export const DEFAULT_EMAIL_PREFERENCES: EmailPreferencesData = {
  orderUpdates: true,
  listingActivity: true,
  marketingEmails: false,
  bidAlerts: true,
};
