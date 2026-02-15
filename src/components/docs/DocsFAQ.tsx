"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocsFAQProps {
    children: React.ReactNode;
}

export function DocsFAQ({ children }: DocsFAQProps) {
    return (
        <div className="w-full space-y-4 my-8 not-prose">
            {children}
        </div>
    );
}

interface DocsFAQItemProps {
    question: string;
    children: React.ReactNode;
}

export function DocsFAQItem({ question, children }: DocsFAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-muted/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 text-left font-semibold text-foreground hover:bg-muted/20 transition-colors"
            >
                <span>{question}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="p-4 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-transparent">
                    {children}
                </div>
            </div>
        </div>
    );
}
