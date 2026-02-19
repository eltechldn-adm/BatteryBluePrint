export interface Country {
    code: string;
    name: string;
    currency: string;
    units: 'metric' | 'imperial';
    locale: string;
    defaultElectricityUnit: string; // e.g. "p/kWh" or "¢/kWh"
    flag: string;
}

export const SUPPORTED_COUNTRIES: Record<string, Country> = {
    GB: {
        code: 'GB',
        name: 'United Kingdom',
        currency: 'GBP',
        units: 'metric',
        locale: 'en-GB',
        defaultElectricityUnit: 'p/kWh',
        flag: '🇬🇧',
    },
    US: {
        code: 'US',
        name: 'United States',
        currency: 'USD',
        units: 'imperial',
        locale: 'en-US',
        defaultElectricityUnit: '¢/kWh',
        flag: '🇺🇸',
    },
    AU: {
        code: 'AU',
        name: 'Australia',
        currency: 'AUD',
        units: 'metric',
        locale: 'en-AU',
        defaultElectricityUnit: 'c/kWh', // Australian cents
        flag: '🇦🇺',
    },
    CA: {
        code: 'CA',
        name: 'Canada',
        currency: 'CAD',
        units: 'metric',
        locale: 'en-CA',
        defaultElectricityUnit: '¢/kWh',
        flag: '🇨🇦',
    },
    DE: {
        code: 'DE',
        name: 'Germany',
        currency: 'EUR',
        units: 'metric',
        locale: 'de-DE',
        defaultElectricityUnit: '€/kWh', // Or ct/kWh
        flag: '🇩🇪',
    },
    ES: {
        code: 'ES',
        name: 'Spain',
        currency: 'EUR',
        units: 'metric',
        locale: 'es-ES',
        defaultElectricityUnit: '€/kWh',
        flag: '🇪🇸',
    },
    IT: {
        code: 'IT',
        name: 'Italy',
        currency: 'EUR',
        units: 'metric',
        locale: 'it-IT',
        defaultElectricityUnit: '€/kWh',
        flag: '🇮🇹',
    },
    NL: {
        code: 'NL',
        name: 'Netherlands',
        currency: 'EUR',
        units: 'metric',
        locale: 'nl-NL',
        defaultElectricityUnit: '€/kWh',
        flag: '🇳🇱',
    },
    SG: {
        code: 'SG',
        name: 'Singapore',
        currency: 'SGD',
        units: 'metric',
        locale: 'en-SG',
        defaultElectricityUnit: '¢/kWh',
        flag: '🇸🇬',
    },
    ZA: {
        code: 'ZA',
        name: 'South Africa',
        currency: 'ZAR',
        units: 'metric',
        locale: 'en-ZA',
        defaultElectricityUnit: 'R/kWh',
        flag: '🇿🇦',
    },
};

export const DEFAULT_COUNTRY_CODE = 'GB';

/**
 * Best-effort mapping of navigator language/timezone to a supported country.
 * Returns a supported country code or the default.
 */
export function mapNavigatorToCountry(language: string, timeZone?: string): string {
    // 1. Try explicit region in language tag (e.g. "en-GB")
    const region = language.split('-')[1]?.toUpperCase();
    if (region && SUPPORTED_COUNTRIES[region]) {
        return region;
    }

    // 2. Heuristics based on TimeZone (if available)
    if (timeZone) {
        if (timeZone.startsWith('Europe/London')) return 'GB';
        if (timeZone.startsWith('America/New_York')) return 'US';
        if (timeZone.startsWith('America/Los_Angeles')) return 'US';
        if (timeZone.startsWith('America/Chicago')) return 'US';
        if (timeZone.startsWith('America/Denver')) return 'US';
        if (timeZone.startsWith('Australia/')) return 'AU';
        if (timeZone.startsWith('Canada/')) return 'CA'; // Covers Atlantic, Central, etc.
        if (timeZone === 'Europe/Berlin') return 'DE';
        if (timeZone === 'Europe/Madrid') return 'ES';
        if (timeZone === 'Europe/Rome') return 'IT';
        if (timeZone === 'Europe/Amsterdam') return 'NL';
        if (timeZone === 'Asia/Singapore') return 'SG';
        if (timeZone === 'Africa/Johannesburg') return 'ZA';
    }

    // 3. Fallback based on base language if no specific region
    //    (This is imprecise, so we use it as a last resort before default)
    const baseLang = language.split('-')[0].toLowerCase();
    if (baseLang === 'de') return 'DE'; // German -> Germany (likely)
    if (baseLang === 'it') return 'IT';
    if (baseLang === 'nl') return 'NL';

    // Default to GB if all else fails
    return DEFAULT_COUNTRY_CODE;
}
