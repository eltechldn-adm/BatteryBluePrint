import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

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
}

const DATA_DIR = join(process.cwd(), '.data');
const TOKENS_FILE = join(DATA_DIR, 'blueprint-tokens.jsonl');

// Ensure data directory exists
async function ensureDataDir() {
    if (!existsSync(DATA_DIR)) {
        await mkdir(DATA_DIR, { recursive: true });
    }
}

// Generate secure random token
export function generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Create a new token
export async function createToken(
    email: string,
    payload: { results: any; recommendations: any }
): Promise<BlueprintToken> {
    await ensureDataDir();

    const token: BlueprintToken = {
        id: `token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        token: generateToken(),
        email,
        payload,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        createdAt: new Date().toISOString(),
    };

    // Append token as JSON line
    const tokenLine = JSON.stringify(token) + '\n';

    if (existsSync(TOKENS_FILE)) {
        const existing = await readFile(TOKENS_FILE, 'utf-8');
        await writeFile(TOKENS_FILE, existing + tokenLine);
    } else {
        await writeFile(TOKENS_FILE, tokenLine);
    }

    return token;
}

// Get token by token string
export async function getToken(tokenString: string): Promise<BlueprintToken | null> {
    if (!existsSync(TOKENS_FILE)) {
        return null;
    }

    const content = await readFile(TOKENS_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.length > 0);

    for (const line of lines) {
        try {
            const token = JSON.parse(line) as BlueprintToken;
            if (token.token === tokenString) {
                // Check if expired
                if (new Date(token.expiresAt) < new Date()) {
                    return null;
                }
                return token;
            }
        } catch {
            continue;
        }
    }

    return null;
}

// Mark token as used (optional - we allow multiple downloads)
export async function markTokenAsUsed(tokenString: string): Promise<void> {
    if (!existsSync(TOKENS_FILE)) {
        return;
    }

    const content = await readFile(TOKENS_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.length > 0);

    const updatedLines = lines.map(line => {
        try {
            const token = JSON.parse(line) as BlueprintToken;
            if (token.token === tokenString && !token.usedAt) {
                token.usedAt = new Date().toISOString();
                return JSON.stringify(token);
            }
            return line;
        } catch {
            return line;
        }
    });

    await writeFile(TOKENS_FILE, updatedLines.join('\n') + '\n');
}

// Cleanup expired tokens (run periodically)
export async function cleanupExpiredTokens(): Promise<number> {
    if (!existsSync(TOKENS_FILE)) {
        return 0;
    }

    const content = await readFile(TOKENS_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.length > 0);
    const now = new Date();

    const validLines: string[] = [];
    let removed = 0;

    for (const line of lines) {
        try {
            const token = JSON.parse(line) as BlueprintToken;
            if (new Date(token.expiresAt) >= now) {
                validLines.push(line);
            } else {
                removed++;
            }
        } catch {
            // Keep malformed lines
            validLines.push(line);
        }
    }

    if (removed > 0) {
        await writeFile(TOKENS_FILE, validLines.join('\n') + '\n');
    }

    return removed;
}
