import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
    Zap,
    BookOpen,
    Calculator as CalcIcon,
    TrendingUp,
    DollarSign,
    GitCompare,
    Wrench,
    Gift,
    Sparkles,
    ArrowRight,
    FileText,
    Globe
} from "lucide-react";
import type { Metadata } from "next";
import { getArticlesByCategory, CONTENT_CATEGORIES, type ContentCategory } from "@/lib/content/mdx";
import { GuideReinforcementCTA } from '@/components/content/ConversionCTAs';
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
    title: "Energy Hub | BatteryBlueprint",
    description: "Understand solar battery storage properly before you size. Explore guides on basics, sizing, costs, comparisons, and more.",
    keywords: ["solar battery guide", "energy storage", "battery sizing", "solar education"],
    openGraph: {
        title: "Energy Hub | BatteryBlueprint",
        description: "Understand solar battery storage properly before you size. Explore guides on basics, sizing, costs, and more.",
        url: `${siteUrl}/guide`,
        type: "website",
    },
    alternates: {
        canonical: `${siteUrl}/guide`,
    },
};

// Category metadata
const CATEGORY_INFO: Record<ContentCategory, { icon: React.ElementType; description: string }> = {
    basics: {
        icon: BookOpen,
        description: "Core concepts and fundamentals of solar battery storage",
    },
    sizing: {
        icon: CalcIcon,
        description: "How to calculate the right battery capacity for your needs",
    },
    cost: {
        icon: DollarSign,
        description: "Pricing guides, ROI analysis, and financial planning",
    },
    comparisons: {
        icon: GitCompare,
        description: "Side-by-side analysis of battery systems and technologies",
    },
    "how-to": {
        icon: Wrench,
        description: "Step-by-step guides for planning and installation",
    },
    incentives: {
        icon: Gift,
        description: "Tax credits, rebates, and government programs",
    },
    future: {
        icon: Sparkles,
        description: "Emerging technologies and industry trends",
    },
    markets: {
        icon: Globe,
        description: "Regional market analysis, costs, and incentives by country",
    },
};

// Recommended starter articles
const RECOMMENDED_ARTICLES = [
    {
        category: "basics" as ContentCategory,
        slug: "what-is-a-solar-battery",
        title: "What is a Solar Battery?",
        description: "Start here to understand the fundamentals",
    },
];

export default function EnergyHub() {
    const categoryCounts = CONTENT_CATEGORIES.reduce((acc, category) => {
        const articles = getArticlesByCategory(category);
        acc[category] = articles.length;
        return acc;
    }, {} as Record<ContentCategory, number>);

    // Get top 3 articles for each category for the hub view
    const articlesByCategory = CONTENT_CATEGORIES.map(category => ({
        category,
        articles: getArticlesByCategory(category)
            .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
            .slice(0, 3)
    }));

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="animated-blob blob-2 -top-32 -right-48 opacity-10" />
                <div className="animated-blob blob-3 bottom-1/3 -left-32 opacity-10" />
            </div>

            {/* Header - Global in RootLayout */}

            <main className="flex-1 relative z-10">
                {/* Hero Section */}
                <section className="px-4 sm:px-6 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-2">
                            <Zap className="w-4 h-4" />
                            Educational Resource
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Energy Hub
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            Understand solar battery storage properly before you size.
                        </p>
                        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Whether you're planning your first battery system or optimizing an existing one, our guides break down the engineering fundamentals without the marketing fluff.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/calculator">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl gap-2">
                                    <CalcIcon className="w-5 h-5" />
                                    Use the Calculator
                                </Button>
                            </Link>
                            <Link href="/calculator">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl gap-2">
                                    <FileText className="w-5 h-5" />
                                    Get Blueprint PDF
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Category Grid Section */}
                <section className="px-4 sm:px-6 py-12 bg-muted/20">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2">Explore by Topic</h2>
                            <p className="text-muted-foreground">
                                Deep-dive into specific areas of battery storage and energy independence.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CONTENT_CATEGORIES.map((category) => {
                                const info = CATEGORY_INFO[category];
                                const Icon = info.icon;
                                const count = categoryCounts[category];
                                const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');

                                return (
                                    <Link key={category} href={`/${category}`} className="group">
                                        <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                                            <CardHeader>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                        <Icon className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                                        {count} {count === 1 ? 'article' : 'articles'}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                    {categoryTitle}
                                                </CardTitle>
                                                <CardDescription className="text-sm leading-relaxed">
                                                    {info.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center text-sm text-primary font-medium">
                                                    Explore {categoryTitle}
                                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="max-w-6xl mx-auto space-y-12">
                        {articlesByCategory.map((categoryData, index) => {
                            if (categoryData.articles.length === 0) return null; // Don't render empty categories
                            return (
                                <div key={categoryData.category} className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                        <h2 className="text-2xl font-bold capitalize flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Zap className="w-4 h-4" />
                                            </span>
                                            {categoryData.category}
                                        </h2>
                                        <Link
                                            href={`/${categoryData.category}`}
                                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                                        >
                                            View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {categoryData.articles.map((article) => (
                                            <Link
                                                key={article.slug}
                                                href={`/${article.category}/${article.slug}`}
                                                className="group block"
                                            >
                                                <article className="h-full bg-card rounded-xl border border-border/50 p-5 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col">
                                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                                        {article.description}
                                                    </p>
                                                    <div className="text-xs text-muted-foreground/60 font-medium">
                                                        Read more →
                                                    </div>
                                                </article>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Reinforcement CTA after the 3rd category (index 2) */}
                                    {index === 2 && <GuideReinforcementCTA />}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Start Here Section - This section is now redundant or needs to be re-evaluated based on the new category display */}
                {/* Keeping it for now as the instruction only specified inserting the CTA, not removing this section */}
                {RECOMMENDED_ARTICLES.length > 0 && (
                    <section className="px-4 sm:px-6 py-12">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-2">Start Here</h2>
                                <p className="text-muted-foreground">
                                    New to solar batteries? These articles will give you a solid foundation.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {RECOMMENDED_ARTICLES.map((article, index) => (
                                    <Link
                                        key={`${article.category}-${article.slug}`}
                                        href={`/${article.category}/${article.slug}`}
                                        className="block group"
                                    >
                                        <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                                            <CardHeader>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                                                            {article.title}
                                                        </CardTitle>
                                                        <CardDescription>{article.description}</CardDescription>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Conversion Section */}
                <section className="px-4 sm:px-6 py-16 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Size Your System?
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Use our engineering-grade calculator to determine exactly how much battery capacity you need. Account for depth of discharge, inverter efficiency, backup days, and regional climate—all in one tool.
                        </p>
                        <Link href="/calculator">
                            <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-xl gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-100">
                                <CalcIcon className="w-6 h-6" />
                                Calculate My System
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer - Global in RootLayout */}
        </div>
    );
}
