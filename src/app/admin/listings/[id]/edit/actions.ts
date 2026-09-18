'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Not authorized.');
  return user.id;
}

/** Empty string → null, so blank fields clear rather than storing ''. */
function nullable(value: string | undefined) {
  const trimmed = (value ?? '').trim();
  return trimmed === '' ? null : trimmed;
}

function numericOrNull(value: string | undefined) {
  const trimmed = (value ?? '').trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function updateListingSpecs(listingId: string, formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const inspectionScore = numericOrNull(formData.get('inspection_score') as string);
  if (inspectionScore !== null && (inspectionScore < 0 || inspectionScore > 100)) {
    throw new Error('Inspection score must be between 0 and 100.');
  }

  // Highlights come in as one bullet per line.
  const rawHighlights = (formData.get('highlights') as string) ?? '';
  const highlights = rawHighlights
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const { error } = await admin
    .from('listings')
    .update({
      make: nullable(formData.get('make') as string),
      model: nullable(formData.get('model') as string),
      year: nullable(formData.get('year') as string),
      equipment_type: nullable(formData.get('equipment_type') as string),
      condition: nullable(formData.get('condition') as string),
      location: nullable(formData.get('location') as string),
      description: nullable(formData.get('description') as string),
      asking_price: numericOrNull(formData.get('asking_price') as string),
      is_negotiable: formData.get('is_negotiable') === 'on',
      hours: numericOrNull(formData.get('hours') as string),
      serial_number: nullable(formData.get('serial_number') as string),
      net_weight: numericOrNull(formData.get('net_weight') as string),
      engine_model: nullable(formData.get('engine_model') as string),
      engine_power: numericOrNull(formData.get('engine_power') as string),
      fuel_type: nullable(formData.get('fuel_type') as string),
      transmission: nullable(formData.get('transmission') as string),
      bucket_capacity: nullable(formData.get('bucket_capacity') as string),
      tire_size: nullable(formData.get('tire_size') as string),
      inspection_score: inspectionScore,
      highlights: highlights.length > 0 ? highlights : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/listings/${listingId}/edit`);
  revalidatePath('/admin/listings');
  revalidatePath(`/listings/${listingId}`);

  return { ok: true };
}

export async function setSellerVerified(profileId: string, verified: boolean) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from('profiles')
    .update({ is_verified: verified })
    .eq('id', profileId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/users');
  return { verified };
}