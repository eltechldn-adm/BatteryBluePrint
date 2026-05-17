import { BATTERY_DATABASE, BatteryModel } from "@/data/batteries";
import { HomeownerProfile, RecommendationResult, BatteryRankingResult } from "./types";
import { getHardExclusions } from "./rules";
import { scoreBattery } from "./scoring";
import { generateExplanation } from "./explanations";
import { determineArchetype } from "./profiles";

export function generateBatteryRecommendations(profile: HomeownerProfile): RecommendationResult {
    // 1. Hard Exclusions
    const { excluded, remaining } = getHardExclusions(profile, BATTERY_DATABASE);

    if (remaining.length === 0) {
        return {
            topRecommendation: null,
            budgetAlternative: null,
            premiumAlternative: null,
            excludedSystems: excluded,
            archetypeMatch: determineArchetype(profile)
        };
    }

    // 2. Score remaining batteries
    const ranked: BatteryRankingResult[] = remaining.map(battery => {
        const score = scoreBattery(battery, profile);
        // We will generate explanations later once we know the final rank
        return {
            battery,
            score,
            explanation: { whySelected: '', whyAlternativesLower: '', tradeoffs: { pros: [], cons: [], warnings: [] }, assumptions: [] }
        };
    });

    // 3. Sort logic (Tie-breakers)
    // 1. Highest total score
    // 2. Highest cycle life
    // 3. Lowest cost (roughly estimated via category for now, or price string parsing if needed)
    ranked.sort((a, b) => {
        if (b.score.total !== a.score.total) {
            return b.score.total - a.score.total;
        }
        // Tie-breaker 1: Cycle life
        const cyclesB = b.battery.cycle_life || 0;
        const cyclesA = a.battery.cycle_life || 0;
        if (cyclesB !== cyclesA) {
            return cyclesB - cyclesA;
        }
        // Tie-breaker 2: Premium > Mid-Range for quality, or vice versa if budget is strict
        if (profile.budgetSensitivity === 'Strict') {
            const costA = a.battery.category === 'Premium' ? 2 : (a.battery.category === 'Mid-Range' ? 1 : 0);
            const costB = b.battery.category === 'Premium' ? 2 : (b.battery.category === 'Mid-Range' ? 1 : 0);
            return costA - costB; // lower cost first
        }
        
        return 0;
    });

    // 4. Select top, budget, premium
    const topRecommendation = ranked[0];
    
    // Find a budget alternative (highest scoring non-premium, or lower cost)
    let budgetAlternative = ranked.find(r => r.battery.id !== topRecommendation.battery.id && r.battery.category !== 'Premium') || null;
    
    // Find a premium/scalable alternative
    let premiumAlternative = ranked.find(r => r.battery.id !== topRecommendation.battery.id && r.battery.category === 'Premium' && (budgetAlternative ? r.battery.id !== budgetAlternative.battery.id : true)) || null;

    // 5. Generate Explanations
    topRecommendation.explanation = generateExplanation(topRecommendation.battery, profile, topRecommendation.score, true);
    
    if (budgetAlternative) {
        budgetAlternative.explanation = generateExplanation(budgetAlternative.battery, profile, budgetAlternative.score, false);
    }
    
    if (premiumAlternative) {
        premiumAlternative.explanation = generateExplanation(premiumAlternative.battery, profile, premiumAlternative.score, false);
    }

    return {
        topRecommendation,
        budgetAlternative,
        premiumAlternative,
        excludedSystems: excluded,
        archetypeMatch: determineArchetype(profile)
    };
}
