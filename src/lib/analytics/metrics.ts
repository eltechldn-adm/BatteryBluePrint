import { getRedisClient } from '@/lib/kv/redis';

export interface AnalyticsSummary {
    totalLeads: number;
    totalEvents: number;
    calculatorSubmissions: number;
    eventsLast7Days: { date: string; count: number }[];
    topEventTypes: { type: string; count: number }[];
    recentEvents: any[];
}

export interface DailyReportSummary {
    timestamp: string;
    period: string;
    metrics: {
        totalLeads24h: number;
        totalEvents24h: number;
        calculatorSubmissions24h: number;
        blueprintDownloads24h: number;
    };
    topEventTypes: { type: string; count: number }[];
}

/**
 * Get total number of leads stored
 */
export async function getTotalLeads(): Promise<number> {
    const kv = getRedisClient();
    return await kv.llen('leads_log');
}

/**
 * Get total number of events stored
 */
export async function getTotalEvents(): Promise<number> {
    const kv = getRedisClient();
    return await kv.llen('events_log');
}

/**
 * Get raw recent events
 */
export async function getRecentEvents(limit: number = 100): Promise<any[]> {
    const kv = getRedisClient();
    const currentLength = await kv.llen('events_log');

    // Redis lrange is inclusive. Get the last N items.
    // However, our lpush architecture puts the newest at the HEAD (index 0)?
    // Let's verify standard lpush behavior: LPUSH puts at head. LRANGE 0 N gets the newest N.
    return await kv.lrange('events_log', 0, limit - 1);
}

/**
 * Get Full Analytics Dashboard Data
 * (Aggregates data in memory since we are using a simple list log structure)
 * Note: As the app scales, this should be moved to a proper time-series DB or specialized Redis keys.
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const kv = getRedisClient();

    // Fetch counts
    const totalLeads = await kv.llen('leads_log');
    const totalEvents = await kv.llen('events_log');

    // Fetch last ~2000 events for detailed stats (limit to prevent timeout on massive logs)
    // In production with high volume, we'd need a specific 'daily_stats' key structure.
    // For now, this meets the requirement "Must use existing Upstash Redis storage" without complex migrations.
    const sampleSize = 2000;
    const rawEvents = await kv.lrange<any>('events_log', 0, sampleSize - 1);

    let calculatorSubmissions = 0;
    const eventTypeCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};

    // Initialize last 7 days with 0
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyCounts[dateStr] = 0;
    }

    // Process events
    rawEvents.forEach(event => {
        // Count Calc Submissions
        if (event.type === 'calculator_submit' || event.action === 'calculator_submit') {
            calculatorSubmissions++;
        }

        // Count Top Types
        const type = event.type || event.action || 'unknown';
        eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;

        // Count Daily
        if (event.timestamp) {
            const dateStr = new Date(event.timestamp).toISOString().split('T')[0];
            if (dailyCounts[dateStr] !== undefined) {
                dailyCounts[dateStr]++;
            }
        }
    });

    // Format Top Events
    const topEventTypes = Object.entries(eventTypeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({ type, count }));

    // Format Daily Stats (reverse chronological for chart/table)
    const eventsLast7Days = Object.entries(dailyCounts)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB)) // Sort chronological
        .map(([date, count]) => ({ date, count }));

    return {
        totalLeads,
        totalEvents,
        calculatorSubmissions,
        eventsLast7Days,
        topEventTypes,
        recentEvents: rawEvents.slice(0, 50) // Return top 50 for the table
    };
}

export async function getDailySummary(): Promise<DailyReportSummary> {
    const kv = getRedisClient();
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);

    // Fetch sample of logs (assuming < 5000 events/day for now)
    const eventLogs = await kv.lrange<any>('events_log', 0, 4999);
    const leadLogs = await kv.lrange<any>('leads_log', 0, 999);

    // Filter last 24h
    const recentEvents = eventLogs.filter(e => {
        if (!e.timestamp) return false;
        return new Date(e.timestamp).getTime() > twentyFourHoursAgo;
    });
    const recentLeads = leadLogs.filter(l => {
        if (!l.timestamp) return false;
        return new Date(l.timestamp).getTime() > twentyFourHoursAgo;
    });

    // Calc Submissions
    const calculatorSubmissions = recentEvents.filter(e =>
        e.type === 'calculator_submit' || e.action === 'calculator_submit'
    ).length;

    // Blueprint Downloads
    const blueprintDownloads = recentEvents.filter(e =>
        e.type === 'blueprint_download'
    ).length;

    // Top Event Types
    const typeCounts: Record<string, number> = {};
    recentEvents.forEach(e => {
        const type = e.type || e.action || 'unknown';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const topEventTypes = Object.entries(typeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([type, count]) => ({ type, count }));

    return {
        timestamp: new Date().toISOString(),
        period: 'Last 24 Hours',
        metrics: {
            totalLeads24h: recentLeads.length,
            totalEvents24h: recentEvents.length,
            calculatorSubmissions24h: calculatorSubmissions,
            blueprintDownloads24h: blueprintDownloads
        },
        topEventTypes
    };
}
