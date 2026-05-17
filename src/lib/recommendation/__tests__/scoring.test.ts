import { scoreBattery } from '../scoring';
import { HomeownerProfile } from '../types';
import { BATTERY_DATABASE } from '@/data/batteries';
import { getDynamicWeights } from '../weights';

describe('Scoring Engine', () => {
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

    it('should assign higher outageResilience score for Whole-Home setups', () => {
        const tesla = BATTERY_DATABASE.find(b => b.id === 'tesla-powerwall-3')!;
        const growatt = BATTERY_DATABASE.find(b => b.id === 'growatt-ark')!;
        
        const profile: HomeownerProfile = { ...baseProfile, backupGoal: 'Whole-Home' };
        
        const teslaScore = scoreBattery(tesla, profile);
        const growattScore = scoreBattery(growatt, profile);
        
        expect(teslaScore.breakdown.outageResilience).toBeGreaterThan(growattScore.breakdown.outageResilience);
        expect(teslaScore.breakdown.wholeHomeCapability).toBeGreaterThan(growattScore.breakdown.wholeHomeCapability);
    });

    it('should assign high DIY score for server rack batteries', () => {
        const eg4 = BATTERY_DATABASE.find(b => b.id === 'eg4-wallmount')!;
        const tesla = BATTERY_DATABASE.find(b => b.id === 'tesla-powerwall-3')!;
        
        const profile: HomeownerProfile = { ...baseProfile, installerPreference: 'DIY' };
        
        const eg4Score = scoreBattery(eg4, profile);
        const teslaScore = scoreBattery(tesla, profile);
        
        expect(eg4Score.breakdown.diySuitability).toBeGreaterThan(teslaScore.breakdown.diySuitability);
    });
    
    it('dynamic weights should increase smart tariff weight for Dynamic/Agile', () => {
        const profile: HomeownerProfile = { ...baseProfile, utilityTariff: 'Dynamic/Agile' };
        const weights = getDynamicWeights(profile);
        expect(weights.smartTariffSuitability).toBeGreaterThan(10);
    });
});
