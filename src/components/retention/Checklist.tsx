"use client";

import { useRetention } from "@/lib/retention/context";
import { CHECKLIST_ITEMS } from "@/lib/retention/types";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function Checklist() {
    const { project, toggleChecklistItem } = useRetention();
    
    const isChecked = (id: string) => !!project.checklist[id];

    const sections = Array.from(new Set(CHECKLIST_ITEMS.map(i => i.section)));

    return (
        <div className="w-full space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Execution Checklist</h4>
            <div className="grid gap-6 sm:grid-cols-2">
                {sections.map(section => (
                    <Card key={section} className="shadow-sm border-border/50">
                        <CardContent className="p-4 space-y-4">
                            <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{section}</h5>
                            <div className="space-y-3">
                                {CHECKLIST_ITEMS.filter(i => i.section === section).map(item => (
                                    <div key={item.id} className="flex items-start space-x-3">
                                        <input 
                                            type="checkbox"
                                            id={item.id} 
                                            checked={isChecked(item.id)}
                                            onChange={() => toggleChecklistItem(item.id)}
                                            className="mt-1 w-4 h-4 rounded border-muted-foreground/50 text-primary focus:ring-primary accent-primary"
                                        />
                                        <Label 
                                            htmlFor={item.id} 
                                            className={`text-sm leading-snug cursor-pointer ${isChecked(item.id) ? "text-muted-foreground line-through" : "text-foreground"}`}
                                        >
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
