'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { ValuationRequestFormData } from '@/lib/validations/valuation-request';

export function useSubmitValuationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ValuationRequestFormData) => {
      console.log('Starting valuation request submission with data:', data);
      
      const supabase = createClient();

      console.log('Supabase client created');

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

        console.log('Supabase response:', { request, error });

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
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      queryClient.invalidateQueries({ queryKey: ['admin', 'valuation-requests'] });
      toast.success('Thanks! We will contact you within 24 hours.');
    },
    onError: (error: any) => {
      console.error('Valuation request error:', error);
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        full: JSON.stringify(error, null, 2),
      });
      toast.error(error?.message || 'Failed to submit. Please try again.');
    },
  });
}