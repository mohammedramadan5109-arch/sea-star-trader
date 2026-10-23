'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from '@/lib/validations/settings';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import toast from 'react-hot-toast';

/**
 * Change-password flow for logged-in users.
 *
 * Security model: Supabase lets any logged-in session call updateUser
 * directly, so we deliberately re-authenticate FIRST with the current
 * password (same pattern as the login route). A stolen unlocked session
 * cannot change credentials without knowing the current password.
 */
export function ChangePasswordForm({ userEmail }: { userEmail: string }) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    setSaving(true);
    const supabase = createClient();

    try {
      // 1) Verify the current password by re-authenticating. Uses the same
      // anonymous client the login form uses — if it fails, we stop before
      // touching the stored credential.
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: data.currentPassword,
      });
      if (authError) {
        toast.error(
          authError.message === 'Invalid login credentials' || authError.code === 'invalid_credentials'
            ? 'Current password is incorrect.'
            : 'Could not verify your current password. Please try again.'
        );
        return;
      }

      // 2) Update the credential now that the session is proven genuine.
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (updateError) throw updateError;

      // 3) Drop the re-authentication session we just refreshed and force a
      // clean sign-in with the new password — sessions die, data doesn't.
      await supabase.auth.signOut();

      toast.success('Password changed. Please log in with your new password.');
      reset();
      window.location.href = '/login';
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : 'Failed to change password. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Current Password" error={errors.currentPassword?.message} required>
        <Input
          {...register('currentPassword')}
          type="password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          autoComplete="current-password"
        />
      </FormField>

      <FormField label="New Password" error={errors.password?.message} required>
        <Input
          {...register('password')}
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          autoComplete="new-password"
        />
      </FormField>

      <FormField label="Confirm New Password" error={errors.confirmPassword?.message} required>
        <Input
          {...register('confirmPassword')}
          type="password"
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />
      </FormField>

      <Button type="submit" disabled={saving}>
        {saving ? 'Changing…' : 'Change Password'}
      </Button>
    </form>
  );
}
