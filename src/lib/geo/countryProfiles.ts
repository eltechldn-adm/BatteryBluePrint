import { SUPPORTED_COUNTRIES } from './countries';

export interface CountryProfile {
    countryCode: string; // e.g. "GB"
    regionId: string;    // Maps to existing LOCATION_PROFILES.id (e.g. "uk")
    currencyCode: string;
    locale: string;
    defaults: {
        electricityRate: number;
        electricityUnit: string; // e.g. "p/kWh"
        exportRate?: number;
    }
}

/**
 * Maps global country codes (ISO alpha-2) to Calculator-specific region profiles.
 * This ensures the transparent global selector drives the calculator defaults.
 */
export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
    GB: {
        countryCode: 'GB',
        regionId: 'uk',
        currencyCode: 'GBP',
        locale: 'en-GB',
        defaults: {
            electricityRate: 0.28,
            electricityUnit: 'p/kWh',
            exportRate: 0.15
        }
    },
    US: {
        countryCode: 'US',
        regionId: 'us',
        currencyCode: 'USD',
        locale: 'en-US',
        defaults: {
            electricityRate: 0.16,
            electricityUnit: '¢/kWh',
            exportRate: 0.05
        }
    },
    AU: {
        countryCode: 'AU',
        regionId: 'au',
        currencyCode: 'AUD',
        locale: 'en-AU',
        defaults: {
            electricityRate: 0.30,
            electricityUnit: 'c/kWh',
            exportRate: 0.05
        }
    },
    CA: {
        countryCode: 'CA',
        regionId: 'ca',
        currencyCode: 'CAD',
        locale: 'en-CA',
        defaults: {
            electricityRate: 0.14,
            electricityUnit: '¢/kWh',
            exportRate: 0.05
        }
    },
    DE: {
        countryCode: 'DE',
        regionId: 'de',
        currencyCode: 'EUR',
        locale: 'de-DE',
        defaults: {
            electricityRate: 0.35,
            electricityUnit: '€/kWh',
            exportRate: 0.08
        }
    },
    ES: {
        countryCode: 'ES',
        regionId: 'global', // Fallback for now if 'es' region doesn't exist in calculator
        currencyCode: 'EUR',
        locale: 'es-ES',
        defaults: {
            electricityRate: 0.25,
            electricityUnit: '€/kWh',
            exportRate: 0.05
        }
    },
    IT: {
        countryCode: 'IT',
        regionId: 'global',
        currencyCode: 'EUR',
        locale: 'it-IT',
        defaults: {
            electricityRate: 0.30,
            electricityUnit: '€/kWh',
            exportRate: 0.05
        }
    },
    NL: {
        countryCode: 'NL',
        regionId: 'global',
        currencyCode: 'EUR',
        locale: 'nl-NL',
        defaults: {
            electricityRate: 0.30,
            electricityUnit: '€/kWh',
            exportRate: 0.09
        }
    },
    SG: {
        countryCode: 'SG',
        regionId: 'global',
        currencyCode: 'SGD',
        locale: 'en-SG',
        defaults: {
            electricityRate: 0.30,
            electricityUnit: '¢/kWh',
            exportRate: 0.10
        }
    },
    ZA: {
        countryCode: 'ZA',
        regionId: 'za',
        currencyCode: 'ZAR',
        locale: 'en-ZA',
        defaults: {
            electricityRate: 2.50,
            electricityUnit: 'R/kWh',
            exportRate: 0.00
        }
    },
};

export const DEFAULT_PROFILE = COUNTRY_PROFILES['GB'];

export function getProfileForCountry(countryCode: string): CountryProfile {
    return COUNTRY_PROFILES[countryCode] || DEFAULT_PROFILE;
}
