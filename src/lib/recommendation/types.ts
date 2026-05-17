import { BatteryModel } from "@/data/batteries";

export type OutageFrequency = 'Rare' | 'Few times a year' | 'Weekly';
export type OutageDuration = '< 2 hrs' | '2-12 hrs' | 'Multi-day';
export type EVOwnership = 'None' | '1' | '2+';
export type SolarOwnership = 'None' | 'Existing String' | 'Existing Microinverters' | 'Planning New';
export type Climate = 'Mild' | 'Extreme Cold' | 'Extreme Heat';
export type UtilityTariff = 'Flat Rate' | 'Time of Use (TOU)' | 'Dynamic/Agile' | 'Net Metering';
export type BackupGoal = 'None' | 'Critical Loads' | 'Whole-Home';
export type BudgetSensitivity = 'Strict' | 'Moderate' | 'Premium';
export type InstallSpace = 'Tight Indoor' | 'Spacious Garage' | 'Outdoor';
export type InstallerPreference = 'DIY' | 'Professional';
export type ExpansionNeeds = 'Fixed' | 'Likely to Expand';
export type Archetype = 'Backup Security' | 'ROI Optimizer' | 'DIY Builder' | 'Smart Tariff Maximizer' | 'Off-Grid Preparedness' | 'Balanced';

export interface HomeownerProfile {
    outageFrequency: OutageFrequency;
    outageDuration: OutageDuration;
    evOwnership: EVOwnership;
    solarOwnership: SolarOwnership;
    climate: Climate;
    utilityTariff: UtilityTariff;
    backupGoal: BackupGoal;
    budgetSensitivity: BudgetSensitivity;
    installSpace: InstallSpace;
    installerPreference: InstallerPreference;
    expansionNeeds: ExpansionNeeds;
    targetUsableKwh?: number;
}

export interface HardExclusionReason {
    batteryId: string;
    batteryModel: string;
    reason: string;
    explanation: string;
}

export interface RecommendationScore {
    total: number;
    breakdown: {
        outageResilience: number;
        smartTariffSuitability: number;
        climateSuitability: number;
        wholeHomeCapability: number;
        modularScalability: number;
        diySuitability: number;
        retrofitFriendliness: number;
        spaceEfficiency: number;
        longTermRoi: number;
        budgetAlignment: number;
    };
}

export interface TradeoffAnalysis {
    pros: string[];
    cons: string[];
    warnings: string[];
}

export interface RecommendationExplanation {
    whySelected: string;
    whyAlternativesLower: string;
    tradeoffs: TradeoffAnalysis;
    assumptions: string[];
}

export interface BatteryRankingResult {
    battery: BatteryModel;
    score: RecommendationScore;
    explanation: RecommendationExplanation;
}

export interface RecommendationResult {
    topRecommendation: BatteryRankingResult | null;
    budgetAlternative: BatteryRankingResult | null;
    premiumAlternative: BatteryRankingResult | null;
    excludedSystems: HardExclusionReason[];
    archetypeMatch: Archetype;
}
