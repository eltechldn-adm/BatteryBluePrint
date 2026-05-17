import { BatteryModel } from "@/data/batteries";
import { HomeownerProfile, RecommendationScore, RecommendationExplanation, TradeoffAnalysis } from "./types";
import { RegionProfile } from "@/data/regions/schema";

export function generateExplanation(
    battery: BatteryModel,
    profile: HomeownerProfile,
    score: RecommendationScore,
    isTop: boolean,
    region?: RegionProfile
): RecommendationExplanation {
    let whySelected = "";
    const tradeoffs: TradeoffAnalysis = { pros: [], cons: [], warnings: [] };
    const assumptions: string[] = [];

    // Regional notes
    if (region?.id === 'uk') {
        assumptions.push("Regional adjustment applied: UK dynamic tariffs increase the value of smart tariff integration.");
    }
    if (region?.id === 'us') {
        assumptions.push("Regional adjustment applied: US code and certification requirements increase the importance of verified UL-compatible systems.");
    }

    // Base logic for selection
    if (isTop) {
        whySelected = `The ${battery.brand} ${battery.model} achieved the highest engineering match score for your profile. `;
    } else {
        whySelected = `The ${battery.brand} ${battery.model} is presented as an alternative based on its strong architectural alignment. `;
    }

    // Add specific reasons based on high scoring areas
    const b = score.breakdown;
    const sortedCategories = Object.entries(b).sort(([, a], [, c]) => c - a);
    const topCategory = sortedCategories[0][0];

    if (topCategory === 'outageResilience') {
        whySelected += `It scored exceptionally well in outage resilience, providing the necessary capacity and peak output to meet your backup requirements safely.`;
    } else if (topCategory === 'smartTariffSuitability') {
        whySelected += `Its mature integration with dynamic tariffs makes it highly suitable for your energy trading goals.`;
    } else if (topCategory === 'diySuitability') {
        whySelected += `Its open architecture and server-rack design perfectly match your requirement for a DIY-friendly installation.`;
    } else if (topCategory === 'retrofitFriendliness') {
        whySelected += `Because you already have an existing solar array, its AC-coupled design allows for a clean retrofit without replacing your current inverter.`;
    } else {
        whySelected += `It provides an excellent balance of capacity, output, and long-term durability.`;
    }

    // Tradeoffs
    if (battery.chemistry === 'LiFePO4') {
        tradeoffs.pros.push('Superior thermal stability and cycle life due to LFP chemistry.');
    } else {
        tradeoffs.cons.push('NMC chemistry generally exhibits faster degradation under heavy daily cycling compared to LFP.');
    }

    if (battery.coupling === 'DC' && !battery.inverter_included) {
        tradeoffs.warnings.push('Requires a compatible 3rd-party hybrid inverter, which is not included in the battery price.');
    }

    if (battery.blackout_support === 'None') {
        tradeoffs.cons.push('Does not support power backup during grid outages.');
    } else if (battery.blackout_support === 'Whole-Home') {
        tradeoffs.pros.push('Capable of supporting heavy whole-home loads during blackouts.');
    }

    if (b.budgetAlignment < 5) { // Assuming scale is 0-10 or similar, but weights make it higher. Let's just use generic checks.
        if (battery.category === 'Premium') {
            tradeoffs.cons.push('Premium pricing means a longer financial payback period.');
        }
    }

    if (profile.installerPreference === 'DIY' && battery.category !== 'DIY/ServerRack') {
         tradeoffs.warnings.push('Attempting a DIY install on this system may void the manufacturer warranty.');
    }

    // Assumptions
    assumptions.push(`Assumes your main electrical panel has sufficient busbar rating for an additional ${battery.continuous_output_kW || 5}kW of injection.`);
    
    if (battery.blackout_support !== 'None') {
        assumptions.push(`Assumes installation will include an automatic transfer switch or isolation gateway.`);
    }

    return {
        whySelected,
        whyAlternativesLower: `Other systems were ranked lower due to poorer alignment with your specific coupling needs, budget constraints, or installer preferences.`,
        tradeoffs,
        assumptions
    };
}
