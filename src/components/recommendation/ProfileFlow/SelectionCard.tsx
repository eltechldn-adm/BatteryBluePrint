import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    selected: boolean;
    onClick: () => void;
}

export function SelectionCard({ title, description, icon, selected, onClick }: SelectionCardProps) {
    return (
        <button
            onClick={onClick}
            aria-pressed={selected}
            className={cn(
                "relative text-left p-4 rounded-xl border-2 transition-all duration-200 w-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                selected 
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                    : "border-border/40 bg-background hover:border-primary/40 hover:bg-muted/30"
            )}
        >
            {selected && (
                <div className="absolute top-3 right-3 text-primary animate-in zoom-in duration-200">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            )}
            
            <div className="flex items-start gap-3">
                {icon && (
                    <div className={cn(
                        "mt-0.5 shrink-0 transition-colors",
                        selected ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"
                    )}>
                        {icon}
                    </div>
                )}
                <div className="pr-6">
                    <h4 className={cn("font-medium", selected ? "text-foreground" : "text-foreground/80")}>{title}</h4>
                    {description && (
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
}
