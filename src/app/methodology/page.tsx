import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Engineering Methodology & detailed Calculation Logic | BatteryBlueprint",
    description: "Transparency is our product. Detailed explanation of how we calculate battery size, ROI, LCOE, and autonomy duration.",
    alternates: {
        canonical: "https://batteryblueprint.com/methodology",
    },
    openGraph: {
        title: "Engineering Methodology | BatteryBlueprint",
        description: "Transparency is our product. Detailed explanation of how we calculate battery size, ROI, and autonomy.",
        url: "https://batteryblueprint.com/methodology",
        type: "website",
    },
};

export default function MethodologyPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://batteryblueprint.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Methodology",
                "item": "https://batteryblueprint.com/methodology"
            }
        ]
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="article-prose prose prose-slate dark:prose-invert max-w-none">
                <h1>Engineering Methodology</h1>
                <p className="lead">
                    Unlike generic solar blogs that give "rules of thumb," BatteryBlueprint uses <strong>deterministic engineering formulas</strong> to size systems.
                    We believe you should know exactly how your numbers are generated. This page documents our core algorithms, data sources, and modeling assumptions.
                </p>

                <hr />

                <h2>1. Battery Sizing Algorithm</h2>
                <p>
                    Our sizing calculator does not simply multiply "Load x Days." That approach leads to system failure during winter.
                    We use a derating-based model that accounts for real-world inefficiencies.
                </p>

                <h3>Core Formula</h3>
                <p>
                    The required <strong>Nameplate Capacity (C_total)</strong> is calculated as:
                </p>
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm my-4">
                    C_total = (Daily Load × Days of Autonomy) / (DoD × Efficiency × TempFactor)
                </div>

                <h3>Variable Definitions</h3>
                <ul>
                    <li><strong>Daily Load</strong>: Measured in kWh. We recommend using your highest winter monthly bill divided by 30 to ensure worst-case coverage.</li>
                    <li><strong>Days of Autonomy</strong>: The number of days the system must run without solar input (critical for off-grid or storm resilience).</li>
                    <li><strong>DoD (Depth of Discharge)</strong>: We assume a safe DoD of <strong>80%</strong> for most calculations to prolong battery life, even if manufacturers claim 100%.</li>
                    <li><strong>Efficiency</strong>: We apply a standard <strong>90% round-trip efficiency</strong> factor (AC-to-DC-to-AC losses).</li>
                    <li><strong>TempFactor (Winter Mode)</strong>: If "Winter Mode" is enabled, we apply an additional <strong>20% buffer</strong> (1.2 multiplier to capacity) to account for Lithium-Ion voltage sag in cold temperatures.</li>
                </ul>

                <h2>2. Data Sourcing Standards</h2>
                <p>
                    Garbage in, garbage out. Our models are only as good as the data feeding them.
                    We adhere to a strict hierarchy of data sources.
                </p>

                <h3>Tier 1: Primary Engineering Data (Preferred)</h3>
                <ul>
                    <li><strong>Manufacturer Datasheets</strong>: Source of truth for C-rates, cycle life, and continuous power output.</li>
                    <li><strong>Independent Lab Testing</strong>: PVEL (PV Evolution Labs) or DNV reporting.</li>
                    <li><strong>Government Tables</strong>: NREL "Annual Technology Baseline" (ATB) for future cost projections.</li>
                </ul>

                <h3>Tier 2: Market Data</h3>
                <ul>
                    <li><strong>Verified Quotes</strong>: Anonymized quotes from real users (verified via Reddit r/solar and forums).</li>
                    <li><strong>Wholesale Listings</strong>: CED Greentech and local distributor pricing lists.</li>
                </ul>

                <h3>Excluded Data</h3>
                <p>
                    We explicitly <strong>exclude</strong> press releases and unverified marketing claims from our database.
                    If a company claims a "breakthrough" density without a whitepaper, we do not model it.
                </p>

                <h2>3. Cost & ROI Modelling</h2>
                <p>
                    Calculating the Return on Investment (ROI) for batteries is complex because it depends on utility rate structures.
                    Our cost guides use the following framework:
                </p>

                <h3>The "Hybrid ROI" Model</h3>
                <p>
                    We assume three revenue streams for a home battery:
                </p>
                <ol>
                    <li><strong>Access to Time-of-Use (TOU) Rates</strong>: Arbitrage savings (buy low, sell high). We model a conservative 15¢/kWh spread.</li>
                    <li><strong>Resilience Value</strong>: The "Insurance Value" of avoiding spoiled food and hotel stays during outages. Modeled at $200/day of avoided outage.</li>
                    <li><strong>Incentives</strong>: Direct cash rebates (e.g., SGIP) or tax credits (30% Federal ITC).</li>
                </ol>

                <h3>Levelized Cost of Storage (LCOS)</h3>
                <p>
                    For comparisons, we calculate LCOS to normalize value across chemistries:
                </p>
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm my-4">
                    LCOS ($/kWh) = (Net System Cost) / (Usable Capacity × Lifecycle Cycles × DoD)
                </div>
                <p>
                    This exposes why cheap Lead Acid batteries are actually expensive long-term (low cycles) compared to LFP (high cycles).
                </p>

                <h2>4. Incentive Verification</h2>
                <p>
                    Incentive programs are legally binding and complex. Our methodology for verifying rebates includes:
                </p>
                <ul>
                    <li><strong>Legislation Review</strong>: We read the actual bill text (e.g., Inflation Reduction Act Section 25D).</li>
                    <li><strong>Program Status Checks</strong>: We verify if a program is "Open," "Waitlisted," or "Closed" (e.g., SGIP Step status).</li>
                    <li><strong>Cap Analysis</strong>: Many rebates have funding caps. We note when a program is nearing exhaustion.</li>
                </ul>

                <h2>5. Safety & Compliance</h2>
                <p>
                    All "How-To" and installation content is vetted against:
                </p>
                <ul>
                    <li><strong>NEC 2023 (National Electrical Code)</strong>: Specifically Article 690 (Solar) and 706 (Energy Storage).</li>
                    <li><strong>NFPA 855</strong>: Standard for the Installation of Stationary Energy Storage Systems.</li>
                    <li><strong>UL 9540</strong>: Fire safety certification requirements.</li>
                </ul>
                <p>
                    We prioritize safety over DIY savings. If a procedure is dangerous (e.g., high voltage wiring), we explicitly advise hiring a certified electrician.
                </p>

                <h2>6. Update Cadence</h2>
                <p>
                    <strong>Quarterly Refresh</strong>: Pricing, interest rates, and incentive availability are reviewed every quarter.
                    <br />
                    <strong>Annual Deep Dive</strong>: Every January, we completely rebuild our "Best of" lists and pricing benchmarks for the new year.
                </p>

                <hr />

                <p className="text-sm text-muted-foreground mt-12">
                    <em>Methodology Version 2.1. Last Updated: February 2026.
                        Questions about our math? Email <a href="mailto:engineering@batteryblueprint.com">engineering@batteryblueprint.com</a>.</em>
                </p>
            </div>
        </div>
    );
}
