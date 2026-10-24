'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { AppraisalRequestFormData } from '@/lib/validations/service-request';

export function useSubmitAppraisalRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppraisalRequestFormData) => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be signed in to request an appraisal.');
      }

      // Appraisal reuses the existing valuation_requests pipeline (and its
      // admin queue); the extended columns carry the new form fields.
      const { data: row, error } = await supabase
        .from('valuation_requests')
        .insert({
          equipment_type: data.equipment_type,
          make: data.make,
          model: data.model,
          year: data.year || null,
          condition: data.condition,
          location: data.location,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone || null,
          hours: data.hours ? Number(data.hours) : null,
          serial_number: data.serial_number || null,
          purpose: data.purpose,
          notes: data.notes || null,
          photo_urls: data.photo_urls ?? [],
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return row;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'valuation-requests'] });
      toast.success('We received your request — our team will contact you within 1 business day.');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    },
  });
}
