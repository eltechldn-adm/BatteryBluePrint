import Link from "next/link";
import { CheckCircle2, AlertTriangle, Globe, Zap, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "US Solar Battery Intelligence | BatteryBlueprint",
    description: "Complete guide to solar battery storage in the US. Understand the 30% federal tax credit, TOU tariffs, UL 9540 standards, and the best architecture for American homes.",
    alternates: {
        canonical: "https://batteryblueprint.com/regions/us",
    },
};

export default function USRegionPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            <main className="flex-1 px-4 sm:px-6 py-12">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Hero */}
                    <div className="space-y-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mx-auto">
                            <Globe className="w-4 h-4" />
                            Regional Intelligence
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">US Solar Battery Guide</h1>
                        <p className="text-xl text-muted-foreground">
                            Economics, architecture, and policy for American energy storage
                        </p>
                    </div>

                    {/* Overview */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Regional Overview</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The United States represents a massive and highly diverse market for residential battery storage. Unlike the UK, where market conditions are relatively uniform, the US market is a patchwork of state-level policies, utility rate structures, and climate realities.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The US spans multiple climate zones. In the Southwest and warm states, outdoor garage or exterior wall installation is common. In cold-climate states (Midwest, Northeast), indoor basement or conditioned-space installation is preferred due to cold-start temperature limitations of lithium-ion chemistries.
                        </p>
                    </section>

                    {/* Grid Reliability */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Grid Reliability Context</h2>
                        <div className="p-4 rounded-lg bg-muted/30 border border-border flex gap-4">
                            <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1">Moderate Grid & Resilience Value</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    US grid reliability averages 4–8 hours of customer interruption per year nationally (EIA SAIDI data), though this varies enormously by region. Texas (ERCOT) and areas in the Southeast experience significantly higher outage rates.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Because outages are a reality for many Americans, **outage resilience** (backup power) is a major driver of battery adoption in the US. Homeowners often look for "Whole-Home Backup" capability, requiring batteries with high peak output and automatic transfer switches to isolate from the grid during blackouts.
                        </p>
                    </section>

                    {/* Tariff and Export Economics */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Tariff and Export Economics</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            US tariff structures are highly state-dependent:
                        </p>
                        <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                            <li><strong>Time-of-Use (TOU) Tariffs:</strong> Default or mandatory in states like California (NEM 3.0), Nevada, and parts of the Northeast. These tariffs charge significantly more for electricity during peak evening hours, making battery discharge highly profitable.</li>
                            <li><strong>Net Metering (NEM):</strong> Historically the dominant export mechanism, credited homeowners 1-to-1 for exported energy. However, California's shift to NEM 3.0 in 2023 reduced export value by ~75%, making on-site battery consumption essential for solar ROI.</li>
                            <li><strong>Flat Rates:</strong> Still common in the Southeast and parts of the Midwest, where the economic case for batteries relies more on backup value than daily cycling.</li>
                        </ul>
                    </section>

                    {/* Incentives */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Incentives and Policy Environment</h2>
                        <div className="p-4 rounded-lg bg-card border border-border flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1">30% Federal Tax Credit (IRA)</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    The Federal Residential Clean Energy Credit (Section 25D) provides a 30% tax credit on the total installed cost of battery storage systems with at least 3 kWh of capacity. This applies through 2032.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Hundreds of state, utility, and local programs exist across the US — including rebates, property tax exemptions, and sales tax exemptions. Homeowners should consult the **DSIRE database** for specific local incentives.
                        </p>
                    </section>

                    {/* Architecture */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Best Battery Architecture for the US</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Enphase microinverters dominate US residential solar installation, estimated at over 50% of new installs. SolarEdge DC-optimized string inverters hold the second-largest share.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            This dominance makes **AC-coupled battery storage** (like the Tesla Powerwall 2 or Enphase IQ Battery) the most common retrofit scenario. For new installations or off-grid builds, DC-coupled systems (like EG4 or Pylontech server racks) are popular among DIYers and in states with less restrictive utility policies.
                        </p>
                    </section>

                    {/* Constraints */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Regional Installation Constraints</h2>
                        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">UL 9540 Certification</h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                    Many US jurisdictions require battery storage systems to be listed to UL 9540 (Standard for Energy Storage Systems). This is a prerequisite for permit approval in most cities. Always verify your system carries this listing.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* When Not to Buy */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">When a Battery May Not Make Sense</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            A battery may not make financial sense if:
                        </p>
                        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                            <li>You are in a state with full 1-to-1 Net Metering and a highly reliable grid (low outage frequency).</li>
                            <li>Your utility does not offer Time-of-Use rates or demand charges.</li>
                            <li>You do not have federal tax liability to claim the 30% credit (though some state rebates may still apply).</li>
                        </ul>
                    </section>

                    {/* Next Steps */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Recommended Next Steps</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link href="/calculator" className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold mb-1">Run the Calculator</h3>
                                    <p className="text-sm text-muted-foreground">Size your battery based on real US profiles.</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-primary self-end mt-2" />
                            </Link>
                            <Link href="/worth-it" className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold mb-1">Is it Worth It?</h3>
                                    <p className="text-sm text-muted-foreground">Read our full verdict on financial payback.</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-primary self-end mt-2" />
                            </Link>
                        </div>
                    </section>

                    {/* Sources */}
                    <section className="space-y-4 pt-6 border-t border-border/40">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Sources & References
                        </h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="https://www.energy.gov/eere/solar/homeowners-guide-federal-tax-credit-solar-photovoltaics" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    DOE: Homeowner's Guide to Federal Tax Credit <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.irs.gov/forms-pubs/about-form-5695" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    IRS: About Form 5695 <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.dsireusa.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    DSIRE: Database of State Incentives <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.eia.gov/electricity/monthly/" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    EIA: Electric Power Monthly <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.ul.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    UL Standards <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}
