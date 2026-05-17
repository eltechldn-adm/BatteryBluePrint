import React, { useState, useEffect } from "react";
import { Cpu, Zap, Activity } from "lucide-react";

const ANALYSIS_MESSAGES = [
    "Evaluating coupling compatibility...",
    "Scoring climate resilience...",
    "Analyzing installer constraints...",
    "Calculating ROI algorithms...",
    "Finalizing engineering match..."
];

export function AnalysisLoader() {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => Math.min(p + 1, ANALYSIS_MESSAGES.length - 1));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-xl mx-auto text-center px-4 animate-in fade-in duration-500">
            <div className="relative mb-8">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                
                {/* Inner spinning gradient ring */}
                <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 border-b-primary/10 animate-spin" />
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                    <Cpu className="w-8 h-8 animate-pulse" />
                </div>
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-4">Engineering Matrix Active</h3>
            
            <div
                className="h-8 overflow-hidden relative w-full flex justify-center"
                aria-live="polite"
                aria-atomic="true"
            >
                {ANALYSIS_MESSAGES.map((msg, idx) => (
                    <p 
                        key={idx}
                        className="absolute text-muted-foreground font-medium transition-all duration-300"
                        style={{
                            opacity: phase === idx ? 1 : 0,
                            transform: `translateY(${(idx - phase) * 20}px)`
                        }}
                    >
                        {msg}
                    </p>
                ))}
            </div>

            {/* Decorative data stream */}
            <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
                <Activity className="w-5 h-5 text-primary animate-pulse [animation-delay:0ms]" />
                <Zap className="w-4 h-4 text-primary animate-pulse [animation-delay:200ms]" />
                <Activity className="w-5 h-5 text-primary animate-pulse [animation-delay:400ms]" />
            </div>
        </div>
    );
}
