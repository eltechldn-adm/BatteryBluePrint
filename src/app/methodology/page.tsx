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

            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Engineering Methodology</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Transparency is our product. Unlike generic solar blogs that give &quot;rules of thumb,&quot; BatteryBlueprint uses <strong>deterministic engineering formulas</strong> to size systems.
                    Every number we produce is fully documented here.
                </p>
            </div>

            <div className="article-prose prose prose-slate dark:prose-invert max-w-none">
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
                    Nameplate Capacity = (Daily Load × Days of Autonomy × Winter Multiplier × Reserve Multiplier) / (Efficiency × Depth of Discharge)
                </div>

                <h3>Variable Definitions</h3>
                <ul>
                    <li><strong>Daily Load</strong>: Measured in kWh. We recommend using your highest winter monthly bill divided by 30 to ensure worst-case coverage.</li>
                    <li><strong>Days of Autonomy</strong>: The number of days the system must run without solar input (critical for off-grid or storm resilience).</li>
                    <li><strong>DoD (Depth of Discharge)</strong>: We assume a safe DoD of <strong>80%</strong> for most calculations to prolong battery life, even if manufacturers claim 100%.</li>
                    <li><strong>Efficiency</strong>: We apply a standard <strong>90% round-trip efficiency</strong> factor (AC-to-DC-to-AC losses).</li>
                    <li><strong>Reserve Multiplier</strong>: We default to a <strong>15%</strong> reserve buffer (1.15 multiplier) for safety margin.</li>
                    <li><strong>Winter Multiplier</strong>: If "Winter Mode" is enabled, we apply an additional <strong>20% buffer</strong> (1.2 multiplier) to account for higher heating demands and lower array efficiency in cold temperatures.</li>
                </ul>

                <h2>2. Data Sourcing Standards</h2>
                <p>
                    Garbage in, garbage out. Our models are only as good as the data feeding them.
                    We adhere to a strict hierarchy of data sources.
                </p>

                <h3>Tier 1: Primary Engineering Data (Preferred)</h3>
                <ul>
                    <li><strong>Manufacturer Datasheets</strong>: Source of truth for C-rates, cycle life, and continuous power output.</li>
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
                    <li><strong>Incentives</strong>: Direct cash rebates (e.g., California SGIP, NY-Sun) or state tax credits where available. Note: the US federal Section 25D residential ITC expired for new installations after December 2025.</li>
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
                    <li><strong>Legislation Review</strong>: We read the actual bill text and subsequent amendments (e.g., the "One Big Beautiful Bill" H.R. 1, July 2025, which terminated Section 25D for residential installations placed in service after December 2025).</li>
                    <li><strong>Program Status Checks</strong>: We verify if a program is "Open," "Waitlisted," or "Closed" (e.g., SGIP Step status).</li>
                    <li><strong>Cap Analysis</strong>: Many rebates have funding caps. We note when a program is nearing exhaustion.</li>
                </ul>

                <h2>5. Safety & Compliance</h2>
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
                    <strong>Update Cadence</strong>: Pricing benchmarks, incentive availability, and programme status are reviewed when legislation changes or on a best-efforts basis. We cannot guarantee a fixed quarterly cadence. Always verify current programme status with the administering authority before making a purchase decision.
                </p>

                <hr />

                <p className="text-sm text-muted-foreground mt-12">
                    <em>Methodology Version 2.2. Last Updated: August 2026.
                        Questions about our math? Email <a href="mailto:engineering@batteryblueprint.com">engineering@batteryblueprint.com</a>.</em>
                </p>
            </div>
        </div>
    );
}
