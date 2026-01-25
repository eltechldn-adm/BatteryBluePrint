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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        Legal
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: January 2026</p>
                </div>

                <Card className="card-premium rounded-2xl border-0">
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-3">Our Commitment</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We respect your privacy. No data is sold. Calculations are done locally in your browser where possible.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Data Collection</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We only collect the email address you provide when downloading your PDF Blueprint. This is used solely to deliver your document and occasional product updates.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-3">Third Parties</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not share, sell, or rent your personal information to third parties for marketing purposes.
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
                            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}
