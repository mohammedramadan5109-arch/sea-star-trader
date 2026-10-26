-- Search logging for the header search bar's "Top searched" panel.
-- One row per submitted search term; popularity = COUNT(*) per term.
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_logs_term ON search_logs(term);

ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Anyone (including visitors) can record a search.
CREATE POLICY "Anyone can log a search"
  ON search_logs FOR INSERT
  WITH CHECK (true);

-- Popular searches are public, non-personal aggregate data.
CREATE POLICY "Anyone can view search logs"
  ON search_logs FOR SELECT
  USING (true);
