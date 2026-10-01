'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      // Always show success, even for unknown emails, to prevent enumeration
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset email error:', error);
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md p-8 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
        <h1 className="text-2xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
          Check your email
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
          We've sent password reset instructions to your email address.
        </p>
        <Link href="/login" className="text-sm font-semibold" style={{ color: 'var(--orange)' }}>
          ← Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
        Forgot password?
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
        Enter your email and we'll send you reset instructions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
            Email Address
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </Button>

        <div className="text-center">
          <Link href="/login" className="text-sm font-semibold" style={{ color: 'var(--orange)' }}>
            ← Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}