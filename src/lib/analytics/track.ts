import { track, JourneyEventName } from "@/lib/analytics/journey";

// Shim to redirect legacy analytics calls to the new Journey system
// This ensures we have a single source of truth (localStorage: bb_journey_v1)
// and avoids duplication while preserving existing call sites.

export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    // Cast string to JourneyEventName if it matches, otherwise it might be typed loosely in legacy
    // We assume the legacy events are now in JourneyEventName
    track(event as JourneyEventName, properties);
  }
};

export type AnalyticsEvent = JourneyEventName;
