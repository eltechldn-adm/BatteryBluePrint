"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SUPPORTED_COUNTRIES, DEFAULT_COUNTRY_CODE, mapNavigatorToCountry, Country } from './countries';

interface CountryContextType {
    country: Country;
    setCountry: (code: string) => void;
    detectedCountryCode: string | null;
    hasUserOverride: boolean;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: React.ReactNode }) {
    const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
    const [detectedCountryCode, setDetectedCountryCode] = useState<string | null>(null);
    const [hasUserOverride, setHasUserOverride] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 1. Check LocalStorage
        const storedCountry = localStorage.getItem('bb_country');
        const storedOverride = localStorage.getItem('bb_country_override'); // 'true' if manually set

        if (storedCountry && SUPPORTED_COUNTRIES[storedCountry]) {
            setCountryCode(storedCountry);
            if (storedOverride === 'true') {
                setHasUserOverride(true);
            }
        } else {
            // 2. Auto-detect
            const detected = mapNavigatorToCountry(
                navigator.language,
                Intl.DateTimeFormat().resolvedOptions().timeZone
            );
            setDetectedCountryCode(detected);
            setCountryCode(detected);

            // Persist auto-detected value (but don't mark as override)
            localStorage.setItem('bb_country', detected);
        }
    }, []);

    const setCountry = (code: string) => {
        if (SUPPORTED_COUNTRIES[code]) {
            setCountryCode(code);
            setHasUserOverride(true);
            localStorage.setItem('bb_country', code);
            localStorage.setItem('bb_country_override', 'true');
        }
    };

    const value = {
        country: SUPPORTED_COUNTRIES[countryCode],
        setCountry,
        detectedCountryCode,
        hasUserOverride,
    };

    if (!mounted) {
        // Return null or partial render to avoid hydration mismatch? 
        // Actually, for static export, it's safer to render children with default state 
        // and let client update. Context provides default until mounted.
        // However, to prevent flash of wrong country content, we might want to wait?
        // User requested "No new routes", "Keep site fully static".
        // We'll render with default (GB) on server/initial static HTML, 
        // and update on client.
        return (
            <CountryContext.Provider value={{
                country: SUPPORTED_COUNTRIES[DEFAULT_COUNTRY_CODE],
                setCountry: () => { },
                detectedCountryCode: null,
                hasUserOverride: false
            }}>
                {children}
            </CountryContext.Provider>
        );
    }

    return (
        <CountryContext.Provider value={value}>
            {children}
        </CountryContext.Provider>
    );
}

export function useCountry() {
    const context = useContext(CountryContext);
    if (context === undefined) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
}
