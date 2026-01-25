export interface LocationProfile {
    id: string;
    label: string;
    countryCode: string;
    electricalStandard: {
        voltage: string;
        phase: 'split-phase' | 'single-phase' | 'three-phase';
        frequencyHz: 50 | 60;
    };
    defaults: {
        dod: number;
        inverterEfficiency: number;
        reserveBuffer: number;
        winterBuffer: number;
    };
    copy: {
        winterLabel: string;
        inverterNote: string;
        disclaimerExtra?: string;
    };
    regionAvailabilityTag: string;
}

export const LOCATION_PROFILES: LocationProfile[] = [
    {
        id: 'us',
        label: 'United States',
        countryCode: 'US',
        electricalStandard: {
            voltage: '120/240V',
            phase: 'split-phase',
            frequencyHz: 60,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.20,
        },
        copy: {
            winterLabel: 'Winter / Low-Sun Buffer',
            inverterNote: 'US homes use 120/240V split-phase. Ensure your inverter continuous kW rating exceeds peak loads (AC startup, EV charging, electric range). Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult a licensed electrician for NEC compliance and permit requirements.',
        },
        regionAvailabilityTag: 'US',
    },
    {
        id: 'uk',
        label: 'United Kingdom',
        countryCode: 'GB',
        electricalStandard: {
            voltage: '230V',
            phase: 'single-phase',
            frequencyHz: 50,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.20, // UK winters
        },
        copy: {
            winterLabel: 'Winter / Low-Sun Buffer',
            inverterNote: 'UK homes typically use 230V single-phase (some 3-phase). Ensure your inverter continuous kW exceeds peak loads (immersion heater, heat pump, EV charger). Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult a qualified electrician for BS 7671 compliance and DNO notification.',
        },
        regionAvailabilityTag: 'UK',
    },
    {
        id: 'ca',
        label: 'Canada',
        countryCode: 'CA',
        electricalStandard: {
            voltage: '120/240V',
            phase: 'split-phase',
            frequencyHz: 60,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.30, // Canadian winters are harsh
        },
        copy: {
            winterLabel: 'Winter / Cold Climate Buffer',
            inverterNote: 'Canadian homes use 120/240V split-phase. Ensure your inverter continuous kW exceeds peak loads (block heater, heat pump, EV charging). Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult a licensed electrician for CEC compliance and local utility interconnection rules.',
        },
        regionAvailabilityTag: 'CA',
    },
    {
        id: 'au',
        label: 'Australia',
        countryCode: 'AU',
        electricalStandard: {
            voltage: '230V',
            phase: 'single-phase',
            frequencyHz: 50,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.00, // Winter buffer DISABLED (milder climate)
        },
        copy: {
            winterLabel: 'Seasonal / Low-Sun Buffer',
            inverterNote: 'Australian homes use 230V single-phase (some 3-phase). Ensure your inverter continuous kW exceeds peak loads (air con, pool pump, EV charger). Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult an accredited electrician for AS/NZS 3000 compliance and DNSP approval.',
        },
        regionAvailabilityTag: 'AU',
    },
    {
        id: 'de',
        label: 'Germany',
        countryCode: 'DE',
        electricalStandard: {
            voltage: '230V',
            phase: 'single-phase',
            frequencyHz: 50,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.20,
        },
        copy: {
            winterLabel: 'Winter / Low-Sun Buffer',
            inverterNote: 'German homes use 230V single-phase (some 3-phase). Ensure your inverter continuous kW exceeds peak loads (heat pump, wallbox/EV charger). Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult a qualified electrician for VDE compliance and utility notification.',
        },
        regionAvailabilityTag: 'EU',
    },
    {
        id: 'za',
        label: 'South Africa',
        countryCode: 'ZA',
        electricalStandard: {
            voltage: '230V',
            phase: 'single-phase',
            frequencyHz: 50,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.00, // Winter buffer DISABLED
        },
        copy: {
            winterLabel: 'Seasonal / Low-Sun Buffer',
            inverterNote: 'South African homes use 230V single-phase. Size for load-shedding resilience. Ensure your inverter continuous kW exceeds peak loads (geyser, pool pump). Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult a qualified electrician for SANS 10142 compliance.',
        },
        regionAvailabilityTag: 'ZA',
    },
    {
        id: 'in',
        label: 'India',
        countryCode: 'IN',
        electricalStandard: {
            voltage: '230V',
            phase: 'single-phase',
            frequencyHz: 50,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.00, // Winter buffer DISABLED
        },
        copy: {
            winterLabel: 'Seasonal / Low-Sun Buffer',
            inverterNote: 'Indian homes use 230V single-phase (some 3-phase). Ensure your inverter continuous kW exceeds peak loads (AC, water heater). Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult a licensed electrician for IE Rules compliance and local utility requirements.',
        },
        regionAvailabilityTag: 'IN',
    },
    {
        id: 'global',
        label: 'Other / Global',
        countryCode: 'XX',
        electricalStandard: {
            voltage: '230V / Varies',
            phase: 'single-phase',
            frequencyHz: 50,
        },
        defaults: {
            dod: 0.80,
            inverterEfficiency: 0.90,
            reserveBuffer: 0.15,
            winterBuffer: 0.00, // Winter buffer DISABLED by default
        },
        copy: {
            winterLabel: 'Seasonal / Low-Sun Buffer',
            inverterNote: 'Electrical standards vary globally. Ensure your inverter continuous kW exceeds peak loads. Example: 10 kWh battery with 5 kW inverter runs a 5 kW load for ~2 hours.',
            disclaimerExtra: 'Consult a qualified local electrician for code compliance.',
        },
        regionAvailabilityTag: 'GLOBAL',
    },
];

