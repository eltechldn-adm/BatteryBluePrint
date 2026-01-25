// Simple in-memory rate limiter
// Tracks requests by IP address

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

/**
 * Check if request should be rate limited
 * @param identifier - Usually IP address
 * @param limit - Max requests per window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
    identifier: string,
    limit: number = 5,
    windowMs: number = 60 * 60 * 1000 // 1 hour default
): RateLimitResult {
    const now = Date.now();
    const entry = store.get(identifier);

    // No entry or expired - allow and create new
    if (!entry || entry.resetAt < now) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + windowMs,
        };
        store.set(identifier, newEntry);
        return {
            allowed: true,
            remaining: limit - 1,
            resetAt: newEntry.resetAt,
        };
    }

    // Entry exists and not expired
    if (entry.count < limit) {
        entry.count++;
        store.set(identifier, entry);
        return {
            allowed: true,
            remaining: limit - entry.count,
            resetAt: entry.resetAt,
        };
    }

    // Limit exceeded
    return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
    };
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
    // Check common headers for proxy/CDN
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to 'unknown' for development
    return 'unknown';
}
