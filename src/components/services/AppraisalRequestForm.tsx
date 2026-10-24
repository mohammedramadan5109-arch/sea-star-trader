'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { appraisalRequestSchema, type AppraisalRequestFormData } from '@/lib/validations/service-request';
import { useSubmitAppraisalRequest } from '@/mutations/useSubmitAppraisalRequest';
import { BulkPhotoUploader } from '@/components/sell/BulkPhotoUploader';
import { ServiceFormCard, ServiceSuccessPanel, ServiceFormError } from './form-shell';
import type { ServiceContactPrefill } from './types';

interface AppraisalRequestFormProps {
  contact: ServiceContactPrefill;
}

export function AppraisalRequestForm({ contact }: AppraisalRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const mutation = useSubmitAppraisalRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppraisalRequestFormData>({
    resolver: zodResolver(appraisalRequestSchema),
    defaultValues: {
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone,
      purpose: undefined,
    },
  });

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Equipment type" error={errors.equipment_type?.message} required>
            <Input
              {...register('equipment_type')}
              type="text"
              placeholder="e.g. Excavator, Grader, Crane"
              error={errors.equipment_type?.message}
            />
          </FormField>

          <FormField label="Make" error={errors.make?.message} required>
            <Input
              {...register('make')}
              type="text"
              placeholder="e.g. Liebherr"
              error={errors.make?.message}
            />
          </FormField>

          <FormField label="Model" error={errors.model?.message} required>
            <Input
              {...register('model')}
              type="text"
              placeholder="e.g. R 926"
              error={errors.model?.message}
            />
          </FormField>

          <FormField label="Year" error={errors.year?.message}>
            <Input {...register('year')} type="text" placeholder="e.g. 2019" error={errors.year?.message} />
          </FormField>

          <FormField label="Hours" error={errors.hours?.message}>
            <Input {...register('hours')} type="text" placeholder="e.g. 7400" error={errors.hours?.message} />
          </FormField>

          <FormField label="Serial number (optional)" error={errors.serial_number?.message}>
            <Input
              {...register('serial_number')}
              type="text"
              placeholder="Found on the machine plate"
              error={errors.serial_number?.message}
            />
          </FormField>

          <FormField label="Condition" error={errors.condition?.message} required>
            <Select {...register('condition')} error={errors.condition?.message} defaultValue="">
              <option value="">Select condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </Select>
          </FormField>

          <FormField label="Location" error={errors.location?.message} required>
            <Input
              {...register('location')}
              type="text"
              placeholder="City, country"
              error={errors.location?.message}
            />
          </FormField>

          <FormField label="Purpose of the appraisal" error={errors.purpose?.message} required>
            <Select {...register('purpose')} error={errors.purpose?.message} defaultValue="">
              <option value="">Select purpose</option>
              <option value="selling">Selling — set the right price</option>
              <option value="insurance">Insurance</option>
              <option value="financing">Financing / collateral</option>
              <option value="other">Other</option>
            </Select>
          </FormField>
        </div>

        <div>
          <BulkPhotoUploader
            onPhotosChange={setPhotoUrls}
            maxPhotos={6}
            label="Photos (helps us value it accurately)"
            required={false}
          />
        </div>

        <FormField label="Notes" error={errors.notes?.message}>
          <Textarea
            {...register('notes')}
            rows={4}
            placeholder="Service history, attachments included, recent major repairs…"
            error={errors.notes?.message}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full btn-3d">
            {mutation.isPending ? 'Sending…' : 'Request appraisal'}
          </Button>
          <ServiceFormError message={mutation.isError ? String(mutation.error?.message) : null} />
        </div>
      </form>
    </ServiceFormCard>
  );
}
