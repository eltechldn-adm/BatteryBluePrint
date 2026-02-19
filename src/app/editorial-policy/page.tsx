import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Editorial Policy & Standards | BatteryBlueprint",
    description: "Our commitment to engineering integrity. We do not accept payment for reviews. Learn about our rigorous fact-checking and correction standards.",
    alternates: {
        canonical: "https://batteryblueprint.com/editorial-policy",
    },
    openGraph: {
        title: "Editorial Policy & Standards | BatteryBlueprint",
        description: "Our commitment to engineering integrity. We do not accept payment for reviews.",
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
                    Our content is written by engineers and technical analysts, not salespeople.
                    <strong>We do not accept payment from manufacturers, installers, or utility companies</strong> to influence our reviews, rankings, or calculator results.
                </p>
                <p>
                    When we recommend a battery system (e.g., Tesla Powerwall vs. Enphase IQ), that recommendation is based purely on data:
                </p>
                <ul>
                    <li><strong>Datasheet Specifications</strong>: Verified chemistry, C-rates, and cycle life.</li>
                    <li><strong>Field Performance</strong>: Real-world round-trip efficiency data.</li>
                    <li><strong>Warranty Terms</strong>: Contractual throughput guarantees, not marketing claims.</li>
                </ul>
                <p>
                    If a product has poor thermal management or strictly limits discharge rates, we will say so—regardless of how popular the brand is.
                </p>

                <h2>2. Review & verification Process</h2>
                <p>
                    Every article and guide on BatteryBlueprint undergoes a multi-step review process before publication.
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
                    Calculations are audited for unit consistency.
                    We ensure that kWh (energy) and kW await (power) are never confused—a common error in solar media.
                    We verify that claimed ROIs account for efficiency losses (DC-to-AC conversion) and battery degradation over time.
                </p>

                <h3>Step 3: Quarterly Audits</h3>
                <p>
                    The energy industry moves fast. A battery that was "best value" in 2024 might be obsolete by 2026.
                    We commit to a <strong>Quarterly Data Refresh</strong> for all pricing and incentive guides.
                    Pages are stamped with a "Last Updated" date so you know exactly how fresh the data is.
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

                <h3>Affiliate Links</h3>
                <p>
                    In the future, we may include affiliate links to vetted retail partners (e.g., independent battery distributors or Amazon for DIY tools).
                    If you purchase a product through these links, we may earn a small commission at no extra cost to you.
                </p>
                <p>
                    <strong>Our Promise:</strong> We will never link to a product we wouldn't use in our own homes just to earn a commission.
                    Commercial intent never overrides technical reality.
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
                    <li>Add a <strong>"Correction Note"</strong> at the top of the article explaining what was changed and when.</li>
                    <li>Clear any server-side caches to ensure the fix propagates instantly.</li>
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
                    <li><strong>No Hallucinations</strong>: All data points (prices, voltages, laws) are manually verified against primary sources.</li>
                    <li><strong>Human Oversight</strong>: Every piece of content is reviewed by a human technical editor for tone, accuracy, and safety.</li>
                    <li><strong>Safety Critical</strong>: For "How-To" guides involving high-voltage DC electricity, we adhere to NFPA 855 and NEC standards, which AI models often overlook.</li>
                </ul>

                <h2>6. Conflict of Interest</h2>
                <p>
                    Our contributors are required to disclose any financial holdings in energy companies they cover.
                    Currently, BatteryBlueprint has <strong>no exclusive partnership</strong> with any single battery manufacturer (e.g., Tesla, LG, Enphase).
                    We are 100% reader-supported and independent.
                </p>

                <hr />

                <p className="text-sm text-muted-foreground mt-12">
                    <em>Policy Last Updated: February 2026. This document is reviewed annually to ensure it reflects our evolving high standards.</em>
                </p>
            </div>
        </div>
    );
}
