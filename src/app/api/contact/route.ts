import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/contact';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const rate = checkRateLimit(
    { name: 'contact', limit: 5, windowMs: 60_000 },
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

  // Server-side validation (audit LOW-2): never trust client-side zod checks —
  // direct API callers bypass the React form entirely.
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // High-1 fix: persist to the `inquiries` table via the service-role
  // client (bypasses RLS). The table is admin-only for reads through the
  // public API — anon cannot even INSERT it directly, only this route can.
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from('inquiries').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject,
    message: parsed.data.message,
    inquiry_type: parsed.data.inquiry_type ?? 'general',
  });

  if (error) {
    console.error('[contact] failed to persist inquiry:', error.message);
    return NextResponse.json(
      { error: 'Failed to submit your message. Please try again shortly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}