import { getRequestContext } from '@cloudflare/next-on-pages';

export interface BlueprintToken {
    id: string;
    token: string;
    email: string;
    payload: {
        results: any;
        recommendations: any;
    };
    expiresAt: string;
    createdAt: string;
    usedAt?: string;
    confirmedAt?: string;
    type: 'confirm' | 'download';
}

export interface EmailStatus {
    subscribedAt: string;
    confirmedAt?: string;
    lastRequestAt: string;
}

// Generate secure random token using Web Crypto
export function generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Hash email for key
async function hashEmail(email: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// KV Helper to get the correct namespace/binding
function getKV() {
    try {
        const env = getRequestContext().env as unknown as CloudflareEnv;
        if (!env || !env.BATTERYBLUEPRINT_KV) {
            // Fallback for local dev if bindings aren't set up or we are not in Pages runtime yet
            // Warning: This implies local dev needs `wrangler pages dev` or a mock.
            // For safety, we can throw or return a mock interface if needed.
            if (process.env.NODE_ENV === 'development') {
                console.warn('BATTERYBLUEPRINT_KV not found. Returning shim (data will not persist).');
                return createInMemoryShim();
            }
            throw new Error('BATTERYBLUEPRINT_KV binding not found');
        }
        return env.BATTERYBLUEPRINT_KV;
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            return createInMemoryShim();
        }
        throw e;
    }
}

// In-Memory Shim for Local Dev (when not running with wrangler binding)
const inMemoryStore = new Map<string, string>();
function createInMemoryShim() {
    return {
        put: async (key: string, value: string, options?: { expirationTtl?: number }) => {
            inMemoryStore.set(key, value);
        },
        get: async (key: string) => {
            return inMemoryStore.get(key) || null;
        },
        delete: async (key: string) => {
            inMemoryStore.delete(key);
        }
    } as unknown as KVNamespace;
}

// Low-level operations
export async function putToken(type: 'confirm' | 'download', tokenData: BlueprintToken): Promise<void> {
    const kv = getKV();
    const key = `${type}:${tokenData.token}`;
    // Store for 24 hours (86400 seconds)
    await kv.put(key, JSON.stringify(tokenData), { expirationTtl: 86400 });
}

export async function getToken(type: 'confirm' | 'download', token: string): Promise<BlueprintToken | null> {
    const kv = getKV();
    const key = `${type}:${token}`;
    const data = await kv.get(key);

    if (!data) return null;

    try {
        const parsed = JSON.parse(data) as BlueprintToken;
        if (new Date(parsed.expiresAt) < new Date()) {
            await kv.delete(key);
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

export async function markUsed(type: 'confirm' | 'download', token: string): Promise<void> {
    const data = await getToken(type, token);
    if (data) {
        data.usedAt = new Date().toISOString();
        await putToken(type, data);
    }
}

// High-level Operations (matching previous Redis interface for easier migration)

export async function createConfirmToken(
    email: string,
    payload: { results: any; recommendations: any }
): Promise<{ token: string; data: BlueprintToken }> {
    const tokenStr = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const tokenData: BlueprintToken = {
        id: `token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        token: tokenStr,
        email,
        payload,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        type: 'confirm'
    };

    await putToken('confirm', tokenData);
    return { token: tokenStr, data: tokenData };
}

export async function getConfirmToken(token: string): Promise<BlueprintToken | null> {
    return getToken('confirm', token);
}

export async function markConfirmTokenAsConfirmed(token: string): Promise<void> {
    const data = await getToken('confirm', token);
    if (!data) throw new Error('Token not found');

    // In the KV model, we might essentially just want to ensure it existed. 
    // The previous logic marked it confirmed. 
    // We can update it or just delete it if we are creating a download token immediately after.
    // User requirement says "markUsed".
    // Let's just update `usedAt` or `confirmedAt` equivalent.
    // Since BlueprintToken interface has usedAt, let's use that or add `confirmedAt` field if we want strict compatibility.
    // But wait, the previous interface had `confirmedAt`.
    // Let's add `confirmedAt` to BlueprintToken interface? 
    // Actually the interface above has `usedAt`. 
    // Let's stick to `markUsed` logic for simplicity or add `confirmedAt` property to `BlueprintToken`.
    // Let's assume `usedAt` is sufficient for "confirmed/used" status.

    await markUsed('confirm', token);
}

export async function createDownloadToken(
    email: string,
    payload: { results: any; recommendations: any }
): Promise<{ token: string; data: BlueprintToken }> {
    const tokenStr = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const tokenData: BlueprintToken = {
        id: `token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        token: tokenStr,
        email,
        payload,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        type: 'download'
    };

    await putToken('download', tokenData);
    return { token: tokenStr, data: tokenData };
}

export async function getDownloadToken(token: string): Promise<BlueprintToken | null> {
    return getToken('download', token);
}

export async function markDownloadTokenAsUsed(token: string): Promise<void> {
    await markUsed('download', token);
}

export async function updateEmailStatus(email: string, updates: Partial<EmailStatus>): Promise<void> {
    const kv = getKV();
    const emailHash = await hashEmail(email);
    const key = `email:${emailHash}`;

    const existing = await kv.get(key);
    let status: EmailStatus = existing ? JSON.parse(existing) : {
        subscribedAt: new Date().toISOString(),
        lastRequestAt: new Date().toISOString()
    };

    status = { ...status, ...updates, lastRequestAt: new Date().toISOString() };
    await kv.put(key, JSON.stringify(status));
}
