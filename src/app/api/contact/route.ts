import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/contact';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

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

  // TODO: Create an 'inquiries' table if you want to store these
  // For now, you could send an email via Resend or another service.
  // `parsed.data` is the validated payload:
  // { name, email, phone?, subject, message, inquiry_type? }

  return NextResponse.json({ success: true });
}