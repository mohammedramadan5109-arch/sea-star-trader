'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { MapPinListingWithTitle } from '@/hooks/useMapListings';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Wide initial view: SeaStarTrader is a global marketplace.
const INITIAL_VIEW = {
  longitude: 30,
  latitude: 25,
  zoom: 1.8,
};

export function EquipmentMap({
  listings,
}: {
  listings: MapPinListingWithTitle[];
}) {
  const [selected, setSelected] = useState<MapPinListingWithTitle | null>(null);

  const mapRef = useMemo(() => ({ current: null as MapRef | null }), []);
  // Fit to all pins exactly once, the first time listings data exists. Doing
  // this in onLoad alone races the listings query — onLoad usually fires
  // before the data has arrived, and then nothing would re-fit.
  const hasFitted = useRef(false);

  useEffect(() => {
    const map = mapRef.current;
    if (hasFitted.current || listings.length === 0 || !map) return;

    const lons = listings.map((l) => l.longitude);
    const lats = listings.map((l) => l.latitude);
    map.fitBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)],
      ],
      { padding: 60, maxZoom: 12, duration: 0 }
    );
    hasFitted.current = true;
  }, [listings, mapRef]);
  
  // Also handle the case where the map finishes loading after data is
  // already present (fitBounds needs the map instance, which may not be
  // set yet on the very first effect run).
  const handleMapLoad = () => {
    if (hasFitted.current || listings.length === 0) return;

    const lons = listings.map((l) => l.longitude);
    const lats = listings.map((l) => l.latitude);
    mapRef.current?.fitBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)],
      ],
      { padding: 60, maxZoom: 12, duration: 0 }
    );
    hasFitted.current = true;
  };

  if (!TOKEN) {
    return (
      <div
        className="h-full flex items-center justify-center text-center p-8"
        style={{ backgroundColor: 'var(--off-white)' }}
      >
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          Map is unavailable: no Mapbox token configured (NEXT_PUBLIC_MAPBOX_TOKEN).
        </p>
      </div>
    );
  }

  const selectAndFly = (listing: MapPinListingWithTitle) => {
    setSelected(listing);
    mapRef.current?.flyTo({
      center: [listing.longitude, listing.latitude],
      zoom: Math.max(mapRef.current.getZoom(), 5),
      duration: 800,
    });
  };

  return (
    <div className="relative h-full w-full">
      <Map
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={mapRef as any}
        mapboxAccessToken={TOKEN}
        initialViewState={INITIAL_VIEW}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '100%' }}
        attributionControl
        onLoad={handleMapLoad}
      >
        <NavigationControl position="top-right" />

        {listings.map((listing) => (
          <Marker
            key={listing.id}
            longitude={listing.longitude}
            latitude={listing.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              selectAndFly(listing);
            }}
          >
            <button
              type="button"
              aria-label={`Show ${listing.equipment_type} in ${listing.location}`}
              className="cursor-pointer"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <MapPin
                size={30}
                strokeWidth={2}
                style={{
                  color: 'var(--orange)',
                  fill: 'var(--paper-solid, #f5f4f0)',
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))',
                }}
              />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            anchor="bottom"
            offset={[0, -34]}
            closeButton={true}
            closeOnClick={true}
            onClose={() => setSelected(null)}
            maxWidth="260px"
          >
            <div className="w-[220px]">
              {selected.photo && (
                <div className="relative w-full aspect-[4/3] mb-2 rounded-sm overflow-hidden">
                  <Image
                    src={selected.photo}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                </div>
              )}
              <h3 className="font-bold text-sm leading-snug mb-1">
                {selected.title}
              </h3>
              <p className="text-xs mb-2 flex items-center gap-1" style={{ color: '#64748b' }}>
                <MapPin size={12} className="shrink-0" />
                {selected.location}
              </p>
              {selected.asking_price ? (
                <p className="text-sm font-bold" style={{ color: 'var(--orange)' }}>
                  ${Number(selected.asking_price).toLocaleString()}
                </p>
              ) : (
                <p className="text-xs font-semibold" style={{ color: '#64748b' }}>
                  Price on request
                </p>
              )}
              <Link
                href={`/listings/${selected.id}`}
                className="mt-2 inline-block text-xs font-semibold underline"
                style={{ color: 'var(--navy-solid)' }}
              >
                View listing →
              </Link>
            </div>
          </Popup>
        )}
      </Map>

      {/* Equipment count overlay */}
      <div
        className="absolute bottom-3 left-3 px-3 py-2 rounded-sm text-xs font-semibold z-10"
        style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--line)' }}
      >
        {listings.length} {listings.length === 1 ? 'machine' : 'machines'} on map
      </div>
    </div>
  );
}
