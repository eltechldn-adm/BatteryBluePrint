/**
 * Analytics Event Tracker
 * 
 * Lightweight event tracking system that:
 * 1. Stores events in localStorage (dev/debugging)
 * 2. Sends events to /api/events for server-side logging
 * 3. Can be extended to support GA4, PostHog, etc.
 */

export type AnalyticsEvent =
  | 'CALC_COMPLETED'
  | 'PDF_MODAL_OPENED'
  | 'PDF_EMAIL_SUBMITTED'
  | 'PDF_DOWNLOADED'
  | 'PDF_DOWNLOADED_DIRECT'
  | 'INSTALLER_LEAD_CLICKED'
  | 'AFFINITY_TIER_CLICKED'
  | 'GUIDE_OPENED'
  | 'PAGE_VIEW';

export interface EventData {
  event: AnalyticsEvent;
  timestamp: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
}

class Analytics {
  private sessionId: string;
  private isDev: boolean;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.isDev = process.env.NODE_ENV === 'development';
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    let sessionId = sessionStorage.getItem('bb_session_id');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('bb_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Track an analytics event
   */
  track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
    const eventData: EventData = {
      event,
      timestamp: new Date().toISOString(),
      properties,
      sessionId: this.sessionId,
    };

    // Store in localStorage for dev debugging
    if (typeof window !== 'undefined') {
      this.storeLocalEvent(eventData);
    }

    // Send to server
    this.sendToServer(eventData);

    // Log in dev
    if (this.isDev) {
      console.log('[Analytics]', event, properties);
    }
  }

  private storeLocalEvent(eventData: EventData): void {
    try {
      const storageKey = 'bb_analytics_events';
      const stored = localStorage.getItem(storageKey);
      const events: EventData[] = stored ? JSON.parse(stored) : [];

      // Keep only last 100 events
      events.push(eventData);
      if (events.length > 100) {
        events.shift();
      }

      localStorage.setItem(storageKey, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to store event:', error);
    }
  }

  private async sendToServer(eventData: EventData): Promise<void> {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      // Fail silently - don't break user experience
      if (this.isDev) {
        console.error('Failed to send event to server:', error);
      }
    }
  }

  /**
   * Get all stored events (for debugging)
   */
  getStoredEvents(): EventData[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem('bb_analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear stored events
   */
  clearStoredEvents(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('bb_analytics_events');
  }
}

// Singleton instance
export const analytics = new Analytics();
