import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Privacy policy for BatteryBlueprint. Learn how we handle your data and protect your information.",
    alternates: {
        canonical: `${siteUrl}/privacy`,
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="animated-blob blob-2 -top-32 -right-48 opacity-10" />
            </div>

            {/* Header - Global in RootLayout */}

            <main className="container mx-auto px-4 py-12 max-w-3xl relative z-10 flex-1">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        Legal
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: February 2026</p>
                </div>

                <Card className="card-premium rounded-2xl border-0">
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-3">Our Commitment</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We respect your privacy. No personal data is sold. All battery sizing calculations are performed locally in your browser — we do not store your inputs on our servers.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Data Collection</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you choose to submit your email address to receive a PDF Blueprint, that email is stored locally in your browser only. We do not transmit it to any server. No account is created and no password is required.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Cookies & Analytics</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google&apos;s Ads Settings</a>.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Advertising Disclosure</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                BatteryBlueprint displays advertisements served by Google AdSense. We may also include affiliate links to products or services. If you purchase through an affiliate link, we may earn a commission at no extra cost to you. All editorial content is independent of advertising relationships.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Third Parties</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not share, sell, or rent your personal information to third parties for marketing purposes. Third-party advertising partners (Google AdSense) operate under their own privacy policies.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Contact</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                For privacy-related questions, email us at{" "}
                                <a href="mailto:support@batteryblueprint.com" className="text-primary hover:underline">
                                    support@batteryblueprint.com
                                </a>. We respond within 2 business days.
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
