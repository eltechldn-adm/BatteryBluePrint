import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AuthorCard() {
    return (
        <div className="mt-8 mb-12 p-6 bg-muted/30 rounded-xl border border-border/50 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    BatteryBlueprint Editorial Team
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl">
                    Research-led guides and tools built for homeowners sizing solar battery storage.
                    Our content is verified by engineers and strictly verified against <Link href="/methodology" className="text-primary hover:underline">methodology standards</Link>.
                </p>
                <div className="text-xs text-muted-foreground pt-1 flex gap-3">
                    <Link href="/editorial-team" className="hover:text-primary transition-colors">About Us</Link>
                    <span>•</span>
                    <Link href="/editorial-policy" className="hover:text-primary transition-colors">Editorial Policy</Link>
                </div>
            </div>
        </div>
    );
}
