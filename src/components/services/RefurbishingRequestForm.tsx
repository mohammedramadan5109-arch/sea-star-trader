'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import {
  refurbishingRequestSchema,
  WORK_NEEDED_OPTIONS,
  type RefurbishingRequestFormData,
} from '@/lib/validations/service-request';

type WorkNeededOption = RefurbishingRequestFormData['work_needed'][number];
import { useSubmitRefurbishingRequest } from '@/mutations/useSubmitRefurbishingRequest';
import { BulkPhotoUploader } from '@/components/sell/BulkPhotoUploader';
import { ServiceFormCard, ServiceSuccessPanel, ServiceFormError } from './form-shell';
import type { ServiceContactPrefill, ListingOption } from './types';

interface RefurbishingRequestFormProps {
  contact: ServiceContactPrefill;
  listingOptions: ListingOption[];
  initialListingId?: string | null;
}

const WORK_LABELS: Record<string, string> = {
  repaint: 'Repaint',
  engine_overhaul: 'Engine overhaul',
  hydraulics: 'Hydraulics',
  undercarriage: 'Undercarriage',
  cab_electrical: 'Cab & electrical',
  full_refurbishment: 'Full refurbishment',
};

export function RefurbishingRequestForm({
  contact,
  listingOptions,
  initialListingId,
}: RefurbishingRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const mutation = useSubmitRefurbishingRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RefurbishingRequestFormData>({
    resolver: zodResolver(refurbishingRequestSchema),
    defaultValues: {
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone,
      listing_id:
        initialListingId && listingOptions.some((o) => o.id === initialListingId)
          ? initialListingId
          : undefined,
      work_needed: [],
    },
  });

  const selectedWork = watch('work_needed') ?? [];

  const toggleWork = (option: WorkNeededOption) => {
    const next = selectedWork.includes(option)
      ? selectedWork.filter((w) => w !== option)
      : [...selectedWork, option];
    setValue('work_needed', next as RefurbishingRequestFormData['work_needed'], {
      shouldValidate: true,
    });
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate({ ...data, photo_urls: photoUrls }, {
      onSuccess: () => {
        setSubmitted(true);
        setPhotoUrls([]);
        reset();
      },
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
        {listingOptions.length > 0 && (
          <FormField label="Link one of your listings (optional)">
            <Select
              {...register('listing_id')}
              error={errors.listing_id?.message}
              defaultValue=""
            >
              <option value="">Describe the machine instead</option>
              {listingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Make" error={errors.make?.message} required>
            <Input
              {...register('make')}
              type="text"
              placeholder="e.g. Caterpillar"
              error={errors.make?.message}
            />
          </FormField>

          <FormField label="Model" error={errors.model?.message} required>
            <Input
              {...register('model')}
              type="text"
              placeholder="e.g. D6R"
              error={errors.model?.message}
            />
          </FormField>

          <FormField label="Year" error={errors.year?.message}>
            <Input
              {...register('year')}
              type="text"
              placeholder="e.g. 2016"
              error={errors.year?.message}
            />
          </FormField>

          <FormField label="Hours" error={errors.hours?.message}>
            <Input
              {...register('hours')}
              type="text"
              placeholder="e.g. 9800"
              error={errors.hours?.message}
            />
          </FormField>
        </div>

        {/* Work needed: toggle chips feeding the work_needed array */}
        <div className="w-full">
          <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-[var(--navy)]">
            Work needed <span className="text-red-600">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {WORK_NEEDED_OPTIONS.map((option) => {
              const active = selectedWork.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleWork(option)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-transform duration-150 active:scale-[0.97] ${
                    active ? '' : 'hover:opacity-80'
                  }`}
                  style={
                    active
                      ? { backgroundColor: 'var(--orange)', color: 'var(--navy-solid)', borderColor: 'var(--orange)' }
                      : { borderColor: 'var(--line)', color: 'var(--navy)', backgroundColor: 'var(--paper)' }
                  }
                >
                  {WORK_LABELS[option]}
                </button>
              );
            })}
          </div>
          {errors.work_needed?.message && (
            <p className="mt-1 text-xs text-red-600">{errors.work_needed.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Current condition" error={errors.current_condition?.message} required>
            <Select
              {...register('current_condition')}
              error={errors.current_condition?.message}
              defaultValue=""
            >
              <option value="">Select condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs work">Needs work</option>
            </Select>
          </FormField>

          <FormField label="Preferred timeline" error={errors.timeline?.message}>
            <Select {...register('timeline')} error={errors.timeline?.message} defaultValue="">
              <option value="">Select timeline</option>
              <option value="asap">As soon as possible</option>
              <option value="one_to_two_weeks">In 1–2 weeks</option>
              <option value="about_a_month">In about a month</option>
              <option value="flexible">Flexible</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Target budget range (optional)" error={errors.budget?.message}>
          <Input
            {...register('budget')}
            type="text"
            placeholder="e.g. $5,000 – $10,000"
            error={errors.budget?.message}
          />
        </FormField>

        <div>
          <BulkPhotoUploader
            onPhotosChange={setPhotoUrls}
            maxPhotos={6}
            label="Photos of the current condition"
            required={false}
          />
        </div>

        <FormField label="Notes" error={errors.notes?.message}>
          <Textarea
            {...register('notes')}
            rows={4}
            placeholder="Known faults, target sale price after works, brand preferences for parts…"
            error={errors.notes?.message}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full btn-3d">
            {mutation.isPending ? 'Sending…' : 'Request refurbishing assessment'}
          </Button>
          <ServiceFormError message={mutation.isError ? String(mutation.error?.message) : null} />
        </div>
      </form>
    </ServiceFormCard>
  );
}
