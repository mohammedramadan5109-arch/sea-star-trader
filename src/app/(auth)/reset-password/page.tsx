'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
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
    // TODO: Implement password reset with Supabase
    console.log('New password:', data.password);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-sm border border-[var(--line)]" style={{ backgroundColor: 'var(--off-white)' }}>
      <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
        Set new password
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
            New Password
          </label>
          <Input
            {...register('password')}
            type="password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
            Confirm Password
          </label>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Re-enter password"
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}