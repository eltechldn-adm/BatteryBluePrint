import { recommendBatteries } from '../recommend-batteries';
import { BATTERY_CATALOG } from '@/lib/batteries/catalog';

let failedTests = 0;

describe('recommendBatteries', () => {
    it('should recommend correct counts for small load (5.1 usable needed)', () => {
        // Input is now "batteryUsableNeeded_kWh" (DC side)
        const result = recommendBatteries({ batteryUsableNeeded_kWh: 5.1 });

        expect(result.premium).not.toBeNull();
        expect(result.midRange).not.toBeNull();
        expect(result.diy).not.toBeNull();

        // Premium must contain at least one recommendation
        expect(result.premium.length).toBeGreaterThanOrEqual(1);

        const allRecommendations = [...result.premium, ...result.midRange, ...result.diy];
        const enphaseResult = allRecommendations.find((r: { battery: { id: string }; count: number }) => r.battery.id === 'enphase-iq5p');

        if (!enphaseResult) {
            throw new Error('enphase-iq5p was not found in any recommendation category');
        }

        expect(enphaseResult.count).toBe(2);
    });

    it('should always round UP count', () => {
        const result = recommendBatteries({ batteryUsableNeeded_kWh: 14.0 });

        expect(result.premium.length).toBeGreaterThanOrEqual(1);
        expect(result.premium[0]?.totalUsable_kWh).toBeGreaterThanOrEqual(14.0);
    });

    it('should return 3 distinct categories with at least one entry each', () => {
        const result = recommendBatteries({ batteryUsableNeeded_kWh: 10 });

        expect(result.premium.length).toBeGreaterThanOrEqual(1);
        expect(result.midRange.length).toBeGreaterThanOrEqual(1);
        expect(result.diy.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter batteries by region - US includes region-specific models', () => {
        const result = recommendBatteries({
            batteryUsableNeeded_kWh: 10,
            locationTag: 'US'
        });

        const allBatteries = [...result.premium, ...result.midRange, ...result.diy]
            .map(r => r.battery);

        expect(allBatteries.length).toBeGreaterThanOrEqual(1);

        allBatteries.forEach(battery => {
            const isAvailable = battery.regionAvailability['US'] || battery.regionAvailability['GLOBAL'];
            if (!isAvailable) {
                throw new Error(`Battery ${battery.id} is not available in US but was recommended`);
            }
        });
    });

    it('should filter batteries by region - EU excludes US-only models', () => {
        const usOnlyBattery = BATTERY_CATALOG.find(b =>
            b.regionAvailability['US'] &&
            !b.regionAvailability['EU'] &&
            !b.regionAvailability['GLOBAL']
        );

        if (!usOnlyBattery) {
            throw new Error('Prerequisite failed: No US-only battery found in catalog');
        }

        const result = recommendBatteries({
            batteryUsableNeeded_kWh: 10,
            locationTag: 'EU'
        });

        const allBatteries = [...result.premium, ...result.midRange, ...result.diy]
            .map(r => r.battery);

        const hasUsOnlyBattery = allBatteries.some(b => b.id === usOnlyBattery.id);
        expect(hasUsOnlyBattery).toBe(false);
    });

    it('should rely on GLOBAL fallback for unrepresented location tags', () => {
        const nonGlobalBattery = BATTERY_CATALOG.find(b => !b.regionAvailability['GLOBAL']);
        if (!nonGlobalBattery) {
            throw new Error('Prerequisite failed: No non-GLOBAL battery found in catalog');
        }

        const result = recommendBatteries({
            batteryUsableNeeded_kWh: 10,
            locationTag: 'XY'
        });

        const allBatteries = [...result.premium, ...result.midRange, ...result.diy]
            .map(r => r.battery);

        expect(allBatteries.length).toBeGreaterThanOrEqual(1);

        allBatteries.forEach(battery => {
            if (battery.regionAvailability['GLOBAL'] !== true) {
                throw new Error(`Battery ${battery.id} returned for unrepresented region 'XY' but lacks GLOBAL availability`);
            }
            if (battery.id === nonGlobalBattery.id) {
                throw new Error(`Non-GLOBAL battery ${battery.id} incorrectly returned for unrepresented region 'XY'`);
            }
        });
    });

    it('isLimitedCatalog is true when filteredSize < 8 (premium-only GLOBAL fixture)', () => {
        // Premium tier + unrepresented region 'XY' → GLOBAL fallback, tier=premium only.
        // Catalog has 4 GLOBAL premium entries: tesla-pw3, enphase-iq5p, sonnen-eco, lg-resu16h.
        // filteredSize = 4, which is < 8, so isLimitedCatalog must be true.
        const resultLimited = recommendBatteries({
            batteryUsableNeeded_kWh: 10,
            locationTag: 'XY',
            tierFilter: 'premium'
        });

        const limitedFilteredSize = resultLimited.metadata.filteredSize;

        // Prove filteredSize > 0 (non-empty result)
        expect(limitedFilteredSize).toBeGreaterThanOrEqual(1);

        // Prove filteredSize < 8 is actually true for this fixture
        if (limitedFilteredSize >= 8) {
            throw new Error(`Limited fixture expected filteredSize < 8, got ${limitedFilteredSize}. Catalog may have changed.`);
        }

        // The flag must match the invariant
        expect(resultLimited.metadata.isLimitedCatalog).toBe(true);
    });

    it('isLimitedCatalog is false when filteredSize >= 8 (US all-tier fixture)', () => {
        // US region includes US-specific + GLOBAL batteries across all tiers.
        // Current catalog yields >= 9 entries for US, so filteredSize >= 8 → isLimitedCatalog must be false.
        const resultNotLimited = recommendBatteries({
            batteryUsableNeeded_kWh: 10,
            locationTag: 'US'
        });

        const notLimitedFilteredSize = resultNotLimited.metadata.filteredSize;

        // Prove filteredSize >= 8 is actually true for this fixture
        if (notLimitedFilteredSize < 8) {
            throw new Error(`Non-limited fixture expected filteredSize >= 8, got ${notLimitedFilteredSize}. Catalog may have changed.`);
        }

        // The flag must match the invariant
        expect(resultNotLimited.metadata.isLimitedCatalog).toBe(false);
    });
});

function describe(name: string, fn: () => void) {
    console.log(`Group: ${name}`);
    fn();
    if (failedTests > 0) {
        console.error(`\nFAILED ${failedTests} tests.`);
        process.exit(1);
    } else {
        console.log(`\nALL TESTS PASSED.`);
    }
}
function it(name: string, fn: () => void) {
    try {
        fn();
        console.log(`  PASS: ${name}`);
    } catch (e) {
        console.error(`  FAIL: ${name}`, e);
        failedTests++;
    }
}
function expect(actual: unknown) {
    return {
        toBe: (expected: unknown) => {
            if (typeof expected === 'number') {
                if (typeof actual !== 'number' || Number.isNaN(actual) || !Number.isFinite(actual)) {
                    throw new Error(`Expected finite number ${expected}, got ${String(actual)}`);
                }
            }
            if (actual !== expected) throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
        },
        not: {
            toBeNull: () => {
                if (actual === null || actual === undefined) throw new Error(`Expected not null, got ${String(actual)}`);
            }
        },
        toBeNull: () => {
            if (actual !== null && actual !== undefined) throw new Error(`Expected null, got ${String(actual)}`);
        },
        toBeGreaterThanOrEqual: (expected: number) => {
            if (typeof actual !== 'number' || Number.isNaN(actual) || !Number.isFinite(actual)) {
                throw new Error(`Expected a finite number >= ${expected}, got ${String(actual)}`);
            }
            if ((actual as number) < expected) throw new Error(`Expected >= ${expected}, got ${String(actual)}`);
        }
    };
}
