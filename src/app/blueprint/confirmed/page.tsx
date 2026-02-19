"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function ConfirmedContent() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            {/* Header - Global in RootLayout */}

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

                    <div className="p-6 rounded-lg bg-muted/50 space-y-3">
                        <h3 className="font-semibold">What&apos;s Next?</h3>
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
            {/* Footer - Global in RootLayout */}
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
