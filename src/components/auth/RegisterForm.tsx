'use client';

import { useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { useRegister } from '@/mutations/useRegister';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { HCAPTCHA_SITE_KEY } from '@/lib/captcha';
import { dialFor } from '@/lib/country-codes';
import { CountryCodeSelect } from '@/components/auth/CountryCodeSelect';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const { mutateAsync, isPending } = useRegister();
  const captcha = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [countryIso, setCountryIso] = useState('EG'); // default: Egypt (+20)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA.');
      return;
    }
    // Compose international format: +<dial> <number>, dropping spaces/dashes
    // and any trunk-prefix zeros (e.g. 0101234567 with EG -> +20 101234567).
    const digits = data.phone?.replace(/[\s\-().]/g, '');
    const phone = digits
      ? `+${dialFor(countryIso)} ${digits.replace(/^0+/, '')}`
      : undefined;
    try {
      await mutateAsync({ ...data, phone, captchaToken });
    } catch {
      // Error toast already shown by useRegister
    } finally {
      // Tokens are single-use — always get a fresh one for the next try.
      captcha.current?.resetCaptcha();
      setCaptchaToken(null);
    }
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

      <FormField label="Your Name" error={errors.name?.message} required>
        <Input
          {...register('name')}
          type="text"
          placeholder="Mohammed Ramadan"
          error={errors.name?.message}
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
        <div className="flex gap-2">
          <CountryCodeSelect value={countryIso} onChange={setCountryIso} />
          <Input
            {...register('phone')}
            type="tel"
            placeholder="555 000 0000"
            error={errors.phone?.message}
          />
        </div>
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

      <HCaptcha
        ref={captcha}
        sitekey={HCAPTCHA_SITE_KEY}
        onVerify={(token) => setCaptchaToken(token)}
        onExpire={() => setCaptchaToken(null)}
      />

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