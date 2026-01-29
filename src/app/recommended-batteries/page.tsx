import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ShoppingCart, Zap, Battery, Shield, ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Best Home Battery Systems in 2026 | BatteryBlueprint",
    description: "Expert recommendations for the best home battery backup systems, from budget portable units to premium whole-home solutions.",
};

const AFFILIATE_LINK = "https://amzn.to/placeholder";

export default function RecommendedBatteriesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* Header */}
            <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <Link href="/calculator" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
                    BatteryBlueprint
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Calculator
                    </Link>
                    <Link href="/recommended-batteries" className="text-sm font-medium text-foreground">
                        Recommendations
                    </Link>
                    <Link href="/guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Guide
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/20">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                            Best Home Battery Systems <span className="text-primary block mt-2">in 2026</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            We've tested and analyzed the top backup power solutions so you don't have to. From portable power stations to whole-home microgrids, here are our engineering-grade picks.
                        </p>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">

                    {/* Top Picks */}
                    <section id="top-picks" className="space-y-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold">Top Picks for Most Homes</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ProductCard
                                title="EcoFlow Delta Pro"
                                badge="Best Overall"
                                description="The gold standard for portable home backup. Expandable capacity, fast charging, and robust app control make it our #1 choice."
                                capacity="3.6 kWh - 25 kWh"
                                useCase="Whole-home backup, RVs"
                                link={AFFILIATE_LINK}
                            />
                            <ProductCard
                                title="Bluetti AC300 + B300"
                                badge="Best Modular System"
                                description="A highly modular system that lets you start small and grow. The separate inverter and battery modules make installation manageable."
                                capacity="3.0 kWh - 12.3 kWh"
                                useCase="Scalable home backup"
                                link={AFFILIATE_LINK}
                            />
                            <ProductCard
                                title="Jackery Explorer 2000 Plus"
                                badge="Reliability Pick"
                                description="Legendary durability from Jackery. The LFP chemistry ensures a long lifespan, perfect for daily use or emergency readiness."
                                capacity="2.0 kWh - 12 kWh"
                                useCase="Emergency backup, Camping"
                                link={AFFILIATE_LINK}
                            />
                        </div>
                    </section>

                    {/* Budget Options */}
                    <section id="budget" className="space-y-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                                <Battery className="w-5 h-5 text-secondary" />
                            </div>
                            <h2 className="text-3xl font-bold">Best Budget Options</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProductCard
                                title="EcoFlow River 2 Max"
                                description="Unbeatable value for keeping essentials charging. Charges from 0-100% in just 60 minutes. detailed display and app."
                                capacity="512 Wh"
                                useCase="CPAP, Phones, Laptops"
                                link={AFFILIATE_LINK}
                                compact
                            />
                            <ProductCard
                                title="Bluetti EB70"
                                description="Solid performance at an entry-level price point. Reliable LFP battery chemistry ensuring 2500+ life cycles."
                                capacity="716 Wh"
                                useCase="Small appliances, Lighting"
                                link={AFFILIATE_LINK}
                                compact
                            />
                        </div>
                    </section>

                    {/* Premium Systems */}
                    <section id="premium" className="space-y-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <h2 className="text-3xl font-bold">Premium & Whole-Home</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProductCard
                                title="Tesla Powerwall Alternatives"
                                description="Explore high-capacity generic systems that rival the Powerwall in specs but offer more flexibility for off-grid setups."
                                capacity="10 kWh+"
                                useCase="Permanent Install"
                                link={AFFILIATE_LINK}
                            />
                            <ProductCard
                                title="Server Rack Battery Kits"
                                description="For the DIY enthusiast or serious off-gridder. Server rack batteries offer the lowest cost per kWh on the market."
                                capacity="5 kWh - 100 kWh+"
                                useCase="Heavy DIY, Off-Grid Cabins"
                                link={AFFILIATE_LINK}
                            />
                        </div>
                    </section>

                    {/* Comparison Table */}
                    <section id="comparison" className="pt-8">
                        <h2 className="text-2xl font-bold mb-6">Quick Comparison</h2>
                        <div className="overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Capacity</th>
                                        <th className="px-6 py-4">Best For</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    <TableRow name="EcoFlow Delta Pro" cap="3.6-25 kWh" best="Overall Backup" link={AFFILIATE_LINK} />
                                    <TableRow name="Bluetti AC300" cap="3.0-12.3 kWh" best="Modular Scale" link={AFFILIATE_LINK} />
                                    <TableRow name="Jackery 2000 Plus" cap="2.0-12 kWh" best="Durability" link={AFFILIATE_LINK} />
                                    <TableRow name="EcoFlow River 2" cap="512 Wh" best="Portability" link={AFFILIATE_LINK} />
                                    <TableRow name="Server Rack Kits" cap="5-100 kWh" best="Lowest Cost" link={AFFILIATE_LINK} />
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* CTA Block */}
                    <section className="py-16 text-center">
                        <div className="p-10 rounded-3xl bg-primary/5 border border-primary/20 max-w-3xl mx-auto space-y-6">
                            <h2 className="text-3xl font-bold">Unsure what size you need?</h2>
                            <p className="text-muted-foreground text-lg">
                                Use our engineering-grade calculator to find your exact capacity requirements before you buy.
                            </p>
                            <Link href="/calculator">
                                <Button size="lg" className="rounded-xl text-lg px-8 h-12 shadow-lg cursor-pointer">
                                    Go to Calculator <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </section>

                    {/* Affiliate Disclosure */}
                    <footer className="text-center pt-8 pb-12 border-t border-border/40">
                        <p className="text-xs text-muted-foreground/60 max-w-prose mx-auto">
                            Disclosure: This page contains affiliate links. We may earn a commission if you purchase through them at no extra cost to you. This supports our free calculator tool.
                        </p>
                    </footer>

                </div>
            </main>
        </div>
    );
}

function ProductCard({ title, description, capacity, useCase, link, badge, compact }: any) {
    return (
        <Card className={`flex flex-col h-full rounded-2xl overflow-hidden border-border/50 transition-all hover:border-primary/50 hover:shadow-md ${badge ? 'border-t-4 border-t-primary' : ''}`}>
            <CardHeader className="pb-4">
                {badge && (
                    <span className="w-fit mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        {badge}
                    </span>
                )}
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed h-full line-clamp-3">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-6 pt-0">
                <div className="space-y-3 p-4 bg-muted/30 rounded-xl text-sm">
                    <div className="flex justify-between items-center border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-semibold">{capacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Best For</span>
                        <span className="font-semibold text-right">{useCase}</span>
                    </div>
                </div>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <Button className="w-full w-full rounded-xl gap-2 font-semibold cursor-pointer" variant={compact ? "outline" : "default"}>
                        <ShoppingCart className="w-4 h-4" /> Check Price on Amazon
                    </Button>
                </a>
            </CardContent>
        </Card>
    );
}

function TableRow({ name, cap, best, link }: any) {
    return (
        <tr className="bg-background hover:bg-muted/20 transition-colors">
            <td className="px-6 py-4 font-medium">{name}</td>
            <td className="px-6 py-4 text-muted-foreground">{cap}</td>
            <td className="px-6 py-4 text-muted-foreground">{best}</td>
            <td className="px-6 py-4 text-right">
                <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <Button size="sm" variant="ghost" className="h-8 gap-1 text-primary hover:text-primary/80 cursor-pointer">
                        Check Price <ExternalLink className="w-3 h-3" />
                    </Button>
                </a>
            </td>
        </tr>
    )
}
