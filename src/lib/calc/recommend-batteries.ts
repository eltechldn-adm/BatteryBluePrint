import { BATTERY_CATALOG, BatteryCatalogItem, BatteryTier, BatteryChemistry } from '@/lib/batteries/catalog';

export interface RecommendationInputs {
    batteryUsableNeeded_kWh: number;
    locationTag?: string; // Filter by location availability
    tierFilter?: 'all' | BatteryTier;
    chemistryFilter?: 'all' | BatteryChemistry;
}

export interface RecommendedBattery {
    battery: BatteryCatalogItem;
    count: number;
    totalUsable_kWh: number;
    totalNameplate_kWh: number;
    coverage: number; // Percentage (e.g., 105 = 5% oversize)
    isUndersized: boolean;
}

export interface RecommendationResult {
    premium: RecommendedBattery[];
    midRange: RecommendedBattery[];
    diy: RecommendedBattery[];
    metadata: {
        catalogSize: number;
        filteredSize: number;
        isLimitedCatalog: boolean; // True if < 8 items
    };
}

/**
 * Recommends batteries based on battery usable kWh needed (DC side).
 * Returns multiple results per tier, sorted by best match.
 * Filters by location, tier, and chemistry if provided.
 */
export function recommendBatteries(inputs: RecommendationInputs): RecommendationResult {
    const {
        batteryUsableNeeded_kWh,
        locationTag,
        tierFilter = 'all',
        chemistryFilter = 'all'
    } = inputs;

    // Start with full catalog
    let availableBatteries = [...BATTERY_CATALOG];
    const catalogSize = BATTERY_CATALOG.length;

    // Filter by location availability
    if (locationTag && locationTag !== 'GLOBAL') {
        availableBatteries = availableBatteries.filter(b => {
            const key = locationTag as keyof typeof b.regionAvailability;
            return b.regionAvailability[key] || b.regionAvailability.GLOBAL;
        });
    }

    // Filter by tier
    if (tierFilter !== 'all') {
        availableBatteries = availableBatteries.filter(b => b.tier === tierFilter);
    }

    // Filter by chemistry
    if (chemistryFilter !== 'all') {
        availableBatteries = availableBatteries.filter(b => b.chemistry === chemistryFilter);
    }

    const filteredSize = availableBatteries.length;
    const isLimitedCatalog = filteredSize < 8;

    const processBattery = (battery: BatteryCatalogItem): RecommendedBattery => {
        // Use usableKwhPerUnit directly from catalog
        const oneUnitUsable = battery.usableKwhPerUnit;

        // Calculate count needed to meet batteryUsableNeeded
        const count = Math.ceil(batteryUsableNeeded_kWh / oneUnitUsable);
        const totalUsable = oneUnitUsable * count;
        const coverage = (totalUsable / batteryUsableNeeded_kWh) * 100;
        const isUndersized = coverage < 100;

        return {
            battery,
            count,
            totalUsable_kWh: totalUsable,
            totalNameplate_kWh: (battery.nameplateKwhPerUnit || oneUnitUsable) * count,
            coverage,
            isUndersized,
        };
    };

    // Sort by best match:
    // 1. Prefer batteries that meet target (coverage >= 100%)
    // 2. Among those, prefer smallest oversize (closest to 100%)
    // 3. Then by lowest unit count
    // 4. Then alphabetically by brand/model
    const sortByBestMatch = (a: RecommendedBattery, b: RecommendedBattery) => {
        // Prioritize batteries that meet target
        if (a.isUndersized !== b.isUndersized) {
            return a.isUndersized ? 1 : -1;
        }

        // Both meet target or both undersized: prefer smallest oversize/undersize
        if (Math.abs(a.coverage - b.coverage) > 0.1) {
            if (a.isUndersized) {
                // For undersized, prefer higher coverage (closer to 100%)
                return b.coverage - a.coverage;
            } else {
                // For oversized, prefer lower coverage (closer to 100%)
                return a.coverage - b.coverage;
            }
        }

        // Same coverage: prefer fewer units
        if (a.count !== b.count) {
            return a.count - b.count;
        }

        // Same count: alphabetical by brand then model
        const brandCompare = a.battery.brand.localeCompare(b.battery.brand);
        if (brandCompare !== 0) return brandCompare;
        return a.battery.model.localeCompare(b.battery.model);
    };

    // Process and categorize batteries
    const premiumOptions: RecommendedBattery[] = [];
    const midOptions: RecommendedBattery[] = [];
    const diyOptions: RecommendedBattery[] = [];

    for (const battery of availableBatteries) {
        const rec = processBattery(battery);
        if (battery.tier === 'premium') premiumOptions.push(rec);
        else if (battery.tier === 'mid') midOptions.push(rec);
        else if (battery.tier === 'diy') diyOptions.push(rec);
    }

    // Sort each tier by best match
    premiumOptions.sort(sortByBestMatch);
    midOptions.sort(sortByBestMatch);
    diyOptions.sort(sortByBestMatch);

    // Return top 6 per tier (or all if fewer than 6)
    const MAX_RESULTS_PER_TIER = 6;

    return {
        premium: premiumOptions.slice(0, MAX_RESULTS_PER_TIER),
        midRange: midOptions.slice(0, MAX_RESULTS_PER_TIER),
        diy: diyOptions.slice(0, MAX_RESULTS_PER_TIER),
        metadata: {
            catalogSize,
            filteredSize,
            isLimitedCatalog,
        },
    };
}
