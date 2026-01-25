/**
 * DEPRECATED: Use src/lib/analytics/track.ts instead
 * This file is kept for backward compatibility
 */

import { analytics, type AnalyticsEvent } from './track';

export type { AnalyticsEvent };

export function trackEvent(event: AnalyticsEvent, data?: Record<string, string | number | boolean>) {
    analytics.track(event, data);
}
