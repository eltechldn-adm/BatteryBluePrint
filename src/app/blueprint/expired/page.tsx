"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ExpiredPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            {/* Header - Global in RootLayout */}

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">Download Link Expired</h1>
                        <p className="text-lg text-muted-foreground">
                            This PDF download link has expired or is invalid.
                        </p>
                        <p className="text-muted-foreground">
                            Download links are valid for 24 hours after requesting your blueprint.
                        </p>
                    </div>

                    <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                        <h2 className="font-semibold text-lg">Get a Fresh Blueprint</h2>
                        <p className="text-sm text-muted-foreground">
                            Return to the calculator and request a new PDF with your email address. We'll send you a fresh download link right away.
                        </p>
                        <Link
                            href="/calculator"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
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
            {/* Footer - Global in RootLayout */}
        </div>
    );
}
