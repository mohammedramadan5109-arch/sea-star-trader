'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

/**
 * Minimal listing shape needed to draw a pin + popup on the EquipmentMap.
 * Only rows WITH latitude & longitude are returned — listings without
 * coordinates are skipped (they cannot be plotted; they still appear in
 * /listings).
 */
export interface MapPinListing {
  id: string;
  equipment_type: string;
  make: string | null;
  model: string | null;
  year: string | null;
  location: string;
  latitude: number;
  longitude: number;
  asking_price: number | null;
  photos: string[] | null;
}

export interface MapPinListingWithTitle extends MapPinListing {
  title: string;
  photo?: string;
}

const MAPBOX_LISTING_LIMIT = 200;

export function useMapListings() {
  return useQuery({
    queryKey: ['map-listings'],
    queryFn: async (): Promise<MapPinListingWithTitle[]> => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('listings')
        .select(
          'id, equipment_type, make, model, year, location, latitude, longitude, asking_price, photos, status'
        )
        .in('status', ['active', 'approved'])
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('created_at', { ascending: false })
        .limit(MAPBOX_LISTING_LIMIT);

      if (error) throw error;

      return (data as unknown as MapPinListing[]).map((l) => {
        const parts = [l.year, l.make, l.model].filter(Boolean).filter(String);
        const title = parts.length > 0 ? parts.join(' ') : l.equipment_type;
        return {
          ...l,
          title,
          photo: l.photos?.[0],
        };
      });
    },
    staleTime: 60 * 1000,
  });
}
