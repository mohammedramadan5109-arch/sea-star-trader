-- Shipping requests: expose "Equipment location" as a real column.
--
-- The shipping quote form stores its fields in the `details` JSONB of
-- service_requests (typing in src/lib/validations/service-request.ts; the
-- mutation composes them in src/mutations/useSubmitShippingRequest.ts).
-- This migration adds a STORED generated column that materializes
-- details->>'equipment_location', so the location becomes a first-class,
-- queryable column without introducing a second write path. PostgreSQL
-- GENERATED ALWAYS AS ... STORED requires PG12+ — standard on Supabase.
--
-- Idempotent: safe to run more than once.

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS equipment_location TEXT
  GENERATED ALWAYS AS (details->>'equipment_location') STORED;

-- Partial index: quotes are commonly filtered by where the machine stands.
CREATE INDEX IF NOT EXISTS idx_service_requests_equipment_location
  ON service_requests (equipment_location)
  WHERE equipment_location IS NOT NULL;

-- Backfill check: any shipping requests submitted before the form had the
-- field simply have a NULL location here until their next quote includes it.
DO $$
BEGIN
  RAISE NOTICE 'equipment_location generated column ready (% rows populated)',
    (SELECT count(*) FROM service_requests WHERE equipment_location IS NOT NULL);
END
$$;
