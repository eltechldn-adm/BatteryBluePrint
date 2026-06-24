"use client";

/**
 * src/lib/retention/context.tsx
 *
 * React context that wraps the retention ProjectStore and makes it
 * available throughout the app. Integrates session management with
 * 1-hour inactivity expiry.
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import {
    Project,
    VisitMeta,
    CalculatorSnapshot,
    RecommendationSnapshot,
    MilestoneId,
} from "./types";
import {
    loadProject,
    saveProject,
    clearProject,
    setProjectLabel,
    saveCalculatorSnapshot,
    saveRecommendationSnapshot,
    achieveMilestone,
    isRecommendationStale,
    recordVisit,
    isReturningVisitor,
    toggleChecklistItem as storeToggleChecklistItem,
    switchProject as storeSwitchProject,
    deleteProject as storeDeleteProject,
    defaultProject,
    defaultMeta,
} from "./store";
import {
    checkAndRenewSession,
    getSessionExpiresAt,
    formatSessionRemaining,
    getSessionRemainingMs,
} from "./session";
import { STORAGE_KEYS } from "./types";

// ─── Context Type ─────────────────────────────────────────────────────────────

interface RetentionContextType {
    project: Project;
    meta: VisitMeta;
    isReturning: boolean;
    isStale: boolean;

    // Session
    sessionExpiresAt: Date | null;
    sessionTimeRemaining: string;
    sessionWasReset: boolean;

    // Mutations
    updateLabel: (label: string) => void;
    persistCalculatorSnapshot: (snapshot: CalculatorSnapshot) => void;
    persistRecommendationSnapshot: (snapshot: RecommendationSnapshot) => void;
    markMilestone: (id: MilestoneId) => void;
    toggleChecklistItem: (itemId: string) => void;
    updateNotes: (notes: string) => void;
    resetProject: () => void;
    switchProject: (id: string) => void;
    deleteProject: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const RetentionContext = createContext<RetentionContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function RetentionProvider({ children }: { children: ReactNode }) {
    const [project, setProject] = useState<Project>(() => defaultProject());
    const [meta, setMeta] = useState<VisitMeta>(() => defaultMeta());
    const [isReturning, setIsReturning] = useState(false);
    const [isStale, setIsStale] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Session state
    const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
    const [sessionTimeRemaining, setSessionTimeRemaining] = useState("—");
    const [sessionWasReset, setSessionWasReset] = useState(false);

    // On mount: check session expiry first, then hydrate from localStorage
    useEffect(() => {
        // 1. Check & renew session — this may wipe the project list if expired
        const wasReset = checkAndRenewSession(STORAGE_KEYS.PROJECT_LIST);
         
        setSessionWasReset(wasReset);
        setSessionExpiresAt(getSessionExpiresAt());

        // 2. Load project data (from localStorage — survives session expiry)
        const loadedProject = loadProject();
        setProject(loadedProject);

        // 3. Record visit & returning visitor state
        const returning = isReturningVisitor(1);
        setIsReturning(returning);
        const updatedMeta = recordVisit();
        setMeta(updatedMeta);

        setIsStale(isRecommendationStale(loadedProject));
        setIsHydrated(true);
     
    }, []);

    // Live countdown timer — updates every 30 seconds
    useEffect(() => {
        if (!isHydrated) return;

        const tick = () => {
            const remaining = getSessionRemainingMs();
            setSessionTimeRemaining(remaining > 0 ? formatSessionRemaining() : "Expired");
        };

        tick(); // immediate first tick
        const interval = setInterval(tick, 30_000);
        return () => clearInterval(interval);
    }, [isHydrated]);

    // ─── Mutations ────────────────────────────────────────────────────────────

    const updateLabel = useCallback((label: string) => {
        setProject(prev => setProjectLabel(prev, label));
    }, []);

    const persistCalculatorSnapshot = useCallback((snapshot: CalculatorSnapshot) => {
        setProject(prev => saveCalculatorSnapshot(prev, snapshot));
        setIsStale(false);
    }, []);

    const persistRecommendationSnapshot = useCallback((snapshot: RecommendationSnapshot) => {
        setProject(prev => saveRecommendationSnapshot(prev, snapshot));
        setIsStale(false);
    }, []);

    const markMilestone = useCallback((id: MilestoneId) => {
        setProject(prev => {
            const updated = {
                ...prev,
                milestones: achieveMilestone(prev.milestones, id),
            };
            return saveProject(updated);
        });
    }, []);

    const toggleChecklistItem = useCallback((itemId: string) => {
        setProject(prev => storeToggleChecklistItem(prev, itemId));
    }, []);

    const updateNotes = useCallback((notes: string) => {
        setProject(prev => saveProject({ ...prev, notes: notes.slice(0, 2000) }));
    }, []);

    const resetProject = useCallback(() => {
        const fresh = clearProject();
        setProject(fresh);
        setIsReturning(false);
        setIsStale(false);
    }, []);

    const switchProject = useCallback((id: string) => {
        const p = storeSwitchProject(id);
        if (p) {
            setProject(p);
            setIsStale(isRecommendationStale(p));
        }
    }, []);

    const deleteProject = useCallback((id: string) => {
        storeDeleteProject(id);
        const current = loadProject();
        setProject(current);
        setIsStale(isRecommendationStale(current));
    }, []);

    return (
        <RetentionContext.Provider
            value={{
                project,
                meta,
                isReturning,
                isStale,
                sessionExpiresAt,
                sessionTimeRemaining,
                sessionWasReset,
                updateLabel,
                persistCalculatorSnapshot,
                persistRecommendationSnapshot,
                markMilestone,
                toggleChecklistItem,
                updateNotes,
                resetProject,
                switchProject,
                deleteProject,
            }}
        >
            {children}
        </RetentionContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRetention(): RetentionContextType {
    const ctx = useContext(RetentionContext);
    if (!ctx) {
        throw new Error("useRetention must be used inside <RetentionProvider>");
    }
    return ctx;
}
