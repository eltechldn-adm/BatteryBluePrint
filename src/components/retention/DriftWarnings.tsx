"use client";

import { useRetention } from "@/lib/retention/context";
import { isEngineVersionMismatch } from "@/lib/retention/store";
import { AlertTriangle, Info } from "lucide-react";
import { useCountry } from "@/lib/geo/useCountry";
import { getProfileForCountry } from "@/lib/geo/countryProfiles";

export function DriftWarnings({ activeLocationId }: { activeLocationId?: string }) {
    const { project, isStale } = useRetention();
    const { country } = useCountry();
    
    if (!project.recommendation && !project.calculator) return null;

    const engineMismatch = isEngineVersionMismatch(project);
    
    // Check if the location selected in the calculator (or global) differs from the saved recommendation region
    const effectiveLocation = activeLocationId || getProfileForCountry(country.code).regionId;
    const regionMismatch = project.recommendation && project.recommendation.regionId !== effectiveLocation;
    
    const missingCalculator = project.recommendation && !project.calculator;

    if (!isStale && !engineMismatch && !regionMismatch && !missingCalculator && !project.recommendation) {
        return null; // All good and no recommendation
    }

    // Limit to at most 2 warnings per PRD
    let warningsShown = 0;

    const savedDateStr = project.recommendation ? new Date(project.recommendation.savedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : null;
    const daysAgo = project.recommendation ? Math.floor((Date.now() - new Date(project.recommendation.savedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const ageText = daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo} days ago`;

    return (
        <div className="w-full space-y-3 mb-6">
            {project.recommendation && (
                <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mb-1 pl-1">
                    <Info className="w-3.5 h-3.5" />
                    Recommendation generated on {savedDateStr} ({ageText}).
                </p>
            )}
            {isStale && warningsShown++ < 2 && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>
                            <strong>Stale Recommendation:</strong> Your saved recommendation is over 30 days old. Pricing and availability may have changed.
                        </span>
                    </p>
                </div>
            )}
            {engineMismatch && warningsShown++ < 2 && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>
                            <strong>Engine Updated:</strong> The recommendation engine has been updated since your last visit. Recalculate for the latest accuracy.
                        </span>
                    </p>
                </div>
            )}
            {regionMismatch && warningsShown++ < 2 && (
                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>
                            <strong>Region Mismatch:</strong> Your active region ({effectiveLocation}) differs from your saved project region. 
                        </span>
                    </p>
                </div>
            )}
            {missingCalculator && warningsShown++ < 2 && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>
                            <strong>Missing Assumptions:</strong> Base calculator parameters are missing. Please complete the sizing step to build a full blueprint.
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
