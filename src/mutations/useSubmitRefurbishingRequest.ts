'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { RefurbishingRequestFormData } from '@/lib/validations/service-request';

export function useSubmitRefurbishingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RefurbishingRequestFormData) => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be signed in to request a refurbishing assessment.');
      }

      const { data: row, error } = await supabase
        .from('service_requests')
        .insert({
          user_id: user.id,
          service_type: 'refurbishing',
          listing_id: data.listing_id ?? null,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone || null,
          photo_urls: data.photo_urls ?? [],
          details: {
            make: data.make,
            model: data.model,
            year: data.year || null,
            hours: data.hours || null,
            work_needed: data.work_needed,
            current_condition: data.current_condition,
            budget: data.budget || null,
            timeline: data.timeline || null,
            notes: data.notes || null,
          },
        })
        .select()
        .single();

      if (error) throw error;
      return row;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'service-requests'] });
      toast.success('We received your request — our team will contact you within 1 business day.');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    },
  });
}
