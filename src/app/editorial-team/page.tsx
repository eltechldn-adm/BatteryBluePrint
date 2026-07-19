import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator, ShieldCheck, Mail, Award, Cpu, BookOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "Editorial Team & Contributors | BatteryBlueprint",
    description: "Meet the BatteryBlueprint Editorial Research Team. We are an independent educational publishing platform dedicated to transparency.",
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

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BatteryBlueprint Editorial",
        "description": "Educational publishing platform providing technical guides on residential energy storage.",
        "url": "https://batteryblueprint.com"
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />

            <div className="space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The BatteryBlueprint Editorial Team</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        BatteryBlueprint Editorial Research Team: an independent educational publishing platform dedicated to bias-free battery storage guidance.
                    </p>
                </div>

                {/* Named Contributors */}
                {/* Named Contributors */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">The Editorial Desk</h2>
                    <div className="grid md:grid-cols-1 gap-6">
                        <Card className="bg-card border border-border rounded-xl">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-bold">BatteryBlueprint Research Team</h3>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">Technical Publishing</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            BatteryBlueprint is an independent educational publishing platform. Our content is compiled by a dedicated research desk that synthesises publicly available engineering standards, utility rate structures, and manufacturer technical documentation into accessible guides for homeowners.
                                        </p>
                                        <div className="flex flex-wrap gap-3 pt-1">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Award className="w-3.5 h-3.5 text-primary" />
                                                Independent Research
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Cpu className="w-3.5 h-3.5 text-primary" />
                                                Data-Driven Sizing
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Important Disclaimer */}
                <div className="space-y-6 pt-6 mt-6 border-t border-border/50">
                    <h2 className="text-2xl font-bold">Important Disclaimer</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        BatteryBlueprint is an <strong>educational publishing platform</strong>, not a licensed engineering firm. The sizing calculators, financial estimates, and technical guides provided on this site are for educational and planning purposes only. They do not constitute professional engineering advice or an official system design.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        All electrical work, system sizing, and hardware selection must be verified and approved by a certified, licensed professional in your local jurisdiction (e.g., an MCS-certified installer in the UK, or a licensed electrician/NABCEP-certified installer in the US) prior to purchase or installation.
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
                        We are not a sales team. We are a <strong>data-driven editorial collective</strong>.
                        Our mission is to help homeowners size their battery systems correctly, understand the true ROI, and avoid predatory contracts.
                    </p>
                    <p>
                        Our content is researched, written, and verified by diverse contributors with backgrounds in energy policy, technical research, and data modeling.
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
                        Last Updated: 12 May 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
