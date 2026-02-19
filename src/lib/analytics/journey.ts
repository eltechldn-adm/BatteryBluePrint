export type JourneyEventName =
    | 'page_view'
    | 'article_view'
    | 'category_view'
    | 'calculator_view'
    | 'calculator_calculate'
    | 'calculator_reset_defaults'
    | 'calculator_country_sync' // Internal sync
    | 'country_change' // Global state change
    | 'cta_click'
    | 'outbound_click';

export interface JourneyEvent {
    id: string;
    ts: number;
    name: JourneyEventName;
    path: string;
    ref?: string;
    country?: string;
    meta?: Record<string, string | number | boolean | null>;
}

const STORAGE_KEY = 'bb_journey_v1';
const MAX_EVENTS = 500;

// Safe wrapper for localStorage
const getStorage = (): JourneyEvent[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.warn('Journey storage read error', e);
        return [];
    }
};

const setStorage = (events: JourneyEvent[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
        console.warn('Journey storage write error', e);
    }
};

export const track = (
    name: JourneyEventName,
    meta?: Record<string, string | number | boolean | null>
) => {
    if (typeof window === 'undefined') return;

    // Basic info
    const path = window.location.pathname;
    const ref = document.referrer ? new URL(document.referrer).hostname : undefined;

    // Try to grab country from existing localStorage if available/valid (best effort)
    // or relying on what's passed in meta if tracking a country change.
    // We won't tightly couple to the complex CountryProvider logic here to keep this pure.
    let country: string | undefined;
    try {
        // The CountryProvider saves to 'bb_country' presumably? 
        // Waiting for verify, but usually we can check standard keys if known. 
        // Actually, let's just leave it optional or rely on the caller to pass it in meta if critical.
        // Requirement says: "country?: string; // ISO code if known"
        // Let's try to read our persistent country key if it exists.
        // Looking at previous context, CountryProvider uses persistence independently. 
        // We will leave it as optional for now or pass it from the context where convenient.
    } catch { }

    const event: JourneyEvent = {
        id: crypto.randomUUID(),
        ts: Date.now(),
        name,
        path,
        ref: ref !== window.location.hostname ? ref : undefined,
        country, // caller can enrich this if needed, or we implement a getter later
        meta,
    };

    const events = getStorage();
    // Prepend new event
    const updated = [event, ...events].slice(0, MAX_EVENTS);
    setStorage(updated);

    // Dev log
    if (process.env.NODE_ENV === 'development') {
        console.log('[Journey]', name, meta);
    }
};

export const getEvents = (): JourneyEvent[] => {
    return getStorage();
};

export const clearEvents = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
};

export const summarize = () => {
    const events = getEvents();

    const counts: Record<string, number> = {};
    const topPaths: Record<string, number> = {};
    const topCtas: Record<string, number> = {};
    let calcUsage = 0;

    events.forEach(e => {
        // Counts by name
        counts[e.name] = (counts[e.name] || 0) + 1;

        // Top paths (for page views)
        if (e.name === 'page_view' || e.name === 'article_view') {
            topPaths[e.path] = (topPaths[e.path] || 0) + 1;
        }

        if (e.name === 'calculator_calculate') {
            calcUsage++;
        }

        if (e.name === 'cta_click' && e.meta?.cta) {
            const ctaKey = String(e.meta.cta);
            topCtas[ctaKey] = (topCtas[ctaKey] || 0) + 1;
        }
    });

    return {
        totalEvents: events.length,
        counts,
        topPaths: Object.entries(topPaths).sort((a, b) => b[1] - a[1]).slice(0, 10),
        topCtas: Object.entries(topCtas).sort((a, b) => b[1] - a[1]).slice(0, 5),
        calcUsage,
    };
};

export const exportJSON = (): string => {
    return JSON.stringify(getEvents(), null, 2);
};

export const exportCSV = (): string => {
    const events = getEvents();
    if (events.length === 0) return '';

    const header = 'ts,iso_time,name,path,country,meta_json\n';
    const rows = events.map(e => {
        const safeMeta = e.meta ? JSON.stringify(e.meta).replace(/"/g, '""') : '';
        return `${e.ts},"${new Date(e.ts).toISOString()}","${e.name}","${e.path}","${e.country || ''}","${safeMeta}"`;
    });

    return header + rows.join('\n');
};
