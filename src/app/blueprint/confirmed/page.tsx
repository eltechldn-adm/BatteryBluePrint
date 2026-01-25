"use client";

import Link from "next/link";
import { CheckCircle2, Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmedContent() {
    const searchParams = useSearchParams();
    const downloadToken = searchParams.get('token');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://batteryblueprint.com';
    const downloadUrl = downloadToken ? `${siteUrl}/api/blueprint/download?token=${downloadToken}` : null;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <Link href="/calculator" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
                    BatteryBlueprint
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/calculator" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                        Calculator
                    </Link>
                    <Link href="/guide" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                        Guide
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">Email Confirmed!</h1>
                        <p className="text-lg text-muted-foreground">
                            Thank you for confirming your email address.
                        </p>
                        <p className="text-muted-foreground">
                            Your custom BatteryBlueprint PDF is on the way to your inbox. Check your email for the download link.
                        </p>
                    </div>

                    {downloadUrl && (
                        <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                            <h2 className="font-semibold text-lg">Or Download Now</h2>
                            <p className="text-sm text-muted-foreground">
                                Don't want to wait? Click below to download your PDF immediately.
                            </p>
                            <a
                                href={downloadUrl}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                            >
                                <Download className="w-5 h-5" />
                                Download PDF
                            </a>
                            <p className="text-xs text-muted-foreground">
                                This link will expire in 24 hours.
                            </p>
                        </div>
                    )}

                    <div className="p-6 rounded-lg bg-muted/50 space-y-3">
                        <h3 className="font-semibold">What's Next?</h3>
                        <ul className="text-sm text-muted-foreground text-left space-y-2">
                            <li>• Review your personalized battery recommendations</li>
                            <li>• Compare options based on your needs</li>
                            <li>• Use the shopping checklist when talking to installers</li>
                            <li>• Re-run the calculator anytime with different inputs</li>
                        </ul>
                        <Link
                            href="/calculator"
                            className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm"
                        >
                            Back to Calculator
                        </Link>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p>
                            Need help? Email us at{" "}
                            <a href="mailto:support@batteryblueprint.com" className="text-primary hover:underline">
                                support@batteryblueprint.com
                            </a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-border/50 bg-muted/30 px-6 py-8">
                <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
                    <p>© 2026 BatteryBlueprint. For planning purposes only.</p>
                </div>
            </footer>
        </div>
    );
}

export default function ConfirmedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        }>
            <ConfirmedContent />
        </Suspense>
    );
}
