/**
 * src/lib/retention/session.ts
 *
 * Session management for BatteryBlueprint.
 *
 * Rules:
 * - Project list is stored in sessionStorage (cleared on tab/browser close).
 * - A session expiry timestamp is stored in localStorage.
 * - Session lasts 1 hour from last activity.
 * - On page load: if session has expired → wipe project list, reset expiry.
 *                 if session is still valid → extend expiry by 1 hour.
 * - Static-export safe. No PII. No backend.
 */

const SESSION_EXPIRY_KEY = "bb_session_expires_at";
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

// ─── Safe storage helpers ─────────────────────────────────────────────────────

function lsGetRaw(key: string): string | null {
    if (typeof window === "undefined") return null;
    try { return window.localStorage.getItem(key); } catch { return null; }
}

function lsSetRaw(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(key, value); } catch { /* quota exceeded — degrade */ }
}

function ssRemove(key: string): void {
    if (typeof window === "undefined") return;
    try { window.sessionStorage.removeItem(key); } catch { /* no-op */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get the raw expiry timestamp from localStorage, or null if not set.
 */
export function getSessionExpiresAt(): Date | null {
    const raw = lsGetRaw(SESSION_EXPIRY_KEY);
    if (!raw) return null;
    const ts = parseInt(raw, 10);
    if (isNaN(ts)) return null;
    return new Date(ts);
}

/**
 * Returns true if the session is currently active (not expired).
 */
export function isSessionActive(): boolean {
    const expires = getSessionExpiresAt();
    if (!expires) return false;
    return Date.now() < expires.getTime();
}

/**
 * Returns the number of milliseconds remaining in the session.
 * Returns 0 if expired or no session exists.
 */
export function getSessionRemainingMs(): number {
    const expires = getSessionExpiresAt();
    if (!expires) return 0;
    return Math.max(0, expires.getTime() - Date.now());
}

/**
 * Format remaining session time as a human-readable string e.g. "42 min".
 */
export function formatSessionRemaining(): string {
    const ms = getSessionRemainingMs();
    if (ms <= 0) return "Expired";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
        return `${minutes} min ${seconds}s`;
    }
    return `${seconds}s`;
}

/**
 * Extend the session expiry by SESSION_DURATION_MS from now.
 * Called on every page load when the session is still valid.
 */
export function renewSession(): void {
    const newExpiry = Date.now() + SESSION_DURATION_MS;
    lsSetRaw(SESSION_EXPIRY_KEY, String(newExpiry));
}

/**
 * Clear the project list from sessionStorage and start a fresh session expiry.
 * Called when an expired session is detected on load.
 */
export function clearExpiredSession(projectListKey: string): void {
    ssRemove(projectListKey);
    lsSetRaw("bb_project_v1", ""); // Wipe active project on session expiry
    renewSession();
}

/**
 * Check session state on mount and take the appropriate action.
 *
 * - If no session exists: create one (first visit).
 * - If session is still valid: renew it.
 * - If session has expired: clear the project list from sessionStorage, renew.
 *
 * Returns whether the session was expired (and therefore reset) this call.
 */
export function checkAndRenewSession(projectListKey: string): boolean {
    const expires = getSessionExpiresAt();

    if (!expires) {
        // First visit ever
        renewSession();
        return false;
    }

    if (Date.now() >= expires.getTime()) {
        // Session has expired — wipe project list
        clearExpiredSession(projectListKey);
        return true; // was reset
    }

    // Still active — extend
    renewSession();
    return false;
}
