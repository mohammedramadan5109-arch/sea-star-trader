/**
 * One-off repair: re-geocode rows that were mistakenly geocoded to the wrong
 * place. Only touches rows whose latitude/longitude fall inside a small box
 * around the wrong location (Los Angeles), so the fix is idempotent and
 * cannot touch anything else.
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

// Only rows currently sitting near Los Angeles with a Spain-ish location
// string get corrected.
const WRONG_LAT_MIN = 33.5, WRONG_LAT_MAX = 34.5;
const WRONG_LON_MIN = -119.0, WRONG_LON_MAX = -117.5;

async function main() {
  // 1) find rows in the bad box
  const u = SUPABASE_URL + '/rest/v1/listings?select=id,location,latitude,longitude' +
    `&latitude=gte.${WRONG_LAT_MIN}&latitude=lte.${WRONG_LAT_MAX}` +
    `&longitude=gte.${WRONG_LON_MIN}&longitude=lte.${WRONG_LON_MAX}`;
  const r = await fetch(u, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!r.ok) throw new Error('fetch failed: ' + r.status);
  const rows = await r.json();
  const bad = rows.filter((x) => /spain/i.test(x.location));
  console.log('Rows near Los Angeles with Spain in location:', bad.length);
  bad.forEach((x) => console.log('  @', x.latitude, ',', x.longitude, '|', x.location));

  // 2) geocode each correctly — postgis not used; try full string first
  //    with default geocoding types (no place filter), which handles
  //    region-level inputs like "Castille-La Mancha, Spain" correctly.
  for (const row of bad) {
    const geoUrl =
      'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      encodeURIComponent(row.location) +
      '.json?limit=1&access_token=' +
      encodeURIComponent(MAPBOX_TOKEN);
    const gr = await fetch(geoUrl);
    const gj = await gr.json();
    if (!gj.features || gj.features.length === 0) {
      console.log('NO MATCH, leaving row as-is:', row.location);
      continue;
    }
    const [lon, lat] = gj.features[0].center;
    const placeTag = /region|country|place|locality|poi/.test(gj.features[0].id)
      ? gj.features[0].id.split('.').slice(0, 1)[0]
      : '?';
    const ur = await fetch(
      SUPABASE_URL + '/rest/v1/listings?id=eq.' + encodeURIComponent(row.id),
      {
        method: 'PATCH',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      }
    );
    if (!ur.ok) {
      console.log('PATCH failed', ur.status, row.location);
      continue;
    }
    console.log('FIXED     |', row.location, '->', lat.toFixed(4) + ',', lon.toFixed(4), '(' + placeTag + ')');
    await new Promise((res) => setTimeout(res, 150));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
