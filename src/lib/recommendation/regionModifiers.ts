/**
 * src/lib/recommendation/regionModifiers.ts
 *
 * Regional scoring modifier layer for the BatteryBlueprint recommendation engine.
 *
 * Phase 18.2: This is a STUB implementation — it is a no-op pass-through.
 * The engine is wired to accept a RegionProfile but modifiers are not yet applied.
 *
 * Phase 18.3 will replace applyRegionalModifiers() with the full multiplier logic,
 * add unit tests, and update the engine to call this with the resolved RegionProfile.
 *
 * Design contract:
 * - Pure function: no side effects, deterministic
 * - Input: current weight map + RegionProfile
 * - Output: adjusted weight map
 * - All multipliers are clamped to [0.5, 2.0] to prevent score collapse
 */

import { CategoryWeights } from './weights';
import { RegionProfile, RegionScoringModifiers } from '@/data/regions/schema';

/** Clamps a multiplier to the safe [0.5, 2.0] range. */
function clamp(value: number): number {
    return Math.max(0.5, Math.min(2.0, value));
}

/**
 * Applies regional scoring multipliers on top of the profile-driven weights.
 *
 * Phase 18.2: STUB — returns weights unchanged.
 * Phase 18.3: Full implementation with per-dimension multipliers.
 *
 * @param weights - Current weight map from getDynamicWeights(profile)
 * @param region  - Optional RegionProfile. If undefined, weights are returned unchanged.
 * @returns       - Adjusted weight map (same keys, modified values)
 */
export function applyRegionalModifiers(
    weights: CategoryWeights,
    region: RegionProfile | undefined
): CategoryWeights {
    if (!region) {
        return weights;
    }

    // Phase 18.3: Full implementation activated
    return applyModifierMap(weights, region.scoringModifiers);
}

/**
 * Phase 18.3 implementation target.
 * Applies a RegionScoringModifiers map to a CategoryWeights object.
 * Each weight is multiplied by its corresponding regional modifier and clamped.
 *
 * @internal — Not exported. Will be activated in Phase 18.3.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function applyModifierMap(
    weights: CategoryWeights,
    modifiers: RegionScoringModifiers
): CategoryWeights {
    return {
        outageResilience:      Math.round(weights.outageResilience      * clamp(modifiers.outageResilienceMultiplier)),
        smartTariffSuitability: Math.round(weights.smartTariffSuitability * clamp(modifiers.smartTariffSuitabilityMultiplier)),
        climateSuitability:    Math.round(weights.climateSuitability    * clamp(modifiers.climateSuitabilityMultiplier)),
        wholeHomeCapability:   Math.round(weights.wholeHomeCapability   * clamp(modifiers.wholeHomeCapabilityMultiplier)),
        modularScalability:    Math.round(weights.modularScalability    * clamp(modifiers.modularScalabilityMultiplier)),
        diySuitability:        Math.round(weights.diySuitability        * clamp(modifiers.diySuitabilityMultiplier)),
        retrofitFriendliness:  Math.round(weights.retrofitFriendliness  * clamp(modifiers.retrofitFriendlinessMultiplier)),
        spaceEfficiency:       Math.round(weights.spaceEfficiency       * clamp(modifiers.spaceEfficiencyMultiplier)),
        longTermRoi:           Math.round(weights.longTermRoi           * clamp(modifiers.longTermRoiMultiplier)),
        budgetAlignment:       Math.round(weights.budgetAlignment       * clamp(modifiers.budgetAlignmentMultiplier)),
    };
}
