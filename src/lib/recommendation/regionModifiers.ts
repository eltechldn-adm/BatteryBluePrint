/**
 * src/lib/recommendation/regionModifiers.ts
 *
 * Regional scoring modifier layer for the BatteryBlueprint recommendation engine.
 *
 * Phase 18.3: ACTIVE — applyModifierMap() is live.
 * Regional scoring multipliers are fully applied when a RegionProfile is provided.
 * Activation completed in Phase 18.3; the engine passes the resolved RegionProfile
 * through scoreBattery() → applyRegionalModifiers() → applyModifierMap().
 *
 * Design contract:
 * - Pure function: no side effects, deterministic
 * - Input: current weight map + RegionProfile
 * - Output: adjusted weight map with per-dimension multipliers applied
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
 * Phase 18.3: ACTIVE — full implementation.
 * Each scoring dimension is multiplied by its corresponding regional modifier
 * and clamped to [0.5, 2.0] before being passed to the scoring engine.
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

    return applyModifierMap(weights, region.scoringModifiers);
}

/**
 * Applies a RegionScoringModifiers map to a CategoryWeights object.
 * Each weight is multiplied by its corresponding regional modifier and clamped.
 *
 * @internal — Not exported. Active since Phase 18.3.
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
