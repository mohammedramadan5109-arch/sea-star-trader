'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Backing tables for the service-requests admin queue. Appraisal requests
 * keep living in valuation_requests; everything else in service_requests.
 */
const REQUEST_TABLES = ['service_requests', 'valuation_requests'] as const;
type RequestTable = (typeof REQUEST_TABLES)[number];

const SERVICE_STATUSES = ['pending', 'contacted', 'in_progress', 'completed', 'rejected'] as const;
type ServiceStatus = (typeof SERVICE_STATUSES)[number];

// valuation_requests's CHECK constraint only allows these three.
const VALUATION_STATUSES = ['pending', 'contacted', 'converted'] as const;

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

function isRequestTable(table: string): table is RequestTable {
  return (REQUEST_TABLES as readonly string[]).includes(table);
}

/** Change a request's status (validated per backing table). */
export async function updateServiceRequestStatus(
  table: string,
  id: string,
  status: string
) {
  await requireAdmin();
  if (!isRequestTable(table)) throw new Error('Unknown request table.');

  const validStatuses = table === 'valuation_requests' ? VALUATION_STATUSES : SERVICE_STATUSES;
  if (!(validStatuses as readonly string[]).includes(status)) {
    throw new Error('Invalid status.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from(table).update({ status }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/service-requests');
  revalidatePath('/admin/valuation-requests');
  revalidatePath('/admin');
  return { status };
}

/** Save or clear the internal admin notes on a request. */
export async function updateServiceRequestNotes(
  table: string,
  id: string,
  notes: string
) {
  await requireAdmin();
  if (!isRequestTable(table)) throw new Error('Unknown request table.');

  const admin = createAdminClient();
  const { error } = await admin
    .from(table)
    .update({ admin_notes: notes.slice(0, 2000) })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/service-requests');
  revalidatePath('/admin/valuation-requests');
  return { ok: true };
}
