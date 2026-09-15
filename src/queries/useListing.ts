'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Listing } from './useListings';

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async (): Promise<Listing | null> => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    },
    enabled: !!id,
  });
}