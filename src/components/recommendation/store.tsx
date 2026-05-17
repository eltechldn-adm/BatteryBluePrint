"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { HomeownerProfile, RecommendationResult } from "@/lib/recommendation/types";
import { generateBatteryRecommendations } from "@/lib/recommendation/engine";

export type FlowState = 'sizing' | 'refinement' | 'analyzing' | 'results';

interface RecommendationState {
    flowState: FlowState;
    profile: Partial<HomeownerProfile>;
    result: RecommendationResult | null;
}

interface RecommendationContextType extends RecommendationState {
    setFlowState: (state: FlowState) => void;
    updateProfile: (updates: Partial<HomeownerProfile>) => void;
    startAnalysis: () => void;
    resetFlow: () => void;
}

const defaultState: RecommendationState = {
    flowState: 'sizing',
    profile: {},
    result: null,
};

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export function RecommendationProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<RecommendationState>(defaultState);
    const [mounted, setMounted] = useState(false);

    // Load from sessionStorage on mount
    useEffect(() => {
        setMounted(true);
        const saved = sessionStorage.getItem('bb_recommendation_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // If it was analyzing on reload, just send back to refinement
                if (parsed.flowState === 'analyzing') {
                    parsed.flowState = 'refinement';
                }
                setState(parsed);
            } catch (e) {
                console.error("Failed to parse saved recommendation state", e);
            }
        }
    }, []);

    // Save to sessionStorage on state change
    useEffect(() => {
        if (mounted) {
            sessionStorage.setItem('bb_recommendation_state', JSON.stringify(state));
        }
    }, [state, mounted]);

    const setFlowState = (flowState: FlowState) => {
        setState(prev => ({ ...prev, flowState }));
    };

    const updateProfile = (updates: Partial<HomeownerProfile>) => {
        setState(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }));
    };

    const startAnalysis = () => {
        setFlowState('analyzing');
        
        // Ensure minimum profile fields are set, use defaults if missing
        const fullProfile: HomeownerProfile = {
            outageFrequency: state.profile.outageFrequency || 'Rare',
            outageDuration: state.profile.outageDuration || '< 2 hrs',
            evOwnership: state.profile.evOwnership || 'None',
            solarOwnership: state.profile.solarOwnership || 'None',
            climate: state.profile.climate || 'Mild',
            utilityTariff: state.profile.utilityTariff || 'Flat Rate',
            backupGoal: state.profile.backupGoal || 'None',
            budgetSensitivity: state.profile.budgetSensitivity || 'Moderate',
            installSpace: state.profile.installSpace || 'Spacious Garage',
            installerPreference: state.profile.installerPreference || 'Professional',
            expansionNeeds: state.profile.expansionNeeds || 'Fixed',
            targetUsableKwh: state.profile.targetUsableKwh
        };

        // Simulate deep engineering analysis
        setTimeout(() => {
            const result = generateBatteryRecommendations(fullProfile);
            setState(prev => ({ ...prev, flowState: 'results', result }));
        }, 2000);
    };

    const resetFlow = () => {
        setState({ flowState: 'sizing', profile: { targetUsableKwh: state.profile.targetUsableKwh }, result: null });
    };

    return (
        <RecommendationContext.Provider value={{ ...state, setFlowState, updateProfile, startAnalysis, resetFlow }}>
            {children}
        </RecommendationContext.Provider>
    );
}

export function useRecommendation() {
    const context = useContext(RecommendationContext);
    if (context === undefined) {
        throw new Error("useRecommendation must be used within a RecommendationProvider");
    }
    return context;
}
