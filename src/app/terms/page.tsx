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

            <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="text-xl font-bold text-primary">
                    <Link href="/" className="hover:opacity-80 transition-opacity">BatteryBlueprint</Link>
                </div>
                <div className="flex gap-4">
                    <Link href="/calculator">
                        <Button className="btn-premium">Calculator</Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-3xl relative z-10 flex-1">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                        <FileText className="w-4 h-4" />
                        Legal
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: January 2026</p>
                </div>

                <Card className="card-premium rounded-2xl border-0">
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-3">Estimates Only</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                This tool provides estimates only. Consult with a certified electrician or solar installer before purchasing any hardware. BatteryBlueprint is not responsible for installation decisions.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Use of Service</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You may use BatteryBlueprint for personal, non-commercial battery sizing calculations. The recommendations provided are based on general engineering principles and may not account for all site-specific factors.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Limitation of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                BatteryBlueprint provides this service &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from the use of our calculator or recommendations.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-border/50 bg-muted/20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-xl font-bold text-primary">BatteryBlueprint</div>
                        <nav className="flex gap-8 text-sm text-muted-foreground">
                            <Link href="/calculator" className="hover:text-primary transition-colors">Calculator</Link>
                            <Link href="/guide" className="hover:text-primary transition-colors">Guide</Link>
                            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}
