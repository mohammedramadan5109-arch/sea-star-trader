/**
 * Browser-safe Mapbox Geocoding helper.
 *
 * Uses the publishable token (NEXT_PUBLIC_MAPBOX_TOKEN, a `pk.` token) which
 * is designed to appear in client bundles. Geocode failures never throw:
 * callers should treat null as "no coordinates" and let the listing save
 * without a pin rather than blocking the seller.
 */

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  /** Mapbox's resolved place name, useful for debugging matches. */
  matchedPlace: string;
}

// Full-context query: no `types` filter, so region-level inputs like
// "Castille-La Mancha, Spain" resolve correctly (see the backfill lesson).
export async function geocodeLocation(location: string): Promise<GeocodeResult | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token || !location.trim()) return null;

  try {
    const url =
      'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      encodeURIComponent(location.trim()) +
      '.json?limit=1&access_token=' +
      encodeURIComponent(token);

    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    const feature = json?.features?.[0];
    if (!feature) return null;

    const [longitude, latitude] = feature.center;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;

    return { latitude, longitude, matchedPlace: String(feature.place_name ?? '') };
  } catch {
    return null;
  }
}
