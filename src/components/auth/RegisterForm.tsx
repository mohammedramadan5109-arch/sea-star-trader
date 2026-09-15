'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { useRegister } from '@/mutations/useRegister';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import Link from 'next/link';

export function RegisterForm() {
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
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

      <FormField label="Company Name" error={errors.company_name?.message} required>
        <Input
          {...register('company_name')}
          placeholder="Your company name"
          error={errors.company_name?.message}
        />
      </FormField>

      <FormField label="Phone Number" error={errors.phone?.message}>
        <Input
          {...register('phone')}
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message}
        />
      </FormField>

      <FormField label="Password" error={errors.password?.message} required>
        <Input
          {...register('password')}
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
        />
      </FormField>

      <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
        <Input
          {...register('confirmPassword')}
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
        />
      </FormField>

      <SubmitButton loading={isPending}>Create Account</SubmitButton>

      <div className="text-center text-sm text-[var(--slate)]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[var(--orange)]">
          Log in
        </Link>
      </div>
    </form>
  );
}