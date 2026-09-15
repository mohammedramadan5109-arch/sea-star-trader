'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

interface UseListingsParams {
  category?: string;
  subcategory?: string;
  search?: string;
  location?: string;
  limit?: number;
  orderBy?: 'created_at' | 'price';
}

export interface Listing {
  id: string;
  equipment_type: string;
  make: string | null;
  model: string | null;
  year: string | null;
  condition: string | null;
  location: string;
  photos: string[] | null;
  asking_price: number | null;
  created_at: string;
  category: string;
  subcategory: string | null;
}

export function useListings(params: UseListingsParams = {}) {
  const { category, subcategory, search, location, limit = 50, orderBy = 'created_at' } = params;

  return useQuery({
    queryKey: ['listings', { category, subcategory, search, location, limit, orderBy }],
    queryFn: async (): Promise<Listing[]> => {
      const supabase = createClient();

      let query = supabase
        .from('listings')
        .select('*')
        .in('status', ['active', 'approved']);

      if (category) {
        query = query.eq('category', category);
      }

      if (subcategory) {
        query = query.eq('subcategory', subcategory);
      }

      if (search) {
        query = query.or(
          `equipment_type.ilike.%${search}%,make.ilike.%${search}%,model.ilike.%${search}%`
        );
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      if (orderBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      } else if (orderBy === 'price') {
        query = query.order('asking_price', { ascending: true });
      }

      query = query.limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    },
    staleTime: 60 * 1000, // 1 minute
  });
}