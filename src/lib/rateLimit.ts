// Centralized rate limiting for API routes
// Uses in-memory store (per-instance, resets on deploy — good enough for single-instance Next.js)

type RateLimitRecord = { count: number; resetAt: number };

const rateLimiters = new Map<string, Map<string, RateLimitRecord>>();

export function rateLimit(
  name: string,
  maxAttempts: number,
  windowMs: number,
): (identifier: string) => { allowed: boolean; remaining: number; retryAfter?: number } {
  if (!rateLimiters.has(name)) {
    rateLimiters.set(name, new Map());
  }
  const store = rateLimiters.get(name)!;

  return (identifier: string) => {
    const now = Date.now();
    const record = store.get(identifier);

    if (!record || now > record.resetAt) {
      store.set(identifier, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (record.count >= maxAttempts) {
      return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
    }

    record.count++;
    return { allowed: true, remaining: maxAttempts - record.count };
  };
}

// Pre-configured rate limiters
export const loginRateLimiter = rateLimit('login', 5, 15 * 60 * 1000);        // 5 per 15 min
export const apiRateLimiter = rateLimit('api', 60, 60 * 1000);                  // 60 per minute
export const contentRateLimiter = rateLimit('content', 30, 60 * 1000);          // 30 per minute
export const contactRateLimiter = rateLimit('contact', 3, 60 * 60 * 1000);     // 3 per hour
export const newsletterRateLimiter = rateLimit('newsletter', 3, 60 * 60 * 1000); // 3 per hour
export const aiRateLimiter = rateLimit('ai', 10, 60 * 1000);                   // 10 per minute
