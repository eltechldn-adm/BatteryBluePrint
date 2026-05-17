/**
 * src/data/regions/schema.ts
 *
 * TypeScript schema for the BatteryBlueprint Regional Intelligence System.
 * Phase 18.1 PRD — implemented in Phase 18.2.
 *
 * All fields are build-time constants. No runtime APIs. No geolocation.
 * Fully static-export-safe and Cloudflare Pages compatible.
 */

// ─── Climate ─────────────────────────────────────────────────────────────────

export type ClimateZone =
    | 'temperate'       // UK, coastal US, Pacific NW — mild year-round
    | 'continental'     // Central/Eastern US, Canada — hot summers, cold winters
    | 'hot-arid'        // Southwest US, parts of AU (SA/WA) — sustained dry heat
    | 'hot-humid'       // Southeast US, QLD/NT Australia — heat + high humidity
    | 'extreme-cold'    // Northern Canada, Scandinavia — sustained sub-zero winters
    | 'mediterranean'   // Southern EU, CA coast, SW AU — warm dry summers, mild winters
    | 'oceanic';        // New Zealand, Ireland — mild, wet, cloudy

export type WildfireRisk = 'none' | 'low' | 'moderate' | 'high';
export type HumidityLevel = 'low' | 'moderate' | 'high';

// ─── Grid ────────────────────────────────────────────────────────────────────

export type GridReliabilityTier =
    | 'stable'          // < 1 hr outage/year avg (Germany, UK urban)
    | 'moderate'        // 1–8 hrs/year (most US suburban)
    | 'unreliable'      // 8–40 hrs/year (rural US, parts of AU outback)
    | 'severe';         // 40+ hrs/year (wildfire zones, Puerto Rico)

// ─── Tariffs ─────────────────────────────────────────────────────────────────

export type DominantTariffStructure =
    | 'flat-rate'       // Single price per kWh at all times
    | 'tou'             // Time-of-Use: peak / off-peak
    | 'dynamic-agile'   // Real-time market pricing (Octopus Agile UK, CAISO)
    | 'demand-charge'   // Charges based on peak power draw (mainly commercial)
    | 'net-metering'    // Full retail credit for exports (traditional US NEM)
    | 'fit'             // Legacy Feed-in Tariff (AU pre-2012, DE EEG)
    | 'smart-export';   // Modern export tariff, less than retail (UK SEG, AU DEBS)

export type ExportOpportunity = 'none' | 'limited' | 'good' | 'excellent';

// ─── Solar Architecture ───────────────────────────────────────────────────────

export type SolarArchitectureNorm =
    | 'microinverter-dominant'  // Enphase strongly dominant (mainstream US)
    | 'string-inverter'         // SolarEdge, Fronius, SMA dominant (UK, AU, DE)
    | 'hybrid-inverter'         // Inverter includes battery charge control (growing AU/US)
    | 'mixed';                  // No dominant technology — varies by installer

// ─── Chemistry & Coupling Bias ───────────────────────────────────────────────

/**
 * Directional bias applied to recommendation scoring.
 * Does NOT hard-exclude any chemistry — it adjusts weight multipliers.
 */
export type ChemistryBias =
    | 'strongly-lfp'     // LFP multiplier 1.8× — extreme heat/cold regions
    | 'lfp'              // LFP multiplier 1.3× — mild preference
    | 'neutral'          // No chemistry bias applied
    | 'nmc-acceptable';  // NMC not penalised (temperate, mild cycling regions)

export type CouplingBias =
    | 'ac-preferred'     // AC-coupled batteries boosted — existing string/microinverter regions
    | 'dc-preferred'     // DC-coupled batteries boosted — new-build solar dominant
    | 'hybrid-preferred' // Hybrid inverter systems boosted
    | 'neutral';         // No coupling bias

// ─── Incentives ──────────────────────────────────────────────────────────────

export type IncentiveType =
    | 'tax-credit'    // Reduces income tax owed (IRA 25D/48)
    | 'rebate'        // Direct payment (SGIP, some utility programs)
    | 'vat-relief'    // Reduced or zero VAT on installation
    | 'vpp-payment'   // Payment for grid services / virtual power plant
    | 'smart-export'  // Per-kWh payment for exported electricity
    | 'fit';          // Legacy feed-in tariff (closed to new applicants in most regions)

export type IncentiveStatus =
    | 'active'          // Currently available and accepting applications
    | 'announced'       // Confirmed but not yet open
    | 'ending-soon'     // Closing within 12 months
    | 'expired';        // No longer available (kept for historical context)

export interface IncentiveProgram {
    id: string;
    name: string;
    type: IncentiveType;
    status: IncentiveStatus;
    /** Human-readable value description. Never invent specific £/$ amounts without a source. */
    valueDescription: string;
    /** Can this be combined with other programs in this region? */
    stackable: boolean;
    /** Does the homeowner need a certified/accredited installer to qualify? */
    installerRequired: boolean;
    expiryNote?: string;
    /** Authoritative government or regulator source URL — mandatory field. */
    sourceUrl: string;
    /** ISO 8601 date — when this entry was last verified against the source. */
    lastVerified: string;
}

