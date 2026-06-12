"use client";

/**
 * src/components/batteries/BatteryPriceDisplay.tsx
 *
 * Client component that reads the user's selected country from CountryProvider
 * and renders a localized price for a single battery.
 *
 * Designed to be embedded in the static battery detail page (Server Component)
 * without causing hydration errors: the server always renders nothing (returns null
 * before mount), and the client replaces it after hydration.
 */

import { useState, useEffect } from "react";
import { BatteryModel } from "@/data/batteries";
import { useCountry } from "@/lib/geo/CountryProvider";
import { formatBatteryPrice } from "@/lib/pricing/formatBatteryPrice";

interface Props {
    battery: BatteryModel;
}

export function BatteryPriceDisplay({ battery }: Props) {
    const { country } = useCountry();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // During SSR / pre-hydration, show the raw USD string to prevent hydration mismatch
    if (!mounted) {
        return (
            <div>
                <p className="font-bold text-xl">{battery.price_range_usd ?? "—"}</p>
            </div>
        );
    }

    const price = formatBatteryPrice(battery, country.code);

    return (
        <div className="space-y-1">
            <p className="font-bold text-xl">{price.localDisplay}</p>
            {price.usdReference && (
                <p className="text-sm text-muted-foreground">
                    USD reference: {price.usdReference}
                </p>
            )}
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-2 leading-relaxed">
                Converted from USD reference pricing using static planning rates. Final installed costs vary by installer, region, incentives, and electrical work.
            </p>
        </div>
    );
}
