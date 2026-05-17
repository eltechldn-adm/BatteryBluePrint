import { getHardExclusions } from '../rules';
import { HomeownerProfile } from '../types';
import { BATTERY_DATABASE } from '@/data/batteries';

describe('Hard Exclusion Engine', () => {
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

    it('should exclude DC batteries when solar is Existing Microinverters', () => {
        const profile: HomeownerProfile = { ...baseProfile, solarOwnership: 'Existing Microinverters' };
        const { excluded, remaining } = getHardExclusions(profile, BATTERY_DATABASE);

        // Check if a known DC battery like BYD is excluded
        const bydExcluded = excluded.find(e => e.batteryId === 'byd-battery-box-premium-hvs');
        expect(bydExcluded).toBeDefined();
        expect(bydExcluded?.reason).toContain('Incompatible Coupling');

        // Check if a known AC battery like Enphase is remaining
        const enphaseRemaining = remaining.find(b => b.id === 'enphase-iq-5p');
        expect(enphaseRemaining).toBeDefined();
    });

    it('should exclude Premium closed-ecosystems when installer preference is DIY', () => {
        const profile: HomeownerProfile = { ...baseProfile, installerPreference: 'DIY' };
        const { excluded, remaining } = getHardExclusions(profile, BATTERY_DATABASE);

        // Tesla should be excluded
        const teslaExcluded = excluded.find(e => e.batteryId === 'tesla-powerwall-3');
        expect(teslaExcluded).toBeDefined();

        // EG4 should be remaining
        const eg4Remaining = remaining.find(b => b.id === 'eg4-wallmount');
        expect(eg4Remaining).toBeDefined();
    });

    it('should exclude IP20 indoor-only batteries when install space is Outdoor', () => {
        const profile: HomeownerProfile = { ...baseProfile, installSpace: 'Outdoor' };
        const { excluded, remaining } = getHardExclusions(profile, BATTERY_DATABASE);

        // Ruixu Sible is IP20 (Indoor)
        const ruixuExcluded = excluded.find(e => e.batteryId === 'ruixu-sible');
        expect(ruixuExcluded).toBeDefined();

        // Tesla PW3 is IP67 (Both)
        const teslaRemaining = remaining.find(b => b.id === 'tesla-powerwall-3');
        expect(teslaRemaining).toBeDefined();
    });
});
