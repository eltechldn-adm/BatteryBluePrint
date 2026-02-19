"use client";

import Link from "next/link";
import { Mail, AlertCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText('support@batteryblueprint.com');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            {/* Header - Global in RootLayout */}

            {/* Main Content */}
            <main className="flex-1 px-4 sm:px-6 py-12">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Hero */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground">
                            Questions about the calculator? We're here to help.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div className="p-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="font-semibold text-amber-900 dark:text-amber-100">
                                    We cannot provide electrical design approvals
                                </p>
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    BatteryBlueprint is a planning tool, not a licensed engineering firm. For installation, permitting, and final system design, please work with a licensed electrician or solar installer in your area.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Options */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">How to Reach Us</h2>

                        {/* Email */}
                        <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email Support</h3>
                                    <p className="text-sm text-muted-foreground">We typically respond within 24-48 hours</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="mailto:support@batteryblueprint.com?subject=Calculator Support Request"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    support@batteryblueprint.com
                                </a>
                                <button
                                    onClick={handleCopyEmail}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm cursor-pointer"
                                    aria-label="Copy email address"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* What We Can Help With */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">We Can Help With:</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Questions about how the calculator works</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Understanding your results</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Clarifying assumptions and formulas</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Reporting bugs or technical issues</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Suggesting battery models for the catalog</span>
                                </li>
                            </ul>
                        </div>

                        {/* What We Can't Help With */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">We Cannot Help With:</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex gap-2">
                                    <span className="text-muted-foreground/50">•</span>
                                    <span>Final system design or engineering approval</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-muted-foreground/50">•</span>
                                    <span>Electrical code compliance or permitting</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-muted-foreground/50">•</span>
                                    <span>Installer recommendations or referrals</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-muted-foreground/50">•</span>
                                    <span>Product purchases or warranty support</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* FAQ Link */}
                    <div className="text-center pt-8">
                        <p className="text-muted-foreground mb-4">
                            Looking for answers? Check our comprehensive guide first:
                        </p>
                        <Link
                            href="/guide"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold"
                        >
                            Read the Guide
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            {/* Footer - Global in RootLayout */}
        </div>
    );
}
