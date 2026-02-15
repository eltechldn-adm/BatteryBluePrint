"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, Cpu, ChevronRight, Battery, Sun } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
    const featuresRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for feature cards
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate");
                    }
                });
            },
            { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
        );

        const cards = featuresRef.current?.querySelectorAll(".feature-card");
        cards?.forEach((card, index) => {
            (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="animated-blob blob-1 -top-48 -left-48" />
                <div className="animated-blob blob-2 top-1/3 -right-32" />
                <div className="animated-blob blob-3 -bottom-32 left-1/4" />
            </div>

            {/* Header */}
            {/* Header */}
            <Header />

            {/* Hero */}
            <main className="flex-1 flex flex-col relative z-10">
                <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
                    {/* Left Side: Content */}
                    <div className="flex-1 space-y-8 text-center lg:text-left max-w-2xl">
                        <div className="space-y-6">
                            <h1 className="hero-animate text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                                Stop Guessing.<br />
                                <span className="text-primary">Start Sizing.</span>
                            </h1>
                            <p className="hero-animate hero-animate-delay-1 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Engineering-grade solar battery calculations without the sales fluff.
                                Get accurate kWh requirements, inverter sizing checks, and real hardware matching.
                            </p>
                        </div>
                        {/* 3-Step Micro Flow */}
                        <div className="hero-animate hero-animate-delay-2 bg-muted/30 rounded-2xl p-6 max-w-xl mx-auto lg:mx-0">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">1</div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Enter daily kWh</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Your home's energy use</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">2</div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Choose backup days</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">+ winter buffer option</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">3</div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Get battery size</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">+ recommendations</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-animate hero-animate-delay-3 flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                            <Link href="/calculator">
                                <Button size="lg" className="btn-premium w-full sm:w-auto text-lg px-8 h-14 rounded-2xl shadow-lg">
                                    Start Sizing
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/guide">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-2xl border-2 hover:bg-muted/50 transition-all">
                                    Read the Guide
                                </Button>
                            </Link>
                        </div>
                        <div className="hero-animate hero-animate-delay-4 flex items-center gap-6 text-sm text-muted-foreground justify-center lg:justify-start pt-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <span>No signup required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span>Instant results</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Live Preview Cards */}
                    <div className="flex-1 w-full max-w-md lg:max-w-lg hero-animate hero-animate-delay-2">
                        <div className="relative">
                            {/* Preview Cards Stack */}
                            <div className="preview-card-stack space-y-4">
                                {/* Results Preview Card - Realistic Dashboard Style */}
                                <Card className="card-premium bg-card border-border/50 rounded-2xl overflow-hidden shadow-lg">
                                    <CardContent className="p-6">
                                        {/* Header Row */}
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Battery className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-semibold text-foreground">Sample Results</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">Calculated</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mb-5">Updated just now</p>

                                        {/* Metrics Grid - 2 Column */}
                                        <div className="grid grid-cols-2 gap-6 mb-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1.5">Load Target</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-semibold text-foreground">11.5</span>
                                                    <span className="text-sm text-muted-foreground">kWh</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1.5">Battery Usable</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-semibold text-primary">12.8</span>
                                                    <span className="text-sm text-muted-foreground">kWh</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

                                        {/* Nameplate Row - Full Width */}
                                        <div>
                                            <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1.5">Nameplate Needed</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-semibold text-foreground">16.0</span>
                                                <span className="text-sm text-muted-foreground">kWh</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Battery Recommendation Card - Polished */}
                                <Card className="card-premium bg-card border-border/50 rounded-2xl overflow-hidden shadow-lg">
                                    <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="tier-chip tier-premium text-xs px-2.5 py-1">Premium</div>
                                                </div>
                                                <h4 className="font-bold text-base mb-1">Powerwall 3</h4>
                                                <p className="text-xs text-muted-foreground">Tesla • 13.5 kWh usable</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-xl font-bold text-primary">1</div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Unit</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                                            <span className="badge-pill badge-pill-success text-xs px-3 py-1.5">✓ 105% Coverage</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features / Value Prop */}
                <section className="bg-gradient-to-b from-muted/20 to-muted/40 py-24 px-6 relative">
                    <div className="max-w-6xl mx-auto" ref={featuresRef}>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why BatteryBlueprint?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Real engineering math, not salesperson estimates.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="feature-card card-premium rounded-2xl border-0 bg-card/80 backdrop-blur-sm">
                                <CardContent className="p-8 space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                                        <Zap className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold">Precise Math</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We separate Power (kW) from Energy (kWh). Don&apos;t get sold a battery that dies in 2 hours.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="feature-card card-premium rounded-2xl border-0 bg-card/80 backdrop-blur-sm">
                                <CardContent className="p-8 space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/20 flex items-center justify-center">
                                        <Shield className="w-7 h-7 text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-bold">Safety Buffers</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Winter derating, aging buffers, and Depth-of-Discharge (DoD) handling built-in.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="feature-card card-premium rounded-2xl border-0 bg-card/80 backdrop-blur-sm">
                                <CardContent className="p-8 space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center">
                                        <Cpu className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-bold">Real Hardware</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Match your load to real battery models like Powerwall 3, Enphase 5P, or EG4 server racks.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Sun className="w-4 h-4" />
                            Free • No Signup • Instant Results
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to size your system?</h2>
                        <p className="text-lg text-muted-foreground">
                            Get your personalized battery blueprint in under 60 seconds.
                        </p>
                        <Link href="/calculator">
                            <Button size="lg" className="btn-premium text-lg px-10 h-14 rounded-2xl shadow-lg">
                                Start Sizing
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            {/* Footer */}
            <Footer />
        </div>
    );
}
