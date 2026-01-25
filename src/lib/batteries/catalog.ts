export type BatteryTier = 'premium' | 'mid' | 'diy';
export type BatteryChemistry = 'LFP' | 'NMC' | 'Other';

export interface BatteryCatalogItem {
    id: string;
    brand: string;
    model: string;
    tier: BatteryTier;
    chemistry: BatteryChemistry;
    usableKwhPerUnit: number;
    nameplateKwhPerUnit: number | null;
    continuousKwPerUnit: number | null;
    warrantyYears: number | null;
    regionAvailability: {
        US: boolean;
        UK: boolean;
        EU: boolean;
        AU: boolean;
        CA: boolean;
        ZA: boolean;
        IN: boolean;
        GLOBAL: boolean;
    };
    sourceUrl: string;
    sourceNote: string;
    priceRangeUsd?: string;
    priceSourceUrl?: string;
    priceLastVerified?: string; // ISO date
}

/**
 * Comprehensive battery catalog for BatteryBlueprint.
 * All specs sourced from manufacturer datasheets or official documentation.
 * Updated: 2026-01-21
 */
export const BATTERY_CATALOG: BatteryCatalogItem[] = [
    // ===== PREMIUM TIER =====
    {
        id: 'tesla-pw3',
        brand: 'Tesla',
        model: 'Powerwall 3',
        tier: 'premium',
        chemistry: 'LFP',
        usableKwhPerUnit: 13.5,
        nameplateKwhPerUnit: 13.5,
        continuousKwPerUnit: 11.5,
        warrantyYears: 10,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: true,
            ZA: false,
            IN: false,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.tesla.com/powerwall',
        sourceNote: 'Tesla Powerwall 3 Datasheet 2024. Integrated inverter. LFP chemistry.',
        priceRangeUsd: '$8,500 - $11,000 (Installed)',
    },
    {
        id: 'enphase-iq5p',
        brand: 'Enphase',
        model: 'IQ Battery 5P',
        tier: 'premium',
        chemistry: 'LFP',
        usableKwhPerUnit: 5.0,
        nameplateKwhPerUnit: 5.0,
        continuousKwPerUnit: 3.84,
        warrantyYears: 15,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: true,
            ZA: false,
            IN: false,
            GLOBAL: true,
        },
        sourceUrl: 'https://enphase.com/installers/products/iq-battery-5p',
        sourceNote: 'Enphase IQ Battery 5P Datasheet. Modular AC-coupled system. 15-year warranty.',
        priceRangeUsd: '$3,500 - $5,000 (Per unit, installed)',
    },
    {
        id: 'sonnen-eco',
        brand: 'sonnen',
        model: 'sonnenBatterie 10',
        tier: 'premium',
        chemistry: 'LFP',
        usableKwhPerUnit: 10.0,
        nameplateKwhPerUnit: 11.0,
        continuousKwPerUnit: 4.6,
        warrantyYears: 10,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: false,
            ZA: false,
            IN: false,
            GLOBAL: true,
        },
        sourceUrl: 'https://sonnenusa.com/en/sonnenbatterie',
        sourceNote: 'sonnen Eco Datasheet. German engineering, LFP chemistry, 10-year warranty.',
        priceRangeUsd: '$10,000 - $14,000 (Installed)',
    },
    {
        id: 'lg-resu16h',
        brand: 'LG Energy Solution',
        model: 'RESU16H Prime',
        tier: 'premium',
        chemistry: 'NMC',
        usableKwhPerUnit: 16.0,
        nameplateKwhPerUnit: 16.0,
        continuousKwPerUnit: 7.0,
        warrantyYears: 10,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: true,
            ZA: true,
            IN: false,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.lgessbattery.com/us/home-battery/resu.lg',
        sourceNote: 'LG RESU16H Prime Datasheet. High-voltage NMC battery, 10-year warranty.',
        priceRangeUsd: '$7,000 - $9,500 (Battery only)',
    },

    // ===== MID-RANGE TIER =====
    {
        id: 'ruixu-sible-5',
        brand: 'Ruixu',
        model: 'Sible 48V 5.12kWh',
        tier: 'mid',
        chemistry: 'LFP',
        usableKwhPerUnit: 4.1,
        nameplateKwhPerUnit: 5.12,
        continuousKwPerUnit: 5.0,
        warrantyYears: 10,
        regionAvailability: {
            US: true,
            UK: false,
            EU: false,
            AU: true,
            CA: true,
            ZA: true,
            IN: true,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.ruixuenergy.com/',
        sourceNote: 'Ruixu Sible 48V Datasheet. Mid-range LFP, 10-year warranty.',
        priceRangeUsd: '$1,300 - $1,700 (Battery only)',
    },
    {
        id: 'pylon-us5000',
        brand: 'Pylon Technologies',
        model: 'US5000',
        tier: 'mid',
        chemistry: 'LFP',
        usableKwhPerUnit: 4.8,
        nameplateKwhPerUnit: 4.8,
        continuousKwPerUnit: 3.7,
        warrantyYears: 10,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: true,
            ZA: true,
            IN: true,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.pylontech.com.cn/',
        sourceNote: 'Pylontech US5000 Datasheet. Popular mid-range LFP, modular, 10-year warranty.',
        priceRangeUsd: '$1,400 - $1,900 (Battery only)',
    },
    {
        id: 'byd-hvs',
        brand: 'BYD',
        model: 'Battery-Box Premium HVS 10.2',
        tier: 'mid',
        chemistry: 'LFP',
        usableKwhPerUnit: 10.2,
        nameplateKwhPerUnit: 10.24,
        continuousKwPerUnit: 5.0,
        warrantyYears: 10,
        regionAvailability: {
            US: false,
            UK: true,
            EU: true,
            AU: true,
            CA: false,
            ZA: true,
            IN: true,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.byd.com/en/energy',
        sourceNote: 'BYD Battery-Box Premium HVS Datasheet. High-voltage LFP, modular, 10-year warranty.',
        priceRangeUsd: '$3,500 - $5,000 (Battery only)',
    },
    {
        id: 'growatt-arb',
        brand: 'Growatt',
        model: 'ARB 5.12kWh',
        tier: 'mid',
        chemistry: 'LFP',
        usableKwhPerUnit: 5.12,
        nameplateKwhPerUnit: 5.12,
        continuousKwPerUnit: 2.56,
        warrantyYears: 10,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: true,
            ZA: true,
            IN: true,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.growatt.com/',
        sourceNote: 'Growatt ARB Datasheet. Affordable LFP, modular, 10-year warranty.',
        priceRangeUsd: '$1,200 - $1,600 (Battery only)',
    },

    // ===== DIY / SERVER RACK TIER =====
    {
        id: 'eg4-lifepower4',
        brand: 'EG4',
        model: 'LifePower4 (Server Rack)',
        tier: 'diy',
        chemistry: 'LFP',
        usableKwhPerUnit: 4.1,
        nameplateKwhPerUnit: 5.12,
        continuousKwPerUnit: 5.12,
        warrantyYears: 5,
        regionAvailability: {
            US: true,
            UK: false,
            EU: false,
            AU: false,
            CA: true,
            ZA: false,
            IN: false,
            GLOBAL: false,
        },
        sourceUrl: 'https://signaturesolar.com/eg4-lifepower4-lithium-battery-48v-100ah/',
        sourceNote: 'EG4 LifePower4 Datasheet (Signature Solar). DIY-friendly server rack LFP, requires inverter.',
        priceRangeUsd: '$1,300 - $1,600 (Battery only)',
    },
    {
        id: 'ampere-time-12v-300ah',
        brand: 'Ampere Time',
        model: '12V 300Ah LiFePO4',
        tier: 'diy',
        chemistry: 'LFP',
        usableKwhPerUnit: 3.84,
        nameplateKwhPerUnit: 3.84,
        continuousKwPerUnit: 3.84,
        warrantyYears: 5,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: true,
            ZA: true,
            IN: true,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.amperetime.com/',
        sourceNote: 'Ampere Time 12V 300Ah Datasheet. Budget DIY LFP, requires series/parallel config.',
        priceRangeUsd: '$900 - $1,200 (Per battery)',
    },
    {
        id: 'renogy-core-mini',
        brand: 'Renogy',
        model: 'CORE Mini 12V 200Ah',
        tier: 'diy',
        chemistry: 'LFP',
        usableKwhPerUnit: 2.56,
        nameplateKwhPerUnit: 2.56,
        continuousKwPerUnit: 2.56,
        warrantyYears: 5,
        regionAvailability: {
            US: true,
            UK: true,
            EU: true,
            AU: true,
            CA: true,
            ZA: false,
            IN: false,
            GLOBAL: true,
        },
        sourceUrl: 'https://www.renogy.com/',
        sourceNote: 'Renogy CORE Mini Datasheet. Compact DIY LFP, 5-year warranty.',
        priceRangeUsd: '$600 - $850 (Per battery)',
    },
    {
        id: 'battleborn-100ah',
        brand: 'Battle Born',
        model: 'GC3 12V 270Ah',
        tier: 'diy',
        chemistry: 'LFP',
        usableKwhPerUnit: 3.46,
        nameplateKwhPerUnit: 3.46,
        continuousKwPerUnit: 3.46,
        warrantyYears: 10,
        regionAvailability: {
            US: true,
            UK: false,
            EU: false,
            AU: false,
            CA: true,
            ZA: false,
            IN: false,
            GLOBAL: false,
        },
        sourceUrl: 'https://battlebornbatteries.com/',
        sourceNote: 'Battle Born GC3 Datasheet. Premium DIY LFP made in USA, 10-year warranty.',
        priceRangeUsd: '$1,200 - $1,500 (Per battery)',
    },
];

/**
 * Get all batteries available for a specific region.
 */
export function getBatteriesByRegion(regionTag: string): BatteryCatalogItem[] {
    if (regionTag === 'GLOBAL') {
        return BATTERY_CATALOG;
    }

    return BATTERY_CATALOG.filter(battery => {
        const key = regionTag as keyof typeof battery.regionAvailability;
        return battery.regionAvailability[key] || battery.regionAvailability.GLOBAL;
    });
}

/**
 * Get batteries filtered by tier.
 */
export function getBatteriesByTier(tier: BatteryTier): BatteryCatalogItem[] {
    return BATTERY_CATALOG.filter(battery => battery.tier === tier);
}

/**
 * Get batteries filtered by chemistry.
 */
export function getBatteriesByChemistry(chemistry: BatteryChemistry): BatteryCatalogItem[] {
    return BATTERY_CATALOG.filter(battery => battery.chemistry === chemistry);
}
