import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms of service for BatteryBlueprint. Review our terms and conditions for using the solar battery sizing calculator.",
    alternates: {
        canonical: `${siteUrl}/terms`,
    },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="animated-blob blob-3 -top-32 -left-48 opacity-10" />
            </div>

            {/* Header - Global in RootLayout */}

            <main className="container mx-auto px-4 py-12 max-w-3xl relative z-10 flex-1">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                        <FileText className="w-4 h-4" />
                        Legal
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: February 2026</p>
                </div>

                <Card className="card-premium rounded-2xl border-0">
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-3">Estimates Only</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                All results provided by BatteryBlueprint are estimates for planning purposes only. They are not a substitute for professional engineering assessment. Consult a certified electrician or licensed solar installer before purchasing or installing any hardware. BatteryBlueprint is not responsible for installation decisions made based on our calculations.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Use of Service</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You may use BatteryBlueprint for personal, non-commercial battery sizing calculations. The recommendations provided are based on general engineering principles and may not account for all site-specific factors including local electrical codes, inverter compatibility, or grid interconnection requirements.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Advertising & Affiliate Links</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                BatteryBlueprint displays advertisements via Google AdSense and may include affiliate links to products or services. Clicking an affiliate link and making a purchase may result in a commission paid to BatteryBlueprint at no additional cost to you. Advertising relationships do not influence our editorial content or battery recommendations.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Editorial Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                All content on BatteryBlueprint is for educational purposes only. Our guides and articles are written by the BatteryBlueprint Editorial team using publicly available engineering data, manufacturer datasheets, and industry standards. We strive for accuracy but make no warranty that information is current or error-free.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Limitation of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                BatteryBlueprint provides this service &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from the use of our calculator, recommendations, or content.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            {/* Footer - Global in RootLayout */}
        </div>
    );
}
