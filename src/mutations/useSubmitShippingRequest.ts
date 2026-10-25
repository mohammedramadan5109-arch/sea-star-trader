'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { ShippingRequestFormData } from '@/lib/validations/service-request';

export function useSubmitShippingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShippingRequestFormData) => {
      const supabase = createClient();

      // RLS also enforces this; the guard gives a clear message instead of
      // a policy error.
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be signed in to request a shipping quote.');
      }

      const { data: row, error } = await supabase
        .from('service_requests')
        .insert({
          user_id: user.id,
          service_type: 'shipping',
          listing_id: data.listing_id ?? null,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone || null,
          details: {
            equipment_description: data.equipment_description || null,
            equipment_location: data.equipment_location || null,
            pickup_country: data.pickup_country,
            pickup_city: data.pickup_city,
            destination_country: data.destination_country,
            destination: data.destination,
            shipping_method: data.shipping_method,
            dimensions: data.dimensions || null,
            weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
            ready_date: data.ready_date || null,
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
