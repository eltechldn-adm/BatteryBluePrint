/**
 * src/lib/retention/store.ts
 *
 * ProjectStore — client-side localStorage persistence for BatteryBlueprint projects.
 *
 * Fully static-export safe. No PII. No backend. No cookies.
 * All operations degrade gracefully if localStorage is unavailable.
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
// Increment this when the recommendation engine's scoring logic changes
// so saved snapshots can be flagged as potentially stale.
export const ENGINE_VERSION = "17.4";

// ─── ID Generation ───────────────────────────────────────────────────────────

function generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for old browsers
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
    } catch {
        // no-op
    }
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
        // Gracefully handle legacy v1 without checklist
        if (!stored.checklist) {
            stored.checklist = {};
        }
        return stored;
    }
    // No valid project — attempt migration from old sessionStorage key
    const migrated = migrateFromSessionStorage();
    if (migrated) {
        lsSet(STORAGE_KEYS.PROJECT, migrated);
        return migrated;
    }
    return defaultProject();
}

/**
 * Get the list of all stored project IDs
 */
export function getProjectList(): string[] {
    return lsGet<string[]>(STORAGE_KEYS.PROJECT_LIST) || [];
}

/**
 * Get all fully hydrated projects
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
 * Save the project to localStorage, dual-writing to the index.
 */
export function saveProject(project: Project): Project {
    const updated: Project = { ...project, updatedAt: new Date().toISOString() };
    lsSet(STORAGE_KEYS.PROJECT, updated); // Active pointer
    
    // Dual write to multi-project store
    lsSet(`bb_project_${updated.id}`, updated);
    const list = getProjectList();
    if (!list.includes(updated.id)) {
        list.push(updated.id);
        lsSet(STORAGE_KEYS.PROJECT_LIST, list);
    }
    return updated;
}

/**
 * Switch the active project to a different stored project.
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
    lsSet(STORAGE_KEYS.PROJECT_LIST, list);
    
    // If active was deleted, clear it
    const active = lsGet<Project>(STORAGE_KEYS.PROJECT);
    if (active && active.id === id) {
        clearProject();
    }
}

/**
 * Clear the active project and return a brand-new one.
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
    if (milestones[id]) return milestones; // already achieved
    return { ...milestones, [id]: new Date().toISOString() };
}

/**
 * Toggle a checklist item and auto-unlock milestones if appropriate.
 */
export function toggleChecklistItem(project: Project, itemId: string): Project {
    const isChecked = !project.checklist[itemId];
    const newChecklist = { ...project.checklist, [itemId]: isChecked };
    
    // Auto-unlock checklist_started
    let newMilestones = achieveMilestone(project.milestones, "checklist_started");
    
    // Auto-unlock checklist_complete if all main sections are done
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

/**
 * Record a new visit. Call this once on app mount (client-side only).
 * Returns the updated meta.
 */
export function recordVisit(): VisitMeta {
    const meta = loadMeta();
    const now = new Date().toISOString();
    const updated: VisitMeta = {
        ...meta,
        lastVisit: now,
        visitCount: meta.visitCount + 1,
    };
    // Ensure firstVisit is set
    if (!meta.firstVisit) updated.firstVisit = now;
    lsSet(STORAGE_KEYS.META, updated);
    return updated;
}

/**
 * Record that a named trigger has fired. Used for frequency-cap enforcement.
 */
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

/**
 * Check if a trigger is allowed to fire (enforces 24h minimum cap).
 */
export function isTriggerAllowed(triggerName: string, minHours = 24): boolean {
    const meta = loadMeta();
    const lastFired = meta.triggerLastFired[triggerName];
    if (!lastFired) return true;
    const elapsed = Date.now() - new Date(lastFired).getTime();
    return elapsed > minHours * 60 * 60 * 1000;
}

// ─── Session Helpers ──────────────────────────────────────────────────────────

/**
 * Returns true if the user has been away for more than `thresholdHours` hours.
 */
export function isReturningVisitor(thresholdHours = 1): boolean {
    const meta = loadMeta();
    if (meta.visitCount <= 1) return false;
    const elapsed = Date.now() - new Date(meta.lastVisit).getTime();
    return elapsed > thresholdHours * 60 * 60 * 1000;
}

// ─── Migration ────────────────────────────────────────────────────────────────

/**
 * Attempt to migrate the old Phase 17 sessionStorage recommendation state
 * into a new Project. Called once on first load.
 */
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

// ─── Export / Import ─────────────────────────────────────────────────────────

/**
 * Serialize a project into a compliant JSON export payload.
 */
export function exportProject(project: Project): string {
    const payload: ProjectExportPayload = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        project
    };
    return JSON.stringify(payload, null, 2);
}

/**
 * Validate an imported JSON string payload before hydration.
 */
export function validateProjectImport(jsonStr: string): { valid: false; error: string } | { valid: true; payload: ProjectExportPayload; collision: boolean } {
    try {
        const payload = JSON.parse(jsonStr) as Partial<ProjectExportPayload>;
        if (payload.schemaVersion !== 1) {
            return { valid: false, error: "Unsupported schema version or invalid file." };
        }
        if (!payload.project || !payload.project.id || !payload.project.createdAt) {
            return { valid: false, error: "Corrupted project data." };
        }
        const list = getProjectList();
        return { valid: true, payload: payload as ProjectExportPayload, collision: list.includes(payload.project.id) };
    } catch {
        return { valid: false, error: "Invalid JSON format." };
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
    
    // Enforce max 5 rule if new
    const list = getProjectList();
    if (!list.includes(project.id) && list.length >= 5) {
        throw new Error("Maximum of 5 projects reached.");
    }
    
    return saveProject(project);
}
