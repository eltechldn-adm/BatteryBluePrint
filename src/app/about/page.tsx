"use client";

import Link from "next/link";
import { CheckCircle2, Shield, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <Link href="/calculator" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
                    BatteryBlueprint
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Calculator
                    </Link>
                    <Link href="/recommendations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Recommendations
                    </Link>
                    <Link href="/recommendations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Recommendations
                    </Link>
                    <Link href="/guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Guide
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-foreground">
                        About
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Contact
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 sm:px-6 py-12">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Hero */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold">About BatteryBlueprint</h1>
                        <p className="text-xl text-muted-foreground">
                            No-BS solar battery sizing for engineers and homeowners
                        </p>
                    </div>

                    {/* Mission */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            BatteryBlueprint exists to provide transparent, engineering-grade battery sizing calculations for solar energy systems. We believe planning your battery storage shouldn't require expensive consultations or guesswork.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our calculator uses industry-standard formulas to help you understand your energy storage needs before talking to installers. No marketing fluff. No hidden assumptions. Just math.
                        </p>
                    </section>

                    {/* What We Are */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">What BatteryBlueprint Is</h2>
                        <div className="grid gap-4">
                            <div className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">A Planning Tool</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get ballpark sizing estimates to inform your research and installer conversations. Understand the scale of system you need.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                                <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Transparent Assumptions</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Every assumption is documented. DoD, efficiency, reserve buffers—all visible and adjustable. No black boxes.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                                <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Engineering-Grade Math</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Based on real-world battery specifications and proven sizing formulas used by solar professionals.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What We're Not */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">What BatteryBlueprint Is NOT</h2>
                        <div className="p-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-3">
                            <p className="text-sm text-amber-900 dark:text-amber-100">
                                <strong>Not a final design.</strong> Your installer must account for local codes, inverter limits, solar production, and site-specific factors.
                            </p>
                            <p className="text-sm text-amber-900 dark:text-amber-100">
                                <strong>Not electrical engineering advice.</strong> We provide calculations, not professional engineering services. Always work with licensed professionals for installation.
                            </p>
                            <p className="text-sm text-amber-900 dark:text-amber-100">
                                <strong>Not affiliated with manufacturers.</strong> We don't sell batteries or receive commissions. Battery recommendations are based purely on technical specifications.
                            </p>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">How It Works</h2>
                        <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                            <li>You enter your daily energy consumption and backup requirements</li>
                            <li>We calculate usable battery capacity needed (accounting for DoD, efficiency, reserves)</li>
                            <li>We recommend real batteries from our catalog that meet your needs</li>
                            <li>You download a PDF blueprint to share with installers</li>
                        </ol>
                        <p className="text-sm text-muted-foreground italic">
                            All formulas are standard industry calculations. No proprietary algorithms. No vendor lock-in.
                        </p>
                    </section>

                    {/* Trust & Transparency */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Trust & Transparency</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We built BatteryBlueprint because we were frustrated by opaque battery sizing tools that hide their assumptions. Every default value in our calculator is documented in the <Link href="/guide" className="text-primary hover:underline">Guide</Link>, and you can adjust them to match your specific situation.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our battery catalog includes source links to manufacturer datasheets. Prices (when shown) are estimates with clear disclaimers. We don't inflate numbers to sell you bigger systems.
                        </p>
                    </section>

                    {/* CTA */}
                    <div className="text-center pt-8">
                        <Link
                            href="/calculator"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                        >
                            Try the Calculator
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-border/50 bg-muted/30 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                        <div>
                            <h4 className="font-semibold mb-3">Tools</h4>
                            <div className="space-y-2">
                                <Link href="/calculator" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Calculator
                                </Link>
                                <Link href="/guide" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Guide
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Company</h4>
                            <div className="space-y-2">
                                <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                                <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Legal</h4>
                            <div className="space-y-2">
                                <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy
                                </Link>
                                <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Terms
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Contact</h4>
                            <a href="mailto:support@batteryblueprint.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                                support@batteryblueprint.com
                            </a>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
                        <p>© 2026 BatteryBlueprint. For planning purposes only. Not professional engineering advice.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
