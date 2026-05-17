"use client";

import React, { useState } from "react";
import { RecommendationResult } from "@/lib/recommendation/types";
import { ChevronDown, ChevronUp, Info, AlertTriangle, BookOpen } from "lucide-react";

interface ExplanationListProps {
    result: RecommendationResult;
}

export function ExplanationList({ result }: ExplanationListProps) {
    const [open, setOpen] = useState(false);
    const { topRecommendation, archetypeMatch } = result;

    if (!topRecommendation) return null;

    const { explanation } = topRecommendation;
    const allWarnings = [
        ...explanation.tradeoffs.warnings,
        ...(result.budgetAlternative?.explanation.tradeoffs.warnings ?? []),
        ...(result.premiumAlternative?.explanation.tradeoffs.warnings ?? []),
    ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

    return (
        <section
            aria-label="Engineering explanation and assumptions"
            className="mt-4 rounded-xl border border-border/40 bg-muted/20 overflow-hidden"
        >
            {/* Toggle header */}
            <button
                id="rec-explanation-toggle"
                aria-expanded={open}
                aria-controls="rec-explanation-body"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <BookOpen className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                    Engineering explanation &amp; assumptions
                </div>
                {open
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                }
            </button>

            {open && (
                <div id="rec-explanation-body" className="px-5 pb-6 space-y-5 animate-in fade-in duration-200">
                    {/* Archetype */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Profile Archetype
                        </p>
                        <p className="text-sm font-medium text-foreground">{archetypeMatch}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                            Your answers matched the <strong>{archetypeMatch}</strong> homeowner profile. The engine
                            applied weighting that prioritises the characteristics most valued by this archetype.
                        </p>
                    </div>

                    {/* Why recommended */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" aria-hidden="true" />
                            Why this ordering
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {explanation.whyAlternativesLower}
                        </p>
                    </div>

                    {/* Assumptions */}
                    {explanation.assumptions.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Assumptions made
                            </p>
                            <ul className="space-y-1.5">
                                {explanation.assumptions.map((a, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground shrink-0" aria-hidden="true" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Warnings */}
                    {allWarnings.length > 0 && (
                        <div className="rounded-lg border border-amber-200/60 dark:border-amber-700/30 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                                Important considerations
                            </p>
                            <ul className="space-y-1.5">
                                {allWarnings.map((w, i) => (
                                    <li key={i} className="text-sm text-amber-800 dark:text-amber-300 leading-snug">
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="pt-2 border-t border-border/40">
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                            These recommendations are planning aids generated from a deterministic scoring model and publicly
                            available specifications. They do not constitute professional electrical advice. Always consult a
                            qualified installer before purchasing or installing any energy storage system.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
