-- Migration: per-user email notification preferences for account settings.
--
-- Adds a single JSONB column so adding future toggles needs no DDL.
-- Authenticated users may edit ONLY their own row through the public API
-- (RLS exists on profiles), and the column-level UPDATE grant below is
-- extended to include it.

BEGIN;

-- 1) Add the column. Sensible defaults: the operational notifications
-- (orders + own-listing activity) on, marketing off.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_preferences JSONB NOT NULL DEFAULT
  '{"orderUpdates": true, "listingActivity": true, "marketingEmails": false, "bidAlerts": true}'::jsonb;

-- 2) Backfill any pre-existing rows that somehow got NULL (habitual safety,
-- same pattern as the name migration).
UPDATE public.profiles
SET email_preferences = '{"orderUpdates": true, "listingActivity": true, "marketingEmails": false, "bidAlerts": true}'::jsonb
WHERE email_preferences IS NULL;

-- 3) Extend the per-user UPDATE column grant (idempotent re-grant).
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (company_name, phone, name, email_preferences) ON public.profiles TO authenticated;

COMMIT;
