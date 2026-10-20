/**
 * One-off backfill: geocode every listing missing coordinates using the
 * Mapbox Geocoding API, then write latitude/longitude back to the listings
 * table via service-role credentials. Reads all secrets from .env.local and
 * never prints them.
 *
 * Usage: node scripts/backfill-listing-coords.js
 */
const fs = require('fs');

const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && m[2] !== undefined && m[2] !== '') {
    env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const MAPBOX_TOKEN = env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!SUPABASE_URL || !SERVICE_KEY || !MAPBOX_TOKEN) {
  console.error('Missing required env vars in .env.local (need SUPABASE_URL, SERVICE_ROLE_KEY, MAPBOX_TOKEN)');
  process.exit(1);
}

// Common address-data quirks we saw in this table.
function normalizeLocation(text) {
  return text
    .replace(/NewZealand/g, 'New Zealand')
    .replace(/\s+/g, ' ')
    .trim();
}

const geoCache = new Map();
async function geocode(location) {
  const norm = normalizeLocation(location);
  if (geoCache.has(norm)) return geoCache.get(norm);

  const variants = [norm];
  // Second variation: drop the last segment (country) if the first try misses.
  const parts = norm.split(',');
  if (parts.length > 2) variants.push(parts.slice(0, -1).join(','));

  for (const v of variants) {
    const url =
      'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      encodeURIComponent(v) +
      ".json?limit=1&types=place&access_token=" +
      encodeURIComponent(MAPBOX_TOKEN);
    const r = await fetch(url);
    const j = await r.json();
    if (j.features && j.features.length > 0) {
      const [lon, lat] = j.features[0].center;
      const result = { lat, lon, matched: j.features[0].place_name };
      geoCache.set(norm, result);
      return result;
    }
  }
  const result = null;
  geoCache.set(norm, result);
  return result;
}

async function fetchPending() {
  const url = SUPABASE_URL + '/rest/v1/listings?select=id,location&latitude=is.null&limit=500';
  const r = await fetch(url, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!r.ok) throw new Error('Listings fetch failed: ' + r.status);
  return r.json();
}

async function updateCoords(id, lat, lon) {
  const url = SUPABASE_URL + '/rest/v1/listings?id=eq.' + encodeURIComponent(id);
  const r = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ latitude: lat, longitude: lon }),
  });
  if (!r.ok) throw new Error('Update failed with HTTP ' + r.status + ' for listing ' + id);
}

(async () => {
  const listings = await fetchPending();
  console.log('Listings needing coordinates:', listings.length);

  let updated = 0;
  const failures = [];
  for (const l of listings) {
    try {
      const geo = await geocode(l.location);
      if (!geo) {
        failures.push({ id: l.id, location: l.location });
        console.log('NO MATCH  |', l.location);
        continue;
      }
      // Mapbox returns [lon, lat]; Supabase columns are latitude / longitude.
      await updateCoords(l.id, geo.lat, geo.lon);
      updated++;
      console.log('UPDATED   |', l.location, '->', geo.lat.toFixed(4) + ',', geo.lon.toFixed(4), '(' + geo.matched + ')');
      await new Promise((res) => setTimeout(res, 150));
    } catch (e) {
      failures.push({ id: l.id, location: l.location, error: e.message });
      console.log('ERROR     |', l.location, '|', e.message);
    }
  }

  console.log('---');
  console.log('Updated:', updated);
  console.log('Failed:', failures.length);
  if (failures.length > 0) {
    console.log('Failed rows:');
    failures.forEach((f) => console.log(' ', f.id, f.location, f.error || ''));
  }
})();
