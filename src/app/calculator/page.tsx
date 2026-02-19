"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { calculateStorageNeeded, SizingResult } from "@/lib/calc/battery-sizing";
import { recommendBatteries, RecommendationResult, RecommendedBattery } from "@/lib/calc/recommend-batteries";
import { BatteryCatalogItem } from "@/lib/batteries/catalog";
import { analytics } from "@/lib/analytics/track";
import { FileText, CheckCircle2, Sparkles, Info, Globe, RotateCcw, HelpCircle, X, ArrowUpDown } from "lucide-react";
import { LOCATION_PROFILES, getLocationProfile } from "@/data/locations";
import { ASSUMPTION_TOOLTIPS, LOCATION_PRESET_EXPLANATION } from "@/lib/ui/assumptionTooltips";
import { useCountry } from "@/lib/geo/useCountry";
import { getProfileForCountry } from "@/lib/geo/countryProfiles";
import { track } from "@/lib/analytics/journey";
import { CalculatorNextSteps } from "@/components/conversion/CalculatorNextSteps";

export default function CalculatorPage() {
    const { country, setCountry } = useCountry();

    const [dailyLoad, setDailyLoad] = useState<string>("10");
    const [autonomy, setAutonomy] = useState<number[]>([1]);
    const [winterMode, setWinterMode] = useState<boolean>(false);

    // Initialize location from global country state
    const [location, setLocation] = useState<string>('auto');
    const [userOverrides, setUserOverrides] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState<boolean>(false);

    // Location preset parameters (applied automatically from location defaults)
    const [dod, setDod] = useState<number>(0.80);
    const [inverterEfficiency, setInverterEfficiency] = useState<number>(0.90);
    const [reserveBuffer, setReserveBuffer] = useState<number>(0.15);
    const [winterBuffer, setWinterBuffer] = useState<number>(0.20);

    // Track if user has customized assumptions (protects overrides from location changes)
    const [hasUserCustomizedAssumptions, setHasUserCustomizedAssumptions] = useState<boolean>(false);

    // Location preset explanation popover
    const [locationInfoOpen, setLocationInfoOpen] = useState<boolean>(false);

    const [result, setResult] = useState<SizingResult | null>(null);
    const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [hasCalculated, setHasCalculated] = useState(false);

    // Recommendations UI state
    const [sortBy, setSortBy] = useState<'best-match' | 'lowest-units' | 'highest-coverage'>('best-match');
    const [filterTier, setFilterTier] = useState<'all' | 'premium' | 'mid' | 'diy'>('all');
    const [filterChemistry, setFilterChemistry] = useState<'all' | 'LFP' | 'NMC' | 'Other'>('all');

    // Bill estimator state
    const [billEstimatorEnabled, setBillEstimatorEnabled] = useState(false);
    const [savedManualLoad, setSavedManualLoad] = useState<string>("");
    const [billAmount, setBillAmount] = useState<string>("");
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly' | 'yearly' | 'custom'>('monthly');
    const [customDays, setCustomDays] = useState<string>("30");
    const [electricityRate, setElectricityRate] = useState<string>("");

    const resultsRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Determine effective location and profile
    const effectiveLocation = location === 'auto' ? getProfileForCountry(country.code).regionId : location;
    const locationProfile = getLocationProfile(effectiveLocation);
    const countryProfile = getProfileForCountry(country.code);

    // Dynamic Currency & Rates from Country Profile 
    // If the calculator location matches the global country, use the country's specific currency/rates.
    // Otherwise fallback to the location profile's defaults (less specific).
    const isGlobalSync = effectiveLocation === countryProfile.regionId;

    const currency = isGlobalSync ? countryProfile.currencyCode : '$'; // Default to $ if region mismatch (e.g. manual override) - or just use locationProfile default
    // Actually, simple is better: Use Country Profile for formatting if possible, else fallback.
    // For simplicity in Phase 14B.2: 
    // Use the currency from the current Country (from Header) if it matches the active region.
    // If user selected "United Kingdom" in calculator but Header is "US", what happens?
    // We decided Header controls Calculator.
    // So let's rely on countryProfile for currency symbol if we can.

    const currencySymbol = (code: string) => {
        try {
            return (0).toLocaleString(countryProfile.locale, { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();
        } catch {
            return '$';
        }
    };

    // Current display currency
    const displayCurrency = countryProfile.currencyCode;
    const displayCurrencySymbol = currencySymbol(displayCurrency);

    const typicalRate = isGlobalSync ? countryProfile.defaults.electricityRate : 0.20;

    // Handle Calculator-specific location change (Two-way sync attempt)
    const handleLocationChange = (newLocation: string) => {
        setLocation(newLocation);

        // Attempt to sync back to global country if possible
        // Simple map for the standard supported ones
        const regionToCountry: Record<string, string> = {
            'uk': 'GB',
            'us': 'US',
            'au': 'AU',
            'ca': 'CA',
            'de': 'DE',
            'za': 'ZA',
            // 'global' maps to nothing specific, keep current
        };

        if (regionToCountry[newLocation]) {
            setCountry(regionToCountry[newLocation]);
        }
    };

    // Set mounted flag
    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync global country to local calculator location
    useEffect(() => {
        if (!mounted) return;

        const profile = getProfileForCountry(country.code);
        // Only update if the user hasn't explicitly selected a different calculator region
        // (For now, we assume global country drives calculator region until manually changed in calculator)
        // Actually, requirement is: "Header country selector must control the Calculator mode automatically."
        // So we ALWAYS update location when country changes.
        // So we ALWAYS update location when country changes.
        if (profile) {
            // Track sync event if location actually changes
            if (location !== profile.regionId) {
                track('calculator_country_sync', {
                    from: location,
                    to: profile.regionId,
                    source: 'auto_sync_header'
                });
                setLocation(profile.regionId);
            }
        }
    }, [country.code, mounted]);

    // Load location from localStorage or default to auto on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('bb_location');
        // Only load saved location if it's valid, otherwise keep default 'auto'
        if (savedLocation && savedLocation !== 'null' && savedLocation !== 'undefined') {
            setLocation(savedLocation);
        } else {
            // If no saved location, use the one derived from global country
            const profile = getProfileForCountry(country.code);
            setLocation(profile.regionId);
        }

        // Load saved assumption overrides
        const savedOverrides = localStorage.getItem('bb_assumptions_overrides');
        if (savedOverrides) {
            try {
                const overrides = JSON.parse(savedOverrides);
                if (overrides.dod !== undefined) setDod(overrides.dod);
                if (overrides.inverterEfficiency !== undefined) setInverterEfficiency(overrides.inverterEfficiency);
                if (overrides.reserveBuffer !== undefined) setReserveBuffer(overrides.reserveBuffer);
                if (overrides.winterBuffer !== undefined) setWinterBuffer(overrides.winterBuffer);
                if (overrides.winterMode !== undefined) setWinterMode(overrides.winterMode);
                setHasUserCustomizedAssumptions(true);
            } catch (e) {
                console.error('Failed to load assumption overrides:', e);
            }
        }

        firstInputRef.current?.focus();
    }, []);

    // Save location to localStorage and cookie when changed
    useEffect(() => {
        localStorage.setItem('bb_location', location);
        document.cookie = `bb_location=${location}; path=/; max-age=31536000`; // 1 year
    }, [location]);

    // Apply location presets when location changes
    // CRITICAL: Only apply if user hasn't manually customized these values
    useEffect(() => {
        const profile = locationProfile;

        // If user has customized assumptions, don't override them
        if (hasUserCustomizedAssumptions) {
            // Only update winter buffer value (not the mode) to keep UI in sync
            setWinterBuffer(profile.defaults.winterBuffer);
            return;
        }

        // First time or no customization: apply all presets
        setWinterMode(profile.defaults.winterBuffer > 0);
        setWinterBuffer(profile.defaults.winterBuffer);
        setDod(profile.defaults.dod);
        setInverterEfficiency(profile.defaults.inverterEfficiency);
        setReserveBuffer(profile.defaults.reserveBuffer);
    }, [effectiveLocation, hasUserCustomizedAssumptions]); // Re-run when effective location changes

    // Initialize electricity rate when location changes
    useEffect(() => {
        // If user hasn't overridden the rate, apply the default for the new location/profile
        if (!userOverrides.has('electricityRate')) {
            setElectricityRate(typicalRate.toFixed(2));
        }
    }, [typicalRate, userOverrides]); // Update when typicalRate changes (which changes with location)

    // Helper for bill estimator currency label
    const currencyLabel = displayCurrencySymbol;

    // Recalculate recommendations when filters change
    useEffect(() => {
        if (result) {
            const recs = recommendBatteries({
                batteryUsableNeeded_kWh: result.batteryUsableNeeded_kWh,
                locationTag: locationProfile.regionAvailabilityTag,
                tierFilter: filterTier,
                chemistryFilter: filterChemistry,
            });
            setRecommendations(recs);
        }
    }, [filterTier, filterChemistry, result, locationProfile.regionAvailabilityTag]);

    // Bill estimator calculation
    const calculateDailyKwhFromBill = (): number | null => {
        const bill = parseFloat(billAmount);
        const rate = parseFloat(electricityRate);

        if (!bill || !rate || bill <= 0 || rate <= 0) return null;

        const totalKwh = bill / rate;

        let days = 30;
        if (billingPeriod === 'quarterly') days = 90;
        else if (billingPeriod === 'yearly') days = 365;
        else if (billingPeriod === 'custom') days = parseFloat(customDays) || 30;

        return totalKwh / days;
    };

    // Update dailyLoad when bill estimator values change
    useEffect(() => {
        if (billEstimatorEnabled) {
            const estimatedDaily = calculateDailyKwhFromBill();
            if (estimatedDaily !== null) {
                setDailyLoad(estimatedDaily.toFixed(1));
            }
        }
    }, [billEstimatorEnabled, billAmount, electricityRate, billingPeriod, customDays]);

    // Toggle bill estimator mode
    const toggleBillEstimator = () => {
        if (!billEstimatorEnabled) {
            // Enabling: save current manual input
            setSavedManualLoad(dailyLoad);
            setBillEstimatorEnabled(true);
            if (!electricityRate) {
                setElectricityRate(typicalRate.toFixed(2));
            }
        } else {
            // Disabling: restore manual input
            setBillEstimatorEnabled(false);
            setDailyLoad(savedManualLoad || "10");
        }
    };

    // Advanced assumption handlers with validation
    const handleDodChange = (value: number) => {
        const clamped = Math.max(0.50, Math.min(0.95, value));
        setDod(clamped);
        setHasUserCustomizedAssumptions(true);
        saveAssumptionOverrides({ dod: clamped });
    };

    const handleEfficiencyChange = (value: number) => {
        const clamped = Math.max(0.80, Math.min(0.98, value));
        setInverterEfficiency(clamped);
        setHasUserCustomizedAssumptions(true);
        saveAssumptionOverrides({ inverterEfficiency: clamped });
    };

    const handleReserveBufferChange = (value: number) => {
        const clamped = Math.max(0.00, Math.min(0.40, value));
        setReserveBuffer(clamped);
        setHasUserCustomizedAssumptions(true);
        saveAssumptionOverrides({ reserveBuffer: clamped });
    };

    const handleWinterBufferChange = (value: number) => {
        const clamped = Math.max(0.10, Math.min(0.40, value));
        setWinterBuffer(clamped);
        setHasUserCustomizedAssumptions(true);
        saveAssumptionOverrides({ winterBuffer: clamped });
    };

    const handleAdvancedWinterModeChange = (checked: boolean) => {
        setWinterMode(checked);
        setHasUserCustomizedAssumptions(true);
        saveAssumptionOverrides({ winterMode: checked });
    };

    const saveAssumptionOverrides = (updates: Partial<{
        dod: number;
        inverterEfficiency: number;
        reserveBuffer: number;
        winterBuffer: number;
        winterMode: boolean;
    }>) => {
        const savedOverrides = localStorage.getItem('bb_assumptions_overrides');
        const current = savedOverrides ? JSON.parse(savedOverrides) : {};
        const updated = { ...current, ...updates };
        localStorage.setItem('bb_assumptions_overrides', JSON.stringify(updated));
    };

    const resetToLocationDefaults = () => {
        // Clear customization flag and localStorage
        setHasUserCustomizedAssumptions(false);
        localStorage.removeItem('bb_assumptions_overrides');

        // Apply all location defaults
        const profile = locationProfile;
        setDod(profile.defaults.dod);
        setInverterEfficiency(profile.defaults.inverterEfficiency);
        setReserveBuffer(profile.defaults.reserveBuffer);
        setWinterBuffer(profile.defaults.winterBuffer);
        setWinterMode(profile.defaults.winterBuffer > 0);
    };



    const handleResetToLocationDefaults = () => {
        // Track reset
        track('calculator_reset_defaults', { location: effectiveLocation });

        // Clear all user overrides
        setUserOverrides(new Set());

        // Apply all location defaults
        const profile = locationProfile;
        setDod(profile.defaults.dod);
        setInverterEfficiency(profile.defaults.inverterEfficiency);
        setReserveBuffer(profile.defaults.reserveBuffer);
        setWinterBuffer(profile.defaults.winterBuffer);
        setWinterMode(profile.defaults.winterBuffer > 0);
    };

    const handleWinterModeChange = (value: boolean) => {
        setWinterMode(value);
        setUserOverrides(prev => new Set(prev).add('winterMode'));
    };

    const handleCalculate = () => {
        const load = parseFloat(dailyLoad);
        if (isNaN(load) || load <= 0) return;

        // Track calculation
        track('calculator_calculate', {
            location: effectiveLocation,
            hasOverrides: userOverrides.size > 0,
            winterMode: winterMode,
            autonomy: autonomy[0]
        });

        const res = calculateStorageNeeded({
            dailyLoad_kWh: load,
            daysOfAutonomy: autonomy[0],
            dod: dod,
            efficiency: inverterEfficiency,
            winterMode: winterMode,
            reserveBuffer: reserveBuffer,
        });
        setResult(res);

        // VERIFICATION: Recommendation target must match Results panel exactly
        // Example: dailyLoad=100, days=3, reserve=15%, winter=ON, efficiency=90%, DoD=80%
        // → Load Target = 414 kWh
        // → Battery Usable Needed = 460 kWh (this value is passed to recommendBatteries)
        // → Recommended Nameplate = 575 kWh
        // The UI header at line 1077 displays: result.batteryUsableNeeded_kWh
        // This same value is passed below as batteryUsableNeeded_kWh
        const recs = recommendBatteries({
            batteryUsableNeeded_kWh: res.batteryUsableNeeded_kWh,
            locationTag: locationProfile.regionAvailabilityTag,
            tierFilter: filterTier,
            chemistryFilter: filterChemistry,
        });
        setRecommendations(recs);
        setHasCalculated(true);

        // Smooth scroll to results
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // Track calculation completion
        analytics.track('CALC_COMPLETED', {
            dailyLoad: load,
            autonomyDays: autonomy[0],
            winterMode,
            batteryNeeded: res.batteryNameplateNeeded_kWh,
            location: effectiveLocation,
        });
    };

    const handleUnlockPDF = (tier?: string) => {
        analytics.track('PDF_MODAL_OPENED', { tier });
        track('cta_click', { id: 'unlock_pdf', tier: tier || 'none' });

        if (tier) {
            analytics.track('AFFINITY_TIER_CLICKED', { tier });
        }
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="animated-blob blob-1 -top-48 -right-48 opacity-10" />
                <div className="animated-blob blob-2 bottom-1/4 -left-32 opacity-10" />
            </div>

            <main className="flex-1 container mx-auto w-full px-4 sm:px-6 pt-32 pb-10 max-w-6xl relative z-10">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">System Sizing Calculator</h1>
                    <p className="text-muted-foreground text-lg">Enter your requirements to get engineering-grade recommendations.</p>
                </div>

                <div className="grid lg:grid-cols-[520px_minmax(0,1fr)] gap-8 items-start">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <Card className="card-premium h-fit rounded-2xl border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                        <CardTitle className="text-xl">Your Requirements</CardTitle>
                                        <CardDescription className="text-base">Enter your consumption details below.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border-2 border-border/30 shadow-sm hover:border-primary/30 transition-colors max-w-[260px] w-full min-w-0">
                                            <Globe className="w-4 h-4 text-primary shrink-0" />
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <span className="text-sm font-medium text-muted-foreground shrink-0">Location:</span>
                                                <select
                                                    value={location}
                                                    onChange={(e) => handleLocationChange(e.target.value)}
                                                    className="text-sm font-semibold bg-transparent border-none outline-none cursor-pointer text-foreground pr-6 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjNkI1QjREIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-right min-w-0 flex-1 truncate max-w-full"
                                                    style={{ backgroundPosition: 'right 0 center' }}
                                                >
                                                    <option value="auto">Auto</option>
                                                    <option disabled>—</option>
                                                    {LOCATION_PROFILES.map(profile => (
                                                        <option key={profile.id} value={profile.id} title={profile.label}>
                                                            {profile.countryCode} — {profile.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {mounted && location === 'auto' && (
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        ({locationProfile.countryCode})
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Standalone Location Info Popover */}
                                        <Popover open={locationInfoOpen} onOpenChange={setLocationInfoOpen}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="shrink-0 w-6 h-6 rounded-full border border-border/40 bg-muted/30 hover:bg-muted/60 hover:border-primary/40 transition-colors flex items-center justify-center cursor-pointer"
                                                    aria-label="Location preset information"
                                                >
                                                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent side="bottom" align="start" className="w-80 max-w-[calc(100vw-2rem)]">
                                                <div className="space-y-3">
                                                    <p className="text-sm leading-relaxed text-foreground">
                                                        {LOCATION_PRESET_EXPLANATION.tagline}
                                                    </p>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button className="text-sm font-medium text-primary hover:underline">
                                                                Why these defaults?
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <HelpCircle className="w-5 h-5 text-primary" />
                                                                    {LOCATION_PRESET_EXPLANATION.title}
                                                                </DialogTitle>
                                                                <DialogDescription className="text-sm text-muted-foreground pt-2">
                                                                    {LOCATION_PRESET_EXPLANATION.tagline}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-3 py-4">
                                                                {LOCATION_PRESET_EXPLANATION.points.map((point, idx) => (
                                                                    <div key={idx} className="flex items-start gap-2">
                                                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                                            <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                                                                        </div>
                                                                        <p className="text-sm text-foreground leading-relaxed flex-1">{point}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="pt-2 border-t">
                                                                <p className="text-xs text-muted-foreground italic">
                                                                    {LOCATION_PRESET_EXPLANATION.footer}
                                                                </p>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        {userOverrides.size > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleResetToLocationDefaults}
                                                className="text-xs h-auto py-1 px-2"
                                                title="Reset to location defaults"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">

                                <div className="space-y-3">
                                    <Label htmlFor="dailyLoad" className="text-base font-semibold">Daily Energy Load (kWh)</Label>
                                    <Input
                                        ref={firstInputRef}
                                        id="dailyLoad"
                                        type="number"
                                        value={dailyLoad}
                                        onChange={(e) => setDailyLoad(e.target.value)}
                                        placeholder="e.g. 15.5"
                                        className="h-12 text-lg rounded-xl border-2 focus:border-primary transition-colors"
                                        disabled={billEstimatorEnabled}
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            {locationProfile.id === 'us' ? 'Find this on your electric bill (Monthly kWh ÷ 30).' :
                                                locationProfile.id === 'uk' ? 'Find this on your electricity bill (Monthly kWh ÷ 30).' :
                                                    'Use your monthly kWh ÷ 30.'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={toggleBillEstimator}
                                            className="text-xs font-medium text-primary hover:underline shrink-0"
                                        >
                                            {billEstimatorEnabled ? 'Enter kWh manually' : "Don't know? Estimate from bill"}
                                        </button>
                                    </div>

                                    {/* Commercial-scale warning */}
                                    {parseFloat(dailyLoad) > 200 && !isNaN(parseFloat(dailyLoad)) && (
                                        <div className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                            <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                                <span>
                                                    <strong>Commercial-scale load detected.</strong> This calculator is optimized for residential systems. For loads above 200 kWh/day, consult a commercial solar installer.
                                                </span>
                                            </p>
                                        </div>
                                    )}

                                    {billEstimatorEnabled && (
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
                                                        setUserOverrides(prev => new Set(prev).add('electricityRate'));
                                                    }}
                                                    placeholder={typicalRate.toFixed(2)}
                                                    className="h-10 rounded-lg"
                                                    step="0.01"
                                                />
                                            </div>

                                            {calculateDailyKwhFromBill() !== null && (
                                                <div className="pt-2 border-t border-border/50">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        Estimated Daily kWh: <span className="text-primary">{calculateDailyKwhFromBill()!.toFixed(1)}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-base font-semibold">{locationProfile.id === 'us' ? 'Days of Backup (During Outages)' : 'Days of Autonomy (Backup)'}</Label>
                                        <span className="text-lg font-mono font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg">{autonomy[0]} Days</span>
                                    </div>
                                    <div className="slider-premium py-2">
                                        <Slider
                                            value={autonomy}
                                            onValueChange={setAutonomy}
                                            min={1}
                                            max={7}
                                            step={1}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{locationProfile.id === 'us' ? 'How many days of backup during grid outages?' : 'How many days should the battery last without sun?'}</p>
                                </div>

                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                                    <input
                                        type="checkbox"
                                        id="winterMode"
                                        className="toggle-premium h-5 w-5 rounded border-2 border-muted text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                        checked={winterMode}
                                        onChange={(e) => handleWinterModeChange(e.target.checked)}
                                    />
                                    <Label htmlFor="winterMode" className="font-medium cursor-pointer text-base flex-1">
                                        {locationProfile.copy.winterLabel}
                                        <span className="text-primary font-semibold ml-1">(+{Math.round(winterBuffer * 100)}%)</span>
                                    </Label>
                                </div>

                                {/* Advanced Assumptions Section */}
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

                                <Button
                                    onClick={handleCalculate}
                                    className="btn-premium w-full text-lg h-14 rounded-xl shadow-lg cursor-pointer"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Calculate My Blueprint
                                </Button>

                            </CardContent>
                        </Card>

                        {/* Premium Unlock CTA - Under Calculator */}
                        {result && (
                            <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#2D241E] via-[#3D312A] to-[#2D241E] shadow-xl border-2 border-[#4A3D32]">
                                <div className="space-y-4">
                                    <h4 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-[#F5F5DC]">
                                        <FileText className="w-6 h-6 text-[#F4A460]" />
                                        Unlock Full Blueprint PDF
                                    </h4>
                                    <p className="text-base md:text-lg text-[#DCCFB8] leading-relaxed">
                                        Includes comparison table, installer checklist, and questions to ask installers.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-[#F4A460]">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Instant download • No signup required</span>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full h-16 text-xl font-bold rounded-xl shadow-lg transition-all duration-200 bg-[#E35336] hover:bg-[#C94429] text-white border-2 border-[#E35336] hover:border-[#C94429] hover:shadow-[0_0_20px_rgba(227,83,54,0.4)] hover:scale-105 active:scale-100 focus-visible:ring-4 focus-visible:ring-[#E35336]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D241E] cursor-pointer"
                                        onClick={() => handleUnlockPDF()}
                                    >
                                        Get My PDF
                                    </Button>

                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div ref={resultsRef} className="w-full max-w-[560px] justify-self-end space-y-6">
                        {result ? (
                            <>
                                <Card className={`card-premium bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 rounded-2xl overflow-hidden ${hasCalculated ? 'result-animate' : ''}`}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-2xl flex items-center gap-2">
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                            Your Results
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-4 rounded-xl bg-background/60">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Load Energy Target</p>
                                                <div className="text-3xl font-bold text-foreground">{result.loadTarget_kWh} <span className="text-lg font-normal text-foreground/60">kWh</span></div>
                                                <p className="text-xs text-foreground/60 mt-2 leading-relaxed">
                                                    Energy your home needs (with buffers)
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-primary/10">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Battery Usable Needed</p>
                                                <div className="text-3xl font-bold text-primary">{result.batteryUsableNeeded_kWh} <span className="text-lg font-normal text-primary/60">kWh</span></div>
                                                <p className="text-xs text-foreground/60 mt-2 leading-relaxed">
                                                    Accounts for inverter efficiency
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-background/60">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Recommended Nameplate</p>
                                            <div className="text-2xl font-bold text-foreground/80">{result.batteryNameplateNeeded_kWh} <span className="text-base font-normal text-foreground/50">kWh</span></div>
                                            <p className="text-xs text-foreground/60 mt-2 leading-relaxed">
                                                Sticker rating (DoD adjusted)
                                            </p>
                                        </div>

                                        {/* Calculation Breakdown - Collapsible */}
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="calculation-breakdown" className="border-b-0">
                                                <AccordionTrigger className="text-sm font-semibold text-muted-foreground hover:text-foreground py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <Info className="w-4 h-4" />
                                                        How we calculated this
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2 pb-4 px-4">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="grid grid-cols-[1fr_auto] gap-4 items-baseline py-2 border-b border-border/30">
                                                            <span className="text-muted-foreground">
                                                                <strong className="text-foreground">1. Base Energy</strong> = Daily kWh × Days
                                                            </span>
                                                            <span className="font-mono font-semibold text-foreground">
                                                                {result.breakdown.loadBase} × {result.breakdown.autonomyMult} = {(result.breakdown.loadBase * result.breakdown.autonomyMult).toFixed(1)} kWh
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-[1fr_auto] gap-4 items-baseline py-2 border-b border-border/30">
                                                            <span className="text-muted-foreground">
                                                                <strong className="text-foreground">2. Apply Buffers</strong> = Base × Reserve{winterMode ? ' × Winter' : ''}
                                                            </span>
                                                            <span className="font-mono font-semibold text-foreground">
                                                                {(result.breakdown.loadBase * result.breakdown.autonomyMult).toFixed(1)} × {result.breakdown.reserveMult.toFixed(2)}{winterMode ? ` × ${result.breakdown.winterMult.toFixed(1)}` : ''} = {result.loadTarget_kWh} kWh
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-[1fr_auto] gap-4 items-baseline py-2 border-b border-border/30">
                                                            <span className="text-muted-foreground">
                                                                <strong className="text-foreground">3. Inverter Loss</strong> = Load Target ÷ Efficiency ({Math.round(result.breakdown.efficiencyDerate * 100)}%)
                                                            </span>
                                                            <span className="font-mono font-semibold text-primary">
                                                                {result.loadTarget_kWh} ÷ {result.breakdown.efficiencyDerate.toFixed(2)} = {result.batteryUsableNeeded_kWh} kWh
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-[1fr_auto] gap-4 items-baseline py-2">
                                                            <span className="text-muted-foreground">
                                                                <strong className="text-foreground">4. DoD Adjustment</strong> = Usable ÷ DoD ({Math.round(result.breakdown.dodDerate * 100)}%)
                                                            </span>
                                                            <span className="font-mono font-semibold text-foreground/80">
                                                                {result.batteryUsableNeeded_kWh} ÷ {result.breakdown.dodDerate.toFixed(2)} = {result.batteryNameplateNeeded_kWh} kWh
                                                            </span>
                                                        </div>
                                                        <div className="pt-3 mt-3 border-t border-border/30">
                                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                                <strong className="text-foreground">Summary:</strong> Your load needs {result.loadTarget_kWh} kWh. After inverter loss, the battery must provide {result.batteryUsableNeeded_kWh} kWh usable. To achieve this at {Math.round(dod * 100)}% DoD, you need a {result.batteryNameplateNeeded_kWh} kWh nameplate battery.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* Assumptions Panel */}
                                        <div className="bg-background/50 rounded-xl p-4 text-sm text-muted-foreground grid grid-cols-2 gap-3 border border-border/50">
                                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary/50" /><strong>DoD:</strong> {Math.round(dod * 100)}%</div>
                                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary/50" /><strong>Efficiency:</strong> {Math.round(inverterEfficiency * 100)}%</div>
                                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent/50" /><strong>Buffer:</strong> +{Math.round(reserveBuffer * 100)}% Reserve</div>
                                            {winterMode && <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500/50" /><strong>Winter:</strong> +{Math.round(winterBuffer * 100)}%</div>}
                                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground/50" /><strong>Winter:</strong> {result.breakdown.winterMult > 1 ? "ON (+20%)" : "OFF"}</div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Assumptions - Always Visible */}
                                <Card className="card-premium rounded-2xl border-0">
                                    <CardContent className="p-5">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-primary" />
                                            Assumptions
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground">Depth of Discharge (DoD)</span>
                                                    <Tooltip content={ASSUMPTION_TOOLTIPS.dod.tooltip} ariaLabel="More info about Depth of Discharge" />
                                                </div>
                                                <span className="font-mono font-semibold">{Math.round(dod * 100)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground">Inverter Efficiency</span>
                                                    <Tooltip content={ASSUMPTION_TOOLTIPS.efficiency.tooltip} ariaLabel="More info about Inverter Efficiency" />
                                                </div>
                                                <span className="font-mono font-semibold">{Math.round(inverterEfficiency * 100)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground">Reserve Buffer</span>
                                                    <Tooltip content={ASSUMPTION_TOOLTIPS.reserve.tooltip} ariaLabel="More info about Reserve Buffer" />
                                                </div>
                                                <span className="font-mono font-semibold">{Math.round(reserveBuffer * 100)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground">Winter / Low Sun</span>
                                                    <Tooltip content={ASSUMPTION_TOOLTIPS.winter.tooltip} ariaLabel="More info about Winter Buffer" />
                                                </div>
                                                <span className="font-mono font-semibold">{winterMode ? `ON (+${Math.round(winterBuffer * 100)}%)` : 'OFF'}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground">Days of Autonomy</span>
                                                    <Tooltip content={ASSUMPTION_TOOLTIPS.autonomy.tooltip} ariaLabel="More info about Days of Autonomy" />
                                                </div>
                                                <span className="font-mono font-semibold">{autonomy[0]} {autonomy[0] === 1 ? 'Day' : 'Days'}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                                                <span className="text-muted-foreground">Electrical Standard</span>
                                                <span className="font-mono font-semibold text-xs">
                                                    {locationProfile.id === 'global'
                                                        ? 'Region default'
                                                        : `${locationProfile.electricalStandard.voltage} ${locationProfile.electricalStandard.phase} (${locationProfile.electricalStandard.frequencyHz}Hz)`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                                            Defaults vary by location (climate + electrical standard). You can override anytime.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* How this is calculated - Accordion */}
                                <Card className="card-premium rounded-2xl border-0">
                                    <CardContent className="p-5">
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="calc-explanation" className="border-b-0">
                                                <AccordionTrigger className="text-base font-semibold hover:no-underline py-0 pb-4">
                                                    How this is calculated
                                                </AccordionTrigger>
                                                <AccordionContent className="text-sm text-muted-foreground space-y-4 pt-2">
                                                    <div className="space-y-3">
                                                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                                            <p className="font-semibold text-foreground mb-1">Load Energy Target</p>
                                                            <p className="text-xs leading-relaxed">
                                                                Daily kWh × Days of Autonomy + Buffers (Reserve {Math.round(reserveBuffer * 100)}% + Winter {winterMode ? Math.round(winterBuffer * 100) + '%' : '0%'}) = Energy your home needs
                                                            </p>
                                                        </div>
                                                        <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                                                            <p className="font-semibold text-foreground mb-1">Battery Usable Needed</p>
                                                            <p className="text-xs leading-relaxed">
                                                                Load Target ÷ Inverter Efficiency ({Math.round(inverterEfficiency * 100)}%) = Actual usable capacity needed from battery
                                                            </p>
                                                        </div>
                                                        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                                                            <p className="font-semibold text-foreground mb-1">Recommended Nameplate</p>
                                                            <p className="text-xs leading-relaxed">
                                                                Battery Usable ÷ DoD ({Math.round(dod * 100)}%) = Sticker rating on the battery spec sheet
                                                            </p>
                                                        </div>
                                                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                                                            <p className="font-semibold text-foreground mb-1 text-xs">Usable vs Nameplate</p>
                                                            <p className="text-xs leading-relaxed">
                                                                A 10 kWh nameplate battery provides ~{Math.round(10 * dod)} kWh usable ({Math.round(dod * 100)}% DoD). This protects battery health and lifespan.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <div className="h-full min-h-[520px] max-w-full flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
                                <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                                    <Sparkles className="w-7 h-7 text-muted-foreground/50" />
                                </div>
                                <p className="text-lg font-medium mb-1.5">Enter your details</p>
                                <p className="text-sm text-center max-w-xs">Fill in your requirements on the left to see your personalized battery blueprint.</p>
                            </div>
                        )}

                        {/* Inverter Note */}
                        <Card className="card-premium rounded-2xl border-0">
                            <CardContent className="p-5">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Info className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground mb-1">Inverter Note</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Ensure your Inverter Continuous Output (kW) exceeds your peak appliances.
                                            Batteries provide kWh (Energy), Inverters provide kW (Power).
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trust / Disclaimer */}
                        <Card className="card-premium rounded-2xl border-0 bg-muted/30">
                            <CardContent className="p-5">
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <p className="leading-relaxed">
                                        <strong className="text-foreground">Estimates for planning.</strong> Final design depends on your loads, inverter limits, solar production, and local code.
                                    </p>
                                    <p className="text-xs">
                                        Not affiliated with Tesla, Enphase, EG4, or any battery manufacturer.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>



                {/* Recommendations Section - Full Width */}
                {recommendations && result && (
                    <div className="w-full mt-12">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">
                            <div className="space-y-6">
                                {/* Header with Sort/Filter Controls */}
                                <div className="space-y-4 pb-4 border-b border-border/50">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-xl">
                                                Recommended Batteries
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Curated options for planning — availability varies by region.
                                            </p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Recommendations are based on your <strong className="text-foreground">Battery Usable Needed</strong> requirement ({result.batteryUsableNeeded_kWh} kWh). Each option meets or exceeds your calculated needs.
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Globe className="w-4 h-4 text-primary" />
                                                <p className="text-sm text-muted-foreground">
                                                    Showing recommendations for: <strong className="text-foreground">{locationProfile.label}</strong>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Sort Control - only show for large catalogs */}
                                        {recommendations.metadata.catalogSize >= 25 && (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value as any)}
                                                    className="text-sm border border-border/40 rounded-lg px-3 py-1.5 bg-background text-foreground cursor-pointer hover:border-primary/40 transition-colors"
                                                >
                                                    <option value="best-match">Best match</option>
                                                    <option value="lowest-units">Lowest units</option>
                                                    <option value="highest-coverage">Highest coverage</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Filter Chips - only show for large catalogs */}
                                    {recommendations.metadata.catalogSize >= 25 && !recommendations?.metadata.isLimitedCatalog && (
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setFilterTier('all')}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${filterTier === 'all'
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background border-border/40 text-muted-foreground hover:border-primary/40'
                                                    }`}
                                            >
                                                All Tiers
                                            </button>
                                            {[
                                                { value: 'premium' as const, label: 'Premium' },
                                                { value: 'mid' as const, label: 'Mid-Range' },
                                                { value: 'diy' as const, label: 'DIY' }
                                            ].map(tier => (
                                                <button
                                                    key={tier.value}
                                                    onClick={() => setFilterTier(tier.value)}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${filterTier === tier.value
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-background border-border/40 text-muted-foreground hover:border-primary/40'
                                                        }`}
                                                >
                                                    {tier.label}
                                                </button>
                                            ))}

                                            <div className="w-px h-6 bg-border/40 mx-1" />

                                            <button
                                                onClick={() => setFilterChemistry('all')}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${filterChemistry === 'all'
                                                    ? 'bg-secondary text-secondary-foreground border-secondary'
                                                    : 'bg-background border-border/40 text-muted-foreground hover:border-secondary/40'
                                                    }`}
                                            >
                                                All Chemistry
                                            </button>
                                            {['LFP', 'NMC'].map(chem => (
                                                <button
                                                    key={chem}
                                                    onClick={() => setFilterChemistry(chem as any)}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${filterChemistry === chem
                                                        ? 'bg-secondary text-secondary-foreground border-secondary'
                                                        : 'bg-background border-border/40 text-muted-foreground hover:border-secondary/40'
                                                        }`}
                                                >
                                                    {chem}
                                                </button>
                                            ))}

                                            {(filterTier !== 'all' || filterChemistry !== 'all') && (
                                                <>
                                                    <div className="w-px h-6 bg-border/40 mx-1" />
                                                    <button
                                                        onClick={() => {
                                                            setFilterTier('all');
                                                            setFilterChemistry('all');
                                                        }}
                                                        className="text-xs px-3 py-1.5 rounded-full border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer"
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {recommendations?.metadata.isLimitedCatalog && (
                                        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    <strong className="text-foreground">Catalog is currently limited for this region.</strong> More models coming.
                                                </p>
                                            </div>
                                        </div>
                                    )}


                                </div>

                                {/* Inverter sanity check callout */}
                                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-4 h-4 text-secondary" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-semibold text-foreground text-sm">Inverter check (kW)</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Batteries provide energy (kWh). Your inverter must handle power (kW). Make sure continuous kW exceeds your peak loads.
                                            </p>
                                            <p className="text-xs text-muted-foreground/80 italic">
                                                Example: 10 kWh battery with 5 kW inverter can run a 5 kW load for ~2 hours.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Battery Cards Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {(() => {
                                        // Flatten all recommendations into a single array
                                        const allRecs: Array<{ tier: string; data: RecommendedBattery; whyText: string }> = [];

                                        recommendations.premium.forEach(rec => {
                                            allRecs.push({ tier: 'Premium', data: rec, whyText: 'Best warranty + integrated inverter' });
                                        });

                                        recommendations.midRange.forEach(rec => {
                                            allRecs.push({ tier: 'Mid-Range', data: rec, whyText: 'Great value + reliable performance' });
                                        });

                                        recommendations.diy.forEach(rec => {
                                            allRecs.push({ tier: 'DIY / Rack', data: rec, whyText: 'Lowest cost per kWh + expandable' });
                                        });

                                        // Apply sorting (filtering already done by recommendBatteries)
                                        let sorted = [...allRecs];
                                        if (sortBy === 'lowest-units') {
                                            sorted.sort((a, b) => a.data.count - b.data.count);
                                        } else if (sortBy === 'highest-coverage') {
                                            sorted.sort((a, b) => b.data.coverage - a.data.coverage);
                                        }
                                        // 'best-match' keeps original order from recommendBatteries

                                        // For small catalogs, limit to 3 cards max (1 per tier)
                                        if (recommendations.metadata.catalogSize < 25) {
                                            sorted = sorted.slice(0, 3);
                                        }

                                        // Show empty state if no matches
                                        if (sorted.length === 0) {
                                            return (
                                                <div className="col-span-full py-12 text-center">
                                                    <p className="text-muted-foreground">No batteries match your filters.</p>
                                                    <button
                                                        onClick={() => {
                                                            setFilterTier('all');
                                                            setFilterChemistry('all');
                                                        }}
                                                        className="mt-2 text-sm text-primary hover:underline cursor-pointer"
                                                    >
                                                        Clear filters
                                                    </button>
                                                </div>
                                            );
                                        }

                                        // Render filtered and sorted cards
                                        return sorted.map((rec, idx) => (
                                            <BatteryCard
                                                key={`${rec.tier}-${rec.data.battery.id}`}
                                                tier={rec.tier}
                                                data={rec.data}
                                                targets={result}
                                                whyText={rec.whyText}
                                                delay={idx * 0.05}
                                            />
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div >
                    </div >
                )
                }

                {/* PDF functionality removed - static site only */}


            </main>

            {/* Footer - Global in RootLayout */}
        </div>
    );
}

function BatteryCard({
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

function EmptyTierCard({ tier, delay }: { tier: string, delay: number }) {
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
