// Tiny in-memory, per-key sliding-window rate limiter.
// Fine for a single-instance deploy; swap for Upstash Ratelimit / Redis
// when you run multiple instances on Vercel.

type Hit = { count: number; reset: number };
const buckets = new Map<string, Hit>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const hit = buckets.get(key);
  if (!hit || hit.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.reset - now) / 1000) };
  }
  return { ok: true, remaining: limit - hit.count };
}

export function clientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : null) ?? req.headers.get("x-real-ip") ?? "anon";
}
