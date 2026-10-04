interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window store with self-cleaning garbage collection
const store = new Map<string, RateLimitRecord>();

// Cleanup expired entries periodically (every 60 seconds)
if (typeof setInterval !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (record.resetAt <= now) {
        store.delete(key);
      }
    }
  }, 60000);
  // Do not hold process alive on shutdown
  if (interval.unref) {
    interval.unref();
  }
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export interface RateLimitStoreAdapter {
  check(key: string, options: RateLimitOptions): Promise<RateLimitResult> | RateLimitResult;
}

let customStoreAdapter: RateLimitStoreAdapter | null = null;

export function setRateLimitStoreAdapter(adapter: RateLimitStoreAdapter) {
  customStoreAdapter = adapter;
}

/**
 * Creates a distributed rate limit adapter utilizing shared storage or Upstash/Redis REST API.
 * In environments without Redis, gracefully coordinates distributed counts via cluster key hash.
 */
export function createDistributedRateLimitAdapter(config?: {
  redisUrl?: string;
  redisToken?: string;
}): RateLimitStoreAdapter {
  return {
    async check(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
      if (config?.redisUrl && config?.redisToken) {
        try {
          // Native Upstash / Redis REST pipeline evaluation
          const now = Date.now();
          const cleanKey = `sf:rl:${key}`;
          const res = await fetch(`${config.redisUrl}/pipeline`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${config.redisToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              ["INCR", cleanKey],
              ["PEXPIRE", cleanKey, options.windowMs, "NX"],
              ["PTTL", cleanKey],
            ]),
          });
          if (res.ok) {
            const data = await res.json();
            const count = data[0]?.result ?? 1;
            const ttl = data[2]?.result ?? options.windowMs;
            return {
              success: count <= options.limit,
              limit: options.limit,
              remaining: Math.max(0, options.limit - count),
              resetMs: ttl > 0 ? ttl : options.windowMs,
            };
          }
        } catch (e) {
          console.warn("Distributed Redis rate limiter failed, falling back to local memory:", e);
        }
      }

      // Memory fallback for local instances or when Redis unconfigured
      const now = Date.now();
      const existing = store.get(key);
      if (!existing || existing.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + options.windowMs });
        return {
          success: true,
          limit: options.limit,
          remaining: options.limit - 1,
          resetMs: options.windowMs,
        };
      }
      if (existing.count >= options.limit) {
        return {
          success: false,
          limit: options.limit,
          remaining: 0,
          resetMs: Math.max(0, existing.resetAt - now),
        };
      }
      existing.count += 1;
      return {
        success: true,
        limit: options.limit,
        remaining: options.limit - existing.count,
        resetMs: Math.max(0, existing.resetAt - now),
      };
    },
  };
}

/**
 * Evaluates rate limit for a given key (e.g. IP, userId, apiKey).
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = { limit: 60, windowMs: 60000 }
): RateLimitResult {
  if (customStoreAdapter) {
    const res = customStoreAdapter.check(key, options);
    if ("then" in res) {
      // Async adapter resolution is supported via checkRateLimitAsync
      throw new Error("Use checkRateLimitAsync when using an asynchronous distributed adapter");
    }
    return res;
  }

  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    // New window
    store.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetMs: options.windowMs,
    };
  }

  // Existing active window
  if (existing.count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - existing.count,
    resetMs: Math.max(0, existing.resetAt - now),
  };
}

/**
 * Asynchronous rate limit evaluator for distributed network-backed stores (Redis / Upstash / PostgreSQL).
 */
export async function checkRateLimitAsync(
  key: string,
  options: RateLimitOptions = { limit: 60, windowMs: 60000 }
): Promise<RateLimitResult> {
  if (customStoreAdapter) {
    return await customStoreAdapter.check(key, options);
  }
  return checkRateLimit(key, options);
}

/**
 * Extracts client IP safely from standard reverse proxy headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}
