import Link from "next/link";
import { AffiliateCard } from "@/components/AffiliateCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Recommended Batteries & Hardware | BatteryBlueprint",
    description: "Curated list of solar batteries, inverters, and backup hardware for your sizing needs.",
};

const products = [
    {
        name: "Tesla Powerwall Alternative",
        description: "High-capacity home battery backup system with integrated inverter. Perfect for whole-home coverage and seamless grid outages.",
        specs: "13.5 kWh usable",
        url: "https://amzn.to/placeholder"
    },
    {
        name: "EcoFlow Delta Pro",
        description: "The gold standard for portable home backup. Expandable capacity, fast charging, and robust app control.",
        specs: "3.6 kWh - 25 kWh",
        url: "https://amzn.to/placeholder"
    },
    {
        name: "Bluetti AC300 + B300",
        description: "A highly modular system that lets you start small and grow. The separate inverter and battery modules make installation manageable.",
        specs: "3.0 kWh - 12.3 kWh",
        url: "https://amzn.to/placeholder"
    },
    {
        name: "Jackery Explorer 2000 Plus",
        description: "Legendary durability with LFP chemistry. Ensures a long lifespan, perfect for daily use or emergency readiness.",
        specs: "2.0 kWh - 12 kWh",
        url: "https://amzn.to/placeholder"
    },
    {
        name: "Server Rack Battery 48V",
        description: "Best value for DIY enthusiasts. Rack-mountable LiFePO4 battery modules for building massive storage banks cheaply.",
        specs: "5.12 kWh module",
        url: "https://amzn.to/placeholder"
    }
];

export default function RecommendationsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Header - Matching Duplicate Pattern */}
            <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <Link href="/calculator" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
                    BatteryBlueprint
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Calculator
                    </Link>
                    <Link href="/recommendations" className="text-sm font-medium text-foreground">
                        Recommendations
                    </Link>
                    <Link href="/guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Guide
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        About
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Contact
                    </Link>
                </nav>
            </header>

            <main className="flex-1 py-12 px-6">
                <div className="max-w-6xl mx-auto space-y-12">

                    {/* Hero */}
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Recommended Batteries & Hardware
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Our curated selection of engineering-grade power systems. These recommendations are matched against the rigorous standards of our sizing calculator.
                        </p>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, idx) => (
                            <AffiliateCard
                                key={idx}
                                name={product.name}
                                description={product.description}
                                specs={product.specs}
                                url={product.url}
                            />
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center pt-8">
                        <Link href="/calculator">
                            <Button variant="outline" className="gap-2 cursor-pointer">
                                <ArrowLeft className="w-4 h-4" /> Back to Calculator
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer / Disclaimer */}
            <footer className="py-8 border-t border-border/40 text-center px-6">
                <p className="text-xs text-muted-foreground max-w-prose mx-auto">
                    Disclosure: This page contains affiliate links. We may earn a commission if you purchase through them at no extra cost to you.
                    This supports the development of our free engineering tools.
                    <br className="mb-2" />
                    © 2026 BatteryBlueprint. For planning purposes only.
                </p>
            </footer>
        </div>
    );
}
