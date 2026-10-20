'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/Spinner';
import { useMapListings } from '@/hooks/useMapListings';
import type { MapPinListingWithTitle } from '@/hooks/useMapListings';

// mapbox-gl touches `window` at import time, so the map component must
// never be server-rendered.
const EquipmentMap = dynamic(
  () => import('@/components/map/EquipmentMap').then((m) => m.EquipmentMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: 'var(--off-white)' }}>
        <Spinner size={40} />
      </div>
    ),
  }
);

export default function MapPage() {
  const { data: listings, isLoading, isError } = useMapListings();

  return (
    <div className="h-[calc(100vh-200px)] w-full relative" style={{ backgroundColor: 'var(--off-white)' }}>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Spinner size={40} />
        </div>
      ) : isError ? (
        <div className="h-full flex items-center justify-center text-center p-8">
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            Couldn&apos;t load the equipment map. Please refresh the page.
          </p>
        </div>
      ) : (
        <EquipmentMap listings={(listings ?? []) as MapPinListingWithTitle[]} />
      )}
    </div>
  );
}
