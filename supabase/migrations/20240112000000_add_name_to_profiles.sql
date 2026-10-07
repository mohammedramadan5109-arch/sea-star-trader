-- Migration: add a display `name` to profiles, required at creation and
-- editable by each user through the public API (within RLS column grants).

BEGIN;

-- 1) Add the column. Existing rows get an empty string so the NOT NULL
-- constraint can be added cleanly. New profiles receive their name from the
-- auth-user trigger (step 4).
ALTER TABLE public.profiles
  ADD COLUMN name TEXT NOT NULL DEFAULT '';

-- 2) Make sure every existing row actually has the default applied (idempotent;
-- the ALTER above sets it, but this makes the intent explicit).
UPDATE public.profiles SET name = '' WHERE name = '';

-- 3) Keep the column NOT NULL going forward (already enforced above, but
-- explicit so a future reviewer cannot misread the constraint).
ALTER TABLE public.profiles ALTER COLUMN name SET NOT NULL;

-- 4) Extend the auth-user creation trigger so new signups populate `name`
-- from raw_user_meta_data, exactly like company_name and phone already do.
-- Idempotent CREATE OR REPLACE keeps the trigger body in sync with the
-- profiles column set without dropping/recreating the trigger itself.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_name, phone, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 5) Extend the RLS UPDATE column grant so authenticated users may edit
-- their own name through the public API, alongside company_name and phone.
-- Idempotent (re-grants are fine); keeps the same column-level protection.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (company_name, phone, name) ON public.profiles TO authenticated;

COMMIT;
