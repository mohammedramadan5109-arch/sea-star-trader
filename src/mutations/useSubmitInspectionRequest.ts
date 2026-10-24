'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { InspectionRequestFormData } from '@/lib/validations/service-request';

export function useSubmitInspectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InspectionRequestFormData) => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be signed in to request an inspection.');
      }

      const { data: row, error } = await supabase
        .from('service_requests')
        .insert({
          user_id: user.id,
          service_type: 'inspection',
          listing_id: data.listing_id ?? null,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone || null,
          details: {
            equipment_make: data.equipment_make || null,
            equipment_model: data.equipment_model || null,
            equipment_year: data.equipment_year || null,
            location_country: data.location_country,
            location_city: data.location_city,
            inspection_level: data.inspection_level,
            preferred_from: data.preferred_from || null,
            preferred_to: data.preferred_to || null,
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
