/**
 * src/lib/pricing/formatBatteryPrice.ts
 *
 * Static, client-safe utility for converting and formatting battery prices
 * from their USD reference values into local currencies.
 *
 * Rules:
 * - No API calls. No geolocation. No dynamic imports.
 * - All exchange rates are static planning approximations, clearly labelled.
 * - Always show USD reference for non-USD currencies.
 * - Falls back to USD display if country code is unsupported.
 * - Fully compatible with Next.js static export + Cloudflare Pages.
 */

import { BatteryModel } from "@/data/batteries";

// ─── Static Planning Exchange Rates ──────────────────────────────────────────
// Rates are intentionally conservative planning figures — not live market data.
// Source: typical mid-2024 rates, rounded to sensible planning values.
// Last reviewed: 2026-05

export interface CurrencyConfig {
    currencyCode: string;
    locale: string;
    /** USD → local rate. Multiply USD price by this to get local price. */
    usdRate: number;
}

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
    US: { currencyCode: "USD", locale: "en-US",  usdRate: 1.00 },
    GB: { currencyCode: "GBP", locale: "en-GB",  usdRate: 0.80 },
    AU: { currencyCode: "AUD", locale: "en-AU",  usdRate: 1.52 },
    CA: { currencyCode: "CAD", locale: "en-CA",  usdRate: 1.36 },
    DE: { currencyCode: "EUR", locale: "de-DE",  usdRate: 0.93 },
    ES: { currencyCode: "EUR", locale: "es-ES",  usdRate: 0.93 },
    IT: { currencyCode: "EUR", locale: "it-IT",  usdRate: 0.93 },
    NL: { currencyCode: "EUR", locale: "nl-NL",  usdRate: 0.93 },
    SG: { currencyCode: "SGD", locale: "en-SG",  usdRate: 1.35 },
    ZA: { currencyCode: "ZAR", locale: "en-ZA",  usdRate: 18.50 },
};

// ─── Price Type Labels ────────────────────────────────────────────────────────

const PRICE_TYPE_LABELS: Record<BatteryModel["price_type"], string> = {
    installed:   "installed",
    unit:        "per unit",
    module:      "per module",
    "uk-estimate": "est.",
    standard:    "",
};

// ─── Core Format Function ─────────────────────────────────────────────────────

export interface FormattedBatteryPrice {
    /** Primary display string in the user's local currency. */
    localDisplay: string;
    /** USD reference string — always shown when local ≠ USD. */
    usdReference: string | null;
    /** True if the country code is supported and conversion occurred. */
    isConverted: boolean;
    /** Currency code used for the local display. */
    currencyCode: string;
}

/**
 * Format a battery price for display in a specific country's currency.
 *
 * @param battery    - BatteryModel with numeric price fields
 * @param countryCode - ISO 3166-1 alpha-2 code (e.g. "GB", "US")
 */
export function formatBatteryPrice(
    battery: BatteryModel,
    countryCode: string,
): FormattedBatteryPrice {
    const { price_min_usd, price_max_usd, price_type } = battery;

    // If no numeric prices exist, fall back gracefully
    if (price_min_usd === null || price_max_usd === null) {
        return {
            localDisplay: battery.price_range_usd ?? "Price not available",
            usdReference: null,
            isConverted: false,
            currencyCode: "USD",
        };
    }

    const typeLabel = PRICE_TYPE_LABELS[price_type];
    const typeSuffix = typeLabel ? ` (${typeLabel})` : "";

    // USD reference (always computed — needed for non-USD display)
    const usdFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
    const usdMin = usdFormatter.format(price_min_usd);
    const usdMax = usdFormatter.format(price_max_usd);
    const usdDisplay = `${usdMin}–${usdMax} USD${typeSuffix}`;

    const config = CURRENCY_CONFIGS[countryCode.toUpperCase()];

    // Unsupported country — return USD display
    if (!config) {
        return {
            localDisplay: usdDisplay,
            usdReference: null,
            isConverted: false,
            currencyCode: "USD",
        };
    }

    // USD country — return USD display with no separate reference
    if (config.currencyCode === "USD") {
        return {
            localDisplay: usdDisplay,
            usdReference: null,
            isConverted: false,
            currencyCode: "USD",
        };
    }

    // Non-USD — convert and format
    const localMin = Math.round(price_min_usd * config.usdRate);
    const localMax = Math.round(price_max_usd * config.usdRate);

    const localFormatter = new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.currencyCode,
        maximumFractionDigits: 0,
    });
    const localDisplay = `${localFormatter.format(localMin)}–${localFormatter.format(localMax)} ${config.currencyCode}${typeSuffix}`;

    return {
        localDisplay,
        usdReference: usdDisplay,
        isConverted: true,
        currencyCode: config.currencyCode,
    };
}
