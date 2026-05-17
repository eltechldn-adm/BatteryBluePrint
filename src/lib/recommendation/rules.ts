import { BatteryModel } from "@/data/batteries";
import { HomeownerProfile, HardExclusionReason } from "./types";

export function getHardExclusions(profile: HomeownerProfile, batteries: BatteryModel[]): {
    excluded: HardExclusionReason[];
    remaining: BatteryModel[];
} {
    const excluded: HardExclusionReason[] = [];
    const remaining: BatteryModel[] = [];

    for (const battery of batteries) {
        let isExcluded = false;
        let reason = '';
        let explanation = '';

        // 1. Solar Type Exclusions
        if (profile.solarOwnership === 'Existing Microinverters' && battery.coupling === 'DC') {
            isExcluded = true;
            reason = 'Incompatible Coupling (Microinverters)';
            explanation = `Your existing microinverter setup outputs AC power directly from the roof, making it fundamentally incompatible with pure DC-coupled batteries like the ${battery.model} unless you undergo a major system redesign.`;
        }

        // 2. Installer Exclusions
        if (profile.installerPreference === 'DIY' && battery.category === 'Premium') {
            // Usually Tesla, Enphase, Franklin, SolarEdge are locked to certified installers.
            // Pylontech, EG4, Ruixu are DIY friendly.
            if (['Tesla', 'Enphase', 'FranklinWH', 'SolarEdge', 'LG Energy Solution'].includes(battery.brand)) {
                isExcluded = true;
                reason = 'Closed Ecosystem / Requires Certified Installer';
                explanation = `The ${battery.model} requires a brand-certified professional for installation, commissioning, and warranty validation, which directly conflicts with your preference for a DIY project.`;
            }
        }

        // 3. Location / IP Rating Exclusions
        if (profile.installSpace === 'Outdoor' && battery.install_location === 'Indoor') {
            isExcluded = true;
            reason = 'Insufficient Environmental Protection';
            explanation = `Outdoor installations require strict weatherproof IP ratings. The ${battery.model} is strictly rated for indoor use and would be unsafe or void its warranty if installed outside.`;
        }

        // 4. Climate Exclusions
        if (profile.climate === 'Extreme Cold' && battery.operating_temp_min_c !== null && battery.operating_temp_min_c > -10) {
            isExcluded = true;
            reason = 'Temperature Limits Exceeded';
            explanation = `Your region experiences extreme cold, but the ${battery.model} has a minimum operating temperature of ${battery.operating_temp_min_c}°C, risking shutdown or cell damage during winter.`;
        }

        if (isExcluded) {
            excluded.push({
                batteryId: battery.id,
                batteryModel: `${battery.brand} ${battery.model}`,
                reason,
                explanation
            });
        } else {
            remaining.push(battery);
        }
    }

    return { excluded, remaining };
}