// ─── Regulatory Constraints ──────────────────────────────────────────────────

export type RegulatoryConstraintType =
    | 'export-limit'           // Cap on kW exported to grid
    | 'certification'          // Product/installer certification required
    | 'interconnection'        // Utility application/approval required
    | 'installation-standard'; // Wiring/installation code compliance

export interface RegulatoryConstraint {
    id: string;
    type: RegulatoryConstraintType;
    /** Plain English description of the constraint. */
    description: string;
    /** What does this mean practically for the homeowner? */
    impactOnRecommendation: string;
    sourceUrl: string;
    lastVerified: string;
}

// ─── Scoring Modifiers ───────────────────────────────────────────────────────

/**
 * Multipliers applied to the recommendation engine's dimension weights.
 * Range: 0.5 (halved) to 2.0 (doubled). 1.0 = no change.
 * Applied AFTER getDynamicWeights() and BEFORE final score normalisation.
 *
 * All multipliers are clamped to [0.5, 2.0] in applyRegionalModifiers().
 */
export interface RegionScoringModifiers {
    outageResilienceMultiplier: number;
    smartTariffSuitabilityMultiplier: number;
    climateSuitabilityMultiplier: number;
    wholeHomeCapabilityMultiplier: number;
    modularScalabilityMultiplier: number;
    diySuitabilityMultiplier: number;
    retrofitFriendlinessMultiplier: number;
    spaceEfficiencyMultiplier: number;
    longTermRoiMultiplier: number;
    budgetAlignmentMultiplier: number;
}

/** Neutral modifiers — used as the base for all regions. Override only what differs. */
export const NEUTRAL_MODIFIERS: RegionScoringModifiers = {
    outageResilienceMultiplier: 1.0,
    smartTariffSuitabilityMultiplier: 1.0,
    climateSuitabilityMultiplier: 1.0,
    wholeHomeCapabilityMultiplier: 1.0,
    modularScalabilityMultiplier: 1.0,
    diySuitabilityMultiplier: 1.0,
    retrofitFriendlinessMultiplier: 1.0,
    spaceEfficiencyMultiplier: 1.0,
    longTermRoiMultiplier: 1.0,
    budgetAlignmentMultiplier: 1.0,
};

// ─── RegionProfile (core entity) ─────────────────────────────────────────────

export interface RegionProfile {
    // === Identification ===
    /** Unique identifier. Country-level: 'uk', 'us', 'au'. Sub-region: 'us-ca', 'us-tx'. */
    id: string;
    /** For sub-regions: the parent region to inherit defaults from. */
    parentRegionId?: string;
    /** ISO 3166-1 alpha-2 country code. */
    countryCode: string;
    /** Human-readable name used in UI and editorial content. */
    displayName: string;

    // === Climate ===
    climateZone: ClimateZone;
    /** Average summer high in °C. null if not meaningfully consistent across region. */
    avgSummerTempC: number | null;
    /** Average winter low in °C. null if not meaningfully consistent. */
    avgWinterTempC: number | null;
    wildfireRisk: WildfireRisk;
    humidityLevel: HumidityLevel;

    // === Grid ===
    gridReliability: GridReliabilityTier;
    /** Plain English explanation for the homeowner. Cite source if possible. */
    gridReliabilityNote: string;

    // === Tariffs ===
    dominantTariff: DominantTariffStructure;
    /** Contextual note — e.g. prevalence of tariff type, key providers. */
    tariffNote: string;
    exportOpportunity: ExportOpportunity;

    // === Solar Architecture ===
    solarArchitectureNorm: SolarArchitectureNorm;
    solarArchitectureNote: string;

    // === Incentives ===
    incentivePrograms: IncentiveProgram[];
    /** One-paragraph human-readable overview for use in editorial content. */
    incentiveSummary: string;

    // === Regulatory ===
    regulatoryConstraints: RegulatoryConstraint[];

    // === Installation Reality ===
    /** Common installer practices, panel configurations, and physical constraints. */
    installationNotes: string;
    /** Is outdoor battery installation standard/common in this region? */
    outdoorInstallNorm: boolean;

    // === Recommendation Biases ===
    chemistryBias: ChemistryBias;
    couplingBias: CouplingBias;
    scoringModifiers: RegionScoringModifiers;

    // === Data Quality ===
    dataConfidence: 'high' | 'medium' | 'low';
    /** ISO 8601 date of last human review of this profile. */
    lastReviewed: string;
    /** Optional note about data limitations or pending changes. */
    reviewNote?: string;

    // === Future Hooks (Phase 18.6+) ===
    /** Whether an installer lead-routing network is available for this region. */
    installerNetworkAvailable: boolean;
    /** Internal notes for Phase 19 monetisation planning. Not rendered to users. */
    affiliateOpportunities: string[];
}
