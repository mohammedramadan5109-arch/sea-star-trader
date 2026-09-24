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
  /** Only return listings the admin has marked as featured (used by the
   *  homepage's Latest Equipment section). Falls back to filling in with
   *  the latest non-featured listings if fewer than `limit` are featured,
   *  so the section is never sparse or empty while curation is in progress. */
  featured?: boolean;
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
  status: string;
  is_featured: boolean;
}

export function useListings(params: UseListingsParams = {}) {
  const {
    category,
    subcategory,
    search,
    location,
    limit = 50,
    orderBy = 'created_at',
    featured = false,
  } = params;

  return useQuery({
    queryKey: ['listings', { category, subcategory, search, location, limit, orderBy, featured }],
    queryFn: async (): Promise<Listing[]> => {
      const supabase = createClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function applyFilters(query: any) {
        query = query.in('status', ['active', 'approved']);

        if (category) query = query.eq('category', category);
        if (subcategory) query = query.eq('subcategory', subcategory);
        if (search) {
          query = query.or(
            `equipment_type.ilike.%${search}%,make.ilike.%${search}%,model.ilike.%${search}%`
          );
        }
        if (location) query = query.ilike('location', `%${location}%`);

        if (orderBy === 'created_at') {
          query = query.order('created_at', { ascending: false });
        } else if (orderBy === 'price') {
          query = query.order('asking_price', { ascending: true });
        }

        return query;
      }

      if (!featured) {
        const { data, error } = await applyFilters(
          supabase.from('listings').select('*')
        ).limit(limit);
        if (error) throw error;
        return (data || []) as Listing[];
      }

      // Featured mode: get admin-picked listings first.
      const { data: featuredData, error: featuredError } = await applyFilters(
        supabase.from('listings').select('*').eq('is_featured', true)
      ).limit(limit);
      if (featuredError) throw featuredError;

      const featuredListings = (featuredData || []) as Listing[];
      if (featuredListings.length >= limit) return featuredListings;

      // Not enough featured listings — top up with the latest non-featured
      // ones so the section still shows a full row.
      const excludeIds = featuredListings.map((l: Listing) => l.id);
      let fillQuery = applyFilters(
        supabase.from('listings').select('*').eq('is_featured', false)
      ).limit(limit - featuredListings.length);

      if (excludeIds.length > 0) {
        fillQuery = fillQuery.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data: fillData, error: fillError } = await fillQuery;
      if (fillError) throw fillError;

      return [...featuredListings, ...((fillData || []) as Listing[])];
    },
    staleTime: 60 * 1000,
  });
}