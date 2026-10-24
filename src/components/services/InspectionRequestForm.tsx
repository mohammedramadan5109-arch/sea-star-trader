'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { inspectionRequestSchema, type InspectionRequestFormData } from '@/lib/validations/service-request';
import { useSubmitInspectionRequest } from '@/mutations/useSubmitInspectionRequest';
import { ServiceFormCard, ServiceSuccessPanel, ServiceFormError } from './form-shell';
import type { ServiceContactPrefill, ListingOption } from './types';

interface InspectionRequestFormProps {
  contact: ServiceContactPrefill;
  listingOptions: ListingOption[];
  /** Prefilled from ?listing=<id> when arriving from a listing page. */
  initialListingId?: string | null;
}

export function InspectionRequestForm({
  contact,
  listingOptions,
  initialListingId,
}: InspectionRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const mutation = useSubmitInspectionRequest();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InspectionRequestFormData>({
    resolver: zodResolver(inspectionRequestSchema),
    defaultValues: {
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone,
      listing_id: initialListingId && listingOptions.some((o) => o.id === initialListingId)
        ? initialListingId
        : undefined,
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: () => setSubmitted(true),
    });
  });

  if (submitted) {
    return (
      <ServiceFormCard>
        <ServiceSuccessPanel onReset={() => setSubmitted(false)} />
      </ServiceFormCard>
    );
  }

  return (
    <ServiceFormCard>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Equipment listing" error={errors.listing_id?.message}>
          <Select
            value={watch('listing_id') ?? ''}
            onChange={(e) =>
              setValue('listing_id', e.target.value || undefined, { shouldValidate: true })
            }
            error={errors.listing_id?.message}
          >
            <option value="">Not on SeaStarTrader yet (describe below)</option>
            {listingOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Make" error={errors.equipment_make?.message}>
            <Input
              {...register('equipment_make')}
              type="text"
              placeholder="e.g. Komatsu"
              error={errors.equipment_make?.message}
            />
          </FormField>

          <FormField label="Model" error={errors.equipment_model?.message}>
            <Input
              {...register('equipment_model')}
              type="text"
              placeholder="e.g. PC200-8"
              error={errors.equipment_model?.message}
            />
          </FormField>

          <FormField label="Year" error={errors.equipment_year?.message}>
            <Input
              {...register('equipment_year')}
              type="text"
              placeholder="e.g. 2018"
              error={errors.equipment_year?.message}
            />
          </FormField>

          <FormField label="Location — country" error={errors.location_country?.message} required>
            <Input
              {...register('location_country')}
              type="text"
              placeholder="e.g. UAE"
              error={errors.location_country?.message}
            />
          </FormField>

          <FormField label="Location — city" error={errors.location_city?.message} required>
            <Input
              {...register('location_city')}
              type="text"
              placeholder="e.g. Sharjah"
              error={errors.location_city?.message}
            />
          </FormField>

          <FormField label="Inspection level" error={errors.inspection_level?.message} required>
            <Select
              {...register('inspection_level')}
              error={errors.inspection_level?.message}
              defaultValue=""
            >
              <option value="">Select level</option>
              <option value="visual">Visual walk-around</option>
              <option value="full_mechanical">Full mechanical & hydraulic</option>
              <option value="full_fluid">Full with fluid analysis</option>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Preferred date — from" error={errors.preferred_from?.message}>
            <Input {...register('preferred_from')} type="date" error={errors.preferred_from?.message} />
          </FormField>

          <FormField label="Preferred date — to" error={errors.preferred_to?.message}>
            <Input {...register('preferred_to')} type="date" error={errors.preferred_to?.message} />
          </FormField>
        </div>

        <FormField label="Notes" error={errors.notes?.message}>
          <Textarea
            {...register('notes')}
            rows={4}
            placeholder="Access details, contact person on site, specific concerns about the machine…"
            error={errors.notes?.message}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full btn-3d">
            {mutation.isPending ? 'Sending…' : 'Request inspection'}
          </Button>
          <ServiceFormError message={mutation.isError ? String(mutation.error?.message) : null} />
        </div>
      </form>
    </ServiceFormCard>
  );
}
