-- Critical security fix (audit CRITICAL-1):
-- "Users can update own profile" used USING (auth.uid() = id) with no WITH CHECK
-- and no column restriction, so any authenticated user could run
--   UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
-- The updated row still satisfies the USING expression, so the self-promotion
-- succeeded. Apply with: supabase db push  (or paste into Supabase SQL Editor).

-- 1) Tighten the policy: own row before AND after the update.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2) Column-level hardening: public API callers may only edit their company
--    name and phone. profiles.role, email and id become untouchable through
--    PostgREST regardless of future policy changes.
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (company_name, phone) ON profiles TO authenticated;

-- 3) Defense in depth: a trigger blocks role changes from API callers even if
--    policies are relaxed later. Trusted server contexts (service_role key /
--    dashboard SQL editor) can still manage roles manually.
CREATE OR REPLACE FUNCTION enforce_no_self_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF current_user IN ('service_role', 'supabase_admin', 'postgres') THEN
      RETURN NEW; -- manual admin action from dashboard or server code
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    ) THEN
      RAISE EXCEPTION 'profiles.role cannot be changed via the public API';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_role_guard ON profiles;
CREATE TRIGGER profiles_role_guard
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION enforce_no_self_role_change();
