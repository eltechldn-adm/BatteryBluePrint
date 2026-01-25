import { Redis } from '@upstash/redis';

// In-memory store for local development without Redis
class InMemoryRedis {
    private store = new Map<string, string>();
    private expiries = new Map<string, number>();

    async get<T>(key: string): Promise<T | null> {
        // Check expiry
        const expiry = this.expiries.get(key);
        if (expiry && Date.now() > expiry) {
            this.store.delete(key);
            this.expiries.delete(key);
            return null;
        }

        const value = this.store.get(key);
        if (!value) return null;

        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    async set(key: string, value: any): Promise<void> {
        const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
        this.store.set(key, stringVal);
    }

    async setex(key: string, seconds: number, value: any): Promise<void> {
        await this.set(key, value);
        this.expiries.set(key, Date.now() + (seconds * 1000));
    }

    async del(key: string): Promise<void> {
        this.store.delete(key);
        this.expiries.delete(key);
    }

    async ttl(key: string): Promise<number> {
        const expiry = this.expiries.get(key);
        if (!expiry) return -1;
        const remaining = Math.ceil((expiry - Date.now()) / 1000);
        return remaining > 0 ? remaining : -2;
    }

    // List operations for leads/events mocking
    async lpush(key: string, ...elements: any[]): Promise<number> {
        const current = await this.get<any[]>(key) || [];
        const newElements = elements.map(e => typeof e === 'string' ? e : JSON.stringify(e));
        const updated = [...newElements.reverse(), ...current];
        this.store.set(key, JSON.stringify(updated));
        return updated.length;
    }

    async lrange<T>(key: string, start: number, end: number): Promise<T[]> {
        const current = await this.get<any[]>(key) || [];
        // Handle Redis lrange logic (-1 means end)
        const actualEnd = end === -1 ? current.length : end + 1;
        return current.slice(start, actualEnd).map(item => {
            try { return JSON.parse(item); } catch { return item; }
        });
    }
}

// Client interface wrapper
type RedisClient = Redis | InMemoryRedis;

let redis: RedisClient | null = null;

function getRedis(): RedisClient {
    if (!redis) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (url && token) {
            redis = new Redis({ url, token });
        } else {
            console.warn('⚠️  UPSTASH_REDIS credentials missing. Using in-memory fallback (data will be lost on restart).');
            redis = new InMemoryRedis();
        }
    }
    return redis;
}

// Types
export interface ConfirmTokenData {
    email: string;
    payload: {
        results: any;
        recommendations: any;
    };
    createdAt: string;
    expiresAt: string;
    confirmedAt?: string;
}

export interface DownloadTokenData {
    email: string;
    payload: {
        results: any;
        recommendations: any;
    };
    createdAt: string;
    expiresAt: string;
    usedAt?: string;
}

export interface EmailStatus {
    subscribedAt: string;
    confirmedAt?: string;
    lastRequestAt: string;
}

// Helper: Generate secure token (Web Crypto compatible)
export function generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Hash email for key (Web Crypto compatible)
async function hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Confirm Token Operations
export async function createConfirmToken(
    email: string,
    payload: { results: any; recommendations: any }
): Promise<{ token: string; data: ConfirmTokenData }> {
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const data: ConfirmTokenData = {
        email,
        payload,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
    };

    const kv = getRedis();
    await kv.setex(`confirm:${token}`, 24 * 60 * 60, JSON.stringify(data));

    return { token, data };
}

export async function getConfirmToken(token: string): Promise<ConfirmTokenData | null> {
    const kv = getRedis();
    const data = await kv.get<string>(`confirm:${token}`);

    if (!data) return null;

    // Handle both object (from fallback) and string (from Redis) cases safely if implementation varies
    const parsed: ConfirmTokenData = typeof data === 'string' ? JSON.parse(data) : data;

    if (new Date(parsed.expiresAt) < new Date()) {
        await kv.del(`confirm:${token}`);
        return null;
    }

    return parsed;
}

export async function markConfirmTokenAsConfirmed(token: string): Promise<void> {
    const kv = getRedis();
    const data = await getConfirmToken(token);

    if (!data) throw new Error('Token not found');

    data.confirmedAt = new Date().toISOString();

    const ttl = await kv.ttl(`confirm:${token}`);
    if (ttl > 0) {
        await kv.setex(`confirm:${token}`, ttl, JSON.stringify(data));
    }
}

// Download Token Operations
export async function createDownloadToken(
    email: string,
    payload: { results: any; recommendations: any }
): Promise<{ token: string; data: DownloadTokenData }> {
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const data: DownloadTokenData = {
        email,
        payload,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
    };

    const kv = getRedis();
    await kv.setex(`download:${token}`, 24 * 60 * 60, JSON.stringify(data));

    return { token, data };
}

export async function getDownloadToken(token: string): Promise<DownloadTokenData | null> {
    const kv = getRedis();
    const data = await kv.get<string>(`download:${token}`);

    if (!data) return null;

    const parsed: DownloadTokenData = typeof data === 'string' ? JSON.parse(data) : data;

    if (new Date(parsed.expiresAt) < new Date()) {
        await kv.del(`download:${token}`);
        return null;
    }

    return parsed;
}

export async function markDownloadTokenAsUsed(token: string): Promise<void> {
    const kv = getRedis();
    const data = await getDownloadToken(token);

    if (!data) return;

    data.usedAt = new Date().toISOString();

    const ttl = await kv.ttl(`download:${token}`);
    if (ttl > 0) {
        await kv.setex(`download:${token}`, ttl, JSON.stringify(data));
    }
}

// Email Status Operations
export async function updateEmailStatus(email: string, updates: Partial<EmailStatus>): Promise<void> {
    const kv = getRedis();
    const key = `email:${await hashEmail(email)}`;

    const existing = await kv.get<string | EmailStatus>(key);
    const status: EmailStatus = existing
        ? (typeof existing === 'string' ? JSON.parse(existing) : existing)
        : {
            subscribedAt: new Date().toISOString(),
            lastRequestAt: new Date().toISOString(),
        };

    Object.assign(status, updates);
    status.lastRequestAt = new Date().toISOString();

    await kv.set(key, JSON.stringify(status));
}

// Event & Lead Storage
export async function storeEvent(eventData: any): Promise<void> {
    const kv = getRedis();
    // Use lpush to add to a list of events
    // For Upstash, lpush is supported. For InMemory, we implemented it.
    await kv.lpush('events_log', JSON.stringify(eventData));
}

export async function storeLead(lead: any): Promise<void> {
    const kv = getRedis();
    await kv.lpush('leads_log', JSON.stringify(lead));
}

export async function getLeads(): Promise<any[]> {
    const kv = getRedis();
    // Get last 100 leads
    return await kv.lrange('leads_log', 0, 99);
}
