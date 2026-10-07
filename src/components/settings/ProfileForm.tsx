'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { CountryCodeSelect } from '@/components/auth/CountryCodeSelect';
import { COUNTRIES, dialFor } from '@/lib/country-codes';
import toast from 'react-hot-toast';

interface ProfileFormProps {
  userId: string;
  userEmail: string;
  initialName: string;
  initialCompanyName: string;
  initialPhone: string | null;
}

/**
 * Split a stored phone like "+20 101234567" into its dial code and national
 * part so the country selector can be preselected. Falls back to the default
 * country with the whole value in the number field for legacy formats.
 */
function splitStoredPhone(stored: string | null): { iso2: string; national: string } {
  if (stored && stored.startsWith('+')) {
    const match = stored.match(/^\+(\d{1,4})\s*(.+)$/);
    if (match) {
      const country = COUNTRIES.find((c) => c.dial === match[1]);
      if (country) return { iso2: country.iso2, national: match[2] };
    }
  }
  return { iso2: 'EG', national: stored ?? '' };
}

export function ProfileForm({
  userId,
  userEmail,
  initialName,
  initialCompanyName,
  initialPhone,
}: ProfileFormProps) {
  const parsed = useMemo(() => splitStoredPhone(initialPhone), [initialPhone]);
  const [countryIso, setCountryIso] = useState(parsed.iso2);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
      company_name: initialCompanyName,
      phone: parsed.national,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      // Same normalization as registration: +<dial> <number>, no trunk zero
      // (e.g. 0101234567 with EG selected -> +20 101234567).
      const digits = data.phone?.replace(/[\s\-().]/g, '');
      const phone = digits
        ? `+${dialFor(countryIso)} ${digits.replace(/^0+/, '')}`
        : null;

      const supabase = createClient();
      // Only company_name and phone — the exact columns the RLS grant allows.
          const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          company_name: data.company_name,
          phone,
        })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Profile updated');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email Address">
        <Input type="email" value={userEmail} disabled />
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
          type="text"
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

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>
    </form>
  );
}
