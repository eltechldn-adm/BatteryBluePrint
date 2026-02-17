
import { ContextualInArticleCTA } from '@/components/content/ConversionCTAs';
import { DocsCallout } from '@/components/docs/DocsCallout';
import { DocsFAQ, DocsFAQItem } from '@/components/docs/DocsFAQ';
import { CONTENT_MANIFEST, ManifestArticle } from './content-manifest.generated';

// Components are no longer passed to MDX compiler at runtime, 
// as we are using pre-compiled HTML. 
// However, we still need them if we were to hydrate, but we are doing server-side HTML injection.

export const CONTENT_CATEGORIES = [
    'basics',
    'sizing',
    'cost',
    'comparisons',
    'how-to',
    'incentives',
    'future',
    'markets',
] as const;

export type ContentCategory = typeof CONTENT_CATEGORIES[number];

export interface ArticleMetadata {
    title: string;
    description: string;
    updated: string;
    category: ContentCategory;
    slug: string;
    readingMinutes?: number;
}

export interface Article extends ArticleMetadata {
    html: string;
}

/**
 * Get article metadata without compiling MDX content
 * Uses the build-time generated manifest
 */
export function getArticlesByCategory(category: ContentCategory): ArticleMetadata[] {
    const categoryArticles = CONTENT_MANIFEST[category];
    if (!categoryArticles) return [];

    return Object.values(categoryArticles).map(mapManifestToMetadata);
}

/**
 * Get all articles across all categories (for sitemap generation)
 */
export function getAllArticles(): ArticleMetadata[] {
    let allArticles: ArticleMetadata[] = [];

    for (const category in CONTENT_MANIFEST) {
        if (isSupportedCategory(category)) {
            const articles = Object.values(CONTENT_MANIFEST[category]).map(mapManifestToMetadata);
            allArticles = allArticles.concat(articles);
        }
    }

    return allArticles;
}

/**
 * Helper to map raw manifest record to clean metadata
 */
function mapManifestToMetadata(record: ManifestArticle): ArticleMetadata {
    return {
        title: record.title,
        description: record.description,
        updated: record.updated,
        category: record.category as ContentCategory,
        slug: record.slug,
        readingMinutes: record.readingMinutes,
    };
}

/**
 * Get a specific article with pre-compiled HTML content
 */
export async function getArticle(
    category: ContentCategory,
    slug: string
): Promise<{ metadata: ArticleMetadata; html: string; faqs: { question: string; answer: string }[] } | null> {
    const categoryArticles = CONTENT_MANIFEST[category];
    if (!categoryArticles) return null;

    const record = categoryArticles[slug];
    if (!record) return null;

    return {
        metadata: {
            title: record.title,
            description: record.description,
            updated: record.updated,
            category: record.category as ContentCategory,
            slug: record.slug,
            readingMinutes: record.readingMinutes,
        },
        html: record.html,
        faqs: record.faqs || [],
    };
}

/**
 * Validate if a category is supported
 */
export function isSupportedCategory(category: string): category is ContentCategory {
    // Check if the string exists in our readonly array
    return CONTENT_CATEGORIES.some(c => c === category);
}
