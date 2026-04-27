import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "How to Choose the Right Solar Battery: A Decision Guide",
    description: "A structured engineering decision guide for selecting the right solar battery in 2026 — based on your use case, budget, grid connection, and chemistry requirements.",
    alternates: {
        canonical: "https://batteryblueprint.com/choose-battery",
    },
    openGraph: {
        title: "How to Choose the Right Solar Battery: A Decision Guide | BatteryBlueprint",
        description: "Step-by-step engineering framework for selecting a solar battery in 2026. Capacity sizing, chemistry selection, inverter compatibility, and brand evaluation.",
        url: "https://batteryblueprint.com/choose-battery",
        type: "website",
    },
};

export default function ChooseBatteryPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Choose the Right Solar Battery: A Decision Guide",
        "description": "A structured engineering decision guide for selecting the right solar battery.",
        "url": "https://batteryblueprint.com/choose-battery",
        "publisher": {
            "@type": "Organization",
            "name": "BatteryBlueprint",
            "url": "https://batteryblueprint.com"
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="article-prose prose prose-slate dark:prose-invert max-w-none">
                <h1>How to Choose the Right Solar Battery: A Decision Guide</h1>

                <p className="lead">
                    Selecting a solar battery is a multi-variable engineering decision with significant financial consequences. The correct choice depends on your use case, existing system configuration, grid connection type, physical installation constraints, and budget. This guide provides a structured decision framework — not a brand ranking — that produces a defensible battery selection for your specific situation.
                </p>

                <div className="not-prose my-8 p-5 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm font-semibold text-primary mb-2">Start Here</p>
                    <p className="text-sm text-muted-foreground">
                        Before evaluating specific battery products, determine your required usable capacity. <Link href="/calculator" className="text-primary hover:underline font-medium">Use the battery sizing calculator</Link> to establish this number based on your actual load profile. Every subsequent decision in this guide is downstream of that figure.
                    </p>
                </div>

                <hr />

                <h2>Step 1: Determine Your Primary Use Case</h2>

                <p>
                    Battery storage systems are optimised for different primary functions. Selecting a battery without first defining your primary use case leads to a mis-match between system capability and actual performance requirements.
                </p>

                <h3>Use Case A: Solar Self-Consumption Maximisation</h3>
                <p>
                    You have an existing solar system generating surplus daytime production that is currently exported at a low feed-in rate. You want to store that surplus for evening use. <strong>Key requirement:</strong> High roundtrip efficiency, sufficient capacity to absorb and discharge the daily surplus, DC coupling capability (for new-build systems) or AC coupling capability (for retrofit). Brand examples: Tesla Powerwall 3, Sungrow SBH, Alpha ESS Smile.
                </p>

                <h3>Use Case B: Grid Tariff Arbitrage</h3>
                <p>
                    You have access to a time-of-use tariff with a meaningful peak/off-peak spread, and you want to buy cheap overnight electricity and discharge at peak. <strong>Key requirement:</strong> Ability to charge from the grid (not all systems allow this by default), compatibility with real-time tariff API for automated charging (critical for Octopus Agile), and roundtrip efficiency above 90% (to preserve the arbitrage margin). Brand examples: GivEnergy, Solax Triple Power, SolarEdge Energy Bank.
                </p>

                <h3>Use Case C: Backup Power During Outages</h3>
                <p>
                    You have frequent grid outages or critical loads (medical equipment, refrigeration, home office) that must remain powered during disconnection. <strong>Key requirement:</strong> Islanding capability (the ability to disconnect from grid and operate as a standalone supply to specified circuits), backup gateway or automatic transfer switch, and sufficient capacity for the intended backup duration. Brand examples: Tesla Powerwall (with Gateway), Enphase IQ (with IQ System Controller), FranklinWH aPower.
                </p>

                <h3>Use Case D: Off-Grid or Hybrid Off-Grid</h3>
                <p>
                    You are primarily or partially off-grid, relying on solar+battery for the majority of your energy supply. <strong>Key requirement:</strong> High cycle count (above 4,000 cycles at rated DoD), generator integration capability, DC-coupled system for high solar-to-battery efficiency, and significant capacity (typically 20 kWh+). Brand examples: BYD Battery-Box HVM, Pylontech Force series, Victron Energy + third-party cells.
                </p>

                <h2>Step 2: Calculate Required Usable Capacity</h2>

                <p>
                    Required capacity is derived from your load profile and use case, not from a rule of thumb.
                </p>

                <h3>For self-consumption and arbitrage (Use Cases A and B)</h3>
                <p>
                    The target is to store your daily surplus solar generation (for Use Case A) or your daily off-peak charging load (for Use Case B), whichever is larger. For most UK households on a smart tariff, the optimal battery size is <strong>8–12 kWh usable capacity</strong> — providing one full cycle per day with headroom for seasonal variation. Oversizing beyond 12 kWh for an 8–10 kWh/day household produces diminishing returns.
                </p>

                <h3>For backup power (Use Case C)</h3>
                <p>
                    Define your critical load: the watts required by the circuits you need backed up, and the duration of backup required. A refrigerator (100–200W) + key lighting (50–100W) + medical device (100–500W) running for 24 hours requires approximately 6–20 kWh of usable capacity. A whole-home backup for a 20 kWh/day household for 2 days requires 40 kWh usable — which is a very large and expensive residential system. Most homeowners choose partial backup (critical circuits only) rather than whole-home.
                </p>

                <p>
                    <Link href="/calculator" className="text-primary hover:underline">Calculate your specific required capacity</Link> before proceeding to product selection.
                </p>

                <h2>Step 3: Select Battery Chemistry</h2>

                <p>
                    In 2026, virtually all new residential battery installations should use Lithium Iron Phosphate (LFP) chemistry. NMC (Nickel Manganese Cobalt) products remain available, and lead-acid alternatives exist for budget off-grid applications. Here is the decision framework:
                </p>

                <div className="not-prose overflow-x-auto my-6">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-3 font-semibold">Chemistry</th>
                                <th className="text-left p-3 font-semibold">Cycle Life</th>
                                <th className="text-left p-3 font-semibold">Temp Range</th>
                                <th className="text-left p-3 font-semibold">Cost/kWh</th>
                                <th className="text-left p-3 font-semibold">Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium">LFP</td>
                                <td className="p-3">4,000–6,000</td>
                                <td className="p-3">-20°C to 55°C</td>
                                <td className="p-3">£380–£600</td>
                                <td className="p-3">All residential use cases — default choice</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">NMC</td>
                                <td className="p-3">2,000–3,500</td>
                                <td className="p-3">-10°C to 45°C</td>
                                <td className="p-3">£320–£550</td>
                                <td className="p-3">Avoid for new installations — higher degradation rate</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Lead Acid (AGM)</td>
                                <td className="p-3">400–800</td>
                                <td className="p-3">5°C to 35°C</td>
                                <td className="p-3">£80–£140</td>
                                <td className="p-3">Budget off-grid only; high replacement frequency</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p>
                    LFP&apos;s cycle life advantage over NMC is decisive for residential applications. At one cycle per day, an LFP battery achieves 4,000–6,000 cycles — equivalent to 11–16 years of service. An NMC battery at the same duty cycle achieves 5–10 years before significant capacity loss. The LFP premium over NMC ($10–50/kWh) is recovered through longer service life in all but the shortest ownership scenarios.
                </p>

                <h2>Engineering Reality</h2>

                <p>
                    Three technical factors that are frequently underweighted in consumer battery selection decisions:
                </p>

                <h3>C-Rate: Continuous Power Delivery Capability</h3>
                <p>
                    The C-rate defines the maximum continuous power a battery can discharge relative to its capacity. A 10 kWh battery with a 1C rating can deliver 10 kW continuously. A battery with a 0.5C rating can deliver only 5 kW. For households with high simultaneous loads (EV charging + cooking + air conditioning), a battery with a low C-rate will throttle under combined load. Confirm that the battery&apos;s continuous power output exceeds your anticipated peak simultaneous discharge requirement. The Tesla Powerwall 3 delivers 11.5 kW continuous (0.85C) — adequate for most UK homes but undersized for high-load US configurations.
                </p>

                <h3>Inverter Integration: AC-Coupled vs DC-Coupled</h3>
                <p>
                    AC-coupled systems (separate solar inverter + separate battery inverter) are the standard retrofit configuration for homes with existing solar. DC-coupled systems (single hybrid inverter managing both solar and battery) are more efficient (avoiding one AC-DC conversion step) and are preferred for new-build configurations. The efficiency advantage of DC coupling is approximately 3–5% in annual energy terms — meaningful but not decisive for most homeowners. The more important consideration is compatibility: the battery inverter must be compatible with your existing solar inverter if you are AC coupling.
                </p>

                <h3>Software and Smart Tariff Integration</h3>
                <p>
                    For Use Case B (tariff arbitrage), the battery management system must be able to receive real-time electricity price signals and charge/discharge accordingly. GivEnergy provides an open API compatible with Home Assistant and n8n automation. Enphase IQ operates through the Enphase App with limited open integration. Tesla Powerwall integrates with Tesla Energy Plan but has limited third-party tariff API access. If Octopus Agile or equivalent dynamic tariff integration is part of your use case, confirm API compatibility before selection.
                </p>

                <h2>Step 4: Configuration Decision — AC or DC Coupled?</h2>

                <p>
                    The definitive decision tree:
                </p>

                <ul>
                    <li><strong>Existing solar inverter in warranty (less than 7 years old):</strong> AC coupling — retain existing inverter, add separate battery inverter</li>
                    <li><strong>Existing solar inverter approaching end of warranty (7+ years old):</strong> Consider DC coupling — replace the inverter with a hybrid unit and add battery. Slightly higher upfront cost, better long-term efficiency</li>
                    <li><strong>New solar installation with battery:</strong> DC coupling — install a hybrid inverter from the outset</li>
                    <li><strong>Battery-only (no solar):</strong> AC coupling with standalone battery inverter (no solar interface required)</li>
                </ul>

                <h2>Step 5: Evaluate Specific Products Against Your Requirements</h2>

                <p>
                    Once use case, capacity, chemistry, and coupling type are defined, evaluate specific products against the following criteria in order of priority:
                </p>

                <ol>
                    <li><strong>Usable capacity at confirmed DoD matches your requirement</strong></li>
                    <li><strong>Continuous power rating exceeds your peak load requirement by at least 20%</strong></li>
                    <li><strong>Manufacturer warranty covers the expected payback period (minimum 10 years)</strong></li>
                    <li><strong>Installer availability and service network in your geographic area</strong></li>
                    <li><strong>Smart tariff integration capability if arbitrage is your primary use case</strong></li>
                    <li><strong>Modular expandability if your load is expected to grow (EV, heat pump)</strong></li>
                </ol>

                <p>
                    The <Link href="/comparisons/best-solar-batteries-2026" className="text-primary hover:underline">best solar batteries 2026 comparison</Link> evaluates the leading products against these criteria with current specifications.
                </p>

                <h2>When This Doesn&apos;t Work</h2>

                <p>
                    The decision framework above assumes standard residential grid-connected installation. It requires modification in the following circumstances:
                </p>

                <ul>
                    <li><strong>Three-phase properties:</strong> Most residential UK properties are single-phase. Three-phase properties require three-phase compatible inverters — not all battery inverters support three-phase. Confirm phase configuration at the outset.</li>
                    <li><strong>Properties with Export Limiting requirements:</strong> Some DNO areas require Export Limitation hardware. Confirm the specific inverter and battery combination is compatible with the Export Limitation Device (ELD) your DNO requires.</li>
                    <li><strong>Properties in flood risk zones:</strong> Battery units mounted below the predicted flood level require manufacturer-specific guidance on water ingress rating and placement. Not all battery enclosures are IP65 rated.</li>
                    <li><strong>Properties with atypical consumption profiles:</strong> Night-shift workers, remote workers with unusual load shapes, or EV owners with overnight departure schedules may have load profiles that require custom dispatch scheduling — confirm the battery management system supports custom schedule definition.</li>
                </ul>

                <h2>Real-World Example</h2>

                <p>
                    A household in Edinburgh, Scotland with 4 kW solar, 11 kWh/day average consumption, and Octopus Agile access applied the framework:
                </p>

                <ol>
                    <li><strong>Use case:</strong> Primarily tariff arbitrage (Agile), secondary self-consumption</li>
                    <li><strong>Required capacity:</strong> 9–10 kWh usable (covering daily off-peak charging window)</li>
                    <li><strong>Chemistry:</strong> LFP (default)</li>
                    <li><strong>Coupling:</strong> AC coupled (existing 5-year-old SolarEdge inverter retained)</li>
                    <li><strong>Smart integration:</strong> Required — Home Assistant + Agile API for 30-minute dispatch optimisation</li>
                    <li><strong>Selected product:</strong> GivEnergy 9.5 kWh All-In-One — open API, 10-year warranty, AC coupling compatible, Home Assistant integration documented</li>
                </ol>

                <p>
                    Year 1 outcome: £1,080 annual saving (£560 arbitrage + £380 self-consumption + £140 SEG export). Net installation cost: £7,900. Projected payback: 7.3 years. This outcome was consistent with the <Link href="/payback-reality" className="text-primary hover:underline">UK payback benchmarks</Link> for the solar+Agile scenario.
                </p>

                <h2>Recommendation</h2>

                <p>
                    Follow the five-step decision sequence in order:
                </p>

                <ol>
                    <li>Define your primary use case from the four options above</li>
                    <li><Link href="/calculator" className="text-primary hover:underline">Calculate your required usable capacity</Link> based on your actual load and use case</li>
                    <li>Specify LFP chemistry unless you have a specific reason not to</li>
                    <li>Determine AC vs DC coupling based on your existing solar system age</li>
                    <li>Evaluate specific products against the six-point criteria set above</li>
                </ol>

                <p>
                    Do not select a battery brand before completing steps 1–4. Brand selection at step 5, informed by a correctly specified requirement, produces a defensible and financially sound outcome. Brand selection in the absence of this framework produces a purchase driven by marketing rather than by your actual requirements.
                </p>

                <p>
                    For a complete view of the financial case that should underpin your selection, review <Link href="/worth-it" className="text-primary hover:underline">Is Solar Battery Storage Worth It</Link> and the <Link href="/payback-reality" className="text-primary hover:underline">Payback Reality guide</Link> for your specific market.
                </p>

                <hr />
                <p className="text-xs text-muted-foreground mt-8">
                    Last updated: April 2026. Product specifications and pricing reflect 2026 market conditions. Verify current specifications with manufacturers before purchase. This guide is for educational planning purposes. Consult a qualified solar installer before making any installation decision.
                </p>
            </div>
        </div>
    );
}
