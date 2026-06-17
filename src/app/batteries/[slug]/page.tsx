import { BATTERY_DATABASE } from "@/data/batteries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Thermometer, Battery as BatteryIcon, Settings2, Info, ArrowLeft, CheckCircle2, AlertTriangle, Link as LinkIcon, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BatteryPriceDisplay } from "@/components/batteries/BatteryPriceDisplay";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return BATTERY_DATABASE.map((battery) => ({
        slug: battery.id,
    }));
}

// Any [slug] not returned above is a 404 — do not attempt dynamic rendering.
export const dynamicParams = false;


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const battery = BATTERY_DATABASE.find(b => b.id === slug);
    
    if (!battery) {
        return { title: "Battery Not Found" };
    }

    return {
        title: `${battery.brand} ${battery.model} Solar Battery Specs & Review (2026) | BatteryBlueprint`,
        description: `Engineering specifications, pricing, and features for the ${battery.brand} ${battery.model}. Usable capacity: ${battery.usable_kWh_per_unit} kWh. Peak output: ${battery.peak_output_kW || battery.continuous_output_kW} kW.`,
        alternates: {
            canonical: `https://batteryblueprint.com/batteries/${battery.id}`,
        }
    };
}

export default async function BatteryProductPage({ params }: Props) {
    const { slug } = await params;
    const battery = BATTERY_DATABASE.find(b => b.id === slug);

    if (!battery) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen pb-12">
            {/* Header / Hero */}
            <div className="bg-muted/30 border-b border-border/50 pt-12 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Link href="/batteries/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Catalog
                    </Link>
                    
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {battery.category} Class
                            </Badge>
                            <Badge variant="outline">{battery.chemistry}</Badge>
                            <Badge variant="outline">{battery.coupling} Coupled</Badge>
                            {battery.blackout_support === 'Whole-Home' && (
                                <Badge variant="default" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                                    Whole-Home Backup Capable
                                </Badge>
                            )}
                            <Badge variant="outline" className={battery.dataConfidence === 'High' ? 'border-green-500/30 text-green-600 dark:text-green-400' : ''}>
                                Data Confidence: {battery.dataConfidence}
                            </Badge>
                        </div>

                        <div>
                            <p className="text-xl font-medium text-primary mb-2">{battery.brand}</p>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                {battery.model}
                            </h1>
                        </div>

                        {/* Editorial Summary */}
                        <div className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                            {battery.editorialSummary}
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button asChild size="lg">
                                <Link href="/calculator/">Size This System for Your Home</Link>
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-3 rounded-lg border border-border/50">
                                <Shield className="w-4 h-4 text-primary" />
                                Data verified {battery.dataVerifiedDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 max-w-5xl py-12">
                <div className="grid lg:grid-cols-3 gap-10">
                    
                    {/* Left Column - Deep Dive */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* Best For / Not Ideal For */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2 text-green-800 dark:text-green-400">
                                        <ThumbsUp className="w-5 h-5" /> Best Considered For
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {battery.bestFor.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2 text-red-800 dark:text-red-400">
                                        <ThumbsDown className="w-5 h-5" /> May Be Less Suitable When
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {battery.notIdealFor.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Engineering Verdict */}
                        <section className="space-y-4 article-prose prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border/50 pb-2">
                                <Zap className="w-6 h-6 text-primary" /> Engineering Verdict
                            </h2>
                            <p className="leading-relaxed">{battery.engineeringVerdict}</p>
                        </section>

                        {/* Real-World Considerations */}
                        <section className="space-y-4 article-prose prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold border-b border-border/50 pb-2">
                                Real-World Considerations
                            </h2>
                            <p className="leading-relaxed">{battery.realWorldConsiderations}</p>
                        </section>
                        
                        {/* Installation Notes */}
                        <section className="space-y-4 article-prose prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold border-b border-border/50 pb-2">
                                Installation Notes
                            </h2>
                            <p className="leading-relaxed">{battery.installationNotes}</p>
                        </section>

                        {/* Power & Performance */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold border-b border-border/50 pb-2">Technical Specifications</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-1">
                                    <p className="text-sm text-muted-foreground">Usable Capacity</p>
                                    <p className="text-2xl font-bold">{battery.usable_kWh_per_unit} <span className="text-sm font-normal text-muted-foreground">kWh</span></p>
                                </div>
                                <div className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-1">
                                    <p className="text-sm text-muted-foreground">Continuous Output</p>
                                    <p className="text-2xl font-bold">{battery.continuous_output_kW} <span className="text-sm font-normal text-muted-foreground">kW</span></p>
                                </div>
                                <div className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-1">
                                    <p className="text-sm text-muted-foreground">Peak Output</p>
                                    <p className="text-2xl font-bold">{battery.peak_output_kW || 'N/A'} <span className="text-sm font-normal text-muted-foreground">kW {battery.peak_duration_sec ? `(${battery.peak_duration_sec}s)` : ''}</span></p>
                                </div>
                                <div className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-1">
                                    <p className="text-sm text-muted-foreground">Chemistry</p>
                                    <p className="text-2xl font-bold">{battery.chemistry}</p>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Official Sources */}
                        <Card className="bg-card border-primary/20">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5 text-primary" /> Official Sources
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="space-y-3">
                                    {battery.sourceUrls.map((source, i) => (
                                        <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/50 group">
                                            <span className="text-sm font-medium">{source.label}</span>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </a>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Links lead directly to official manufacturer or regulator documentation. BatteryBlueprint does not use affiliate links for hardware specifications.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Price & Economics */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Economics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Estimated Cost</p>
                                    <BatteryPriceDisplay battery={battery} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certs & Warranty */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Reliability</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Warranty</p>
                                    <p className="font-semibold text-lg">{battery.warranty_years} Years</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Cycle Life (Est.)</p>
                                    <p className="font-semibold text-lg">{battery.cycle_life?.toLocaleString() || 'Not specified'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">End of Life Capacity</p>
                                    <p className="font-semibold text-lg">{battery.end_of_life_capacity_percent}% Retention</p>
                                </div>
                                <div className="pt-4 border-t border-border/50">
                                    <p className="text-sm text-muted-foreground mb-3">Certifications</p>
                                    <div className="flex flex-wrap gap-2">
                                        {battery.certifications.map(cert => (
                                            <Badge key={cert} variant="outline" className="bg-background/50 text-xs">
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Physical Specs */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Physical Specs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Weight</span>
                                    <span className="font-medium">{battery.weight_kg} kg</span>
                                </div>
                                {battery.dimensions_mm && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Dimensions</span>
                                        <span className="font-medium text-right text-sm">
                                            {battery.dimensions_mm.h}h x {battery.dimensions_mm.w}w x {battery.dimensions_mm.d}d mm
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">IP Rating</span>
                                    <span className="font-medium">{battery.ip_rating}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Temp Range</span>
                                    <span className="font-medium">{battery.operating_temp_min_c}°C to {battery.operating_temp_max_c}°C</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Location</span>
                                    <span className="font-medium">{battery.install_location}</span>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-16 p-6 rounded-xl bg-card border border-border text-sm text-muted-foreground leading-relaxed max-w-5xl mx-auto">
                    <p>
                        <strong>Disclaimer:</strong> Battery specifications are provided for planning and educational purposes only. Always verify compatibility, certification, warranty terms, and installation requirements with the manufacturer and a qualified installer before purchasing. BatteryBlueprint compiles this data from publicly available datasheets and official manufacturer releases; specifications may change without notice or vary by local grid regulations.
                    </p>
                </div>
            </div>
        </div>
    );
}
