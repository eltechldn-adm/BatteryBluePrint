/**
 * src/data/regions/uk.ts
 *
 * United Kingdom RegionProfile.
 *
 * Data sources:
 * - Ofgem Smart Export Guarantee: https://www.ofgem.gov.uk/check-if-energy-price-cap-affects-you
 * - HMRC 0% VAT on solar/battery: https://www.gov.uk/government/publications/vat-notice-708-8-energy-saving-materials
 * - National Grid ESO reliability: https://www.nationalgrideso.com/industry-information/balancing-services
 * - MCS certification: https://mcscertified.com/
 * - G98/G99 DNO notification: https://www.energynetworks.org/industry-hub/resource-library/?id=17385
 * - Octopus Agile: https://octopus.energy/agile/
 *
 * Last reviewed: 2026-05-17
 */

import { RegionProfile, NEUTRAL_MODIFIERS } from './schema';

export const UK_REGION: RegionProfile = {
    id: 'uk',
    countryCode: 'GB',
    displayName: 'United Kingdom',

    // === Climate ===
    // UK has an oceanic/temperate climate. Temperatures rarely fall below -5°C in most of England
    // and Wales. Scotland can see -10°C in winter. Summers rarely exceed 30°C outside of extreme events.
    climateZone: 'temperate',
    avgSummerTempC: 20,
    avgWinterTempC: 4,
    wildfireRisk: 'none',
    humidityLevel: 'moderate',

    // === Grid ===
    // The UK grid is one of the most reliable in the world. Great Britain averages under 1 hour of
    // interruption per customer per year (OFGEM Customer Interruptions data).
    // Source: https://www.ofgem.gov.uk/sites/default/files/2024-01/DSO_Report_2023.pdf
    gridReliability: 'stable',
    gridReliabilityNote:
        'The Great Britain transmission network is among the most reliable globally, with average customer interruptions of under 1 hour per year (Ofgem, 2023). Battery backup is primarily justified by tariff arbitrage and export revenue rather than outage resilience.',

    // === Tariffs ===
    // Most UK residential customers are on a single-rate (flat) tariff or Economy 7.
    // Dynamic tariffs (Octopus Agile, Intelligent Octopus) are growing rapidly.
    // Smart Export Guarantee (SEG) provides a per-kWh export rate.
    dominantTariff: 'flat-rate',
    tariffNote:
        'Most UK households are on flat-rate or Economy 7 tariffs. Dynamic agile tariffs (Octopus Agile, Intelligent Octopus) are available to ~12% of meter points as of 2025 and are growing. The Smart Export Guarantee (SEG) pays homeowners per kWh exported to the grid.',
    exportOpportunity: 'good',

    // === Solar Architecture ===
    // UK solar is almost entirely string-inverter based. Enphase microinverters have a small
    // market share. SolarEdge, Fronius, GivEnergy, and Growatt dominate new installs.
    solarArchitectureNorm: 'string-inverter',
    solarArchitectureNote:
        'UK residential solar is dominated by string inverter systems (SolarEdge, Fronius, Growatt, GivEnergy). Microinverters represent a small minority. The GivEnergy hybrid inverter ecosystem has grown significantly since 2022, making AC-coupled battery retrofits the norm.',

    // === Incentives ===
    incentivePrograms: [
        {
            id: 'uk-vat-zero',
            name: '0% VAT on Solar Panels, Batteries & Heat Pumps',
            type: 'vat-relief',
            status: 'active',
            valueDescription:
                'Installations of solar panels, battery storage, and qualifying energy-saving materials are charged at 0% VAT (reduced from the standard 20% rate). Applied directly at point of sale by MCS-registered installers.',
            stackable: true,
            installerRequired: false, // VAT applies to the supply, not installer certification
            expiryNote: 'The 0% rate was confirmed in the Spring Budget 2022 and applies until at least 2027. Subject to future government review.',
            sourceUrl:
                'https://www.gov.uk/guidance/vat-relief-on-energy-saving-materials',
            lastVerified: '2026-05-17',
        },
        {
            id: 'uk-seg',
            name: 'Smart Export Guarantee (SEG)',
            type: 'smart-export',
            status: 'active',
            valueDescription:
                'Mandatory minimum export tariff for licensed electricity suppliers with over 150,000 customers. Rates vary by supplier — typically 4–15p/kWh. Some tariffs (e.g. Octopus Agile Export) pay dynamic rates that can reach 20p+ during peak demand.',
            stackable: true,
            installerRequired: true, // MCS-certified installation required to qualify
            expiryNote: 'No fixed end date. Rates are set by each supplier and reviewed periodically.',
            sourceUrl:
                'https://www.ofgem.gov.uk/environmental-and-social-schemes/smart-export-guarantee-seg',
            lastVerified: '2026-05-17',
        },
        {
            id: 'uk-eco4',
            name: 'Energy Company Obligation (ECO4)',
            type: 'rebate',
            status: 'active',
            valueDescription:
                'Government-mandated scheme requiring large energy suppliers to fund energy efficiency improvements for eligible low-income households. Solar and battery storage may be included for qualifying homes. Full grant available for eligible households.',
            stackable: false,
            installerRequired: true,
            expiryNote: 'ECO4 runs to March 2026. A successor scheme (ECO5 or equivalent) is anticipated but not yet confirmed.',
            sourceUrl:
                'https://www.gov.uk/government/publications/energy-company-obligation-eco-help-to-heat-scheme-2022-to-2026',
            lastVerified: '2026-05-17',
        },
        {
            id: 'uk-gbis',
            name: 'Great British Insulation Scheme (GBIS)',
            type: 'rebate',
            status: 'active',
            valueDescription:
                'Targets households in the lower half of council tax bands and EPC ratings D–G. Focuses on insulation rather than battery storage, but reduces overall home energy demand — improving the financial case for battery storage.',
            stackable: true,
            installerRequired: true,
            expiryNote: 'Runs to March 2026.',
            sourceUrl:
                'https://www.gov.uk/government/publications/great-british-insulation-scheme',
            lastVerified: '2026-05-17',
        },
    ],
    incentiveSummary:
        'The UK offers a 0% VAT rate on solar panel and battery installations, removing a significant cost barrier for homeowners. The Smart Export Guarantee (SEG) provides a mandatory export payment from energy suppliers, with dynamic tariff providers (such as Octopus) offering competitive rates. MCS certification of the installer is required for SEG eligibility. The ECO4 scheme provides full grants for low-income households until March 2026.',

    // === Regulatory Constraints ===
    regulatoryConstraints: [
        {
            id: 'uk-g98-g99',
            type: 'interconnection',
            description:
                'All battery storage systems with inverters up to 3.68 kW single-phase (G98) or above (G99) must comply with Engineering Recommendation G98/G99. G98 systems require simple DNO notification; G99 systems require prior written DNO approval, which can take up to 45 working days.',
            impactOnRecommendation:
                'Larger battery systems (typically above one Powerwall 3 or two Enphase IQ 5P units) will require DNO approval before installation. Factor in a 6–10 week lead time for DNO consent. Your installer should manage this process.',
            sourceUrl:
                'https://www.energynetworks.org/industry-hub/resource-library/?id=17385',
            lastVerified: '2026-05-17',
        },
        {
            id: 'uk-mcs',
            type: 'certification',
            description:
                'MCS (Microgeneration Certification Scheme) certification is required for installers to issue SEG-eligible certificates and to qualify installations for government schemes. MCS also certifies the products themselves.',
            impactOnRecommendation:
                'Always verify your installer holds current MCS certification. Without it, you cannot register for the Smart Export Guarantee or access government grant schemes. Non-MCS installation is legal but excludes you from financial support.',
            sourceUrl: 'https://mcscertified.com/find-an-installer/',
            lastVerified: '2026-05-17',
        },
        {
            id: 'uk-bs7671',
            type: 'installation-standard',
            description:
                'All electrical work in the UK must comply with BS 7671 (IET Wiring Regulations, 18th Edition). Battery installations require a Part P-compliant electrician or self-certification scheme member.',
            impactOnRecommendation:
                'Ensure your installer is registered with a competent person scheme (NICEIC, NAPIT, or equivalent). This is a legal requirement for notifiable electrical work.',
            sourceUrl:
                'https://www.theiet.org/media/1283/bs-7671-overview.pdf',
            lastVerified: '2026-05-17',
        },
    ],

    // === Installation Reality ===
    installationNotes:
        'UK battery installations are predominantly indoor wall-mounted units in garages, utility rooms, or under stairs. Outdoor installation is rare and typically only for IP65+ rated units due to the damp climate. The standard UK split consumer unit often requires an upgrade for whole-home backup capability. Most UK installers favour AC-coupled systems using a hybrid inverter (GivEnergy, SolarEdge, Solis) or a dedicated battery inverter.',
    outdoorInstallNorm: false,

    // === Recommendation Biases ===
    // UK: mild climate means no strong chemistry bias. AC-coupled is the norm for retrofits.
    // Export opportunity is good (SEG), so smart tariff suitability gets a modest boost.
    chemistryBias: 'lfp',
    couplingBias: 'ac-preferred',
    scoringModifiers: {
        ...NEUTRAL_MODIFIERS,
        // Stable UK grid → backup resilience is lower priority than in US
        outageResilienceMultiplier: 0.7,
        // Growing dynamic tariff adoption (Octopus Agile) → tariff arbitrage matters more
        smartTariffSuitabilityMultiplier: 1.6,
        // Mild UK climate → no extreme thermal penalty, but LFP preferred for longevity
        climateSuitabilityMultiplier: 1.1,
        // MCS certification required for incentives → DIY harder to monetise
        diySuitabilityMultiplier: 0.8,
        // Good SEG export opportunity → long-term ROI via export revenue is real
        longTermRoiMultiplier: 1.3,
        // Mainly retrofitting existing string inverter systems
        retrofitFriendlinessMultiplier: 1.4,
    },

    // === Data Quality ===
    dataConfidence: 'high',
    lastReviewed: '2026-05-17',
    reviewNote:
        'Incentive landscape stable as of May 2026. Monitor ECO5 successor scheme announcement expected H2 2026. SEG rates subject to quarterly supplier review.',

    // === Future Hooks ===
    installerNetworkAvailable: false,
    affiliateOpportunities: [
        'MCS installer directory integration (Phase 18.6)',
        'Octopus Agile affiliate referral (Phase 19)',
        'GivEnergy/SolarEdge installer partner program (Phase 19)',
    ],
};
