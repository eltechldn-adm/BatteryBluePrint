import { BatteryModel } from "@/data/batteries";
import { HomeownerProfile, RecommendationScore } from "./types";
import { getDynamicWeights } from "./weights";
import { applyRegionalModifiers } from "./regionModifiers";
import { RegionProfile } from "@/data/regions/schema";

function normalize(value: number, min: number, max: number): number {
    if (max === min) return 0.5;
    const clamped = Math.max(min, Math.min(max, value));
    return (clamped - min) / (max - min);
}

export function scoreBattery(battery: BatteryModel, profile: HomeownerProfile, region?: RegionProfile): RecommendationScore {
    let weights = getDynamicWeights(profile);
    if (region) {
        weights = applyRegionalModifiers(weights, region);
    }
    const breakdown = {
        outageResilience: 0,
        smartTariffSuitability: 0,
        climateSuitability: 0,
        wholeHomeCapability: 0,
        modularScalability: 0,
        diySuitability: 0,
        retrofitFriendliness: 0,
        spaceEfficiency: 0,
        longTermRoi: 0,
        budgetAlignment: 0
    };

    // 1. Outage Resilience
    // Higher capacity and peak output yields better resilience
    const capacityScore = normalize(battery.usable_kWh_per_unit || 0, 2, 15);
    const outputScore = normalize(battery.peak_output_kW || battery.continuous_output_kW || 0, 2, 12);
    breakdown.outageResilience = ((capacityScore * 0.5) + (outputScore * 0.5)) * weights.outageResilience;

    // 2. Smart Tariff Suitability
    // Specific models like GivEnergy or Tesla are great for this
    let smartScore = 0;
    if (battery.smart_tariff_integration) {
        smartScore = 1;
    } else if (['Tesla', 'sonnen', 'GivEnergy'].includes(battery.brand)) {
        smartScore = 0.8;
    } else if (battery.category === 'DIY/ServerRack') {
        smartScore = 0.2; // Reliant entirely on 3rd party inverter
    } else {
        smartScore = 0.5;
    }
    breakdown.smartTariffSuitability = smartScore * weights.smartTariffSuitability;

    // 3. Climate Suitability
    let climateScore = 0.8; // Default good
    if (profile.climate === 'Extreme Heat') {
        climateScore = battery.chemistry === 'LiFePO4' ? 1.0 : 0.4;
    }
    breakdown.climateSuitability = climateScore * weights.climateSuitability;

    // 4. Whole Home Capability
    let wholeHomeScore = 0;
    if (battery.blackout_support === 'Whole-Home') {
        wholeHomeScore = 1;
    } else if (battery.blackout_support === 'Partial') {
        // High continuous output might still support large loads
        wholeHomeScore = (battery.continuous_output_kW || 0) > 7 ? 0.7 : 0.3;
    } else {
        wholeHomeScore = 0;
    }
    breakdown.wholeHomeCapability = wholeHomeScore * weights.wholeHomeCapability;

    // 5. Modular Scalability
    const scaleScore = battery.modular_expansion 
        ? normalize(battery.max_expansion_units || 1, 1, 16)
        : 0;
    breakdown.modularScalability = scaleScore * weights.modularScalability;

    // 6. DIY Suitability
    let diyScore = 0;
    if (battery.category === 'DIY/ServerRack') {
        diyScore = 1.0;
    } else if (battery.category === 'Mid-Range') {
        diyScore = 0.6;
    } else {
        diyScore = 0.1; // Premium usually requires pro install
    }
    breakdown.diySuitability = diyScore * weights.diySuitability;

    // 7. Retrofit Friendliness
    let retrofitScore = 0;
    if (battery.coupling === 'AC') {
        retrofitScore = 1.0; // Easiest to retrofit
    } else if (battery.coupling === 'DC' && !battery.inverter_included) {
        retrofitScore = 0.5; // Requires matching hybrid inverter
    } else if (battery.coupling === 'Hybrid') {
        retrofitScore = 0.7; // Often replaces existing inverter
    }
    breakdown.retrofitFriendliness = retrofitScore * weights.retrofitFriendliness;

    // 8. Space Efficiency
    let spaceScore = 0.5;
    if (battery.dimensions_mm) {
        // volume in liters
        const volumeLiters = (battery.dimensions_mm.h * battery.dimensions_mm.w * battery.dimensions_mm.d) / 1000000;
        const kwhPerLiter = (battery.usable_kWh_per_unit || 1) / volumeLiters;
        // higher energy density is better for tight spaces
        spaceScore = normalize(kwhPerLiter, 0.05, 0.15);
    }
    breakdown.spaceEfficiency = spaceScore * weights.spaceEfficiency;

    // 9. Long-Term ROI
    const cycleScore = normalize(battery.cycle_life || 4000, 4000, 10000);
    const warrantyScore = normalize(battery.warranty_years || 10, 10, 15);
    breakdown.longTermRoi = ((cycleScore * 0.6) + (warrantyScore * 0.4)) * weights.longTermRoi;

    // 10. Budget Alignment
    // Estimate cost per usable kWh using structured numeric fields.
    // Falls back to the legacy string parser only when numeric fields are absent.
    let budgetScore = 0.5;
    if (battery.price_min_usd !== null && battery.usable_kWh_per_unit) {
        const costPerKwh = battery.price_min_usd / battery.usable_kWh_per_unit;
        // Lower cost per kWh = better budget alignment
        budgetScore = 1 - normalize(costPerKwh, 250, 1000);
    } else if (battery.price_range_usd) {
        // Legacy fallback: extract first number from the string
        const parts = battery.price_range_usd.split("-");
        const minCost = parseInt(parts[0].replace(/[^0-9]/g, ""), 10);
        if (!isNaN(minCost) && battery.usable_kWh_per_unit) {
            const costPerKwh = minCost / battery.usable_kWh_per_unit;
            budgetScore = 1 - normalize(costPerKwh, 250, 1000);
        }
    }
    breakdown.budgetAlignment = budgetScore * weights.budgetAlignment;

    // Calculate total
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    return {
        total,
        breakdown
    };
}
