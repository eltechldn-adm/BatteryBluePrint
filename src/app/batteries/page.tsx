import type { Metadata } from "next";
import BatteryCatalog from "@/components/batteries/BatteryCatalog";
import { Zap, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Compare Solar Batteries: Specs, Prices & Engineering Data | BatteryBlueprint",
    description: "Engineering-grade solar battery comparison engine. Filter by usable capacity, peak output, chemistry, and whole-home backup capabilities.",
    alternates: {
        canonical: "https://batteryblueprint.com/batteries",
    },
    openGraph: {
        title: "Solar Battery Comparison Engine | BatteryBlueprint",
        description: "Compare the top solar batteries using engineering-grade data. Filter by usable capacity, peak output, chemistry, and whole-home backup capabilities.",
        url: "https://batteryblueprint.com/batteries",
        type: "website",
    },
};

export default function BatteriesIndexPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header Area */}
            <div className="relative overflow-hidden bg-muted/30 border-b border-border/50 py-16 md:py-24">
                <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                    <div className="animated-blob blob-1 -top-48 -left-48 opacity-30" />
                    <div className="animated-blob blob-2 top-1/3 -right-32 opacity-30" />
                </div>
                
                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                <Zap className="w-4 h-4" />
                                Interactive Engineering Database
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                                Compare Solar <span className="text-primary relative whitespace-nowrap">
                                    <span className="relative z-10">Batteries</span>
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30 z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                    </svg>
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                                Stop comparing marketing brochures. Use our engineering-grade database to filter top residential energy storage systems by usable capacity, peak output, and chemistry.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link href="/calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium group">
                                    Size Your System First
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-3 rounded-lg border border-border/50">
                                    <Shield className="w-4 h-4 text-primary" />
                                    <span>Data verified by Editorial Desk</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 container mx-auto px-4 max-w-7xl py-12 md:py-16">
                <BatteryCatalog />
            </div>

            {/* Educational CTA Area */}
            <div className="container mx-auto px-4 max-w-7xl pb-24">
                <div className="p-8 md:p-12 rounded-2xl bg-card border border-border text-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Zap className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl font-bold">Unsure which specs matter?</h2>
                        <p className="text-muted-foreground text-lg">
                            Comparing batteries without knowing your required kWh output or peak kW demand is like buying a car without knowing if you need it for commuting or towing.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/guide" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all font-medium">
                                Read the Buying Guide
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
