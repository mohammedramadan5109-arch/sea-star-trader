-- Migration: persist contact-form inquiries and newsletter subscribers.
-- These tables back the two public API routes (HIGH-1 / HIGH-2 from the
-- launch audit). Data is written exclusively by server routes; anonymous
-- INSERT is granted through Supabase's anon role ONLY via those routes.
-- Nobody can read these tables through the public API except admins.

BEGIN;

-- ============ Inquiries (contact form) ============
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ Newsletter subscribers ============
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ RLS ============
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Nobody reads/writes through the public API except admins. The
-- newsletter_subscribers UNIQUE(email) keeps duplicate signups idempotent on
-- the server side (routes catch and return success on re-subscribe).
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
CREATE POLICY "Admins can view inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Server-side writes (from the Next.js API routes) use the service_role
-- key via supabaseAdmin, which bypasses RLS entirely — so no INSERT policy
-- is needed and none is granted. This is intentional: even the anon role
-- cannot write these tables through the public REST endpoint.

-- Server routes never UPDATE; admins change status through the server
-- client too. Explicitly deny UPDATE/DELETE via public API:
GRANT SELECT ON public.inquiries TO authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;

-- The unique constraint on email prevents duplicate subscribers at the DB
-- level regardless of which server writes. created_at is indexed for the
-- admin list ordering.
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
  ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at
  ON public.newsletter_subscribers (created_at DESC);

COMMIT;
