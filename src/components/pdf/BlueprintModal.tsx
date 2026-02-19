"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SizingResult } from "@/lib/calc/battery-sizing";
import { RecommendationResult } from "@/lib/calc/recommend-batteries";
import { analytics } from "@/lib/analytics/track";
import { CheckCircle2 } from "lucide-react";

interface BlueprintModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    results: SizingResult;
    recommendations: RecommendationResult;
}

/**
 * BlueprintModal — email capture for the PDF Blueprint.
 *
 * Static-site version: collects the email and stores it locally.
 * To enable actual email delivery, connect a third-party service
 * (e.g. Resend, ConvertKit, Mailchimp) and POST to their API here.
 */
export function BlueprintModal({ open, onOpenChange, results, recommendations }: BlueprintModalProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes("@")) {
            alert("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        analytics.track('PDF_EMAIL_SUBMITTED', {
            email,
            firstName: name || undefined,
            dailyLoad: results.breakdown.loadBase,
            batteryNeeded: results.batteryNameplateNeeded_kWh,
        });

        // Store lead locally (extend this to POST to your email provider)
        try {
            const leadData = {
                email,
                name: name || undefined,
                timestamp: new Date().toISOString(),
                batteryNeeded: results.batteryNameplateNeeded_kWh,
            };
            const existing = JSON.parse(localStorage.getItem('bb_leads') || '[]');
            existing.push(leadData);
            localStorage.setItem('bb_leads', JSON.stringify(existing));
        } catch {
            // Fail silently
        }

        // Simulate a brief loading state for UX
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsSubmitting(false);
        setSubmitted(true);
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

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                        <Button type="submit" className="w-full text-lg" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Email me the PDF"}
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center">
                            We respect your inbox. No spam, just engineering tools.
                        </p>
                    </form>
                ) : (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-primary">Thanks, {name || email}!</h3>
                        <p className="text-sm text-muted-foreground">
                            Your details have been saved. PDF delivery will be available once the email service is connected.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            In the meantime, bookmark this page and return to re-run your calculation anytime.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
