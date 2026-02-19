"use client";

import { CountryProvider } from "@/lib/geo/CountryProvider";

export function CountryProviderClient({ children }: { children: React.ReactNode }) {
    return <CountryProvider>{children}</CountryProvider>;
}
