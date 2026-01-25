/**
 * Tooltip explanations for battery sizing assumptions
 * Single source of truth for all assumption help text
 */

export const ASSUMPTION_TOOLTIPS = {
  dod: {
    label: "Depth of Discharge (DoD)",
    tooltip: "Batteries last longer if you avoid draining to 0%. We assume you use 80% of nameplate capacity as usable energy.",
  },
  efficiency: {
    label: "Inverter Efficiency",
    tooltip: "Energy is lost when converting battery DC to household AC. 90% is a conservative planning default.",
  },
  reserve: {
    label: "Reserve Buffer",
    tooltip: "Extra margin for real-world uncertainty (surges, aging, temperature). Reserve increases required storage.",
  },
  winter: {
    label: "Winter / Low-Sun Buffer",
    tooltip: "Cold temperatures and low sun reduce usable performance. When enabled, we add a % buffer to the energy target.",
  },
  autonomy: {
    label: "Days of Autonomy",
    tooltip: "How many days you want to run essential loads without charging.",
  },
} as const;

export const LOCATION_PRESET_EXPLANATION = {
  title: "Why BatteryBlueprint uses location presets",
  tagline: "Location presets adjust buffers based on typical climate + electrical norms. You can override anytime.",
  points: [
    "Climate: colder / low-sun seasons often need extra buffer.",
    "Electrical norms: regions differ (e.g., 120/240V split-phase vs 230V single-phase). This affects power planning (kW), not energy (kWh).",
    "Product availability varies by region — recommendations are examples, not quotes.",
  ],
  footer: "Your results are planning estimates. For final design, confirm with a qualified installer and local code.",
} as const;
