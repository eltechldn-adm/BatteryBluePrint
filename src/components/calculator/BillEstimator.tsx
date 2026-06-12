import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

export interface BillEstimatorProps {
    currencyLabel: string;
    typicalRate: number;
    billAmount: string;
    setBillAmount: (val: string) => void;
    billingPeriod: "monthly" | "quarterly" | "yearly" | "custom";
    setBillingPeriod: (val: "monthly" | "quarterly" | "yearly" | "custom") => void;
    customDays: string;
    setCustomDays: (val: string) => void;
    electricityRate: string;
    setElectricityRate: (val: string) => void;
    onElectricityRateChange: (val: string) => void;
    estimatedDailyKwh: number | null;
}

export function BillEstimator({
    currencyLabel,
    typicalRate,
    billAmount,
    setBillAmount,
    billingPeriod,
    setBillingPeriod,
    customDays,
    setCustomDays,
    electricityRate,
    setElectricityRate,
    onElectricityRateChange,
    estimatedDailyKwh
}: BillEstimatorProps) {
    return (
        <div className="mt-4 p-4 rounded-xl bg-muted/30 border-2 border-primary/20 space-y-4">
            <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Estimate only.</strong> For accuracy, use the kWh shown on your electricity bill.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label htmlFor="billAmount" className="text-sm font-medium">Bill Amount ({currencyLabel})</Label>
                    <Input
                        id="billAmount"
                        type="number"
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        placeholder="150"
                        className="h-10 rounded-lg"
                        step="0.01"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="billingPeriod" className="text-sm font-medium">Billing Period</Label>
                    <select
                        id="billingPeriod"
                        value={billingPeriod}
                        onChange={(e) => setBillingPeriod(e.target.value as any)}
                        className="h-10 w-full rounded-lg border-2 border-input bg-background px-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom Days</option>
                    </select>
                </div>
            </div>

            {billingPeriod === 'custom' && (
                <div className="space-y-2">
                    <Label htmlFor="customDays" className="text-sm font-medium">Number of Days</Label>
                    <Input
                        id="customDays"
                        type="number"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        placeholder="30"
                        className="h-10 rounded-lg"
                    />
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="electricityRate" className="text-sm font-medium">
                    Electricity Rate ({currencyLabel}/kWh) <span className="text-muted-foreground font-normal">— Typical: {typicalRate.toFixed(2)} (edit)</span>
                </Label>
                <Input
                    id="electricityRate"
                    type="number"
                    value={electricityRate}
                    onChange={(e) => {
                        setElectricityRate(e.target.value);
                        onElectricityRateChange(e.target.value);
                    }}
                    placeholder={typicalRate.toFixed(2)}
                    className="h-10 rounded-lg"
                    step="0.01"
                />
            </div>

            {estimatedDailyKwh !== null && (
                <div className="pt-2 border-t border-border/50">
                    <p className="text-sm font-semibold text-foreground">
                        Estimated Daily kWh: <span className="text-primary">{estimatedDailyKwh.toFixed(1)}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
