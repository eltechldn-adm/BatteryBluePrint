import { generateBatteryRecommendations } from '../engine';
import { HomeownerProfile } from '../types';

describe('Recommendation Logic Engine', () => {
    const baseProfile: HomeownerProfile = {
        outageFrequency: 'Rare',
        outageDuration: '< 2 hrs',
        evOwnership: 'None',
        solarOwnership: 'None',
        climate: 'Mild',
        utilityTariff: 'Flat Rate',
        backupGoal: 'None',
        budgetSensitivity: 'Moderate',
        installSpace: 'Spacious Garage',
        installerPreference: 'Professional',
        expansionNeeds: 'Fixed'
    };

    it('should return a full recommendation result', () => {
        const result = generateBatteryRecommendations(baseProfile);
        
        expect(result.topRecommendation).toBeDefined();
        expect(result.topRecommendation?.battery.model).toBeDefined();
        expect(result.topRecommendation?.explanation.whySelected.length).toBeGreaterThan(0);
        
        expect(result.budgetAlternative).toBeDefined();
        expect(result.premiumAlternative).toBeDefined();
        expect(result.archetypeMatch).toBeDefined();
    });

    it('should fall back to empty when all batteries excluded (edge case)', () => {
        // Impossible profile: DIY, Microinverters, Outdoor, Extreme Cold
        const impossibleProfile: HomeownerProfile = {
            ...baseProfile,
            installerPreference: 'DIY',
            solarOwnership: 'Existing Microinverters',
            installSpace: 'Outdoor',
            climate: 'Extreme Cold'
        };

        const result = generateBatteryRecommendations(impossibleProfile);
        
        // At least one exclusion should have occurred
        expect(result.excludedSystems.length).toBeGreaterThan(0);
        
        // It's possible nothing remains
        if (result.topRecommendation === null) {
            expect(result.budgetAlternative).toBeNull();
            expect(result.premiumAlternative).toBeNull();
        }
    });

    it('should generate explanations with no marketing language', () => {
        const result = generateBatteryRecommendations(baseProfile);
        if (result.topRecommendation) {
            const exp = result.topRecommendation.explanation.whySelected;
            expect(exp).not.toMatch(/amazing|perfect|best choice|incredible/i);
            expect(exp).toMatch(/achieved the highest engineering match score/i);
        }
    });
});
