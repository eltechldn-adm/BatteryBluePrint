import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator, FileText, Scale, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Editorial Team & Contributors | BatteryBlueprint",
    description: "Meet the engineering-led team behind BatteryBlueprint. We are a collective of technical analysts, solar installers, and software engineers dedicated to transparency.",
    alternates: {
        canonical: "https://batteryblueprint.com/editorial-team",
    },
    openGraph: {
        title: "Editorial Team | BatteryBlueprint",
        description: "Meet the engineering-led team behind BatteryBlueprint.",
        url: "https://batteryblueprint.com/editorial-team",
        type: "website",
    },
};

export default function EditorialTeamPage() {
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
                "name": "Editorial Team",
                "item": "https://batteryblueprint.com/editorial-team"
            }
        ]
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The BatteryBlueprint Editorial Team</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We are a collective of engineers, data analysts, and solar advocates building the internet's most accurate home energy resource.
                    </p>
                </div>

                {/* Who We Are */}
                <div className="article-prose prose prose-slate dark:prose-invert max-w-none">
                    <h2>Who We Are</h2>
                    <p>
                        The solar industry is filled with sales-driven narratives. "Zero Down!" "Free Government Money!"
                        It can be confusing and often misleading.
                    </p>
                    <p>
                        <strong>BatteryBlueprint was founded to cut through that noise.</strong>
                    </p>
                    <p>
                        We are not a sales team. We are an <strong>engineering-first editorial collective</strong>.
                        Our mission is to help homeowners size their battery systems correctly, understand the true ROI, and avoid predatory contracts.
                    </p>
                    <p>
                        Our content is researched, written, and verified by diverse contributors with backgrounds in:
                    </p>
                    <ul>
                        <li>Electrical Engineering (PV & Storage focus)</li>
                        <li>Policy Analysis (ITC, SGIP, NEM 3.0)</li>
                        <li>Software Development (Simulation & Modeling)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic mt-4">
                        *Note: While our team includes engineering professionals, BatteryBlueprint is a publishing platform, not a licensed engineering firm. All content is for educational planning purposes only.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                        <Card className="bg-muted/30 border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-primary" />
                                    <span>Data-Driven Sizing</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    We don't guess. We build <Link href="/calculator" className="text-primary hover:underline">calculators</Link> based on physics, load profiles, and NREL weather data.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/30 border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span>Unbiased Analysis</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    We verify every claim. Learn more about our <Link href="/methodology" className="text-primary hover:underline">methodology</Link> and data sources.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <h2>How We Work</h2>
                    <p>
                        Accuracy is our currency. Every article on this site goes through a rigorous review process:
                    </p>
                    <ol>
                        <li><strong>Topic Selection</strong>: We focus on high-impact questions homeowners are asking (e.g., "Is LFP better than NMC?").</li>
                        <li><strong>Engineering Review</strong>: All technical claims (Voltage, Amperage, kWh) are checked against NEC standards and manufacturer datasheets.</li>
                        <li><strong>Policy Verification</strong>: Incentive data is cross-referenced with official government legislation (IRS, CPUC, etc.).</li>
                    </ol>
                    <p>
                        Read our full <Link href="/editorial-policy">Editorial Policy</Link> for details on our corrections process and advertising standards.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        We value feedback from the community. If you spot an error, have a feature request for our calculator, or want to contribute, please reach out.
                    </p>

                    <div className="flex gap-4 not-prose">
                        <Link href="/contact">
                            <Button className="gap-2">
                                <Mail className="w-4 h-4" />
                                Contact the Editors
                            </Button>
                        </Link>
                    </div>

                    <hr />
                    <p className="text-xs text-muted-foreground mt-8">
                        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
