/**
 * src/data/regions/index.ts
 *
 * Central export for the BatteryBlueprint Regional Intelligence System.
 *
 * To add a new region: create a new file (e.g. au.ts), export a RegionProfile,
 * import it here, and add it to REGION_DATABASE.
 *
 * The REGION_DATABASE array is a build-time constant — no API, no database,
 * fully static-export-safe.
 */

export type { RegionProfile, IncentiveProgram, RegulatoryConstraint, RegionScoringModifiers } from './schema';
export { NEUTRAL_MODIFIERS } from './schema';

import { RegionProfile } from './schema';
import { UK_REGION } from './uk';
import { US_REGION } from './us';

/**
 * All available RegionProfiles, in order of editorial priority.
 * Sub-regions (e.g. us-ca) will be added in Phase 18.4.
 */
export const REGION_DATABASE: RegionProfile[] = [
    UK_REGION,
    US_REGION,
];

/**
 * Looks up a RegionProfile by its ID.
 * Returns undefined if no matching region exists (callers should degrade gracefully).
 */
export function getRegionById(id: string): RegionProfile | undefined {
    return REGION_DATABASE.find(r => r.id === id);
}

/**
 * Looks up the best-matching RegionProfile for a given country code.
 * Prefers a country-level match. Falls back to undefined.
 * Sub-region resolution (country + state) is handled by regionResolver.ts (Phase 18.3).
 */
export function getRegionByCountryCode(countryCode: string): RegionProfile | undefined {
    // Prefer an exact country-level match (no parent)
    const countryLevel = REGION_DATABASE.find(
        r => r.countryCode === countryCode.toUpperCase() && !r.parentRegionId
    );
    return countryLevel;
}
