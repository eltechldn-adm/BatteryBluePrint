"use client";

import React from "react";
import Link from "next/link";
import { BatteryRankingResult } from "@/lib/recommendation/types";
import { ArrowRight, CheckCircle2, AlertTriangle, TrendingDown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AlternativeCardProps {
    result: BatteryRankingResult;
    type: "budget" | "premium";
}

export function AlternativeCard({ result, type }: AlternativeCardProps) {
    const { battery, explanation } = result;
    const isBudget = type === "budget";

    const label = isBudget ? "Value Alternative" : "Premium / Scalable Alternative";
    const reasonPrefix = isBudget
        ? "A cost-effective option that reduces upfront outlay while maintaining solid core specifications."
        : "A higher-specification system suited to future expansion, higher resilience, or longer warranty horizons.";

    const topPro = explanation.tradeoffs.pros[0];
    const topCon = explanation.tradeoffs.cons[0] ?? explanation.tradeoffs.warnings[0];

    return (
        <article
            aria-label={`${label}: ${battery.brand} ${battery.model}`}
            className="rounded-xl border border-border/50 bg-card p-5 sm:p-6 flex flex-col h-full hover:border-primary/30 hover:shadow-md transition-all duration-200"
        >
            {/* Label row */}
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1.5">
                    {isBudget
                        ? <TrendingDown className="w-4 h-4 text-amber-500" aria-hidden="true" />
                        : <Star className="w-4 h-4 text-purple-500" aria-hidden="true" />
                    }
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isBudget ? "text-amber-600 dark:text-amber-400" : "text-purple-600 dark:text-purple-400"}`}>
                        {label}
                    </span>
                </div>
                <Badge variant="outline" className="text-xs">
                    {battery.category}
                </Badge>
            </div>

            {/* Brand / model */}
            <div className="mb-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                    {battery.brand}
                </p>
                <h4 className="text-xl font-bold tracking-tight">{battery.model}</h4>
            </div>

            {/* Context sentence */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {reasonPrefix}
            </p>

            {/* Key spec pair */}
            <div className="flex items-center gap-4 text-sm mb-4">
                {battery.usable_kWh_per_unit != null && (
                    <span className="font-semibold text-foreground">
                        {battery.usable_kWh_per_unit} kWh
                    </span>
                )}
                <span className="text-muted-foreground">{battery.coupling}-coupled</span>
                <span className="text-muted-foreground">{battery.chemistry === "LiFePO4" ? "LFP" : battery.chemistry}</span>
            </div>

            {/* Pro / con highlights */}
            {topPro && (
                <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-muted-foreground leading-snug">{topPro}</p>
                </div>
            )}
            {topCon && (
                <div className="flex items-start gap-2 mb-4">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-muted-foreground leading-snug">{topCon}</p>
                </div>
            )}

            {/* Spacer to push CTA to bottom */}
            <div className="mt-auto pt-4 border-t border-border/40">
                <Link
                    href={`/batteries/${battery.id}/`}
                    id={`rec-alt-cta-${battery.id}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline focus:outline-none focus:underline gap-1"
                >
                    View full specifications
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
            </div>
        </article>
    );
}
