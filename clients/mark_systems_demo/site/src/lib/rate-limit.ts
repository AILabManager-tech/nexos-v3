/**
 * Simple in-memory rate limiter.
 *
 * WARNING: In serverless runtimes (Vercel, AWS Lambda, Cloudflare), each
 * function instance has its own Map. A cold client can get a fresh quota on
 * every new instance. For production at scale, replace with @upstash/ratelimit
 * + Redis to get shared state across instances.
 *
 * For local/dev/demo this in-memory version is sufficient.
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3;

// Single-shot startup warning
let warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  if (process.env.NODE_ENV === 'production' && !process.env.UPSTASH_REDIS_REST_URL) {
    console.warn(
      '[rate-limit] Running in-memory rate limiter in production. ' +
        'Rate limits are per-instance and not shared across serverless functions. ' +
        'Configure @upstash/ratelimit for production-grade enforcement.'
    );
  }
}

export function rateLimit(identifier: string): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  warnOnce();
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + WINDOW_MS;
    store.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract client IP from request headers.
 *
 * Priority order (trusted → least trusted):
 * 1. `x-vercel-forwarded-for` — Vercel-specific, set by the edge and NOT
 *    forgeable by the client.
 * 2. `x-real-ip` — Typically set by reverse proxies.
 * 3. `x-forwarded-for` — User-controlled; first value is used (LAST HOP).
 *    SAFE ONLY when running behind a trusted proxy that rewrites the header.
 * 4. `unknown` — No IP headers present.
 *
 * On Vercel this returns the real client IP. Behind any other proxy, you
 * MUST ensure the proxy strips/rewrites X-Forwarded-For.
 */
export function getClientIp(headers: Headers): string {
  // Vercel-only header, not client-controllable
  const vercel = headers.get('x-vercel-forwarded-for');
  if (vercel) {
    const first = vercel.split(',')[0];
    if (first) return first.trim();
  }

  // Standard real-ip (nginx, most proxies)
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // x-forwarded-for — only trusted if running behind a real proxy
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0];
    if (first) return first.trim();
  }

  return 'unknown';
}
