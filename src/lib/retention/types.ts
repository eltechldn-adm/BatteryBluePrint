/**
 * src/lib/retention/types.ts
 *
 * Type definitions for the BatteryBlueprint Retention Layer.
 * All data is stored client-side in localStorage — no PII, no backend.
 */

import { HomeownerProfile, RecommendationResult } from "@/lib/recommendation/types";
import { SizingResult } from "@/lib/calc/battery-sizing";

// ─── Storage Keys ────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
    PROJECT: "bb_project_v1",
    PROJECT_LIST: "bb_project_list_v1",
    META: "bb_meta_v1",
} as const;

export const CHECKLIST_ITEMS = [
    { id: "research_specs", section: "Research", label: "Review battery spec sheets" },
    { id: "research_warranty", section: "Research", label: "Check warranty terms & throughput limits" },
    { id: "installer_quotes", section: "Installer Selection", label: "Get 3 quotes from certified installers" },
    { id: "installer_reviews", section: "Installer Selection", label: "Check installer reviews & past work" },
    { id: "tech_inverter", section: "Technical Validation", label: "Verify inverter compatibility" },
    { id: "tech_space", section: "Technical Validation", label: "Confirm physical installation space" },
    { id: "fin_incentives", section: "Financial", label: "Check local rebates and tax incentives" },
    { id: "fin_roi", section: "Financial", label: "Calculate payback period" }
] as const;

// ─── Calculator Snapshot ──────────────────────────────────────────────────────

export interface CalculatorSnapshot {
    dailyLoad_kWh: number;
    daysOfAutonomy: number;
    dod: number;
    inverterEfficiency: number;
    reserveBuffer: number;
    winterMode: boolean;
    locationId: string;
    result: SizingResult;
    savedAt: string; // ISO8601
}

// ─── Recommendation Snapshot ──────────────────────────────────────────────────

export interface RecommendationSnapshot {
    profile: HomeownerProfile;
    result: RecommendationResult;
    regionId: string | undefined;
    engineVersion: string; // for drift detection
    savedAt: string; // ISO8601
}

// ─── Assumptions Snapshot (for drift detection) ───────────────────────────────

export interface AssumptionSnapshot {
    tariffsNoteAt: string; // ISO8601 — when the region tariff note was recorded
    regionId: string | undefined;
}

// ─── Milestone State ──────────────────────────────────────────────────────────

export type MilestoneId =
    | "sizing_complete"
    | "recommendation_complete"
    | "checklist_started"
    | "report_exported"
    | "checklist_complete";

export type MilestoneState = Partial<Record<MilestoneId, string>>; // id → ISO8601 achieved timestamp

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
    id: string; // UUID v4, anonymous, never transmitted
    createdAt: string; // ISO8601
    updatedAt: string; // ISO8601
    label: string; // user-editable label

    calculator: CalculatorSnapshot | null;
    recommendation: RecommendationSnapshot | null;
    assumptions: AssumptionSnapshot | null;
    checklist: Record<string, boolean>;
    milestones: MilestoneState;
    notes: string; // max 2000 chars free-text

    /** Version of the schema — used for forward-compat migration */
    schemaVersion: 1;
}

// ─── Export Payload ───────────────────────────────────────────────────────────

export interface ProjectExportPayload {
    schemaVersion: 1;
    exportedAt: string; // ISO8601
    project: Project;
}

// ─── Visit Metadata ───────────────────────────────────────────────────────────

export interface VisitMeta {
    firstVisit: string; // ISO8601
    lastVisit: string; // ISO8601
    visitCount: number;
    lastRegionId: string | undefined;
    lastMilestone: MilestoneId | undefined;

    /** Trigger fire timestamps — keyed by trigger name, ISO8601 value */
    triggerLastFired: Partial<Record<string, string>>;
}
