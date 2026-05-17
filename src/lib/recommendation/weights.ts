import { HomeownerProfile } from "./types";

export const BASE_WEIGHTS = {
    outageResilience: 10,
    smartTariffSuitability: 10,
    climateSuitability: 10,
    wholeHomeCapability: 10,
    modularScalability: 10,
    diySuitability: 10,
    retrofitFriendliness: 10,
    spaceEfficiency: 10,
    longTermRoi: 10,
    budgetAlignment: 10,
};

export type CategoryWeights = typeof BASE_WEIGHTS;

/**
 * Adjusts base weights depending on the profile's explicit priorities.
 * For example, if someone has frequent outages, outageResilience weight goes up.
 */
export function getDynamicWeights(profile: HomeownerProfile): CategoryWeights {
    const weights = { ...BASE_WEIGHTS };

    // Outage & Backup adjustments
    if (profile.outageFrequency === 'Weekly' || profile.outageDuration === 'Multi-day') {
        weights.outageResilience += 15;
    }
    if (profile.backupGoal === 'Whole-Home') {
        weights.wholeHomeCapability += 20;
    }

    // Solar / Retrofit adjustments
    if (profile.solarOwnership.includes('Existing')) {
        weights.retrofitFriendliness += 15;
    }

    // Tariff adjustments
    if (profile.utilityTariff === 'Dynamic/Agile') {
        weights.smartTariffSuitability += 20;
    }

    // Budget adjustments
    if (profile.budgetSensitivity === 'Strict') {
        weights.budgetAlignment += 20;
        weights.longTermRoi += 10;
    } else if (profile.budgetSensitivity === 'Premium') {
        weights.budgetAlignment -= 5;
    }

    // Space & Install adjustments
    if (profile.installSpace === 'Tight Indoor') {
        weights.spaceEfficiency += 15;
    }
    if (profile.installerPreference === 'DIY') {
        weights.diySuitability += 25;
    }

    // Expansion adjustments
    if (profile.expansionNeeds === 'Likely to Expand') {
        weights.modularScalability += 15;
    }

    return weights;
}
