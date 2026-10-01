-- Schema-drift fix (audit MEDIUM-3): profiles creation was never captured in
-- migrations. The profiles table has no INSERT policy (correct — users must
-- not insert arbitrary rows), so new profiles must come from a trigger on
-- auth.users. Without this migration a fresh environment cannot register
-- users at all.
--
-- Safe against the live project even if an equivalent trigger was created
-- manually in the dashboard: this trigger is idempotent per-row
-- (ON CONFLICT (id) DO NOTHING), so duplicate triggers never double-insert.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
