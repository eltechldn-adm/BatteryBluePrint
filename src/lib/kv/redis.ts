import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Initialize Redis client (lazy to avoid build-time errors)
let redis: Redis | null = null;

function getRedis(): Redis {
    if (!redis) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
        }

        redis = new Redis({
            url,
            token,
        });
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

// Helper: Generate secure token
export function generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Helper: Hash email for key
function hashEmail(email: string): string {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
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

    // Store with 24h TTL
    await kv.setex(`confirm:${token}`, 24 * 60 * 60, JSON.stringify(data));

    return { token, data };
}

export async function getConfirmToken(token: string): Promise<ConfirmTokenData | null> {
    const kv = getRedis();
    const data = await kv.get<string>(`confirm:${token}`);

    if (!data) return null;

    const parsed: ConfirmTokenData = JSON.parse(data);

    // Check expiration
    if (new Date(parsed.expiresAt) < new Date()) {
        await kv.del(`confirm:${token}`);
        return null;
    }

    return parsed;
}

export async function markConfirmTokenAsConfirmed(token: string): Promise<void> {
    const kv = getRedis();
    const data = await getConfirmToken(token);

    if (!data) {
        throw new Error('Token not found');
    }

    data.confirmedAt = new Date().toISOString();

    // Update with remaining TTL
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

    // Store with 24h TTL
    await kv.setex(`download:${token}`, 24 * 60 * 60, JSON.stringify(data));

    return { token, data };
}

export async function getDownloadToken(token: string): Promise<DownloadTokenData | null> {
    const kv = getRedis();
    const data = await kv.get<string>(`download:${token}`);

    if (!data) return null;

    const parsed: DownloadTokenData = JSON.parse(data);

    // Check expiration
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

    // Update with remaining TTL
    const ttl = await kv.ttl(`download:${token}`);
    if (ttl > 0) {
        await kv.setex(`download:${token}`, ttl, JSON.stringify(data));
    }
}

// Email Status Operations
export async function updateEmailStatus(email: string, updates: Partial<EmailStatus>): Promise<void> {
    const kv = getRedis();
    const key = `email:${hashEmail(email)}`;

    const existing = await kv.get<string>(key);
    const status: EmailStatus = existing ? JSON.parse(existing) : {
        subscribedAt: new Date().toISOString(),
        lastRequestAt: new Date().toISOString(),
    };

    Object.assign(status, updates);
    status.lastRequestAt = new Date().toISOString();

    // No expiration for email status
    await kv.set(key, JSON.stringify(status));
}

export async function getEmailStatus(email: string): Promise<EmailStatus | null> {
    const kv = getRedis();
    const key = `email:${hashEmail(email)}`;
    const data = await kv.get<string>(key);

    if (!data) return null;

    return JSON.parse(data);
}
