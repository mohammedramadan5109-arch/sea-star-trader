import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client. Bypasses Row Level Security.
 *
 * SERVER-ONLY — never import this from a client component or
 * anywhere that ships to the browser. It uses SUPABASE_SERVICE_ROLE_KEY,
 * which must stay out of NEXT_PUBLIC_* env vars.
 *
 * Use this only after you've already verified the caller is an admin
 * (see requireAdmin() in admin/listings/actions.ts) — this client
 * itself does not check permissions.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
