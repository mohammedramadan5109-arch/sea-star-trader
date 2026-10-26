-- Listing condition is now binary: 'New' | 'Used'.
-- The old multi-level values (Excellent / Good / Fair / Needs Repair) are all
-- treated as 'Used' — every pre-existing listing is a second-hand machine.
UPDATE listings
SET condition = 'Used'
WHERE condition IS NOT NULL
  AND condition NOT IN ('New', 'Used');

-- Replace any old CHECK constraint on listings.condition (name unknown, so
-- find it dynamically), then add the new binary one.
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'listings'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%condition%'
    AND NOT pg_get_constraintdef(oid) ILIKE '%NEW%' || chr(39);

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE listings DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

ALTER TABLE listings
  ADD CONSTRAINT listings_condition_check CHECK (condition IN ('New', 'Used'));
