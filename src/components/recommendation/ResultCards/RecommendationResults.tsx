"use client";

import React from "react";
import { useRecommendation } from "../store";
import { TopPickCard } from "./TopPickCard";
import { AlternativeCard } from "./AlternativeCard";
import { ExplanationList } from "../ExplanationBlocks/ExplanationList";
import { ExclusionAccordion } from "../ExclusionPanel/ExclusionAccordion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sliders, Globe, AlertTriangle } from "lucide-react";
import { getRegionById } from "@/data/regions";

export function RecommendationResults() {
    const { result, resetFlow, setFlowState, regionId, staleRegion } = useRecommendation();
    const region = regionId ? getRegionById(regionId) : undefined;

    if (!result) return null;

    const { topRecommendation, budgetAlternative, premiumAlternative } = result;
    const hasAlternatives = budgetAlternative || premiumAlternative;

    // --- Empty state: engine returned no top recommendation ---
    if (!topRecommendation) {
        return (
            <section
                aria-label="Recommendation engine result"
                className="max-w-2xl mx-auto text-center py-12 px-4"
            >
                <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto mb-4">
                    <Sliders className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-3">No close matches found</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                    Your combination of coupling requirements, installer preference, or climate constraints
                    resulted in all systems in our current database being mathematically disqualified.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                    This is most common when selecting <strong>DIY</strong> installer preference alongside
                    <strong> Whole-Home</strong> backup — a combination that currently has very limited product
                    availability in our database. Consider relaxing one constraint.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => setFlowState("refinement")}
                        id="rec-empty-adjust"
                    >
                        <Sliders className="w-4 h-4 mr-2" aria-hidden="true" />
                        Adjust profile inputs
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={resetFlow}
                        id="rec-empty-reset"
                        className="text-muted-foreground"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
                        Start over
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section aria-label="Engineering recommendation results" className="w-full space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1">
                        Engineering Analysis Complete
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                        The following results are generated from a deterministic scoring model weighted against your
                        stated profile. They are planning aids, not purchase recommendations.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFlowState("refinement")}
                        id="rec-results-adjust"
                        className="text-sm"
                    >
                        <Sliders className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                        Adjust inputs
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFlow}
                        id="rec-results-reset"
                        className="text-sm text-muted-foreground"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                        Reset
                    </Button>
                </div>
            </div>

            {staleRegion && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5" />
                    <div>
                        <div className="font-semibold">Region changed</div>
                        <div className="mt-0.5">Your selected region has changed. Recalculate to update the recommendation.</div>
                    </div>
                </div>
            )}

            <div className="bg-muted/30 rounded-xl p-4 text-sm flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary mt-0.5" />
                <div>
                    <div className="font-semibold text-foreground">
                        {region ? `Regional context applied: ${region.displayName}` : "Global baseline mode"}
                    </div>
                    <div className="text-muted-foreground mt-0.5">
                        {region ? `${region.dominantTariff} tariff • ${region.gridReliability} grid` : "Using standard physics and engineering assumptions without regional bias."}
                    </div>
                </div>
            </div>

            {/* A. Top recommendation */}
            <TopPickCard result={topRecommendation} />

            {/* B + C. Alternatives */}
            {hasAlternatives && (
                <div>
                    <h3 className="text-base font-semibold text-muted-foreground mb-3">
                        Alternative options
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {budgetAlternative && (
                            <AlternativeCard result={budgetAlternative} type="budget" />
                        )}
                        {premiumAlternative && (
                            <AlternativeCard result={premiumAlternative} type="premium" />
                        )}
                    </div>
                </div>
            )}

            {/* D. Explanation summary */}
            <ExplanationList result={result} />

            {/* E. Exclusion transparency panel (collapsed by default) */}
            <ExclusionAccordion exclusions={result.excludedSystems} />
        </section>
    );
}
