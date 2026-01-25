export interface SizingInputs {
    dailyLoad_kWh: number;
    daysOfAutonomy: number; // e.g. 1, 2, 3
    dod?: number; // Default 0.80
    efficiency?: number; // Default 0.90
    winterMode?: boolean; // If true, adds 1.20 derate
    reserveBuffer?: number; // Default 0.15 (15% safety margin)
}

export interface SizingResult {
    loadTarget_kWh: number;
    batteryUsableNeeded_kWh: number; // Accounts for efficiency
    batteryNameplateNeeded_kWh: number; // Accounts for DoD
    breakdown: {
        loadBase: number;
        autonomyMult: number;
        winterMult: number;
        reserveMult: number;
        efficiencyDerate: number;
        dodDerate: number;
    };
}

/**
 * Calculates the required battery storage based on load and autonomy.
 * Follows 'solar-math-validator' SKILL.
 * Updated Phase 2.1: Strict separation of Load Target vs Battery Usable.
 */
export function calculateStorageNeeded(inputs: SizingInputs): SizingResult {
    const {
        dailyLoad_kWh,
        daysOfAutonomy,
        dod = 0.8,
        efficiency = 0.9,
        winterMode = false,
        reserveBuffer = 0.15,
    } = inputs;

    // 1. Calculate Load Energy Target (AC Side)
    // loadTarget = DailyLoad * Days * Winter * Reserve
    const baseLoad = dailyLoad_kWh * daysOfAutonomy;
    const winterMult = winterMode ? 1.2 : 1.0;
    const reserveMult = 1 + reserveBuffer;

    const loadTarget = baseLoad * winterMult * reserveMult;

    // 2. Calculate Battery Usable Needed (DC Side)
    // batteryUsable = loadTarget / efficiency
    const batteryUsable = loadTarget / efficiency;

    // 3. Calculate Nameplate Needed (Sticker Rating)
    // batteryNameplate = batteryUsable / DoD
    const nameplate = batteryUsable / dod;

    // 4. Rounding
    // Targets -> 1 decimal
    // Nameplate -> UP to nearest 0.5
    const roundedNameplate = Math.ceil(nameplate * 2) / 2;

    // Returns
    return {
        loadTarget_kWh: parseFloat(loadTarget.toFixed(1)),
        batteryUsableNeeded_kWh: parseFloat(batteryUsable.toFixed(1)),
        batteryNameplateNeeded_kWh: roundedNameplate,
        breakdown: {
            loadBase: dailyLoad_kWh,
            autonomyMult: daysOfAutonomy,
            winterMult,
            reserveMult,
            efficiencyDerate: efficiency,
            dodDerate: dod,
        },
    };
}

export interface InverterInputs {
    peakLoad_kW: number;
    motorSurge_kW?: number;
}

export interface InverterResult {
    recommendedContinuous_kW: number;
    recommendedSurge_kW: number;
    notes: string[];
}

/**
 * Calculates inverter requirements.
 * SKILL: Recommend inverter continuous kW >= peak continuous load.
 */
export function calculateInverterSpecs(inputs: InverterInputs): InverterResult {
    const { peakLoad_kW, motorSurge_kW = 0 } = inputs;

    return {
        recommendedContinuous_kW: peakLoad_kW,
        recommendedSurge_kW: Math.max(peakLoad_kW, motorSurge_kW),
        notes: [
            "Ensure inverter matches specific voltage requirements (48V vs HV).",
            motorSurge_kW > 0 ? "Motor surge loads included in sizing." : "No specific surge loads entered.",
        ].filter((_, i) => !(i === 1 && motorSurge_kW === 0)),
    };
}
