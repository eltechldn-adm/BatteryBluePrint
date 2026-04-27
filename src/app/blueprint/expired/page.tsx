import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Page Not Found | BatteryBlueprint",
    description: "This page could not be found. Return to the calculator to run your battery sizing.",
};

export default function ExpiredPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">Page Not Available</h1>
                        <p className="text-lg text-muted-foreground">
                            This page is no longer active.
                        </p>
                        <p className="text-muted-foreground">
                            Return to the calculator to run your battery sizing calculations.
                        </p>
                    </div>

                    <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                        <h2 className="font-semibold text-lg">Use the Calculator</h2>
                        <p className="text-sm text-muted-foreground">
                            The BatteryBlueprint calculator is available directly in your browser — no download required.
                            Enter your daily load and get engineering-grade battery recommendations instantly.
                        </p>
                        <Link
                            href="/calculator"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                        >
                            Go to Calculator
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
        </div>
    );
}
