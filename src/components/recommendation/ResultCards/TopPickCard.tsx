"use client";

import React from "react";
import Link from "next/link";
import { BatteryRankingResult } from "@/lib/recommendation/types";
import {
    Award,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    Zap,
    Cpu,
    Shield,
    Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function ScoreRing({ score }: { score: number }) {
    // Score is raw from the engine — normalise to 0–100 for display.
    // Engine uses weighted sums, empirically capped ~250–450. We cap at 350.
    const normalised = Math.min(99, Math.max(55, Math.round((score / 350) * 100)));
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (normalised / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center w-24 h-24 shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
                <circle cx="36" cy="36" r={radius} fill="none" strokeWidth="5" className="stroke-muted" />
                <circle
                    cx="36" cy="36" r={radius}
                    fill="none" strokeWidth="5"
                    stroke="hsl(var(--primary))"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold leading-none">{normalised}</span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5">score</span>
            </div>
        </div>
    );
}

export function TopPickCard({ result }: { result: BatteryRankingResult }) {
    const { battery, explanation, score } = result;
    const topPro = explanation.tradeoffs.pros[0];
    const topCon = explanation.tradeoffs.cons[0] ?? explanation.tradeoffs.warnings[0];

    const couplingLabel = battery.coupling === "AC"
        ? "AC-Coupled"
        : battery.coupling === "DC"
            ? "DC-Coupled"
            : "Hybrid";

    return (
        <article
            aria-label={`Top engineering recommendation: ${battery.brand} ${battery.model}`}
            className="relative rounded-2xl border-2 border-primary/40 bg-card overflow-hidden shadow-lg shadow-primary/5"
        >
            {/* Header ribbon */}
            <div className="flex items-center justify-between gap-4 px-6 py-3 bg-primary/10 border-b border-primary/20">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Top Engineering Match</span>
                </div>
                <Badge
                    variant="outline"
                    className="text-xs border-primary/30 text-primary bg-primary/5"
                >
                    {battery.category}
                </Badge>
            </div>

            <div className="p-6 sm:p-8">
                {/* Brand / Model + score */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                            {battery.brand}
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                            {battery.model}
                        </h3>
                        {battery.dataConfidence && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Info className="w-3 h-3" aria-hidden="true" />
                                Data confidence: {battery.dataConfidence}
                            </p>
                        )}
                    </div>
                    <ScoreRing score={score.total} />
                </div>

                {/* Why selected */}
                <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border/40">
                    <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                        Engineering rationale
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {explanation.whySelected}
                    </p>
                </div>

                {/* Key specs row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        {
                            label: "Usable capacity",
                            value: battery.usable_kWh_per_unit != null
                                ? `${battery.usable_kWh_per_unit} kWh`
                                : "See datasheet",
                            icon: <Zap className="w-3.5 h-3.5" />,
                        },
                        {
                            label: "Continuous output",
                            value: battery.continuous_output_kW != null
                                ? `${battery.continuous_output_kW} kW`
                                : "—",
                            icon: <Shield className="w-3.5 h-3.5" />,
                        },
                        {
                            label: "Coupling",
                            value: couplingLabel,
                            icon: <Cpu className="w-3.5 h-3.5" />,
                        },
                        {
                            label: "Chemistry",
                            value: battery.chemistry === "LiFePO4" ? "LFP" : battery.chemistry,
                            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                        },
                    ].map((spec) => (
                        <div
                            key={spec.label}
                            className="rounded-lg border border-border/40 bg-background p-3"
                        >
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                {spec.icon}
                                <span className="text-[10px] font-medium uppercase tracking-wider">
                                    {spec.label}
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-foreground">{spec.value}</p>
                        </div>
                    ))}
                </div>

                {/* Key pro / con */}
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {topPro && (
                        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-snug">{topPro}</p>
                        </div>
                    )}
                    {topCon && (
                        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="text-sm text-amber-800 dark:text-amber-300 leading-snug">{topCon}</p>
                        </div>
                    )}
                </div>

                {/* CTA — single anchor to avoid nested interactive element (a > button) */}
                <Link
                    href={`/batteries/${battery.id}/`}
                    id={`rec-top-cta-${battery.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary/15 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    Full specifications &amp; review
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
            </div>
        </article>
    );
}
