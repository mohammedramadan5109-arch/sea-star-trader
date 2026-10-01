'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { ValuationRequestFormData } from '@/lib/validations/valuation-request';

export function useSubmitValuationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ValuationRequestFormData) => {
      const supabase = createClient();

      try {
        const { data: request, error } = await supabase
  .from('valuation_requests')
  .insert({
    equipment_type: data.equipment_type,
    make: data.make || null,
    model: data.model || null,
    year: data.year || null,
    condition: data.condition,
    location: data.location,
    contact_name: data.contact_name,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone || null, // Added
    status: 'pending',
  })
  .select()
  .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        return request;
      } catch (err) {
        console.error('Mutation function error:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'valuation-requests'] });
      toast.success('Thanks! We will contact you within 24 hours.');
    },
    onError: (error: any) => {
      console.error('Valuation request error:', error?.message);
      toast.error(error?.message || 'Failed to submit. Please try again.');
    },
  });
}