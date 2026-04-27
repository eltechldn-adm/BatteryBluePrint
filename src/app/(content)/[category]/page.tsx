import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    getArticlesByCategory,
    CONTENT_CATEGORIES,
    isSupportedCategory,
    type ContentCategory,
} from '@/lib/content/mdx';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Lightbulb } from 'lucide-react';
import { GlobalUsersNotice } from '@/components/content/GlobalUsersNotice';

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateStaticParams() {
    return CONTENT_CATEGORIES.map((category) => ({
        category,
    }));
}

// Category metadata: descriptions and related links for empty categories
const CATEGORY_META: Record<string, {
    title: string;
    intro: string;
    relatedCategories: string[];
}> = {
    basics: {
        title: 'Solar Battery Basics',
        intro: `Understanding solar battery fundamentals is the first step to sizing your system correctly. This section covers how solar batteries work, what the key specifications mean, and how to interpret the numbers that matter — capacity (kWh), depth of discharge (DoD), round-trip efficiency, and cycle life. Whether you're new to off-grid energy or just want to verify your assumptions, these guides give you the engineering foundation to make informed decisions without relying on a salesperson.`,
        relatedCategories: ['sizing', 'cost', 'comparisons'],
    },
    sizing: {
        title: 'Battery Sizing Guides',
        intro: `Getting the right battery size is the most critical decision in any solar energy system. Too small and you run out of power during outages; too large and you waste thousands of dollars on capacity you'll never use. This section walks through the engineering methodology behind battery sizing — daily load calculations, autonomy requirements, depth of discharge buffers, and seasonal adjustments for winter efficiency loss. Use these guides alongside our calculator to validate your inputs and understand the assumptions behind your results.`,
        relatedCategories: ['basics', 'cost', 'comparisons'],
    },
    cost: {
        title: 'Solar Battery Cost & Value',
        intro: `Battery storage is a significant investment, and understanding the true cost requires looking beyond the sticker price. This section covers installed cost ranges, payback period calculations, incentive stacking strategies, and the total cost of ownership over a 10–15 year system lifespan. We break down the cost per kWh of usable storage for different battery chemistries and system sizes, so you can compare options on an apples-to-apples basis. All figures are updated regularly and include regional variations where data is available.`,
        relatedCategories: ['sizing', 'comparisons', 'basics'],
    },
    comparisons: {
        title: 'Battery Comparisons',
        intro: `Not all solar batteries are created equal. Lithium iron phosphate (LFP), lead-acid, and flow batteries each have distinct trade-offs in cycle life, efficiency, temperature sensitivity, and upfront cost. This section provides side-by-side technical comparisons of the most popular battery chemistries and products, using manufacturer datasheet specifications rather than marketing claims. Our comparisons are designed to help you shortlist options before talking to installers, so you arrive with informed questions rather than starting from zero.`,
        relatedCategories: ['basics', 'sizing', 'cost'],
    },
    'how-to': {
        title: 'How-To Guides',
        intro: `Practical, step-by-step guides for planning and evaluating solar battery installations. This section is in active development. In the meantime, explore our related guides below — they cover the foundational knowledge you'll need before diving into installation specifics.`,
        relatedCategories: ['basics', 'sizing', 'comparisons'],
    },
    incentives: {
        title: 'Solar Battery Incentives',
        intro: `Government incentives, tax credits, and rebates can significantly reduce the net cost of a solar battery system. This section is in active development and will cover federal tax credits (ITC/IRA), state-level rebates, utility programs, and SGIP-style incentives by region. In the meantime, explore our cost analysis guides for a full picture of battery economics.`,
        relatedCategories: ['cost', 'basics', 'sizing'],
    },
    future: {
        title: 'Future of Energy Storage',
        intro: `The energy storage landscape is evolving rapidly — from next-generation battery chemistries to grid-scale virtual power plants. This section is in active development and will cover emerging technologies, market trends, and what they mean for homeowners planning systems today. In the meantime, explore our comparison guides for a current-state view of available technologies.`,
        relatedCategories: ['comparisons', 'basics', 'cost'],
    },
    markets: {
        title: 'Solar Battery Markets',
        intro: `Solar battery economics vary significantly by country and region — driven by electricity prices, incentive structures, grid reliability, and climate. This section covers market-specific sizing considerations, cost benchmarks, and incentive landscapes for the US, UK, Australia, Canada, and the EU. Each guide uses local utility rate data and regional solar irradiance figures to give you accurate, location-specific guidance rather than generic global averages.`,
        relatedCategories: ['cost', 'sizing', 'comparisons'],
    },
};

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    basics: 'Basics',
    sizing: 'Sizing',
    cost: 'Cost & Value',
    comparisons: 'Comparisons',
    'how-to': 'How-To Guides',
    incentives: 'Incentives',
    future: 'Future of Storage',
    markets: 'Markets',
};

