'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type ReviewAction = 'approve' | 'reject';

async function requireAdmin(): Promise<string> {
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

  if (profile?.role !== 'admin') {
    throw new Error('Not authorized.');
  }

  return user.id;
}

/**
 * Approves or rejects a pending listing.
 * - Reject  → status = 'rejected'
 * - Approve → status = 'active' (this is what makes it show up on the
 *   public /listings page — confirm your public listings query filters
 *   on status = 'active'; if not, change the value below)
 */
export async function reviewListing(listingId: string, action: ReviewAction) {
  await requireAdmin();
  const admin = createAdminClient();

  const newStatus = action === 'reject' ? 'rejected' : 'active';

  const { error: updateError } = await admin
    .from('listings')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', listingId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath('/admin/listings');
  revalidatePath('/listings');

  return { status: newStatus };
}