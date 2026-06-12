import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { ASSUMPTION_TOOLTIPS } from "@/lib/ui/assumptionTooltips";
import { LocationProfile } from "@/data/locations";

export interface AdvancedAssumptionsProps {
    hasUserCustomizedAssumptions: boolean;
    dod: number;
    handleDodChange: (val: number) => void;
    inverterEfficiency: number;
    handleEfficiencyChange: (val: number) => void;
    reserveBuffer: number;
    handleReserveBufferChange: (val: number) => void;
    winterMode: boolean;
    handleAdvancedWinterModeChange: (val: boolean) => void;
    winterBuffer: number;
    handleWinterBufferChange: (val: number) => void;
    resetToLocationDefaults: () => void;
    locationProfile: LocationProfile;
}

export function AdvancedAssumptions({
    hasUserCustomizedAssumptions,
    dod,
    handleDodChange,
    inverterEfficiency,
    handleEfficiencyChange,
    reserveBuffer,
    handleReserveBufferChange,
    winterMode,
    handleAdvancedWinterModeChange,
    winterBuffer,
    handleWinterBufferChange,
    resetToLocationDefaults,
    locationProfile
}: AdvancedAssumptionsProps) {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced" className="border-0">
                <AccordionTrigger className="text-base font-semibold hover:no-underline py-3 px-4 rounded-xl hover:bg-muted/30">
                    <div className="flex items-center gap-2">
                        <span>Advanced (Optional)</span>
                        {hasUserCustomizedAssumptions && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-primary/10 text-primary">Custom</span>
                        )}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6 pb-2">
                    <p className="text-sm text-muted-foreground mb-4">
                        Fine-tune calculation assumptions. Defaults are based on your selected location.
                    </p>

                    {/* DoD */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Label className="text-sm font-semibold">{ASSUMPTION_TOOLTIPS.dod.label}</Label>
                                <Tooltip content={ASSUMPTION_TOOLTIPS.dod.tooltip} ariaLabel="More info about Depth of Discharge" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={Math.round(dod * 100)}
                                    onChange={(e) => handleDodChange(parseFloat(e.target.value) / 100)}
                                    className="h-8 w-16 text-center text-sm"
                                    min={50}
                                    max={95}
                                />
                                <span className="text-sm font-mono">%</span>
                            </div>
                        </div>
                        <Slider
                            value={[dod * 100]}
                            onValueChange={([v]) => handleDodChange(v / 100)}
                            min={50}
                            max={95}
                            step={1}
                            className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">How much of the battery's capacity can be safely used (higher = more usable energy but may reduce lifespan)</p>
                    </div>

                    {/* Inverter Efficiency */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Label className="text-sm font-semibold">{ASSUMPTION_TOOLTIPS.efficiency.label}</Label>
                                <Tooltip content={ASSUMPTION_TOOLTIPS.efficiency.tooltip} ariaLabel="More info about Inverter Efficiency" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={Math.round(inverterEfficiency * 100)}
                                    onChange={(e) => handleEfficiencyChange(parseFloat(e.target.value) / 100)}
                                    className="h-8 w-16 text-center text-sm"
                                    min={80}
                                    max={98}
                                />
                                <span className="text-sm font-mono">%</span>
                            </div>
                        </div>
                        <Slider
                            value={[inverterEfficiency * 100]}
                            onValueChange={([v]) => handleEfficiencyChange(v / 100)}
                            min={80}
                            max={98}
                            step={1}
                            className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">Energy conversion efficiency from DC battery to AC home power (typical: 90-95%)</p>
                    </div>

                    {/* Reserve Buffer */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Label className="text-sm font-semibold">{ASSUMPTION_TOOLTIPS.reserve.label}</Label>
                                <Tooltip content={ASSUMPTION_TOOLTIPS.reserve.tooltip} ariaLabel="More info about Reserve Buffer" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={Math.round(reserveBuffer * 100)}
                                    onChange={(e) => handleReserveBufferChange(parseFloat(e.target.value) / 100)}
                                    className="h-8 w-16 text-center text-sm"
                                    min={0}
                                    max={40}
                                />
                                <span className="text-sm font-mono">%</span>
                            </div>
                        </div>
                        <Slider
                            value={[reserveBuffer * 100]}
                            onValueChange={([v]) => handleReserveBufferChange(v / 100)}
                            min={0}
                            max={40}
                            step={1}
                            className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">Safety margin for unexpected usage or measurement error (recommended: 15%)</p>
                    </div>

                    {/* Winter Buffer */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Label className="text-sm font-semibold">{ASSUMPTION_TOOLTIPS.winter.label}</Label>
                                <Tooltip content={ASSUMPTION_TOOLTIPS.winter.tooltip} ariaLabel="More info about Winter Buffer" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="winterModeAdvanced"
                                    className="toggle-premium h-4 w-4 rounded border-2 border-muted text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                    checked={winterMode}
                                    onChange={(e) => handleAdvancedWinterModeChange(e.target.checked)}
                                />
                                <Label htmlFor="winterModeAdvanced" className="text-sm cursor-pointer">
                                    {winterMode ? 'ON' : 'OFF'}
                                </Label>
                            </div>
                        </div>
                        {winterMode && (
                            <>
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs text-muted-foreground">Buffer Amount</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={Math.round(winterBuffer * 100)}
                                            onChange={(e) => handleWinterBufferChange(parseFloat(e.target.value) / 100)}
                                            className="h-8 w-16 text-center text-sm"
                                            min={10}
                                            max={40}
                                        />
                                        <span className="text-sm font-mono">%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[winterBuffer * 100]}
                                    onValueChange={([v]) => handleWinterBufferChange(v / 100)}
                                    min={10}
                                    max={40}
                                    step={1}
                                    className="cursor-pointer"
                                />
                            </>
                        )}
                        <p className="text-xs text-muted-foreground">Additional capacity for reduced solar production in winter or cloudy seasons</p>
                    </div>

                    {/* Reset Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetToLocationDefaults}
                        className="w-full text-sm"
                        disabled={!hasUserCustomizedAssumptions}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset to {locationProfile.label} Defaults
                    </Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
