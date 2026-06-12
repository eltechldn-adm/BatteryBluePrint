"use client";

import { useRetention } from "@/lib/retention/context";
import { CheckCircle2, Circle } from "lucide-react";
import { MilestoneId } from "@/lib/retention/types";

const MILESTONES: { id: MilestoneId; label: string }[] = [
    { id: "sizing_complete", label: "Sizing" },
    { id: "recommendation_complete", label: "Recommendation" },
    { id: "checklist_started", label: "Planning" },
    { id: "checklist_complete", label: "Ready" }
];

export function MilestoneProgress() {
    const { project } = useRetention();
    const achieved = project.milestones;

    return (
        <div className="w-full">
            <h4 className="text-sm font-semibold mb-4 text-foreground/80">Project Progress</h4>
            <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                <div className="absolute left-0 top-3 h-0.5 w-full bg-border -z-10" />
                {MILESTONES.map((m) => {
                    const isDone = !!achieved[m.id];
                    return (
                        <div key={m.id} className="flex flex-col items-center gap-2 bg-muted/30 px-2 sm:px-4">
                            {isDone ? (
                                <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10 bg-muted/30" />
                            ) : (
                                <Circle className="w-6 h-6 text-muted-foreground/30 fill-background bg-muted/30" />
                            )}
                            <span className={`text-xs font-medium text-center ${isDone ? "text-foreground" : "text-muted-foreground"}`}>
                                {m.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
