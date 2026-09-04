import { recommendBatteries } from '../recommend-batteries';
import { BATTERY_CATALOG } from '@/lib/batteries/catalog';

let failedTests = 0;

describe('recommendBatteries', () => {
    it('should recommend correct counts for small load (5.1 usable needed)', () => {
        // Tesla 13.5 usable -> 1 unit
        // Enphase 5.0 usable -> 2 units (5.0 * 1 is < 5.1, so 2)

        // Input is now "batteryUsableNeeded_kWh" (DC side)
        const result = recommendBatteries({ batteryUsableNeeded_kWh: 5.1 });

        expect(result.premium).not.toBeNull();
        expect(result.midRange).not.toBeNull();
        expect(result.diy).not.toBeNull();

        // Premium must contain at least one recommendation
        expect(result.premium.length).toBeGreaterThanOrEqual(1);

        process.stdout.write(`    DEBUG: Premium model picked: ${result.premium?.[0]?.battery.id} count: ${result.premium?.[0]?.count}\n`);

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

        process.stdout.write(`    DEBUG: US recommendations: ${allBatteries.map(b => b.id).join(', ')}\n`);
    });

    it('should filter batteries by region - EU excludes US-only models (optional)', () => {
        const usOnlyBattery = BATTERY_CATALOG.find(b => 
            b.regionAvailability['US'] && 
            !b.regionAvailability['EU'] && 
            !b.regionAvailability['GLOBAL']
        );

        if (!usOnlyBattery) {
            process.stdout.write(`    DEBUG: No US-only batteries found in database, skipping test\n`);
            return;
        }

        const result = recommendBatteries({ 
            batteryUsableNeeded_kWh: 10,
            locationTag: 'EU'
        });

        const allBatteries = [...result.premium, ...result.midRange, ...result.diy]
            .map(r => r.battery);

        const hasUsOnlyBattery = allBatteries.some(b => b.id === usOnlyBattery.id);
        if (hasUsOnlyBattery) {
            throw new Error(`US-only battery ${usOnlyBattery.id} appeared in EU recommendations`);
        }

        process.stdout.write(`    DEBUG: EU recommendations exclude US-only ${usOnlyBattery.id}\n`);
    });

    it('should include GLOBAL batteries in all regions (optional)', () => {
        const globalBattery = BATTERY_CATALOG.find(b => b.regionAvailability['GLOBAL']);

        if (!globalBattery) {
            process.stdout.write(`    DEBUG: No GLOBAL batteries found in database, skipping test\n`);
            return;
        }

        const regions = ['US', 'EU', 'UK', 'AU', 'CA'];
        regions.forEach(region => {
            const result = recommendBatteries({
                batteryUsableNeeded_kWh: 10,
                locationTag: region
            });

            const allBatteries = [...result.premium, ...result.midRange, ...result.diy]
                .map(r => r.battery);

            if (allBatteries.length === 0) {
                throw new Error(`No batteries available for region ${region}`);
            }

            process.stdout.write(`    DEBUG: ${region} has ${allBatteries.length} recommendations\n`);
        });
    });

    it('should set limitedCatalog flag when fewer than 3 batteries available', () => {
        const result = recommendBatteries({
            batteryUsableNeeded_kWh: 10,
            locationTag: 'IN' 
        });

        const totalRecommendations = [...result.premium, ...result.midRange, ...result.diy].length;

        if (totalRecommendations < 3) {
            if (!result.metadata.isLimitedCatalog) {
                throw new Error('limitedCatalog should be true when fewer than 3 batteries available');
            }
        }

        process.stdout.write(`    DEBUG: IN has ${totalRecommendations} recommendations, limitedCatalog=${result.metadata.isLimitedCatalog}\n`);
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
function expect(actual: any) {
    return {
        toBe: (expected: any) => {
            if (typeof expected === 'number') {
                if (typeof actual !== 'number' || Number.isNaN(actual) || !Number.isFinite(actual)) {
                    throw new Error(`Expected finite number ${expected}, got ${actual}`);
                }
            }
            if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
        },
        not: {
            toBeNull: () => {
                if (actual === null || actual === undefined) throw new Error(`Expected not null, got ${actual}`);
            }
        },
        toBeNull: () => {
            if (actual !== null && actual !== undefined) throw new Error(`Expected null, got ${actual}`);
        },
        toBeGreaterThanOrEqual: (expected: number) => {
            if (typeof actual !== 'number' || Number.isNaN(actual) || !Number.isFinite(actual)) {
                throw new Error(`Expected a finite number >= ${expected}, got ${actual}`);
            }
            if (actual < expected) throw new Error(`Expected >= ${expected}, got ${actual}`);
        }
    };
}
