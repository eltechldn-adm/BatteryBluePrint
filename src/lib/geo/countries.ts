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
 * Timezone is checked first — it reflects physical location, not UI language preference.
 * Language tag is used as a fallback when timezone is ambiguous.
 */
export function mapNavigatorToCountry(language: string, timeZone?: string): string {
    // 1. Timezone-based detection FIRST — most accurate (physical location, not UI language)
    if (timeZone) {
        if (timeZone === 'Europe/London' || timeZone === 'Europe/Belfast') return 'GB';
        if (timeZone === 'Europe/Berlin' || timeZone === 'Europe/Busingen') return 'DE';
        if (timeZone === 'Europe/Madrid') return 'ES';
        if (timeZone === 'Europe/Rome') return 'IT';
        if (timeZone === 'Europe/Amsterdam') return 'NL';
        if (timeZone === 'Asia/Singapore') return 'SG';
        if (timeZone === 'Africa/Johannesburg') return 'ZA';
        if (timeZone.startsWith('Australia/')) return 'AU';
        // Canadian timezones
        if (
            timeZone === 'America/Toronto' ||
            timeZone === 'America/Vancouver' ||
            timeZone === 'America/Winnipeg' ||
            timeZone === 'America/Halifax' ||
            timeZone === 'America/St_Johns' ||
            timeZone === 'America/Regina' ||
            timeZone === 'America/Edmonton' ||
            timeZone.startsWith('Canada/')
        ) return 'CA';
        // Mexican timezones — fall through to language or default
        if (
            timeZone === 'America/Mexico_City' ||
            timeZone === 'America/Tijuana' ||
            timeZone === 'America/Cancun' ||
            timeZone === 'America/Chihuahua'
        ) { /* fall through */ }
        // All other America/ timezones → US
        else if (timeZone.startsWith('America/')) return 'US';
    }

    // 2. Language tag region as fallback (e.g. "en-GB" → GB, "de-DE" → DE)
    const region = language.split('-')[1]?.toUpperCase();
    if (region && SUPPORTED_COUNTRIES[region]) {
        return region;
    }

    // 3. Base language fallback for unambiguous languages
    const baseLang = language.split('-')[0].toLowerCase();
    if (baseLang === 'de') return 'DE';
    if (baseLang === 'it') return 'IT';
    if (baseLang === 'nl') return 'NL';

    // Default
    return DEFAULT_COUNTRY_CODE;
}
