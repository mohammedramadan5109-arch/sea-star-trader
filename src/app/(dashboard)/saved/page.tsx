import { createClient } from '@/lib/supabase/server';
import { SavedListingsGrid } from '@/components/dashboard/SavedListingsGrid';

export default async function SavedListingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('saved_listings')
    .select(
      `
      id,
      created_at,
      listing:listings (
        id, make, model, year, asking_price, photos, location, status
      )
    `
    )
    .eq('user_id', user?.id ?? '')
    .order('created_at', { ascending: false });

  const items = (data ?? []).map((row: any) => ({
    savedId: row.id,
    listing: row.listing,
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--navy)' }}>
        Saved listings
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--slate)' }}>
        Equipment you&apos;ve bookmarked to come back to later.
      </p>

      {error ? (
        <p className="text-sm text-red-600">Couldn&apos;t load your saved listings.</p>
      ) : (
        <SavedListingsGrid items={items} />
      )}
    </div>
  );
}
