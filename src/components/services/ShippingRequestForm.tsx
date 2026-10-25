'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { shippingRequestSchema, type ShippingRequestFormData } from '@/lib/validations/service-request';
import { useSubmitShippingRequest } from '@/mutations/useSubmitShippingRequest';
import { ServiceFormCard, ServiceSuccessPanel, ServiceFormError } from './form-shell';
import type { ServiceContactPrefill, ListingOption } from './types';

interface ShippingRequestFormProps {
  contact: ServiceContactPrefill;
  listingOptions: ListingOption[];
  initialListingId?: string | null;
}

export function ShippingRequestForm({
  contact,
  listingOptions,
  initialListingId,
}: ShippingRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const mutation = useSubmitShippingRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ShippingRequestFormData>({
    resolver: zodResolver(shippingRequestSchema),
    defaultValues: {
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone,
      listing_id: initialListingId && listingOptions.some((o) => o.id === initialListingId)
        ? initialListingId
        : undefined,
    },
  });

  const listingChoice = watch('listing_id');

  // Sync "__other__" pseudo-option into the schema fields: real ids are
  // stored in listing_id, the free-text option shows a description input.
  const showFreeText = listingChoice === '__other__' || (!listingChoice && !initialListingId);

  useEffect(() => {
    if (showFreeText) setValue('listing_id', undefined);
  }, [showFreeText, setValue]);

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setSubmitted(true);
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
          <FormField label="Equipment" error={errors.listing_id?.message}>
            <Select
              {...register('listing_id')}
              error={errors.listing_id?.message}
              defaultValue={initialListingId ?? ''}
            >
              <option value="">No specific equipment</option>
              {listingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
              <option value="__other__">Other — describe it myself</option>
            </Select>
          </FormField>
        )}

        {showFreeText && (
          <FormField label="Equipment description" error={errors.equipment_description?.message}>
            <Input
              {...register('equipment_description')}
              type="text"
              placeholder="e.g. Caterpillar 320D excavator"
              error={errors.equipment_description?.message}
            />
          </FormField>
        )}

        <FormField label="Equipment location" error={errors.equipment_location?.message}>
          <Input
            {...register('equipment_location')}
            type="text"
            placeholder="e.g. Yard in 6th of October City, Giza"
            error={errors.equipment_location?.message}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Pickup country" error={errors.pickup_country?.message} required>
            <Input
              {...register('pickup_country')}
              type="text"
              placeholder="e.g. Egypt"
              error={errors.pickup_country?.message}
            />
          </FormField>

          <FormField label="Pickup city" error={errors.pickup_city?.message} required>
            <Input
              {...register('pickup_city')}
              type="text"
              placeholder="e.g. Alexandria"
              error={errors.pickup_city?.message}
            />
          </FormField>

          <FormField label="Destination country" error={errors.destination_country?.message} required>
            <Input
              {...register('destination_country')}
              type="text"
              placeholder="e.g. Chile"
              error={errors.destination_country?.message}
            />
          </FormField>

          <FormField label="Destination port or city" error={errors.destination?.message} required>
            <Input
              {...register('destination')}
              type="text"
              placeholder="e.g. Port of San Antonio"
              error={errors.destination?.message}
            />
          </FormField>

          <FormField label="Shipping method" error={errors.shipping_method?.message} required>
            <Select
              {...register('shipping_method')}
              error={errors.shipping_method?.message}
              defaultValue=""
            >
              <option value="">Select method</option>
              <option value="container">Container</option>
              <option value="roro">RoRo (roll-on/roll-off)</option>
              <option value="flat_rack">Flat rack</option>
              <option value="breakbulk">Breakbulk</option>
              <option value="unsure">Not sure — advise me</option>
            </Select>
          </FormField>

          <FormField label="Ready date" error={errors.ready_date?.message}>
            <Input {...register('ready_date')} type="date" error={errors.ready_date?.message} />
          </FormField>

          <FormField label="Dimensions (L×W×H)" error={errors.dimensions?.message}>
            <Input
              {...register('dimensions')}
              type="text"
              placeholder="e.g. 6.1 × 2.5 × 3.2 m"
              error={errors.dimensions?.message}
            />
          </FormField>

          <FormField label="Weight (kg)" error={errors.weight_kg?.message}>
            <Input
              {...register('weight_kg')}
              type="number"
              placeholder="e.g. 20500"
              error={errors.weight_kg?.message}
            />
          </FormField>
        </div>

        <FormField label="Notes" error={errors.notes?.message}>
          <Textarea
            {...register('notes')}
            rows={4}
            placeholder="Anything else we should know — restricted site access, urgent deadline, customs requirements…"
            error={errors.notes?.message}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full btn-3d">
            {mutation.isPending ? 'Sending…' : 'Request shipping quote'}
          </Button>
          <ServiceFormError message={mutation.isError ? String(mutation.error?.message) : null} />
        </div>
      </form>
    </ServiceFormCard>
  );
}
