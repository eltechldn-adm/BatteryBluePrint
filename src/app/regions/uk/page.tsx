import Link from "next/link";
import { CheckCircle2, AlertTriangle, Globe, Zap, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "UK Solar Battery Intelligence | BatteryBlueprint",
    description: "Complete guide to solar battery storage in the UK. Understand dynamic tariffs, 0% VAT, G99 regulations, and the best architecture for British homes.",
    alternates: {
        canonical: "https://batteryblueprint.com/regions/uk",
    },
};

export default function UKRegionPage() {
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
                        <h1 className="text-4xl md:text-5xl font-bold">UK Solar Battery Guide</h1>
                        <p className="text-xl text-muted-foreground">
                            Economics, architecture, and policy for British energy storage
                        </p>
                    </div>

                    {/* Overview */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Regional Overview</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The United Kingdom represents one of the most mature yet unique residential battery markets globally. Unlike the United States or Australia, where extreme weather and grid instability drive backup power requirements, the UK market is almost entirely driven by <strong>tariff arbitrage</strong> and <strong>self-consumption</strong>.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            The British climate is temperate, meaning extreme temperature derating is rarely a factor for indoor installations. However, the high humidity and damp climate make outdoor installation less common unless the unit carries a high IP rating (IP65 or better) and is sheltered from direct driving rain.
                        </p>
                    </section>

                    {/* Grid Reliability */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Grid Reliability Context</h2>
                        <div className="p-4 rounded-lg bg-muted/30 border border-border flex gap-4">
                            <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1">Stable Grid Reality</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    According to Ofgem data, the Great Britain transmission network is among the most reliable in the world, with average customer interruptions of under 1 hour per year. 
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Because blackouts are rare, paying a premium for "Whole-Home Backup" capability or automatic transfer switches is often hard to justify on pure economics in the UK. Most UK installations focus on shifting energy from cheap off-peak hours to expensive peak hours rather than preparing for multi-day outages.
                        </p>
                    </section>

                    {/* Tariff and Export Economics */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Tariff and Export Economics</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The UK is a pioneer in dynamic time-of-use tariffs. The rise of innovative suppliers like Octopus Energy has transformed the financial case for home batteries.
                        </p>
                        <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                            <li><strong>Dynamic Tariffs:</strong> Tariffs like Octopus Agile change price every 30 minutes based on wholesale market rates. Batteries can charge when prices are negative or near zero and discharge during the 4pm–7pm peak.</li>
                            <li><strong>Smart Export Guarantee (SEG):</strong> Introduced in 2020, the SEG requires suppliers with over 150,000 customers to pay homeowners for exported solar energy. Rates vary from 4p to over 15p per kWh.</li>
                            <li><strong>Arbitrage Potential:</strong> The spread between off-peak charging (often 7-10p) and peak avoidance (30p+) provides a predictable daily return even in winter when solar generation is low.</li>
                        </ul>
                    </section>

                    {/* Incentives */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Incentives and Policy Environment</h2>
                        <div className="p-4 rounded-lg bg-card border border-border flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-1">0% VAT on Battery Storage</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    As of February 2024, the UK government extended the 0% VAT relief to include standalone battery storage installations and retrofits. Previously, this was only available if installed alongside solar panels. This applies until 2027.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            To qualify for the Smart Export Guarantee and ensure safety, installations must be performed by an installer registered with the <strong>Microgeneration Certification Scheme (MCS)</strong> or equivalent competent person scheme.
                        </p>
                    </section>

                    {/* Architecture */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Best Battery Architecture for the UK</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The vast majority of existing UK solar installations use string inverters (such as SolarEdge, Growatt, or GivEnergy) rather than microinverters.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            For retrofits (adding a battery to an existing solar system), **AC-coupled systems** are the dominant choice. They connect directly to the home's AC consumer unit and do not require replacing the existing solar inverter. For new installations, **Hybrid inverters** (DC-coupled) are preferred as they combine both functions in one box, reducing conversion losses.
                        </p>
                    </section>

                    {/* Constraints */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Regional Installation Constraints</h2>
                        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">DNO Notification (G98 / G99)</h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                    All battery systems must be notified to the local Distribution Network Operator (DNO). Systems up to 3.68kW per phase usually fall under G98 (fast-track notification). Systems above this require G99 prior approval, which can take 4–6 weeks and may incur fees.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* When Not to Buy */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">When a Battery May Not Make Sense</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            A battery is not a guaranteed money-saver for every UK home. It may not make financial sense if:
                        </p>
                        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                            <li>You are on a fixed-rate tariff with no intention of switching to a time-of-use tariff.</li>
                            <li>Your evening electricity usage is very low (most of your usage is during the day when solar is active).</li>
                            <li>You cannot access off-peak charging rates (e.g., no smart meter installed).</li>
                        </ul>
                    </section>

                    {/* Next Steps */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Recommended Next Steps</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link href="/calculator" className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold mb-1">Run the Calculator</h3>
                                    <p className="text-sm text-muted-foreground">Size your battery based on real UK profiles.</p>
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
                                <a href="https://www.gov.uk/guidance/vat-relief-on-energy-saving-materials" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    HMRC: VAT Relief on Energy-Saving Materials <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.ofgem.gov.uk/environmental-and-social-schemes/smart-export-guarantee-seg" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    Ofgem: Smart Export Guarantee (SEG) <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://mcscertified.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    MCS: Microgeneration Certification Scheme <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://energysavingtrust.org.uk/advice/solar-panels/storing-electricity/" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    Energy Saving Trust: Storing Electricity <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.nationalgrideso.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                                    National Grid ESO <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}
