import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Clock, ChevronRight, ArrowRight, Share2 } from 'lucide-react';
import { type ArticleMetadata } from '@/lib/content/mdx';
import { BlueprintUpgradeCTA, NextStepsCTA } from '@/components/content/ConversionCTAs';
import { GlobalUsersNotice } from '@/components/content/GlobalUsersNotice';

interface ArticleLayoutProps {
    metadata: ArticleMetadata;
    children: React.ReactNode;
    relatedArticles: ArticleMetadata[];
    faqs?: { question: string; answer: string }[];
}

export function ArticleLayout({ metadata, children, relatedArticles, faqs = [] }: ArticleLayoutProps) {
    const categoryTitle = metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1);
    const articleUrl = `https://batteryblueprint.com/${metadata.category}/${metadata.slug}`;
    const categoryUrl = `https://batteryblueprint.com/${metadata.category}`;

    const socialImage = `https://batteryblueprint.com/og/${metadata.category}.png`; // Fallback dynamic image

    // 1. Article Schema
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metadata.title,
        description: metadata.description,
        dateModified: metadata.updated,
        datePublished: metadata.updated, // Fallback if no published date
        image: socialImage,
        author: {
            '@type': 'Organization',
            name: 'BatteryBlueprint',
            url: 'https://batteryblueprint.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'BatteryBlueprint',
            logo: {
                '@type': 'ImageObject',
                url: 'https://batteryblueprint.com/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
    };

    // 2. Breadcrumb Schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://batteryblueprint.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Energy Hub',
                item: 'https://batteryblueprint.com/guide',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: categoryTitle,
                item: categoryUrl,
            },
            {
                '@type': 'ListItem',
                position: 4,
                name: metadata.title,
                item: articleUrl,
            },
        ],
    };

    // 3. FAQ Schema (Conditional)
    const faqSchema = faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            <div className="min-h-screen flex flex-col bg-background">
                {/* Navigation provided by parent layout or page wrapper, here we focus on article content structure */}

                <main className="flex-1">
                    {/* Hero / Header Section */}
                    <div className="bg-muted/30 border-b border-border/50 pt-32 pb-12 md:py-16 md:pt-36 px-4 sm:px-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                                <ChevronRight className="w-4 h-4" />
                                <Link href="/guide" className="hover:text-primary transition-colors">Energy Hub</Link>
                                <ChevronRight className="w-4 h-4" />
                                <Link href={`/${metadata.category}`} className="hover:text-primary transition-colors">
                                    {categoryTitle}
                                </Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-foreground font-medium truncate max-w-[200px]">{metadata.title}</span>
                            </nav>

                            {/* Title & Description */}
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                                    {metadata.title}
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {metadata.description}
                                </p>
                            </div>

                            {/* Metadata Row */}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={metadata.updated}>
                                        {new Date(metadata.updated).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>5 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

                        {/* Main Content Column */}
                        <article className="min-w-0">
                            {/* Global Users Notice (Conditional based on category) */}
                            {['cost', 'incentives', 'comparisons'].includes(metadata.category) && (
                                <GlobalUsersNotice />
                            )}

                            <div className="article-prose prose prose-slate dark:prose-invert max-w-none 
                prose-headings:scroll-mt-32 
                prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h1:leading-tight
                prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/50 prose-h2:tracking-tight
                prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-12 prose-h3:mb-4
                prose-p:text-lg prose-p:leading-8 prose-p:text-muted-foreground prose-p:mb-8
                prose-ul:my-6 prose-li:text-lg prose-li:text-muted-foreground prose-li:marker:text-primary prose-li:pl-2
                prose-strong:text-foreground prose-strong:font-bold
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/20 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:my-10
                ">
                                {children}
                            </div>

                            {/* Engagement/CTA Block */}
                            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    <div className="space-y-3 flex-1">
                                        <h3 className="text-2xl font-bold">Plan your system with confidence</h3>
                                        <p className="text-muted-foreground">
                                            Don't guess on battery size. Use our engineering-grade calculator to get exact recommendations based on your needs.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                                        <Link href="/calculator">
                                            <Button size="lg" className="w-full sm:w-auto h-12 text-base font-semibold shadow-lg">
                                                Calculate My Requirements
                                            </Button>
                                        </Link>
                                        <Link href="/calculator">
                                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 text-base">
                                                Download Blueprint
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar / Related Content */}
                        <aside className="space-y-8 hidden lg:block">
                            {/* Sticky Container */}
                            <div className="sticky top-24 space-y-8">

                                {/* Related Articles */}
                                {relatedArticles.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                            Related in {categoryTitle}
                                        </h3>
                                        <div className="space-y-3">
                                            {relatedArticles.map((article) => (
                                                <Link key={article.slug} href={`/${article.category}/${article.slug}`} className="block group">
                                                    <Card className="hover:border-primary/50 transition-all hover:shadow-sm">
                                                        <CardHeader className="p-4">
                                                            <CardTitle className="text-sm font-medium leading-normal group-hover:text-primary transition-colors">
                                                                {article.title}
                                                            </CardTitle>
                                                            <CardDescription className="text-xs mt-1 line-clamp-2">
                                                                {article.description}
                                                            </CardDescription>
                                                        </CardHeader>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Global CTA */}
                                <Card className="bg-primary text-primary-foreground border-0 shadow-lg overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

                                    <CardContent className="p-6 relative z-10 space-y-4">
                                        <h3 className="font-bold text-lg leading-tight">Need a custom blueprint?</h3>
                                        <p className="text-primary-foreground/90 text-sm">
                                            Get a complete PDF sizing report to share with your installer.
                                        </p>
                                        <Link href="/calculator" className="block">
                                            <Button variant="secondary" className="w-full font-semibold">
                                                Start Sizing
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                            </div>
                        </aside>
                    </div>

                    {/* Mobile Related Articles (visible only on small screens) */}
                    {relatedArticles.length > 0 && (
                        <div className="lg:hidden px-4 sm:px-6 pb-12">
                            <h3 className="font-bold text-xl mb-6">Related Articles</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {relatedArticles.map((article) => (
                                    <Link key={article.slug} href={`/${article.category}/${article.slug}`} className="block group">
                                        <Card className="h-full hover:border-primary/50 transition-all">
                                            <CardHeader>
                                                <CardTitle className="text-base group-hover:text-primary transition-colors">
                                                    {article.title}
                                                </CardTitle>
                                                <CardDescription className="text-sm mt-1">
                                                    {article.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}