// Per-category decision page recommendation
const CATEGORY_DECISION_PAGE: Record<string, { href: string; label: string; desc: string }> = {
    basics: { href: '/worth-it', label: 'Is Solar Battery Storage Worth It?', desc: 'Before going further, get the honest financial verdict.' },
    sizing: { href: '/choose-battery', label: 'How to Choose the Right Solar Battery', desc: 'Apply your sizing knowledge to pick the right product.' },
    cost: { href: '/hidden-costs', label: 'Hidden Costs of Solar Battery Storage', desc: 'Sticker price is only part of the story.' },
    comparisons: { href: '/choose-battery', label: 'Battery Decision Guide', desc: 'Turn comparison data into a concrete purchase decision.' },
    'how-to': { href: '/common-mistakes', label: 'Biggest Mistakes Homeowners Make', desc: 'Know the errors before you start planning.' },
    incentives: { href: '/payback-reality', label: 'Solar Battery Payback Reality', desc: 'Incentives change the payback — see the real numbers.' },
    future: { href: '/when-not-to-buy', label: 'When NOT to Buy a Solar Battery', desc: 'Emerging tech is promising. Current reality may differ.' },
    markets: { href: '/payback-reality', label: 'Solar Battery Payback Reality: UK vs US vs Global', desc: 'Market-by-market payback benchmarks.' },
};

// Per-category "Start Here" article slug
const CATEGORY_START_ARTICLE: Record<string, string> = {
    basics: 'what-is-a-solar-battery',
    sizing: 'how-much-battery-storage-do-i-need',
    cost: 'is-solar-battery-storage-worth-it',
    comparisons: 'best-solar-batteries-2026',
    'how-to': 'how-to-choose-the-right-solar-battery',
    incentives: 'us-federal-solar-battery-tax-credit-itc',
    future: 'future-of-home-battery-storage-2026-2030',
    markets: 'us-solar-battery-cost-2026',
};

export async function generateMetadata({ params }: CategoryPageProps) {
    const { category } = await params;

    if (!isSupportedCategory(category)) {
        return {};
    }

    const meta = CATEGORY_META[category];
    const title = meta?.title || (category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '));
    const description = meta?.intro
        ? (meta.intro.length > 155 ? meta.intro.slice(0, 155).split(' ').slice(0, -1).join(' ') + '...' : meta.intro)
        : `Learn about battery ${category} with our comprehensive guides and articles.`;

    return {
        title: `${title} | BatteryBlueprint`,
        description: description,
        alternates: {
            canonical: `https://batteryblueprint.com/${category}`,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;

    if (!isSupportedCategory(category)) {
        notFound();
    }

    const articles = getArticlesByCategory(category as ContentCategory);
    const meta = CATEGORY_META[category];
    const categoryTitle = CATEGORY_DISPLAY_NAMES[category] || (category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '));
    const isEmpty = articles.length === 0;
    const decisionPage = CATEGORY_DECISION_PAGE[category];
    const startArticleSlug = CATEGORY_START_ARTICLE[category];

    return (
        <div className="space-y-8">
            {/* Category Hero */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-bold tracking-tight">{meta?.title || `${categoryTitle} Articles`}</h1>
                    {meta?.intro && (
                        <p className="text-base text-muted-foreground leading-relaxed">
                            {meta.intro}
                        </p>
                    )}
                </div>
                <div className="shrink-0">
                    <Link href="/calculator">
                        <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
                            Start Sizing <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

            {isEmpty ? (
                /* Empty category: rich coming-soon with related links */
                <div className="space-y-8">
                    <div className="p-8 rounded-xl border border-dashed bg-muted/30 text-center space-y-4">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                            <h2 className="text-xl font-semibold">Guides Coming Soon</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                We&apos;re writing in-depth guides for this section. Check back soon, or explore related topics below.
                            </p>
                        </div>
                        <Link href="/calculator">
                            <Button>Use the Calculator Now</Button>
                        </Link>
                    </div>

                    {/* Related categories */}
                    {meta?.relatedCategories && meta.relatedCategories.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Explore Related Topics</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {meta.relatedCategories.map((relCat) => {
                                    const relMeta = CATEGORY_META[relCat];
                                    return (
                                        <Link key={relCat} href={`/${relCat}`} className="block group">
                                            <Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm">
                                                <CardHeader>
                                                    <CardTitle className="text-base group-hover:text-primary transition-colors flex items-center justify-between">
                                                        {CATEGORY_DISPLAY_NAMES[relCat] || relCat}
                                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </CardTitle>
                                                    <CardDescription className="text-xs line-clamp-2 mt-1">
                                                        {relMeta?.intro.slice(0, 100)}...
                                                    </CardDescription>
                                                </CardHeader>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Articles grid */
                <div className="grid gap-6">
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/${article.category}/${article.slug}`}
                            className="block group"
                        >
                            <Card className={`h-full transition-all hover:border-primary/50 hover:shadow-sm ${article.slug === startArticleSlug ? 'border-primary/30 bg-primary/5' : ''}`}>
                                <CardHeader>
                                    {article.slug === startArticleSlug && (
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                                            <Lightbulb className="w-3.5 h-3.5" />
                                            Start Here
                                        </div>
                                    )}
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {article.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {article.description}
                                    </CardDescription>
                                    {article.updated && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Updated {new Date(article.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            {' · '}BatteryBlueprint Editorial
                                        </p>
                                    )}
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}

                    {/* Decision Page Callout */}
                    {decisionPage && (
                        <div className="mt-4 p-6 rounded-xl border border-border/60 bg-secondary/5">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Before You Buy</p>
                                    <h3 className="font-bold text-lg">{decisionPage.label}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{decisionPage.desc}</p>
                                </div>
                                <Link href={decisionPage.href} className="shrink-0">
                                    <Button variant="outline" size="sm" className="rounded-lg">
                                        Read Guide <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
