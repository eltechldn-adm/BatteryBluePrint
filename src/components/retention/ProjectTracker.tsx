"use client";

import { useRetention } from "@/lib/retention/context";
import { MilestoneProgress } from "./MilestoneProgress";
import { Checklist } from "./Checklist";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectTracker() {
    const { project, updateNotes } = useRetention();
    
    // Only show if they've at least completed sizing
    if (!project.calculator) return null;

    return (
        <Card className="w-full card-premium border-0 shadow-lg mt-8 mb-8 overflow-hidden">
            <div className="bg-muted/30 p-6 border-b border-border/50">
                <MilestoneProgress />
            </div>
            <CardContent className="p-6">
                <Checklist />
                
                <div className="mt-8 pt-8 border-t border-border/50">
                    <h3 className="text-lg font-semibold mb-2">Project Notes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Private notes for your installation (max 2000 chars). Stored only on your device.
                    </p>
                    <textarea 
                        className="w-full min-h-[120px] p-3 rounded-xl border border-input bg-background/50 text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                        placeholder="E.g., Installer quoted $12k for the Powerwall 3. Need to check if it includes gateway upgrade..."
                        value={project.notes || ""}
                        onChange={(e) => updateNotes(e.target.value)}
                        maxLength={2000}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
