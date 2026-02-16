
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { ContextualInArticleCTA } from '@/components/content/ConversionCTAs';
import { DocsCallout } from '@/components/docs/DocsCallout';
import { DocsFAQ, DocsFAQItem } from '@/components/docs/DocsFAQ';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CONTENT_MANIFEST, ManifestRecord } from './content-manifest.generated';

const components = {
    ContextualInArticleCTA,
    DocsCallout,
    DocsFAQ,
    DocsFAQItem,
};


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
    content: string;
}

/**
 * Get article metadata without compiling MDX content
 * Uses the build-time generated manifest instead of runtime fs
 */
export function getArticlesByCategory(category: ContentCategory): ArticleMetadata[] {
    return CONTENT_MANIFEST
        .filter(article => article.category === category)
        .map(mapManifestToMetadata);
}

/**
 * Get all articles across all categories (for sitemap generation)
 */
export function getAllArticles(): ArticleMetadata[] {
    // Filter out potential invalid categories that might have slipped into the manifest
    return CONTENT_MANIFEST
        .filter(article => isSupportedCategory(article.category))
        .map(mapManifestToMetadata);
}

/**
 * Helper to map raw manifest record to clean metadata
 */
function mapManifestToMetadata(record: ManifestRecord): ArticleMetadata {
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
 * Get a specific article with compiled MDX content
 */
export async function getArticle(
    category: ContentCategory,
    slug: string
): Promise<{ metadata: ArticleMetadata; content: React.ReactElement; faqs: { question: string; answer: string }[] } | null> {
    const record = CONTENT_MANIFEST.find(
        p => p.category === category && p.slug === slug
    );

    if (!record) {
        return null;
    }

    let fileContent = record.source;

    // INJECTION: Insert Contextual CTA after the 2nd H2 (## )
    const h2Regex = /^##\s+(.+)$/gm;
    let match;
    let count = 0;
    let insertIndex = -1;

    // Reset regex state
    h2Regex.lastIndex = 0;

    while ((match = h2Regex.exec(fileContent)) !== null) {
        count++;
        if (count === 2) {
            insertIndex = match.index + match[0].length;
            break;
        }
    }

    if (insertIndex !== -1) {
        const before = fileContent.slice(0, insertIndex);
        const after = fileContent.slice(insertIndex);
        fileContent = `${before}\n\n<ContextualInArticleCTA category="${category}" />\n\n${after}`;
    }

    const { content, frontmatter } = await compileMDX<ArticleMetadata>({
        source: fileContent,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            },
        },
        components: components,
    });

    // Extract FAQs from content
    const faqs: { question: string; answer: string }[] = [];

    // Strategy 1: Look for new <DocsFAQItem> components
    const newFaqRegex = /<DocsFAQItem\s+question=["'](.*?)["']\s*>([\s\S]*?)<\/DocsFAQItem>/g;
    let newMatch;
    while ((newMatch = newFaqRegex.exec(fileContent)) !== null) {
        faqs.push({
            question: newMatch[1].trim(),
            answer: newMatch[2].trim(),
        });
    }

    // Strategy 2: Fallback to old ## FAQ markdown structure if no components found
    if (faqs.length === 0) {
        const oldFaqRegex = /## FAQ([\s\S]*?)(?=---|$)/;
        const oldFaqMatch = fileContent.match(oldFaqRegex);

        if (oldFaqMatch) {
            const faqSection = oldFaqMatch[1];
            const oldQaRegex = /### (.*?)\n([\s\S]*?)(?=###|$)/g;
            let oldMatch;

            while ((oldMatch = oldQaRegex.exec(faqSection)) !== null) {
                faqs.push({
                    question: oldMatch[1].trim(),
                    answer: oldMatch[2].trim(),
                });
            }
        }
    }

    return {
        metadata: {
            title: frontmatter.title,
            description: frontmatter.description,
            updated: frontmatter.updated,
            category,
            slug,
            readingMinutes: frontmatter.readingMinutes,
        },
        content,
        faqs,
    };
}

/**
 * Validate if a category is supported
 */
export function isSupportedCategory(category: string): category is ContentCategory {
    // Check if the string exists in our readonly array
    return CONTENT_CATEGORIES.some(c => c === category);
}
