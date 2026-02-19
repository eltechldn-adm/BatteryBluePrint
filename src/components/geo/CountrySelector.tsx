"use client";

import { useCountry } from "@/lib/geo/useCountry";
import { SUPPORTED_COUNTRIES } from "@/lib/geo/countries";
import { ChevronDown } from "lucide-react";

export function CountrySelector() {
    const { country, setCountry } = useCountry();

    return (
        <div className="relative inline-flex items-center">
            <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
                <span className="text-lg leading-none">{country.flag}</span>
                <span className="hidden sm:inline-block text-xs font-medium">{country.code}</span>
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />

                <select
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-base sm:text-sm"
                    value={country.code}
                    onChange={(e) => setCountry(e.target.value)}
                    aria-label="Select Country"
                >
                    {Object.values(SUPPORTED_COUNTRIES).map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
