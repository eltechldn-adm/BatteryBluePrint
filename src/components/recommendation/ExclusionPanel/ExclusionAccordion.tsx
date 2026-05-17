"use client";

import React, { useState } from "react";
import { HardExclusionReason } from "@/lib/recommendation/types";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

interface ExclusionAccordionProps {
    exclusions: HardExclusionReason[];
}

export function ExclusionAccordion({ exclusions }: ExclusionAccordionProps) {
    const [open, setOpen] = useState(false);

    // If no exclusions exist, render nothing
    if (!exclusions || exclusions.length === 0) return null;

    const panelId = "rec-exclusion-panel";
    const toggleId = "rec-exclusion-toggle";

    return (
        <section
            aria-label="Systems not matched to your profile"
            className="rounded-xl border border-border/40 bg-muted/10 overflow-hidden"
        >
            {/* Toggle header */}
            <button
                id={toggleId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
                <div className="flex items-center gap-2 min-w-0">
                    <Eye
                        className="w-4 h-4 text-muted-foreground shrink-0"
                        aria-hidden="true"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug">
                            Why some systems were excluded
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug mt-0.5 hidden sm:block">
                            {exclusions.length} system{exclusions.length !== 1 ? "s" : ""} not matched to
                            your profile — view the engineering rationale
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {exclusions.length}
                    </span>
                    {open
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    }
                </div>
            </button>

            {/* Expandable body */}
            {open && (
                <div
                    id={panelId}
                    role="region"
                    aria-labelledby={toggleId}
                    className="px-5 pb-5 animate-in fade-in duration-200"
                >
                    {/* Context note */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 pt-1 border-t border-border/30 mt-1">
                        Exclusions are based entirely on the constraints you described — they do not reflect on the
                        overall quality of these products. A system excluded for one homeowner&apos;s profile may be
                        an excellent choice for another.
                    </p>

                    {/* Exclusion list */}
                    <ul className="space-y-3" aria-label="Excluded systems list">
                        {exclusions.map((excl, idx) => (
                            <li
                                key={excl.batteryId ?? idx}
                                className="rounded-lg border border-border/40 bg-background p-4"
                            >
                                {/* Brand / model + reason badge */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 mb-2">
                                    <p className="text-sm font-semibold text-foreground leading-snug">
                                        {excl.batteryModel}
                                    </p>
                                    <span className="inline-flex items-center self-start text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                        {excl.reason}
                                    </span>
                                </div>

                                {/* Engineering explanation */}
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {excl.explanation}
                                </p>
                            </li>
                        ))}
                    </ul>

                    {/* Footer note */}
                    <p className="text-xs text-muted-foreground/70 leading-relaxed mt-4 italic">
                        To include any of these systems, return to profile inputs and adjust the relevant
                        constraints.
                    </p>
                </div>
            )}
        </section>
    );
}
