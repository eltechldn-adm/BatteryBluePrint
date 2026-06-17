/**
 * src/lib/retention/store.ts
 *
 * ProjectStore — client-side persistence for BatteryBlueprint projects.
 *
 * Storage architecture:
 * - Active project data    → localStorage  (survives tab close, expires via session check)
 * - Project LIST / index   → sessionStorage (auto-cleared when browser/tab closes)
 * - Session expiry         → localStorage  (checked on mount in context.tsx)
 *
 * Export format: real PDF with embedded JSON metadata (jsPDF).
 * Import format: .pdf file — JSON payload extracted from PDF Keywords metadata.
 *
 * Fully static-export safe. No PII. No backend. No cookies.
 */

import {
    Project,
    VisitMeta,
    CalculatorSnapshot,
    RecommendationSnapshot,
    MilestoneId,
    MilestoneState,
    STORAGE_KEYS,
    ProjectExportPayload,
    CHECKLIST_ITEMS,
} from "./types";

// ─── Engine Version ───────────────────────────────────────────────────────────
export const ENGINE_VERSION = "17.4";

// ─── ID Generation ───────────────────────────────────────────────────────────

function generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Safe localStorage helpers ────────────────────────────────────────────────

function lsGet<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function lsSet(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // localStorage full or unavailable — degrade silently
    }
}

function lsRemove(key: string): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(key);
    } catch { /* no-op */ }
}

// ─── Safe sessionStorage helpers ─────────────────────────────────────────────
// Project list is stored here so it auto-clears when the tab/browser closes.

function ssGet<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function ssSet(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch { /* quota — degrade */ }
}

// ─── Default builders ────────────────────────────────────────────────────────

export function defaultProject(): Project {
    const now = new Date().toISOString();
    return {
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        label: "My Battery Project",
        calculator: null,
        recommendation: null,
        assumptions: null,
        checklist: {},
        milestones: {},
        notes: "",
        schemaVersion: 1,
    };
}

