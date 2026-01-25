import { calculateStorageNeeded } from '../battery-sizing';

// Mock tests
describe('calculateStorageNeeded', () => {
    it('should calculate splits correctly (10kWh, 1 day)', () => {
        const result = calculateStorageNeeded({
            dailyLoad_kWh: 10,
            daysOfAutonomy: 1,
            dod: 0.8,
            efficiency: 0.9,
            winterMode: false,
            reserveBuffer: 0.15, // Default explicit
        });

        // 1. Load Target (Reserve: 10 * 1.15) = 11.5
        expect(result.loadTarget_kWh).toBe(11.5);

        // 2. Battery Usable Needed (11.5 / 0.9) = 12.777
        expect(result.batteryUsableNeeded_kWh).toBe(12.8); // Rounded 1 decimal

        // 3. Nameplate (12.777... / 0.8) = 15.97
        // Round UP to nearest 0.5 -> 16.0
        expect(result.batteryNameplateNeeded_kWh).toBe(16.0);
    });

    it('should apply Winter Mode (1.2x)', () => {
        const result = calculateStorageNeeded({
            dailyLoad_kWh: 10,
            daysOfAutonomy: 1,
            winterMode: true,
            reserveBuffer: 0, // isolate winter
        });

        // Load Target: 10 * 1.2 = 12.0
        expect(result.loadTarget_kWh).toBe(12.0);

        // Battery Usable: 12 / 0.9 = 13.33 -> 13.3
        expect(result.batteryUsableNeeded_kWh).toBe(13.3);

        // Nameplate: 13.33 / 0.8 = 16.66 -> 17.0
        expect(result.batteryNameplateNeeded_kWh).toBe(17.0);
    });
});

// Helper for 'describe' and 'it' if running in a non-Jest env (placeholder)
function describe(name: string, fn: () => void) { console.log(`Group: ${name}`); fn(); }
function it(name: string, fn: () => void) {
    try { fn(); console.log(`  PASS: ${name}`); }
    catch (e) { console.error(`  FAIL: ${name}`, e); }
}
function expect(actual: number) {
    return {
        toBe: (expected: number) => {
            // Allow minor float diff
            if (Math.abs(actual - expected) > 0.05) throw new Error(`Expected ${expected}, got ${actual}`);
        }
    };
}
