/**
 * Simple in-memory fixed-window rate limiter.
 *
 * Works per server instance, which is correct for local dev and
 * single-instance deployments. If this app is ever served from multiple
 * instances (e.g. serverless), replace the Map below with a shared store
 * such as Upstash Redis (@upstash/ratelimit) — call sites only depend on
 * checkRateLimit() and getClientIp().
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Logical limit name, e.g. 'contact' — combined with the client IP. */
  name: string;
  /** Maximum requests allowed per window. */
  limit: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Requests left in the current window after this one (0 when blocked). */
  remaining: number;
  /** Seconds until the window resets (only meaningful when ok is false). */
  retryAfterSeconds: number;
}

/**
 * Best-effort client IP: proxies/load balancers set x-forwarded-for
 * (first entry is the original client). Falls back to x-real-ip, then
 * 'unknown' (all unknown clients share one bucket — the safe default).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export function checkRateLimit(
  options: RateLimitOptions,
  identifier: string
): RateLimitResult {
  const key = `${options.name}:${identifier}`;
  const now = Date.now();

  // Lazy sweep so the map cannot grow unbounded under sustained load.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > options.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return {
    ok: true,
    remaining: options.limit - bucket.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Clear a client's bucket, e.g. after a successful login so that only
 * FAILED attempts count toward the limit.
 */
export function resetRateLimit(name: string, identifier: string): void {
  buckets.delete(`${name}:${identifier}`);
}
