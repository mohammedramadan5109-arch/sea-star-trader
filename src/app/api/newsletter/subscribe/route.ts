import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';

// 254 = RFC 5321 maximum email length
const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
});

export async function POST(request: Request) {
  const rate = checkRateLimit(
    { name: 'newsletter', limit: 3, windowMs: 60_000 },
    getClientIp(request)
  );
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Server-side validation (audit LOW-2): replaces the old `.includes('@')` check.
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email address', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // High-2 fix: persist via service-role client. The UNIQUE(email)
  // constraint makes re-subscribes idempotent — treat "duplicate key" as
  // success so the UX stays friendly without revealing who is on the list.
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .upsert(
      { email: parsed.data.email },
      { onConflict: 'email', ignoreDuplicates: true }
    );

  if (error) {
    console.error('[newsletter] failed to persist subscriber:', error.message);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again shortly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}