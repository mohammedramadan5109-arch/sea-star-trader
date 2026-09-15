-- Valuation requests table (homepage teaser form)
CREATE TABLE valuation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_type TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year TEXT,
  condition TEXT CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Needs Repair')),
  location TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_valuation_requests_status ON valuation_requests(status);
CREATE INDEX idx_valuation_requests_created_at ON valuation_requests(created_at DESC);

-- RLS
ALTER TABLE valuation_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert valuation requests
CREATE POLICY "Anyone can submit valuation request"
  ON valuation_requests FOR INSERT
  WITH CHECK (true);

-- Only admins can read/update
CREATE POLICY "Admins can view all valuation requests"
  ON valuation_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update valuation requests"
  ON valuation_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );