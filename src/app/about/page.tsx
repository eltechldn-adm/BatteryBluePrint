"use client";

import Link from "next/link";
import { CheckCircle2, Shield, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            {/* Header - Global in RootLayout */}

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
                                <strong>Not a sales platform.</strong> Battery recommendations are based purely on technical specifications. We do not receive manufacturer payments to promote specific products.
                            </p>
                        </div>
                    </section>

                    {/* Advertising & Affiliate Disclosure */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Advertising & Affiliate Disclosure</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            BatteryBlueprint is supported by advertising (Google AdSense) and may include affiliate links to products or services. If you purchase through an affiliate link, we may earn a small commission at no extra cost to you. This helps us keep the calculator and guides free for everyone.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            All editorial content — including battery recommendations, sizing guides, and comparison articles — is written independently of our advertising relationships. We do not accept payment to promote specific products or manufacturers. Our battery catalog is based on publicly available technical specifications and manufacturer datasheets.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            All content on BatteryBlueprint is for <strong>educational purposes only</strong>. It is not professional engineering advice. Always consult a licensed electrician or solar installer before making purchasing or installation decisions.
                        </p>
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
            {/* Footer - Global in RootLayout */}
        </div>
    );
}
