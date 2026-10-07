import { NextResponse } from 'next/server';
import { z } from 'zod';
import { loginSchema } from '@/lib/validations/auth';
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side login endpoint.
 *
 * The old flow called supabase.auth.signInWithPassword straight from the
 * browser, so failed attempts never touched this server and could not be
 * rate limited (GoTrue alone does not lock accounts on this project).
 * Logging in here means every attempt passes the limiter below, and the
 * session cookie is set server-side.
 */

const MAX_ATTEMPTS = 3;
const WINDOW_MINUTES = 10;
const WINDOW_MS = WINDOW_MINUTES * 60_000;

// The hCaptcha token comes from the client widget and is verified by GoTrue.
const loginWithCaptchaSchema = loginSchema.extend({
  captchaToken: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // Only FAILED attempts end up counting: a successful login clears the
  // bucket below, so a user who mistypes twice then succeeds is not locked
  // out of their next session.
  const rate = checkRateLimit(
    { name: 'login', limit: MAX_ATTEMPTS, windowMs: WINDOW_MS },
    ip
  );
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Please try again in ${Math.ceil(
          rate.retryAfterSeconds / 60
        )} minute(s), or reset your password.`,
      },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Server-side validation — never trust client-side zod checks.
  const parsed = loginWithCaptchaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
    // Captcha token from the client's hCaptcha widget, verified by GoTrue.
    options: { captchaToken: parsed.data.captchaToken },
  });

  if (error) {
    if (error.code === 'email_not_confirmed') {
      return NextResponse.json(
        { error: 'Please confirm your email address before logging in.' },
        { status: 403 }
      );
    }

    if (error.code === 'over_request_rate_limit') {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes and try again.' },
        { status: 429 }
      );
    }

    if (error.code === 'captcha_failed') {
      // GoTrue rejects before checking any credentials, so don't burn one of
      // the 3 attempts on a missing/expired captcha token.
      resetRateLimit('login', ip);
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please complete the CAPTCHA and try again.' },
        { status: 400 }
      );
    }

    // Log unexpected (non credential) failures for debugging, but keep the
    // client response generic so attackers can't probe which emails exist.
    if (error.code !== 'invalid_credentials') {
      console.error(
        `[login] sign-in error (${error.code ?? 'unknown'}):`,
        error.message
      );
    }

    const remaining = rate.remaining;
    const attemptInfo =
      remaining > 0
        ? ` ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`
        : ` You have used all ${MAX_ATTEMPTS} attempts — try again in ${WINDOW_MINUTES} minutes or reset your password.`;

    return NextResponse.json(
      {
        error: `Invalid email or password.${attemptInfo}`,
        attemptsRemaining: remaining,
      },
      { status: 401 }
    );
  }

  // Success: clear the failure counter for this IP.
  resetRateLimit('login', ip);
  return NextResponse.json({ ok: true });
}
