/**
 * src/data/regions/us.ts
 *
 * United States National RegionProfile.
 *
 * This is the country-level baseline. State sub-regions (us-ca, us-tx, us-fl)
 * will inherit from this profile and override only the fields that differ.
 *
 * Data sources:
 * - IRS Form 5695 (Residential Clean Energy Credit): https://www.irs.gov/forms-pubs/about-form-5695
 * - DOE Residential Clean Energy Credit: https://www.energy.gov/eere/solar/homeowners-guide-federal-tax-credit-solar-photovoltaics
 * - EIA Electric Power Monthly: https://www.eia.gov/electricity/monthly/
 * - NERC Reliability: https://www.nerc.com/pa/RAPA/PA/Pages/default.aspx
 * - NEC 2023 (NFPA 70): https://www.nfpa.org/codes-and-standards/nfpa-70-standard-for-electrical-installations/70
 * - UL 9540 (Battery Energy Storage): https://www.ul.com/resources/ul-9540-standard-energy-storage-systems
 * - Enphase market share: https://www.woodmac.com/news/editorial/enphase-vs-solaredge/
 *
 * Last reviewed: 2026-05-17
 */

import { RegionProfile, NEUTRAL_MODIFIERS } from './schema';

export const US_REGION: RegionProfile = {
    id: 'us',
    countryCode: 'US',
    displayName: 'United States',

    // === Climate ===
    // The US spans multiple climate zones. The national profile uses 'continental'
    // as the most representative default for the largest population centres
    // (Midwest, Southeast, mid-Atlantic). Sub-regions override this.
    climateZone: 'continental',
    avgSummerTempC: 28,  // Represents a national weighted average — wide variance
    avgWinterTempC: 2,   // Excludes Alaska; Sun Belt winters are much milder
    wildfireRisk: 'low', // Low at national level — elevated in sub-regions (CA, OR, WA)
    humidityLevel: 'moderate',

    // === Grid ===
    // US grid reliability varies enormously. The national average is approximately
    // 4–8 hours of customer interruption per year, placing it in 'moderate'.
    // Rural areas and states with aging infrastructure (TX, PR) are significantly worse.
    // Source: EIA Electric Power Annual, SAIDI/SAIFI data.
    gridReliability: 'moderate',
    gridReliabilityNote:
        'US grid reliability averages 4–8 hours of customer interruption per year nationally (EIA SAIDI data), though this varies enormously by region. Texas (ERCOT) and areas in the Southeast and rural Midwest experience significantly higher outage rates. Battery backup provides meaningful resilience value for most US homeowners.',

    // === Tariffs ===
    // Most US residential customers are on flat-rate tariffs. TOU tariffs are
    // mandated or strongly incentivised in California, Nevada, and parts of New England.
    // Net Metering (NEM) is the dominant export compensation mechanism nationally,
    // though NEM 3.0 in California significantly reduced its value.
    dominantTariff: 'tou',
    tariffNote:
        'US tariff structures are highly state-dependent. Flat-rate tariffs dominate in the Southeast and Midwest. Time-of-Use (TOU) tariffs are growing and are default in California, Nevada, and parts of the Northeast. Net Metering provides export credit in 38+ states, though California\'s NEM 3.0 (2023) shifted economics toward self-consumption. Dynamic tariffs are available but rare at residential level.',
    exportOpportunity: 'good',

    // === Solar Architecture ===
    // Enphase microinverters hold the largest market share in US residential solar
    // (approximately 50%+ of new residential installs as of 2024).
    // SolarEdge string inverters are the second-largest segment.
    // This has major coupling implications for battery recommendations.
    solarArchitectureNorm: 'microinverter-dominant',
    solarArchitectureNote:
        'Enphase microinverters dominate US residential solar installation, estimated at over 50% of new residential installs (Wood Mackenzie, 2024). SolarEdge DC-optimised string inverters hold the second-largest share. This makes AC-coupled battery storage the most common retrofit scenario. DC-coupled systems (EG4, Pylontech) are primarily used in new-build or DIY off-grid configurations.',

    // === Incentives ===
    incentivePrograms: [
        {
            id: 'us-ira-25d',
            name: 'Federal Residential Clean Energy Credit (IRA Section 25D)',
            type: 'tax-credit',
            status: 'active',
            valueDescription:
                'A 30% federal tax credit on the cost of solar panels, battery storage (≥3 kWh), and qualifying installation labour. Applies to the total installed system cost. The credit is non-refundable but can be carried forward to future tax years.',
            stackable: true,
            installerRequired: false, // No specific installer certification required by IRS
            expiryNote:
                'The 30% rate applies through 2032. Steps down to 26% in 2033, 22% in 2034, then expires for residential in 2035 unless renewed. Introduced by the Inflation Reduction Act (2022).',
            sourceUrl:
                'https://www.energy.gov/eere/solar/homeowners-guide-federal-tax-credit-solar-photovoltaics',
            lastVerified: '2026-05-17',
        },
        {
            id: 'us-dsire',
            name: 'State & Utility Incentive Programs (DSIRE Database)',
            type: 'rebate',
            status: 'active',
            valueDescription:
                'Hundreds of state, utility, and local programs exist across the US — including rebates, property tax exemptions, and sales tax exemptions. Examples: NY-Sun Incentive Program, NYSERDA Clean Energy Fund, Colorado Energy Smart Program. Always check the DSIRE database for your specific utility and state.',
            stackable: true,
            installerRequired: false,
            sourceUrl: 'https://www.dsireusa.org/',
            lastVerified: '2026-05-17',
        },
    ],
    incentiveSummary:
        'The most significant US incentive is the 30% Federal Residential Clean Energy Credit (IRA Section 25D), which applies to solar panels and battery systems with at least 3 kWh of capacity, through 2032. This is available to any US homeowner with federal tax liability and does not require a specific installer certification. Additional state, utility, and local incentives vary widely — the DSIRE database (dsireusa.org) is the authoritative source for state-level programmes. Some states (California, New York) have particularly strong incentive stacks.',

    // === Regulatory Constraints ===
    regulatoryConstraints: [
        {
            id: 'us-nec',
            type: 'installation-standard',
            description:
                'All electrical installations must comply with the National Electrical Code (NFPA 70, NEC 2023 or the edition adopted by your state). Battery storage systems are covered under Article 706.',
            impactOnRecommendation:
                'Always use a licensed electrician for battery installation. Unpermitted work may void homeowner insurance and create liability if a fire occurs. Most jurisdictions require a permit for battery storage installations.',
            sourceUrl:
                'https://www.nfpa.org/codes-and-standards/nfpa-70-standard-for-electrical-installations/70',
            lastVerified: '2026-05-17',
        },
        {
            id: 'us-ul9540',
            type: 'certification',
            description:
                'Many US jurisdictions require battery storage systems to be listed to UL 9540 (Standard for Energy Storage Systems and Equipment). Individual battery modules may also need UL 9540A fire testing.',
            impactOnRecommendation:
                'Verify that any battery system purchased carries a valid UL 9540 listing. This is a prerequisite for permit approval in most US cities and for many utility interconnection agreements. All major brand-name systems (Tesla, Enphase, FranklinWH) carry this listing.',
            sourceUrl:
                'https://www.ul.com/resources/ul-9540-standard-energy-storage-systems',
            lastVerified: '2026-05-17',
        },
        {
            id: 'us-utility-interconnection',
            type: 'interconnection',
            description:
                'Utility interconnection applications are required before activating any grid-tied battery or solar system. Application timelines vary from 2 weeks (simple residential) to 6+ months (larger systems or complex utility territories).',
            impactOnRecommendation:
                'Factor in interconnection timeline when planning your installation. Your installer should file the application, but ultimate approval rests with your utility. Some utilities impose export limits that affect battery economics.',
            sourceUrl:
                'https://www.ferc.gov/industries-data/electric/electric-power-markets/interconnection',
            lastVerified: '2026-05-17',
        },
    ],

    // === Installation Reality ===
    installationNotes:
        'US battery installations vary significantly by region. In the Southwest and warm states, outdoor garage installation is common. In cold-climate states (Midwest, Northeast), indoor basement or conditioned-space installation is preferred due to cold-start temperature limitations. Most US homes have 200A service panels; a panel upgrade may be required for whole-home backup capability. The 120/240V split-phase system means battery inverters must support split-phase output for whole-home backup.',
    outdoorInstallNorm: true, // Common in warm-climate states; varies regionally

    // === Recommendation Biases ===
    // US national: moderate grid, microinverter-dominant, TOU tariffs growing.
    // No extreme climate bias at national level (overridden by sub-regions).
    chemistryBias: 'neutral',
    couplingBias: 'ac-preferred', // Microinverter dominance → AC-coupled batteries fit best
    scoringModifiers: {
        ...NEUTRAL_MODIFIERS,
        // Moderate grid reliability → backup resilience is a real value proposition
        outageResilienceMultiplier: 1.3,
        // Growing TOU tariffs → tariff arbitrage is relevant for a significant minority
        smartTariffSuitabilityMultiplier: 1.3,
        // Microinverter-dominant → AC-coupled retrofits are the norm
        retrofitFriendlinessMultiplier: 1.4,
        // Good Net Metering / IRA credit → long-term ROI story is strong
        longTermRoiMultiplier: 1.3,
        // Federal tax credit makes premium systems more accessible
        budgetAlignmentMultiplier: 1.1,
    },

    // === Data Quality ===
    dataConfidence: 'high',
    lastReviewed: '2026-05-17',
    reviewNote:
        'IRA Section 25D rates confirmed through 2032. State incentives change frequently — users should always verify via DSIRE. Monitor NEM 3.0 spread to additional states beyond California.',

    // === Future Hooks ===
    installerNetworkAvailable: false,
    affiliateOpportunities: [
        'Tesla Certified Installer referral programme (Phase 18.6)',
        'EnergySage marketplace affiliate (Phase 19)',
        'DSIRE state incentive page affiliate placement (Phase 19)',
    ],
};
