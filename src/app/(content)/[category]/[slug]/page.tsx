import { notFound } from 'next/navigation';
import {
    getArticle,
    getAllArticles,
    getArticlesByCategory,
    isSupportedCategory,
    type ContentCategory,
} from '@/lib/content/mdx';
import { DocsArticleHeader } from '@/components/docs/DocsArticleHeader';
import { InlineTOC } from '@/components/docs/InlineTOC';
import { DocsCallout } from '@/components/docs/DocsCallout';
import { GlobalUsersNotice } from '@/components/content/GlobalUsersNotice';

interface ArticlePageProps {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        category: article.category,
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
    const { category, slug } = await params;

    if (!isSupportedCategory(category)) {
        return {};
    }

    const article = await getArticle(category as ContentCategory, slug);

    if (!article) {
        return {};
    }

    return {
        title: `${article.metadata.title} | BatteryBlueprint`,
        description: article.metadata.description,
        alternates: {
            canonical: `https://batteryblueprint.com/${category}/${slug}`,
        },
        openGraph: {
            title: article.metadata.title,
            description: article.metadata.description,
            type: 'article',
            publishedTime: article.metadata.updated,
            authors: ['BatteryBlueprint'],
            url: `https://batteryblueprint.com/${category}/${slug}`,
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { category, slug } = await params;

    if (!isSupportedCategory(category)) {
        notFound();
    }

    const article = await getArticle(category as ContentCategory, slug);

    if (!article) {
        notFound();
    }

    const { metadata, content, faqs } = article;
    const categoryTitle = metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1);
    const articleUrl = `https://batteryblueprint.com/${metadata.category}/${metadata.slug}`;
    const categoryUrl = `https://batteryblueprint.com/${metadata.category}`;
    const socialImage = `https://batteryblueprint.com/og/${metadata.category}.png`;

    // Schema Logic
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metadata.title,
        description: metadata.description,
        dateModified: metadata.updated,
        datePublished: metadata.updated,
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

            <article>
                {['cost', 'incentives', 'comparisons'].includes(metadata.category) && (
                    <div className="mb-6">
                        <GlobalUsersNotice />
                    </div>
                )}

                <DocsArticleHeader metadata={metadata} />

                {/* Inline TOC - "On this page" */}
                <InlineTOC />

                {/* 
                   We use the same 'article-prose' class from Phase 9 to maintain typography.
                   The layout around it has changed (Constraints managed by DocsLayout grid).
                */}
                <div className="article-prose prose prose-slate dark:prose-invert max-w-none">
                    {content}
                </div>

                <div className="mt-12 space-y-6 border-t pt-8">
                    <h3 className="text-lg font-semibold">Next Steps</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <DocsCallout
                            title="Calculate your banking needs"
                            description="Use our engineering-grade tool to size your system."
                            href="/calculator"
                            ctaText="Start Sizing"
                            icon="calculator"
                        />
                        <DocsCallout
                            title="Get the Blueprint"
                            description="Download a PDF report for your installer."
                            href="/calculator"
                            ctaText="Download PDF"
                            icon="blueprint"
                            variant="outline"
                        />
                    </div>
                </div>
            </article>
        </>
    );
}
