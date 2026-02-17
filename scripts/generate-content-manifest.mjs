
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(projectRoot, 'src', 'content');
const OUTPUT_FILE = path.join(projectRoot, 'src', 'lib', 'content', 'content-manifest.generated.ts');

const CATEGORIES = [
    'basics',
    'sizing',
    'cost',
    'comparisons',
    'how-to',
    'incentives',
    'future',
    'markets',
];

console.log('🔄 Generating content manifest (HTML Compiled)...');

const manifest = [];

// Helper to strip/replace specific React components for static HTML
function processCustomComponents(content) {
    let processed = content;

    // Replace <DocsCallout ...> with roughly equivalent HTML or strip
    // Since we can't easily render React components in this pipeline without JSX runtime,
    // we will strip them or simplify them.
    // The user requirement says: "Replace <DocsCallout> with <aside class="callout">"
    // This regex is a simple approximation.
    processed = processed.replace(
        /<DocsCallout\s+title=["'](.*?)["']\s+description=["'](.*?)["'](?:.*?)CTA=(?:.*?)>/g,
        (match, title, desc) => `
<aside class="callout p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 my-8">
  <h3 class="font-semibold text-slate-900 dark:text-white mb-2">${title}</h3>
  <p class="text-slate-600 dark:text-slate-400 mb-0">${desc}</p>
</aside>`
    );

    // Simplistic handling for generic DocsCallout if attributes vary
    processed = processed.replace(
        /<DocsCallout\s+([^>]*?)\/?>/g,
        (match, attrs) => {
            // Simple parsing of title/desc
            const title = attrs.match(/title=["'](.*?)["']/)?.[1] || 'Note';
            const desc = attrs.match(/description=["'](.*?)["']/)?.[1] || '';
            return `
<aside class="callout p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 my-8">
  <h3 class="font-semibold text-slate-900 dark:text-white mb-2">${title}</h3>
  <p class="text-slate-600 dark:text-slate-400 mb-0">${desc}</p>
</aside>`;
        }
    );

    // Remove <DocsFAQ> wrappers but keep content
    processed = processed.replace(/<DocsFAQ>/g, '').replace(/<\/DocsFAQ>/g, '');

    // DocsFAQItem is handled during FAQ extraction, so we should STRIP it from the body
    // to avoid duplicating it in the HTML if we render FAQs separately.
    // OR we can leave it as HTML if we want it inline.
    // The user requirement says "Remove <DocsFAQItem ...> wrapper tags but keep inner text for the article body"
    processed = processed.replace(/<DocsFAQItem\s+.*?question=["'].*?["'].*?>([\s\S]*?)<\/DocsFAQItem>/g, '$1');

    return processed;
}

async function compileMarkdown(markdown) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw) // Needed to pass through HTML tags/placeholders
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown);

    return String(file);
}

// Main processing loop
(async () => {
    for (const category of CATEGORIES) {
        const categoryPath = path.join(CONTENT_DIR, category);

        if (fs.existsSync(categoryPath)) {
            const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.mdx'));

            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data, content } = matter(fileContent);

                // 1. CTA Injection Placeholder
                // Insert placeholder after 2nd H2
                const h2Regex = /^##\s+(.+)$/gm;
                let match;
                let count = 0;
                let insertIndex = -1;

                let processedContent = content;

                while ((match = h2Regex.exec(content)) !== null) {
                    count++;
                    if (count === 2) {
                        insertIndex = match.index + match[0].length;
                        break;
                    }
                }

                if (insertIndex !== -1) {
                    const before = content.slice(0, insertIndex);
                    const after = content.slice(insertIndex);
                    processedContent = `${before}\n\n<!--CTA:${category}-->\n\n${after}`;
                }

                // 2. Extract FAQs
                const faqs = [];
                // Strategy 1: <DocsFAQItem>
                const faqItemRegex = /<DocsFAQItem\s+question=["'](.*?)["']\s*>([\s\S]*?)<\/DocsFAQItem>/g;
                let newMatch;
                while ((newMatch = faqItemRegex.exec(content)) !== null) {
                    faqs.push({
                        question: newMatch[1].trim(),
                        answer: newMatch[2].trim(), // Inner markdown/text
                    });
                }
                // Strategy 2: ## FAQ markdown section
                if (faqs.length === 0) {
                    const oldFaqRegex = /## FAQ([\s\S]*?)(?=---|$)/;
                    const oldFaqMatch = content.match(oldFaqRegex);
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

                // 3. Process Custom Components (strip/replace)
                processedContent = processCustomComponents(processedContent);

                // 4. Compile to HTML
                const html = await compileMarkdown(processedContent);

                manifest.push({
                    title: data.title || '',
                    description: data.description || '',
                    updated: data.updated || '',
                    category: data.category || category,
                    slug: data.slug || file.replace('.mdx', ''),
                    readingMinutes: data.readingMinutes || 0,
                    html: html,
                    faqs: faqs
                });
            }
            console.log(`   ✅ Processed ${category}: ${files.length} articles`);
        } else {
            console.log(`   ⚠️ Category not found: ${category}`);
        }
    }

    const fileContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated by scripts/generate-content-manifest.mjs
 */

export interface ManifestArticle {
    title: string;
    description: string;
    updated: string;
    category: string;
    slug: string;
    readingMinutes: number;
    html: string;
    faqs: { question: string; answer: string }[];
}

// Map: Category -> Slug -> Article
export const CONTENT_MANIFEST: Record<string, Record<string, ManifestArticle>> = ${JSON.stringify(
        manifest.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = {};
            acc[item.category][item.slug] = item;
            return acc;
        }, {}),
        null, 4
    )
        };
`;

    try {
        fs.writeFileSync(OUTPUT_FILE, fileContent);
        console.log(`🚀 Manifest generated at ${OUTPUT_FILE} (${manifest.length} total articles)`);
    } catch (error) {
        console.error(`❌ Error writing manifest: ${error.message}`);
        process.exit(1);
    }
})();