export function defaultMeta(): VisitMeta {
    const now = new Date().toISOString();
    return {
        firstVisit: now,
        lastVisit: now,
        visitCount: 1,
        lastRegionId: undefined,
        lastMilestone: undefined,
        triggerLastFired: {},
    };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Load the active project from localStorage.
 * Creates a fresh project if none exists.
 */
export function loadProject(): Project {
    const stored = lsGet<Project>(STORAGE_KEYS.PROJECT);
    if (stored && stored.schemaVersion === 1) {
        if (!stored.checklist) stored.checklist = {};
        return stored;
    }
    const migrated = migrateFromSessionStorage();
    if (migrated) {
        lsSet(STORAGE_KEYS.PROJECT, migrated);
        return migrated;
    }
    return defaultProject();
}

/**
 * Get the list of all stored project IDs (from sessionStorage — session-scoped).
 */
export function getProjectList(): string[] {
    return ssGet<string[]>(STORAGE_KEYS.PROJECT_LIST) || [];
}

/**
 * Get all fully hydrated projects.
 */
export function getAllProjects(): Project[] {
    const list = getProjectList();
    const projects: Project[] = [];
    for (const id of list) {
        const p = lsGet<Project>(`bb_project_${id}`);
        if (p) projects.push(p);
    }
    return projects;
}

/**
 * Save the project to localStorage, dual-writing to the session index.
 */
export function saveProject(project: Project): Project {
    const updated: Project = { ...project, updatedAt: new Date().toISOString() };
    lsSet(STORAGE_KEYS.PROJECT, updated);

    // Dual-write to per-project key in localStorage (data survives tab close)
    lsSet(`bb_project_${updated.id}`, updated);

    // Write project list to sessionStorage (session-scoped index)
    const list = getProjectList();
    if (!list.includes(updated.id)) {
        list.push(updated.id);
        ssSet(STORAGE_KEYS.PROJECT_LIST, list);
    }
    return updated;
}

/**
 * Switch the active project.
 */
export function switchProject(id: string): Project | null {
    const p = lsGet<Project>(`bb_project_${id}`);
    if (p) {
        lsSet(STORAGE_KEYS.PROJECT, p);
        return p;
    }
    return null;
}

/**
 * Delete a project by ID.
 */
export function deleteProject(id: string): void {
    lsRemove(`bb_project_${id}`);
    const list = getProjectList().filter(x => x !== id);
    ssSet(STORAGE_KEYS.PROJECT_LIST, list);

    const active = lsGet<Project>(STORAGE_KEYS.PROJECT);
    if (active && active.id === id) {
        clearProject();
    }
}

/**
 * Clear the active project and return a fresh one.
 */
export function clearProject(): Project {
    lsRemove(STORAGE_KEYS.PROJECT);
    const fresh = defaultProject();
    return saveProject(fresh);
}

/**
 * Update only the label of the active project.
 */
export function setProjectLabel(project: Project, label: string): Project {
    return saveProject({ ...project, label: label.slice(0, 60) });
}

/**
 * Save a calculator result snapshot into the project.
 */
export function saveCalculatorSnapshot(
    project: Project,
    snapshot: CalculatorSnapshot
): Project {
    const updated = {
        ...project,
        calculator: snapshot,
        milestones: achieveMilestone(project.milestones, "sizing_complete"),
    };
    return saveProject(updated);
}

/**
 * Save a recommendation engine result snapshot into the project.
 */
export function saveRecommendationSnapshot(
    project: Project,
    snapshot: RecommendationSnapshot
): Project {
    const updated = {
        ...project,
        recommendation: snapshot,
        assumptions: {
            tariffsNoteAt: new Date().toISOString(),
            regionId: snapshot.regionId,
        },
        milestones: achieveMilestone(project.milestones, "recommendation_complete"),
    };
    return saveProject(updated);
}

/**
 * Mark a milestone as achieved (idempotent).
 */
export function achieveMilestone(
    milestones: MilestoneState,
    id: MilestoneId
): MilestoneState {
    if (milestones[id]) return milestones;
    return { ...milestones, [id]: new Date().toISOString() };
}

/**
 * Toggle a checklist item and auto-unlock milestones if appropriate.
 */
export function toggleChecklistItem(project: Project, itemId: string): Project {
    const isChecked = !project.checklist[itemId];
    const newChecklist = { ...project.checklist, [itemId]: isChecked };

    let newMilestones = achieveMilestone(project.milestones, "checklist_started");

    const allDone = CHECKLIST_ITEMS.every(item => newChecklist[item.id]);
    if (allDone) {
        newMilestones = achieveMilestone(newMilestones, "checklist_complete");
    }

    return saveProject({
        ...project,
        checklist: newChecklist,
        milestones: newMilestones,
    });
}

/**
 * Check if the saved recommendation snapshot is stale (> 30 days).
 */
export function isRecommendationStale(project: Project): boolean {
    if (!project.recommendation) return false;
    const savedAt = new Date(project.recommendation.savedAt).getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    return Date.now() - savedAt > thirtyDaysMs;
}

/**
 * Check if the engine version of the saved snapshot differs from the current engine.
 */
export function isEngineVersionMismatch(project: Project): boolean {
    if (!project.recommendation) return false;
    return project.recommendation.engineVersion !== ENGINE_VERSION;
}

// ─── Visit Metadata ───────────────────────────────────────────────────────────

export function loadMeta(): VisitMeta {
    const stored = lsGet<VisitMeta>(STORAGE_KEYS.META);
    return stored ?? defaultMeta();
}

export function recordVisit(): VisitMeta {
    const meta = loadMeta();
    const now = new Date().toISOString();
    const updated: VisitMeta = {
        ...meta,
        lastVisit: now,
        visitCount: meta.visitCount + 1,
    };
    if (!meta.firstVisit) updated.firstVisit = now;
    lsSet(STORAGE_KEYS.META, updated);
    return updated;
}

export function recordTriggerFired(triggerName: string): void {
    const meta = loadMeta();
    const updated: VisitMeta = {
        ...meta,
        triggerLastFired: {
            ...meta.triggerLastFired,
            [triggerName]: new Date().toISOString(),
        },
    };
    lsSet(STORAGE_KEYS.META, updated);
}

export function isTriggerAllowed(triggerName: string, minHours = 24): boolean {
    const meta = loadMeta();
    const lastFired = meta.triggerLastFired[triggerName];
    if (!lastFired) return true;
    const elapsed = Date.now() - new Date(lastFired).getTime();
    return elapsed > minHours * 60 * 60 * 1000;
}

// ─── Session Helpers ──────────────────────────────────────────────────────────

export function isReturningVisitor(thresholdHours = 1): boolean {
    const meta = loadMeta();
    if (meta.visitCount <= 1) return false;
    const elapsed = Date.now() - new Date(meta.lastVisit).getTime();
    return elapsed > thresholdHours * 60 * 60 * 1000;
}

// ─── Migration ────────────────────────────────────────────────────────────────

function migrateFromSessionStorage(): Project | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem("bb_recommendation_state");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.result) return null;

        const project = defaultProject();
        project.label = "Restored Project";

        if (parsed.result) {
            project.recommendation = {
                profile: parsed.profile || {},
                result: parsed.result,
                regionId: parsed.regionId,
                engineVersion: ENGINE_VERSION,
                savedAt: new Date().toISOString(),
            } as RecommendationSnapshot;
            project.milestones = achieveMilestone(project.milestones, "recommendation_complete");
        }

        return project;
    } catch {
        return null;
    }
}

