"use client";

/**
 * src/lib/retention/context.tsx
 *
 * React context that wraps the retention ProjectStore and makes it
 * available throughout the app. Provides auto-save hooks and
 * returning-visitor detection.
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
    loadMeta,
    recordVisit,
    isReturningVisitor,
    toggleChecklistItem as storeToggleChecklistItem,
    switchProject as storeSwitchProject,
    deleteProject as storeDeleteProject,
    defaultProject,
    defaultMeta,
} from "./store";

// ─── Context Type ─────────────────────────────────────────────────────────────

interface RetentionContextType {
    project: Project;
    meta: VisitMeta;
    isReturning: boolean;
    isStale: boolean;

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
    // Initialize with default state to match server render and prevent hydration mismatch
    const [project, setProject] = useState<Project>(() => defaultProject());
    const [meta, setMeta] = useState<VisitMeta>(() => defaultMeta());
    const [isReturning, setIsReturning] = useState(false);
    const [isStale, setIsStale] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // On mount: hydrate from localStorage, record visit, evaluate returning state
    useEffect(() => {
        const loadedProject = loadProject();
        setProject(loadedProject);
        
        const returning = isReturningVisitor(1);
        setIsReturning(returning);
        
        const updatedMeta = recordVisit();
        setMeta(updatedMeta);
        
        setIsStale(isRecommendationStale(loadedProject));
        setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
