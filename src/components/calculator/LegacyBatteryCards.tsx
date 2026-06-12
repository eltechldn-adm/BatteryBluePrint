import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";
import { SizingResult } from "@/lib/calc/battery-sizing";
import { RecommendedBattery } from "@/lib/calc/recommend-batteries";

export function BatteryCard({
    tier,
    data,
    targets,
    whyText,
    delay
}: {
    tier: string,
    data: RecommendedBattery,
    targets: SizingResult,
    whyText: string,
    delay: number
}) {
    const { battery, count, totalNameplate_kWh, totalUsable_kWh } = data;

    // Coverage Calculations with detailed badges
    const usableCoveragePct = Math.round((totalUsable_kWh / targets.batteryUsableNeeded_kWh) * 100);
    const nameplateCoveragePct = Math.round((totalNameplate_kWh / targets.batteryNameplateNeeded_kWh) * 100);

    // Determine coverage badge
    let coverageBadge = { text: "Meets Target", class: "badge-pill-success", icon: "✓" };
    if (usableCoveragePct >= 100) {
        coverageBadge = { text: "Meets Target", class: "badge-pill-success", icon: "✓" };
    } else if (usableCoveragePct >= 95) {
        coverageBadge = { text: "Close Match", class: "badge-pill-warning", icon: "~" };
    } else {
        coverageBadge = { text: "Undersized", class: "badge-pill-error", icon: "!" };
    }

    const tierClass = tier === "Premium" ? "tier-premium" : tier === "Mid-Range" ? "tier-midrange" : "tier-diy";
    const borderClass = tier === "Premium" ? "bg-primary" : tier === "Mid-Range" ? "bg-secondary" : "bg-accent";

    return (
        <Card
            className="card-premium overflow-hidden rounded-2xl border-0 result-animate"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className={`h-1.5 w-full ${borderClass}`} />
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                        <div className="flex gap-2 items-center flex-wrap">
                            <span className={`tier-chip ${tierClass}`}>{tier}</span>
                            <span className={`badge-pill ${coverageBadge.class}`}>
                                {coverageBadge.icon} {coverageBadge.text}
                            </span>
                            <span className="badge-pill badge-pill-neutral text-xs">
                                {usableCoveragePct}% coverage
                            </span>
                        </div>
                        <h4 className="font-bold text-lg leading-tight">{battery.brand} {battery.model}</h4>
                        <p className="text-xs text-muted-foreground italic">{whyText}</p>
                    </div>
                    <div className="text-right pl-4">
                        <div className="text-2xl font-bold text-primary">{count}</div>
                        <div className="text-xs text-foreground/60 font-medium">Unit{count > 1 ? 's' : ''}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm py-3 border-y border-border/30 bg-muted/10 -mx-5 px-5 my-3">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">Total Usable</span>
                        <span className="font-mono font-semibold text-foreground">{totalUsable_kWh.toFixed(1)} kWh</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">Total Nameplate</span>
                        <span className="font-mono font-semibold text-foreground">{totalNameplate_kWh.toFixed(1)} kWh</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">Per Unit</span>
                        <span className="font-mono text-sm text-foreground/80">{battery.usableKwhPerUnit.toFixed(1)} kWh</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">Chemistry</span>
                        <span className="text-sm text-foreground/80">{battery.chemistry === 'LFP' ? 'LFP' : battery.chemistry === 'NMC' ? 'NMC' : 'Other'}</span>
                    </div>
                </div>

                {/* Mini Compare - Collapsible */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="specs" className="border-b-0">
                        <AccordionTrigger className="text-xs font-medium text-muted-foreground hover:text-foreground py-2 hover:no-underline">
                            View detailed specs
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                            <div className="space-y-2 text-xs pb-2">
                                {battery.continuousKwPerUnit && (
                                    <div className="flex justify-between py-1.5 border-b border-border/20">
                                        <span className="text-muted-foreground">Continuous Output</span>
                                        <span className="font-semibold">{battery.continuousKwPerUnit} kW</span>
                                    </div>
                                )}
                                {battery.warrantyYears && (
                                    <div className="flex justify-between py-1.5 border-b border-border/20">
                                        <span className="text-muted-foreground">Warranty</span>
                                        <span className="font-semibold">{battery.warrantyYears} years</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-1.5 border-b border-border/20">
                                    <span className="text-muted-foreground">Nameplate per unit</span>
                                    <span className="font-semibold">{battery.nameplateKwhPerUnit || battery.usableKwhPerUnit} kWh</span>
                                </div>
                                {battery.sourceNote && (
                                    <div className="pt-2">
                                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                                            {battery.sourceNote}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-border/20 mt-2">
                    <p className="text-muted-foreground">
                        {battery.brand} • {battery.chemistry === 'LFP' ? "LFP" : battery.chemistry === 'NMC' ? "NMC" : "Other"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export function EmptyTierCard({ tier, delay }: { tier: string, delay: number }) {
    const tierClass = tier === "Premium" ? "tier-premium" : tier === "Mid-Range" ? "tier-midrange" : "tier-diy";
    const borderClass = tier === "Premium" ? "bg-primary/30" : tier === "Mid-Range" ? "bg-secondary/30" : "bg-accent/30";

    return (
        <Card
            className="card-premium overflow-hidden rounded-2xl border-0 result-animate opacity-50"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className={`h-1.5 w-full ${borderClass}`} />
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className={`tier-chip ${tierClass}`}>{tier}</span>
                </div>
                <div className="py-8 text-center">
                    <Info className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                        No match found for this tier in your region yet.
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        More models coming soon.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
