-- Shared service requests for Shipping, Inspection and Refurbishing.
-- Appraisal keeps using the existing valuation_requests table.
-- Idempotent: safe to run more than once.

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('shipping', 'inspection', 'refurbishing')),
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  details JSONB NOT NULL DEFAULT '{}',
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_user_id
  ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_service_type
  ON service_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_service_requests_status
  ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at
  ON service_requests(created_at DESC);

-- ---------------------------------------------------------------------------
-- Appraisal: extend the existing valuation_requests table so the appraisal
-- service page can store hours / serial / purpose / notes / photos. Pure
-- additive ALTERs — the existing admin pages keep working unchanged.
-- ---------------------------------------------------------------------------
ALTER TABLE valuation_requests ADD COLUMN IF NOT EXISTS hours NUMERIC;
ALTER TABLE valuation_requests ADD COLUMN IF NOT EXISTS serial_number TEXT;
ALTER TABLE valuation_requests ADD COLUMN IF NOT EXISTS purpose TEXT;
ALTER TABLE valuation_requests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE valuation_requests ADD COLUMN IF NOT EXISTS photo_urls TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE valuation_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE valuation_requests ENABLE ROW LEVEL SECURITY;

-- Signed-in users evaluate their own machines: replace (if it exists) the
-- historical open-insert policy with the same members-only rule the
-- valuation page forms enforce.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'valuation_requests' AND policyname = 'Anyone can submit valuation request'
  ) THEN
    DROP POLICY "Anyone can submit valuation request" ON valuation_requests;
  END IF;
END $$;

DROP POLICY IF EXISTS "Only registered users can submit valuation" ON valuation_requests;
CREATE POLICY "Only registered users can submit valuation"
  ON valuation_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users insert own service requests" ON service_requests;
CREATE POLICY "Users insert own service requests"
  ON service_requests FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users select own service requests" ON service_requests;
CREATE POLICY "Users select own service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Admins select all service requests" ON service_requests;
CREATE POLICY "Admins select all service requests"
  ON service_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins update all service requests" ON service_requests;
CREATE POLICY "Admins update all service requests"
  ON service_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- updated_at stamp on every update (moddatetime is a standard Supabase extension,
-- installed under the "extensions" schema on host projects).
CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

DROP TRIGGER IF EXISTS trg_service_requests_updated_at ON service_requests;
CREATE TRIGGER trg_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);