// ─── Export / Import (PDF) ────────────────────────────────────────────────────

/**
 * Serialize a project payload into a real PDF Blob.
 *
 * The PDF contains a human-readable summary and embeds the full JSON payload
 * in the PDF's Keywords metadata property (invisible to users, readable by code).
 *
 * Uses jsPDF (already a project dependency).
 */
export async function exportProjectAsPDF(project: Project): Promise<Blob> {
    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import("jspdf");

    const payload: ProjectExportPayload = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        project,
    };
    const jsonStr = JSON.stringify(payload);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // ── PDF Metadata (carries the import payload) ─────────────────────────
    doc.setProperties({
        title: `BatteryBlueprint Project — ${project.label}`,
        subject: "Battery Sizing Project Export",
        author: "BatteryBlueprint.com",
        keywords: `BB_PAYLOAD:${jsonStr}`,
        creator: "BatteryBlueprint",
    });

    // ── Colours & layout ──────────────────────────────────────────────────
    const PRIMARY   = [227, 83, 54]  as [number, number, number]; // #E35336
    const DARK      = [20, 20, 30]   as [number, number, number];
    const MID       = [90, 90, 110]  as [number, number, number];
    const LIGHT     = [245, 245, 248] as [number, number, number];
    const W = 210; // A4 width mm

    // Header bar
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, W, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BatteryBlueprint", 14, 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Engineering-Grade Battery Sizing", 14, 20);

    // Project name
    doc.setFillColor(...LIGHT);
    doc.rect(0, 28, W, 18, "F");
    doc.setTextColor(...DARK);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(project.label, 14, 40);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MID);
    doc.text(
        `Exported: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}   |   Project ID: ${project.id.slice(0, 8)}…`,
        14, 46
    );

    let y = 58;

    const section = (title: string) => {
        doc.setFillColor(...PRIMARY);
        doc.rect(14, y - 4, 3, 6, "F");
        doc.setTextColor(...DARK);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(title, 20, y);
        y += 8;
    };

    const row = (label: string, value: string) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...MID);
        doc.text(label, 14, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...DARK);
        doc.text(value, 80, y);
        y += 6;
    };

    // ── Sizing Results ────────────────────────────────────────────────────
    if (project.calculator) {
        const c = project.calculator;
        section("Battery Sizing Results");
        row("Daily Load", `${c.dailyLoad_kWh} kWh`);
        row("Days of Autonomy", `${c.daysOfAutonomy}`);
        row("Depth of Discharge", `${(c.dod * 100).toFixed(0)}%`);
        row("Efficiency", `${(c.inverterEfficiency * 100).toFixed(0)}%`);
        row("Winter Mode", c.winterMode ? "Yes" : "No");
        if (c.result) {
            row("Usable Capacity Needed", `${c.result.batteryUsableNeeded_kWh.toFixed(1)} kWh`);
            row("Nameplate Capacity Needed", `${c.result.batteryNameplateNeeded_kWh.toFixed(1)} kWh`);
        }
        y += 4;
    }

    // ── Recommendation ────────────────────────────────────────────────────
    if (project.recommendation) {
        const r = project.recommendation;
        section("Top Recommendation");
        if (r.result?.topRecommendation) {
            const top = r.result.topRecommendation;
            row("Battery", top.battery?.name ?? "—");
            row("Score", top.score?.total?.toFixed(0) ?? "—");
        } else {
            row("Status", "No specific battery matched");
        }
        y += 4;
    }

    // ── Milestones ────────────────────────────────────────────────────────
    section("Milestones");
    const milestoneLabels: Record<string, string> = {
        sizing_complete:         "Sizing complete",
        recommendation_complete: "Recommendation complete",
        checklist_started:       "Checklist started",
        checklist_complete:      "Checklist complete",
        report_exported:         "Report exported",
    };
    const mIds = Object.keys(milestoneLabels) as (keyof typeof milestoneLabels)[];
    for (const mId of mIds) {
        const achieved = project.milestones[mId as keyof typeof project.milestones];
        row(
            milestoneLabels[mId],
            achieved
                ? `✓ ${new Date(achieved).toLocaleDateString("en-GB")}`
                : "Pending"
        );
    }
    y += 4;

    // ── Checklist ─────────────────────────────────────────────────────────
    if (Object.keys(project.checklist).length > 0) {
        section("Installation Checklist");
        const ITEMS = [
            { id: "research_specs",    label: "Review battery spec sheets" },
            { id: "research_warranty", label: "Check warranty terms" },
            { id: "installer_quotes",  label: "Get 3 installer quotes" },
            { id: "installer_reviews", label: "Check installer reviews" },
            { id: "tech_inverter",     label: "Verify inverter compatibility" },
            { id: "tech_space",        label: "Confirm installation space" },
            { id: "fin_incentives",    label: "Check local rebates" },
            { id: "fin_roi",           label: "Calculate payback period" },
        ];
        for (const item of ITEMS) {
            const done = project.checklist[item.id];
            row(done ? `☑ ${item.label}` : `☐ ${item.label}`, "");
            y -= 2; // tighten rows for checklist
        }
        y += 4;
    }

    // ── Notes ─────────────────────────────────────────────────────────────
    if (project.notes?.trim()) {
        section("Notes");
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(project.notes, W - 28);
        doc.text(lines, 14, y);
        y += lines.length * 5 + 4;
    }

    // ── Footer ────────────────────────────────────────────────────────────
    doc.setFillColor(...LIGHT);
    doc.rect(0, 282, W, 15, "F");
    doc.setFontSize(7);
    doc.setTextColor(...MID);
    doc.text(
        "Generated by BatteryBlueprint.com — Engineering-grade battery sizing. Not professional electrical advice.",
        W / 2,
        290,
        { align: "center" }
    );
    doc.text("Import this file at batteryblueprint.com to restore your project.", W / 2, 294, { align: "center" });

    return doc.output("blob") as Blob;
}

