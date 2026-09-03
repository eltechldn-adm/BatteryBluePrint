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
                    <p className="text-muted-foreground">Last updated: September 2026</p>
                </div>

                <Card className="card-premium rounded-2xl border-0">
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-3">Our Commitment</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We respect your privacy. No personal data is sold. Battery sizing calculations are performed locally in your browser — your calculator inputs are not transmitted to our servers merely by using the calculator.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Calculator Use (No Email)</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                When you use the BatteryBlueprint calculator without requesting an emailed Blueprint, your inputs (appliance loads, battery sizing parameters, and results) are processed entirely within your browser. No account is created and no calculator input data is sent to our servers during ordinary calculator use.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Email Blueprint Delivery</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you voluntarily request that your Blueprint PDF be sent to you by email, the following information is transmitted to a BatteryBlueprint server-side function hosted on Cloudflare Pages:
                            </p>
                            <ul className="text-muted-foreground text-sm space-y-1 list-disc pl-5 mt-3">
                                <li><strong>Your email address</strong> — used solely to deliver the Blueprint email.</li>
                                <li><strong>Your name</strong> (if provided) — used to personalise the email greeting.</li>
                                <li><strong>Your sizing results</strong> — included in the email body and PDF attachment.</li>
                                <li><strong>The PDF file</strong> — transmitted as a base64-encoded attachment.</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                That function passes the email and PDF to <strong>Resend</strong> (resend.com), our email delivery service provider, to dispatch the email. Resend processes this data under its own privacy policy and applicable data protection law. We do not independently store your email address after the email has been dispatched, but you should review <a href="https://resend.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Resend&apos;s Privacy Policy</a> for their data handling and retention practices.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                If you choose to download the Blueprint PDF directly (without email), no personal information is transmitted to any server.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Analytics (Google Analytics 4)</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use Google Analytics 4 (GA4) to understand how visitors use our site. GA4 collects anonymous usage data including page views, session duration, and navigation paths. We have enabled IP anonymisation on all GA4 data. We do not transmit personally identifiable information to Google Analytics. Google Analytics data is retained according to the configured retention settings in our GA4 property and subject to <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>. You can opt out by using the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Advertising &amp; Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                BatteryBlueprint may display advertising, including advertising served through Google AdSense when enabled. If advertising is active, Google AdSense may use cookies to serve ads based on your prior visits to this or other websites. Cookie categories that may be used on this site:
                            </p>
                            <ul className="text-muted-foreground text-sm space-y-1 list-disc pl-5">
                                <li><strong>Necessary cookies:</strong> Essential for site functionality. Cannot be disabled.</li>
                                <li><strong>Analytics cookies:</strong> Google Analytics 4 &mdash; anonymous usage statistics.</li>
                                <li><strong>Advertising cookies:</strong> Google AdSense &mdash; personalised ad targeting (when advertising is enabled).</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                Opt out of personalised advertising at <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google&apos;s Ads Settings</a>.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Your Rights (UK GDPR / GDPR)</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                If you are in the UK or European Economic Area, you have rights under UK GDPR and GDPR:
                            </p>
                            <ul className="text-muted-foreground text-sm space-y-1 list-disc pl-5">
                                <li><strong>Right of access:</strong> Request a copy of any personal data we hold.</li>
                                <li><strong>Right to erasure:</strong> Request deletion of your personal data.</li>
                                <li><strong>Right to rectification:</strong> Request correction of inaccurate data.</li>
                                <li><strong>Right to object:</strong> Object to processing for marketing or analytics.</li>
                                <li><strong>Right to data portability:</strong> Receive your data in a portable format.</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed mt-3">
                                To exercise any of these rights, email <a href="mailto:support@batteryblueprint.com" className="text-primary hover:underline">support@batteryblueprint.com</a>. You may also complain to the <a href="https://ico.org.uk/make-a-complaint/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Information Commissioner&apos;s Office (ICO)</a>.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Data Retention</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Calculator inputs are processed locally in your browser and are not stored on our servers. Email addresses submitted for Blueprint delivery are passed to Resend for dispatch and are not retained by BatteryBlueprint independently after delivery. Google Analytics data is retained according to our configured GA4 property retention settings and Google&apos;s applicable policies. Any advertising data is subject to Google&apos;s own retention policies.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Third Parties</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not sell or rent your data to third parties. We use Google Analytics (analytics), Resend (email delivery for Blueprint requests), and may use Google AdSense (advertising when enabled), all of which operate under their own privacy policies and may transfer data internationally in compliance with applicable data protection law.
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
