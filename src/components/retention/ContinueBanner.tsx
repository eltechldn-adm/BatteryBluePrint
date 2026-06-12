"use client";

/**
 * src/components/retention/ContinueBanner.tsx
 *
 * Non-intrusive "Continue where you left off" banner for returning visitors.
 * Renders below the page header — never as a modal or overlay.
 *
 * Rules:
 * - Only visible when there is a saved project with meaningful data.
 * - Only fires once per session (dismissed state persists in sessionStorage).
 * - Dismissing does not clear the project — only hides the banner.
 * - "Start fresh" confirms before clearing the project.
 */

import React, { useState, useEffect } from "react";
import { useRetention } from "@/lib/retention/context";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, RotateCcw, Calendar } from "lucide-react";

const BANNER_DISMISSED_KEY = "bb_banner_dismissed_session";

function formatRelativeTime(iso: string): string {
    const ms = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(ms / 86400000);

    if (days >= 1) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (mins >= 5) return `${mins} minutes ago`;
    return "recently";
}

export function ContinueBanner() {
    const { project, isReturning, isStale, resetProject } = useRetention();
    const [visible, setVisible] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);

    // Only show if: returning visitor, project has data, not dismissed this session
    useEffect(() => {
        if (!isReturning) return;
        if (!project.calculator && !project.recommendation) return;

        const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
        if (dismissed) return;

        setVisible(true);
    }, [isReturning, project.calculator, project.recommendation]);

    const handleDismiss = () => {
        setVisible(false);
        sessionStorage.setItem(BANNER_DISMISSED_KEY, "1");
    };

    const handleStartFresh = () => {
        if (!confirmReset) {
            setConfirmReset(true);
            return;
        }
        resetProject();
        setVisible(false);
        sessionStorage.setItem(BANNER_DISMISSED_KEY, "1");
    };

    const handleScrollToResults = () => {
        // Scroll to the results section if it exists on the calculator page,
        // otherwise navigate to the calculator
        const resultsEl = document.querySelector("[data-retention-anchor]");
        if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.location.href = "/calculator";
        }
        handleDismiss();
    };

    if (!visible) return null;

    const lastActivity = project.updatedAt;
    const milestoneCount = Object.keys(project.milestones).length;
    const hasRecommendation = !!project.recommendation;

    return (
        <div
            role="banner"
            aria-label="Continue your battery research"
            className="w-full bg-muted/40 border-b border-border/60 px-4 sm:px-6 py-3"
        >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Left: status */}
                <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground leading-snug">
                            {project.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last updated {formatRelativeTime(lastActivity)}
                            {milestoneCount > 0 && (
                                <span className="ml-1">
                                    · {milestoneCount} milestone{milestoneCount !== 1 ? "s" : ""} reached
                                </span>
                            )}
                            {isStale && (
                                <span className="ml-1 text-amber-600 font-medium">
                                    · assumptions may be outdated
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 pl-11 sm:pl-0">
                    <Button
                        size="sm"
                        onClick={handleScrollToResults}
                        id="retention-banner-resume"
                        className="text-xs h-8 px-3"
                    >
                        {hasRecommendation ? "View recommendation" : "Continue sizing"}
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleStartFresh}
                        id="retention-banner-fresh"
                        className="text-xs h-8 px-3 text-muted-foreground"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        {confirmReset ? "Confirm?" : "Start fresh"}
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismiss}
                        aria-label="Dismiss banner"
                        className="text-xs h-8 w-8 p-0 text-muted-foreground"
                    >
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