/**
 * Validate an imported PDF file.
 *
 * Reads the PDF as text, extracts the BB_PAYLOAD JSON from the Keywords
 * metadata field, then validates the schema.
 */
export function validateProjectImportFromPDF(
    arrayBuffer: ArrayBuffer
): { valid: false; error: string } | { valid: true; payload: ProjectExportPayload; collision: boolean } {
    try {
        // Decode the PDF binary as latin-1 (preserves byte values) to scan for our marker
        const bytes = new Uint8Array(arrayBuffer);
        let pdfStr = "";
        for (let i = 0; i < bytes.length; i++) {
            pdfStr += String.fromCharCode(bytes[i]);
        }

        // Find BB_PAYLOAD marker in Keywords metadata
        const marker = "BB_PAYLOAD:";
        const markerIdx = pdfStr.indexOf(marker);
        if (markerIdx === -1) {
            return { valid: false, error: "No save data found in this PDF. Make sure you are importing a file exported directly from the new version of BatteryBlueprint." };
        }

        // Extract JSON — it ends at the next PDF stream delimiter
        // Keywords field in PDF is enclosed in parentheses: /Keywords (BB_PAYLOAD:{...})
        let jsonStart = markerIdx + marker.length;
        // Find the closing delimiter: could be ) for PDF string or end of Keywords
        // We look for the matching unescaped )
        let jsonStr = "";
        let depth = 0;
        let i = jsonStart;
        while (i < pdfStr.length) {
            const ch = pdfStr[i];
            if (ch === "(" ) { depth++; }
            else if (ch === ")") {
                if (depth === 0) break; // end of PDF string
                depth--;
            } else if (ch === "\\" ) {
                i++; // skip escaped char
            }
            jsonStr += ch;
            i++;
        }

        if (!jsonStr) {
            return { valid: false, error: "Could not extract project data from PDF. The file may be corrupted." };
        }

        const payload = JSON.parse(jsonStr) as Partial<ProjectExportPayload>;
        if (payload.schemaVersion !== 1) {
            return { valid: false, error: "Unsupported schema version or invalid file." };
        }
        if (!payload.project || !payload.project.id || !payload.project.createdAt) {
            return { valid: false, error: "Corrupted project data." };
        }
        const list = getProjectList();
        return {
            valid: true,
            payload: payload as ProjectExportPayload,
            collision: list.includes(payload.project.id),
        };
    } catch (e) {
        return { valid: false, error: "Failed to read PDF. Ensure you are using a PDF exported from BatteryBlueprint." };
    }
}

/**
 * Hydrate an imported project payload into local storage.
 */
export function importProject(payload: ProjectExportPayload, asCopy: boolean): Project {
    const project = { ...payload.project };
    if (asCopy) {
        project.id = generateId();
        project.label = `${project.label} (Copy)`;
    }

    const list = getProjectList();
    if (!list.includes(project.id) && list.length >= 5) {
        throw new Error("Maximum of 5 projects reached. Delete a project first.");
    }

    return saveProject(project);
}
