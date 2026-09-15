'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useLogin } from '@/mutations/useLogin';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import Link from 'next/link';

export function LoginForm() {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email Address" error={errors.email?.message} required>
        <Input
          {...register('email')}
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
        />
      </FormField>

      <FormField label="Password" error={errors.password?.message} required>
        <Input
          {...register('password')}
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
        />
      </FormField>

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm font-semibold text-[var(--orange)]">
          Forgot password?
        </Link>
      </div>

      <SubmitButton loading={isPending}>Log In</SubmitButton>

      <div className="text-center text-sm text-[var(--slate)]">
        Don't have an account?{' '}
        <Link href="/register" className="font-semibold text-[var(--orange)]">
          Sign up
        </Link>
      </div>
    </form>
  );
}