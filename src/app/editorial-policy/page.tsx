import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Editorial Policy & Standards | BatteryBlueprint",
    description: "Our commitment to engineering integrity. We do not accept payment for recommendations. Learn about our correction standards.",
    alternates: {
        canonical: "https://batteryblueprint.com/editorial-policy",
    },
    openGraph: {
        title: "Editorial Policy & Standards | BatteryBlueprint",
        description: "Our commitment to engineering integrity. We do not accept payment for recommendations.",
        url: "https://batteryblueprint.com/editorial-policy",
        type: "website",
    },
};

export default function EditorialPolicyPage() {
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
                "name": "Editorial Policy",
                "item": "https://batteryblueprint.com/editorial-policy"
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
                <h1>Editorial Policy & Integrity Standards</h1>
                <p className="lead">
                    BatteryBlueprint was built to solve a specific problem: the solar industry is filled with sales-driven misinformation.
                    Our mission is to provide <strong>engineering-grade, physics-first analysis</strong> of home energy storage systems.
                    We adhere to strict standards of independence, transparency, and technical accuracy.
                </p>

                <hr />

                <h2>1. Editorial Independence</h2>
                <p>
                    Our content is compiled by the BatteryBlueprint Editorial Research Team.
                    <strong>We do not accept payment from manufacturers, installers, or utility companies</strong> to influence our recommendations or calculator results.
                </p>
                <p>
                    When we recommend a battery system (e.g., Tesla Powerwall vs. Enphase IQ), that recommendation is based purely on data:
                </p>
                <ul>
                    <li><strong>Datasheet Specifications</strong>: Reported chemistry, C-rates, and cycle life.</li>
                    
                    <li><strong>Warranty Terms</strong>: Contractual throughput guarantees, not marketing claims.</li>
                </ul>
                <p>
                    If a product has poor thermal management or strictly limits discharge rates, we will say so—regardless of how popular the brand is.
                </p>

                <h2>2. Review & Verification Process</h2>
                <p>
                    Content may use AI-assisted tooling for drafting, structuring, and research workflows, but final published claims are checked against cited sources where material.
                </p>
                <h3>Step 1: Technical Research</h3>
                <p>
                    Writers must cite primary sources. We do not use "other blogs" as references.
                    Acceptable sources include:
                </p>
                <ul>
                    <li><strong>NREL (National Renewable Energy Laboratory)</strong> datasets.</li>
                    <li><strong>Manufacturer Technical Docs</strong> (Installation manuals, not sales brochures).</li>
                    <li><strong>Legislative Text</strong> (e.g., IRS tax code for 25D credits, CPUC rulings for NEM 3.0).</li>
                </ul>

                <h3>Step 2: Physics Check</h3>
                <p>
                    Our calculator enforces unit consistency.
                    We ensure that kWh (energy) and kW (power) are never confused—a common error in solar media.
                    We model ROIs to account for efficiency losses (DC-to-AC conversion) and battery degradation over time.
                </p>

                <h3>Step 3: Best-Efforts Updates</h3>
                <p>
                    Updates are performed when important information changes or on a best-efforts basis. We do not guarantee a fixed quarterly refresh cycle.
                </p>

                <h2>3. Advertising & Revenue Transparency</h2>
                <p>
                    Maintaining a technical platform requires resources. We believe in being upfront about how we make money.
                </p>

                <h3>Display Advertising</h3>
                <p>
                    You may see programmatic advertisements (e.g., via Google AdSense) on our site.
                    These ads are automatically served based on your browsing history and context.
                    <strong>We do not manually select these advertisers</strong>, and their presence does not constitute an endorsement by BatteryBlueprint.
                    Our editorial team has zero visibility into which ads are served to you.
                </p>

                <h2>4. Corrections Policy</h2>
                <p>
                    Engineering demands precision. If we get a number wrong, we correct it openly.
                    We do not "stealth edit" errors away.
                </p>
                <p>
                    If a correction is material (e.g., a change in Tax Credit eligibility or a safety warning), we will:
                </p>
                <ol>
                    <li>Update the article immediately.</li>
                </ol>
                <p>
                    If you spot a technical error, please report it to <a href="mailto:corrections@batteryblueprint.com">corrections@batteryblueprint.com</a>.
                    We value peer review from the engineering community.
                </p>

                <h2>5. Content Generative AI Policy</h2>
                <p>
                    We use advanced Large Language Models (LLMs) to assist in <strong>formatting, structuring, and spelling-checking</strong> our content.
                    However, AI is never the final authority.
                </p>
                <ul>
                    <li><strong>Data Sources</strong>: Technical specifications are sourced from manufacturer documentation.</li>
                    <li><strong>Scope</strong>: Content is generated and reviewed on a best-efforts basis. It is for educational purposes only.</li>
                </ul>

                <h2>6. Conflict of Interest</h2>
                <p>
                    Currently, BatteryBlueprint has <strong>no exclusive partnership</strong> with any single battery manufacturer (e.g., Tesla, LG, Enphase).
                    We are independent.
                </p>

                <hr />

                <p className="text-sm text-muted-foreground mt-12">
                    <em>Policy Last Updated: August 2026. This document is reviewed annually to ensure it reflects our evolving high standards.</em>
                </p>
            </div>
        </div>
    );
}
