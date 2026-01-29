import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Battery, Sun, ChevronRight, BookOpen, AlertTriangle, Shield } from "lucide-react";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
    title: "Complete Solar Battery Sizing Guide | BatteryBlueprint",
    description: "Learn how to size solar batteries correctly. Understand kW vs kWh, depth of discharge, inverter efficiency, autonomy days, winter buffers, and more. Comprehensive guide for homeowners and engineers.",
    keywords: ["solar battery guide", "battery sizing guide", "depth of discharge", "DoD", "inverter efficiency", "solar education", "kWh calculator", "battery backup"],
    openGraph: {
        title: "Complete Solar Battery Sizing Guide | BatteryBlueprint",
        description: "Learn how to size solar batteries correctly. Understand kW vs kWh, depth of discharge, inverter efficiency, autonomy days, and winter buffers.",
        url: `${siteUrl}/guide`,
        type: "article",
    },
    alternates: {
        canonical: `${siteUrl}/guide`,
    },
};

export default function GuidePage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="animated-blob blob-2 -top-32 -right-48 opacity-10" />
                <div className="animated-blob blob-3 bottom-1/3 -left-32 opacity-10" />
            </div>

            <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="text-xl font-bold text-primary">
                    <Link href="/" className="hover:opacity-80 transition-opacity">BatteryBlueprint</Link>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Calculator
                    </Link>
                    <Link href="/recommendations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Recommendations
                    </Link>
                    <Link href="/guide" className="text-sm font-medium text-foreground">
                        Guide
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        About
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Contact
                    </Link>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        Educational Resource
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Complete Solar Battery Sizing Guide</h1>
                    <p className="text-xl text-muted-foreground">Everything you need to know to size your battery system correctly—no marketing fluff, just engineering fundamentals.</p>
                </div>

                {/* Table of Contents */}
                <Card className="mb-8 bg-muted/30">
                    <CardContent className="p-6">
                        <h2 className="font-semibold mb-3">On This Page</h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#what-calculator-does" className="hover:text-primary transition-colors">What This Calculator Does (and Doesn't)</a></li>
                            <li><a href="#key-terms" className="hover:text-primary transition-colors">Key Terms Explained</a></li>
                            <li><a href="#estimate-daily-kwh" className="hover:text-primary transition-colors">How to Estimate Daily kWh</a></li>
                            <li><a href="#choose-backup-days" className="hover:text-primary transition-colors">Choosing Days of Backup</a></li>
                            <li><a href="#winter-buffer" className="hover:text-primary transition-colors">Winter & Low-Sun Buffers</a></li>
                            <li><a href="#inverter-note" className="hover:text-primary transition-colors">Inverter Power vs Energy</a></li>
                            <li><a href="#safety-disclaimer" className="hover:text-primary transition-colors">Safety & Code Compliance</a></li>
                            <li><a href="#faq" className="hover:text-primary transition-colors">Frequently Asked Questions</a></li>
                        </ul>
                    </CardContent>
                </Card>

                <div className="space-y-12">
                    {/* What Calculator Does */}
                    <section id="what-calculator-does">
                        <h2 className="text-3xl font-bold mb-4">What This Calculator Does (and Doesn't)</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                BatteryBlueprint calculates the <strong className="text-foreground">usable battery capacity</strong> you need based on your daily energy consumption and backup requirements. It accounts for real-world factors like depth of discharge, inverter efficiency, and reserve buffers.
                            </p>
                            <p>
                                <strong className="text-foreground">What it DOES:</strong> Provides ballpark sizing estimates for planning conversations with installers. Helps you understand the scale of system you need.
                            </p>
                            <p>
                                <strong className="text-foreground">What it DOESN'T:</strong> Replace professional engineering. Your installer must account for local codes, inverter limits, solar production curves, and site-specific factors. This is a planning tool, not a final design.
                            </p>
                        </div>
                    </section>

                    {/* Key Terms */}
                    <section id="key-terms">
                        <h2 className="text-3xl font-bold mb-6">Key Terms Explained</h2>

                        <div className="space-y-6">
                            <Card className="card-premium rounded-2xl border-0 overflow-hidden">
                                <div className="h-1.5 w-full bg-primary" />
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Zap className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">kW vs kWh</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                <strong className="text-foreground">Power (kW)</strong> is the rate of energy flow—like the size of a pipe. <strong className="text-foreground">Energy (kWh)</strong> is the total amount stored—like the size of a tank.
                                            </p>
                                            <div className="mt-3 p-3 rounded-lg bg-muted/30 text-sm">
                                                <strong>Example:</strong> A 10kWh battery with 5kW output can power a 5kW load for 2 hours. If your load is only 2kW, the same battery lasts 5 hours.
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-premium rounded-2xl border-0 overflow-hidden">
                                <div className="h-1.5 w-full bg-secondary" />
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                            <Battery className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Depth of Discharge (DoD)</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                You never drain a battery to 0%. Modern LiFePO4 (LFP) batteries typically use <strong className="text-foreground">80% DoD</strong> to maximize lifespan. Older lead-acid batteries use 50%.
                                            </p>
                                            <div className="mt-3 p-3 rounded-lg bg-muted/30 text-sm">
                                                <strong>What this means:</strong> A 10kWh nameplate battery gives you ~8kWh of usable energy. Our calculator accounts for this automatically.
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-premium rounded-2xl border-0 overflow-hidden">
                                <div className="h-1.5 w-full bg-accent" />
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                            <Sun className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Inverter Efficiency</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Inverters convert DC battery power to AC house power. This conversion loses <strong className="text-foreground">5-10% of energy</strong> as heat. We default to 90% efficiency (10% loss).
                                            </p>
                                            <div className="mt-3 p-3 rounded-lg bg-muted/30 text-sm">
                                                <strong>Why it matters:</strong> If you need 10kWh at your outlets, you actually need ~11.1kWh from the battery to account for inverter losses.
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-6 rounded-xl bg-card border border-border">
                                <h3 className="text-xl font-bold mb-2">Reserve Buffer</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    An extra safety margin (typically <strong className="text-foreground">15%</strong>) to account for battery aging, temperature effects, and unexpected loads. Think of it as insurance against running out of power.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-card border border-border">
                                <h3 className="text-xl font-bold mb-2">Days of Autonomy</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    How many days can you run without sun? <strong className="text-foreground">1 day is typical for grid-tied systems</strong> (backup during outages). Off-grid systems usually need 3-5 days to handle cloudy weather.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Estimate Daily kWh */}
                    <section id="estimate-daily-kwh">
                        <h2 className="text-3xl font-bold mb-4">How to Estimate Daily kWh from Your Bill</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Your electricity bill is the best source for your daily energy usage. Here's how to find it in different regions:
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-card border border-border">
                                    <h4 className="font-semibold text-foreground mb-2">🇺🇸 United States</h4>
                                    <p className="text-sm">
                                        Look for "Total kWh" or "Energy Usage" on your bill. Divide monthly kWh by 30 for daily average. Example: 900 kWh/month ÷ 30 = 30 kWh/day.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-card border border-border">
                                    <h4 className="font-semibold text-foreground mb-2">🇬🇧 United Kingdom</h4>
                                    <p className="text-sm">
                                        Check "Total Consumption" in kWh. UK bills often show daily average already. If monthly, divide by 30. Example: 450 kWh/month ÷ 30 = 15 kWh/day.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-card border border-border">
                                    <h4 className="font-semibold text-foreground mb-2">🇪🇺 Europe</h4>
                                    <p className="text-sm">
                                        Look for "Verbrauch" (DE), "Consommation" (FR), or "Consumo" (ES/IT). Usually in kWh. Divide by days in billing period for daily average.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                <p className="text-sm text-amber-900 dark:text-amber-100">
                                    <strong>Pro tip:</strong> Review 3-6 months of bills to account for seasonal variation. Summer (AC) and winter (heating) usage can differ significantly.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Choose Backup Days */}
                    <section id="choose-backup-days">
                        <h2 className="text-3xl font-bold mb-4">How to Choose Days of Backup</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                The right number of autonomy days depends on your grid reliability and solar production:
                            </p>
                            <ul className="space-y-2 ml-6 list-disc">
                                <li><strong className="text-foreground">1 day:</strong> Grid-tied systems in reliable areas. Battery covers evening/night usage and short outages.</li>
                                <li><strong className="text-foreground">2 days:</strong> Areas with occasional multi-day outages or inconsistent solar (cloudy climates).</li>
                                <li><strong className="text-foreground">3-5 days:</strong> Off-grid systems or areas with frequent extended outages. Handles several cloudy days in a row.</li>
                                <li><strong className="text-foreground">7+ days:</strong> Remote off-grid locations with winter cloud cover or critical backup needs.</li>
                            </ul>
                            <p>
                                <strong className="text-foreground">Remember:</strong> More days = bigger (more expensive) battery bank. Balance cost against your actual risk of extended outages or low-sun periods.
                            </p>
                        </div>
                    </section>

                    {/* Winter Buffer */}
                    <section id="winter-buffer">
                        <h2 className="text-3xl font-bold mb-4">Winter & Low-Sun Buffer Explained</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Solar production drops in winter due to shorter days, lower sun angles, and cloud cover. The winter buffer adds <strong className="text-foreground">20% extra capacity</strong> to compensate.
                            </p>
                            <p>
                                <strong className="text-foreground">When to enable:</strong> If you live in a region with significant seasonal variation (northern latitudes, monsoon climates) and want year-round reliability.
                            </p>
                            <p>
                                <strong className="text-foreground">When to skip:</strong> Tropical/equatorial regions with consistent sun year-round, or if you're only sizing for summer usage.
                            </p>
                            <div className="p-4 rounded-lg bg-card border border-border">
                                <p className="text-sm">
                                    <strong className="text-foreground">Example:</strong> If you need 10kWh in summer, winter mode sizes for 12kWh to maintain the same backup capability during shorter winter days.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Inverter Note */}
                    <section id="inverter-note">
                        <h2 className="text-3xl font-bold mb-4">Inverter Note: Power Limits vs Energy Storage</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Your inverter's power rating (kW) is separate from battery capacity (kWh). The inverter limits <strong className="text-foreground">how fast</strong> you can draw power, while the battery determines <strong className="text-foreground">how long</strong> you can draw it.
                            </p>
                            <div className="p-4 rounded-lg bg-card border border-border">
                                <p className="text-sm mb-2">
                                    <strong className="text-foreground">Example scenario:</strong>
                                </p>
                                <ul className="text-sm space-y-1 ml-4 list-disc">
                                    <li>Battery: 20kWh usable</li>
                                    <li>Inverter: 5kW continuous output</li>
                                    <li>Result: You can draw up to 5kW for 4 hours (20kWh ÷ 5kW = 4h)</li>
                                </ul>
                            </div>
                            <p>
                                <strong className="text-foreground">Important:</strong> If your peak load exceeds your inverter rating, you'll trip the inverter even if the battery has plenty of energy left. Discuss inverter sizing with your installer.
                            </p>
                        </div>
                    </section>

                    {/* Safety Disclaimer */}
                    <section id="safety-disclaimer">
                        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                            <CardContent className="p-6">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                                    <div>
                                        <h2 className="text-2xl font-bold mb-3 text-amber-900 dark:text-amber-100">Safety & Code Compliance</h2>
                                        <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                                            <p>
                                                <strong>This calculator provides estimates only.</strong> It is not a substitute for professional electrical engineering or design services.
                                            </p>
                                            <p>
                                                Battery systems involve high voltage DC electricity and must comply with local electrical codes (NEC in US, BS 7671 in UK, etc.). Improper installation can cause fires, electric shock, or equipment damage.
                                            </p>
                                            <p>
                                                <strong>Always work with:</strong>
                                            </p>
                                            <ul className="ml-4 list-disc space-y-1">
                                                <li>Licensed electricians for installation</li>
                                                <li>Certified solar installers for system design</li>
                                                <li>Local building inspectors for permit approval</li>
                                            </ul>
                                            <p className="pt-2">
                                                We are not liable for any damages resulting from use of this calculator. See our <Link href="/terms" className="underline hover:text-amber-900 dark:hover:text-amber-100">Terms of Service</Link> for full disclaimer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* FAQ */}
                    <section id="faq">
                        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <details className="p-4 rounded-lg bg-card border border-border">
                                <summary className="font-semibold cursor-pointer">Why is my recommended battery size larger than my daily usage?</summary>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    The calculator accounts for DoD (you can't use 100% of battery capacity), inverter losses (~10%), reserve buffer (15%), and your chosen days of autonomy. A 10kWh/day load with 1 day autonomy typically needs ~14-15kWh of usable battery capacity.
                                </p>
                            </details>

                            <details className="p-4 rounded-lg bg-card border border-border">
                                <summary className="font-semibold cursor-pointer">Can I use this for off-grid systems?</summary>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Yes, but increase days of autonomy to 3-5 days minimum. Off-grid systems also need careful solar array sizing (not covered by this calculator) to ensure you can recharge the battery bank even in winter.
                                </p>
                            </details>

                            <details className="p-4 rounded-lg bg-card border border-border">
                                <summary className="font-semibold cursor-pointer">What if I want to add solar panels later?</summary>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Size your battery for your backup needs first. Solar panels reduce how often you draw from the grid, but don't change your backup capacity requirements. You can add panels anytime if your inverter supports it.
                                </p>
                            </details>

                            <details className="p-4 rounded-lg bg-card border border-border">
                                <summary className="font-semibold cursor-pointer">Why do you recommend multiple battery options per tier?</summary>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Different batteries have different unit sizes. We show options that meet your needs with varying unit counts. Fewer units = simpler installation but less flexibility. More smaller units = easier to expand later.
                                </p>
                            </details>

                            <details className="p-4 rounded-lg bg-card border border-border">
                                <summary className="font-semibold cursor-pointer">How accurate are the battery prices shown?</summary>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Prices are estimates based on typical retail/installed costs and vary significantly by region, installer, and current market conditions. Always get multiple quotes from local installers for accurate pricing.
                                </p>
                            </details>

                            <details className="p-4 rounded-lg bg-card border border-border">
                                <summary className="font-semibold cursor-pointer">Can I adjust the DoD or efficiency assumptions?</summary>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Yes! Click "Advanced Settings" in the calculator to adjust DoD, inverter efficiency, and reserve buffer. Our defaults (80% DoD, 90% efficiency, 15% reserve) are industry-standard conservative values.
                                </p>
                            </details>
                        </div>
                    </section>
                </div>

                {/* CTA */}
                <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 text-center">
                    <h3 className="text-2xl font-bold mb-3">Ready to size your system?</h3>
                    <p className="text-muted-foreground mb-6">Use our calculator to get personalized battery recommendations based on your specific needs.</p>
                    <Link href="/calculator">
                        <Button size="lg" className="btn-premium text-lg px-8 h-14 rounded-xl">
                            Open Calculator
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
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