export function getLocationProfile(locationId: string): LocationProfile {
    return LOCATION_PROFILES.find(p => p.id === locationId) || LOCATION_PROFILES.find(p => p.id === 'us')!;
}

export function detectLocationFromBrowser(): string {
    if (typeof window === 'undefined') return 'us';

    // A) Primary: Intl.Locale with region (modern browsers)
    try {
        if (typeof Intl !== 'undefined' && Intl.Locale && navigator.language) {
            const locale = new Intl.Locale(navigator.language);
            if (locale.region) {
                const region = locale.region.toUpperCase();
                // Map to supported location IDs
                if (region === 'GB') return 'uk';
                if (region === 'US') return 'us';
                if (region === 'CA') return 'ca';
                if (region === 'AU') return 'au';
                if (region === 'DE') return 'de';
                if (region === 'ZA') return 'za';
                if (region === 'IN') return 'in';
                // EU countries
                if (['FR', 'ES', 'IT', 'NL', 'BE', 'PT', 'AT', 'SE', 'DK', 'FI', 'NO', 'IE', 'PL', 'CZ', 'GR'].includes(region)) {
                    return 'de'; // Use Germany as EU default
                }
            }
        }
    } catch (e) {
        // Fallback to next method
    }

    // B) Secondary: Timezone-based detection (more reliable than language alone)
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // UK & Ireland
        if (timezone.includes('Europe/London') || timezone.includes('Europe/Dublin')) return 'uk';

        // EU countries
        if (timezone.includes('Europe/Berlin') ||
            timezone.includes('Europe/Paris') ||
            timezone.includes('Europe/Madrid') ||
            timezone.includes('Europe/Rome') ||
            timezone.includes('Europe/Amsterdam') ||
            timezone.includes('Europe/Brussels') ||
            timezone.includes('Europe/Vienna') ||
            timezone.includes('Europe/') // Other European timezones default to DE
        ) {
            return 'de';
        }

        // Americas
        if (timezone.includes('America/')) {
            if (timezone.includes('Toronto') ||
                timezone.includes('Vancouver') ||
                timezone.includes('Montreal') ||
                timezone.includes('Calgary') ||
                timezone.includes('Edmonton')
            ) {
                return 'ca';
            }
            return 'us'; // Other Americas default to US
        }

        // Australia & New Zealand
        if (timezone.includes('Australia/') || timezone.includes('Pacific/Auckland')) return 'au';

        // South Africa
        if (timezone.includes('Africa/Johannesburg')) return 'za';

        // India
        if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) return 'in';

    } catch (e) {
        // Fallback to next method
    }

    // C) Tertiary: Parse navigator.language
    const locale = navigator.language || 'en-US';
    if (locale.includes('-')) {
        const region = locale.split('-')[1].toUpperCase();
        if (region === 'GB') return 'uk';
        if (region === 'US') return 'us';
        if (region === 'CA') return 'ca';
        if (region === 'AU') return 'au';
        if (region === 'DE') return 'de';
        if (region === 'ZA') return 'za';
        if (region === 'IN') return 'in';
    }

    // Language prefix fallback
    if (locale.startsWith('en-US')) return 'us';
    if (locale.startsWith('en-GB')) return 'uk';
    if (locale.startsWith('en-CA')) return 'ca';
    if (locale.startsWith('en-AU')) return 'au';
    if (locale.startsWith('de')) return 'de';
    if (locale.startsWith('af') || locale.startsWith('zu')) return 'za';
    if (locale.startsWith('hi') || locale.startsWith('en-IN')) return 'in';

    // D) Final fallback
    return 'us';
}
