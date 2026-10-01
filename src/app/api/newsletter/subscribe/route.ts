import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

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

  // TODO: Integrate with your email provider (Resend, Mailchimp, etc.)
  // `parsed.data.email` is the validated address.

  return NextResponse.json({ success: true });
}