"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SizingResult } from "@/lib/calc/battery-sizing";
import { RecommendationResult } from "@/lib/calc/recommend-batteries";
import { analytics } from "@/lib/analytics/track";
import { Download, Loader2 } from "lucide-react";

interface BlueprintModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    results: SizingResult;
    recommendations: RecommendationResult;
}

export function BlueprintModal({ open, onOpenChange, results, recommendations }: BlueprintModalProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmEmailSent, setConfirmEmailSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleEmailRequest = async () => {
        analytics.track('PDF_EMAIL_SUBMITTED', {
            email,
            firstName: name || undefined,
            dailyLoad: results.breakdown.loadBase,
            batteryNeeded: results.batteryNameplateNeeded_kWh,
        });

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // Request PDF via confirmation email
            const response = await fetch('/api/blueprint/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name: name || undefined,
                    results,
                    recommendations,
                }),
            });

            const contentType = response.headers.get("content-type");
            let data: any;

            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                // Determine error message from text or status
                const text = await response.text();
                console.error("Non-JSON API response:", text);
                throw new Error(
                    `Server error (${response.status}). Please try the direct download.`
                );
            }

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to send email');
            }

            setConfirmEmailSent(true);

        } catch (e) {
            console.error("Email request failed:", e);
            setErrorMessage(e instanceof Error ? e.message : 'Failed to send email. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fallback: Direct download (client-side generation)
    const handleDirectDownload = async () => {
        setIsSubmitting(true);
        try {
            const { pdf } = await import("@react-pdf/renderer");
            const { BlueprintDocument } = await import("./BlueprintDocument");

            const blob = await pdf(
                <BlueprintDocument results={results} recommendations={recommendations} />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `BatteryBlueprint-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            analytics.track('PDF_DOWNLOADED_DIRECT', { email });
        } catch (e) {
            console.error("PDF generation failed:", e);
            alert("PDF generation failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes("@")) {
            alert("Please enter a valid email address");
            return;
        }
        handleEmailRequest();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Get Your BatteryBlueprint PDF</DialogTitle>
                    <DialogDescription>
                        Includes battery options, coverage, shopping checklist, and installer questions.
                    </DialogDescription>
                </DialogHeader>

                {!confirmEmailSent ? (
                    <form onSubmit={onSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">First Name</Label>
                            <Input
                                id="name"
                                placeholder="Optional"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {errorMessage && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <Button type="submit" className="w-full text-lg" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Email me the PDF"
                            )}
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center">
                            We respect your inbox. No spam, just engineering tools.
                        </p>
                    </form>
                ) : (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                            <Download className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-primary">Check your inbox!</h3>
                        <p className="text-sm text-muted-foreground">
                            We've sent a confirmation email to <strong>{email}</strong>.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Please click the link in the email to confirm and receive your PDF.
                        </p>
                        <div className="p-4 rounded-md bg-muted/50 text-xs text-muted-foreground">
                            <p className="font-medium mb-1">Why confirm?</p>
                            <p>Email confirmation ensures your PDF reaches you and helps us prevent spam.</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
