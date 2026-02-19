
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

// ─── Validation constants ───────────────────────────────────────────────────
const MIN_WORD_COUNT = 1500;
const MIN_H2_COUNT = 4;
const MIN_DESCRIPTION_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 160;

console.log('\n📦 [Content Manifest] Starting generation...');
console.log(`   📂 Source: ${CONTENT_DIR}`);
console.log(`   📄 Output: ${OUTPUT_FILE}`);

const manifest = [];
const validationErrors = [];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Count words in a markdown string (strips markdown syntax) */
function countWords(markdown) {
    return markdown
        .replace(/```[\s\S]*?```/g, '') // strip code blocks
        .replace(/`[^`]+`/g, '')         // strip inline code
        .replace(/!\[.*?\]\(.*?\)/g, '') // strip images
        .replace(/\[.*?\]\(.*?\)/g, '$1') // strip links, keep text
        .replace(/[#*_~>|]/g, '')         // strip markdown symbols
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean).length;
}

/** Count occurrences of H2 headings (## ...) */
function countH2(markdown) {
    return (markdown.match(/^##\s+.+/gm) || []).length;
}

/** Check if article has an H1 */
function hasH1(markdown) {
    return /^#\s+.+/m.test(markdown);
}

/** Check if article has a FAQ section */
function hasFAQ(markdown) {
    return /## (Common Questions|FAQ|Frequently Asked Questions)/i.test(markdown) ||
        /<DocsFAQItem/i.test(markdown);
}

/** Count internal links (href="/...") */
function countInternalLinks(markdown) {
    return (markdown.match(/\]\(\/[^)]+\)/g) || []).length;
}

/** Validate a single article and return array of error strings */
function validateArticle(filePath, frontmatter, content) {
    const errors = [];
    const relPath = path.relative(projectRoot, filePath);

    const wordCount = countWords(content);
    const h2Count = countH2(content);
    const internalLinks = countInternalLinks(content);
    const descLen = (frontmatter.description || '').length;

    if (wordCount < MIN_WORD_COUNT) {
        errors.push(`[${relPath}] Word count too low: ${wordCount} (min ${MIN_WORD_COUNT})`);
    }
    if (!hasH1(content) && !frontmatter.title) {
        errors.push(`[${relPath}] Missing H1 heading`);
    }
    if (h2Count < MIN_H2_COUNT) {
        errors.push(`[${relPath}] Only ${h2Count} H2 sections (min ${MIN_H2_COUNT})`);
    }
    if (!hasFAQ(content)) {
        errors.push(`[${relPath}] Missing FAQ section`);
    }
    if (internalLinks < 2) {
        errors.push(`[${relPath}] Only ${internalLinks} internal links (min 2)`);
    }
    if (!frontmatter.description) {
        errors.push(`[${relPath}] Missing meta description`);
    } else if (descLen < MIN_DESCRIPTION_LENGTH || descLen > MAX_DESCRIPTION_LENGTH) {
        errors.push(`[${relPath}] Meta description length ${descLen} chars (must be ${MIN_DESCRIPTION_LENGTH}–${MAX_DESCRIPTION_LENGTH})`);
    }
    if (!frontmatter.updated) {
        errors.push(`[${relPath}] Missing 'updated' date in frontmatter`);
    }

    return errors;
}

// Helper to strip/replace specific React components for static HTML
function processCustomComponents(content) {
    let processed = content;

    processed = processed.replace(
        /<DocsCallout\s+title=["'](.*?)["']\s+description=["'](.*?)["'](?:.*?)CTA=(?:.*?)>/g,
        (match, title, desc) => `
<aside class="callout p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 my-8">
  <h3 class="font-semibold text-slate-900 dark:text-white mb-2">${title}</h3>
  <p class="text-slate-600 dark:text-slate-400 mb-0">${desc}</p>
</aside>`
    );

    processed = processed.replace(
        /<DocsCallout\s+([^>]*?)\/?>/g,
        (match, attrs) => {
            const title = attrs.match(/title=["'](.*?)["']/)?.[1] || 'Note';
            const desc = attrs.match(/description=["'](.*?)["']/)?.[1] || '';
            return `
<aside class="callout p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 my-8">
  <h3 class="font-semibold text-slate-900 dark:text-white mb-2">${title}</h3>
  <p class="text-slate-600 dark:text-slate-400 mb-0">${desc}</p>
</aside>`;
        }
    );

    processed = processed.replace(/<DocsFAQ>/g, '').replace(/<\/DocsFAQ>/g, '');
    processed = processed.replace(/<DocsFAQItem\s+.*?question=["'].*?["'].*?>([\s\S]*?)<\/DocsFAQItem>/g, '$1');

    return processed;
}

async function compileMarkdown(markdown) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(markdown);

    return String(file);
}

// ─── Main processing loop ────────────────────────────────────────────────────
(async () => {
    for (const category of CATEGORIES) {
        const categoryPath = path.join(CONTENT_DIR, category);

        if (fs.existsSync(categoryPath)) {
            const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.mdx'));

            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data, content } = matter(fileContent);

                // ── Validate article structure ──────────────────────────────
                const errors = validateArticle(filePath, data, content);
                if (errors.length > 0) {
                    validationErrors.push(...errors);
                }

                // 1. CTA Injection Placeholder
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
                const faqItemRegex = /<DocsFAQItem\s+question=["'](.*?)["']\s*>([\s\S]*?)<\/DocsFAQItem>/g;
                let newMatch;
                while ((newMatch = faqItemRegex.exec(content)) !== null) {
                    faqs.push({
                        question: newMatch[1].trim(),
                        answer: newMatch[2].trim(),
                    });
                }
                if (faqs.length === 0) {
                    const oldFaqRegex = /## (?:Common Questions|FAQ|Frequently Asked Questions)([\s\S]*?)(?=---|$)/i;
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

                // 3. Process Custom Components
                processedContent = processCustomComponents(processedContent);

                // 4. Compile to HTML
                const html = await compileMarkdown(processedContent);

                // 5. Word count for manifest metadata
                const wordCount = countWords(content);

                manifest.push({
                    title: data.title || '',
                    description: data.description || '',
                    updated: data.updated || '',
                    category: data.category || category,
                    slug: data.slug || file.replace('.mdx', ''),
                    readingMinutes: data.readingMinutes || Math.ceil(wordCount / 200),
                    wordCount,
                    html: html,
                    faqs: faqs
                });
            }
            console.log(`   ✅ Processed ${category}: ${files.length} articles`);
        } else {
            console.log(`   ⚠️ Category not found: ${category}`);
        }
    }

    // ── Build-time validation gate ───────────────────────────────────────────
    if (manifest.length === 0) {
        console.error('\n❌ [CRITICAL BUILD ERROR] Content Manifest is empty!');
        console.error('   No articles were found. Check src/content directories.\n');
        process.exit(1);
    }

    if (validationErrors.length > 0) {
        console.error('\n❌ [BUILD ERROR] Article validation failed:');
        validationErrors.forEach(err => console.error(`   • ${err}`));
        console.error('\n   Fix the above issues and re-run the build.\n');
        process.exit(1);
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
    wordCount: number;
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
        const totalSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
        console.log(`\n✅ [Content Manifest] Generated successfully!`);
        console.log(`   📝 Total Articles: ${manifest.length}`);
        console.log(`   💾 File Size: ${totalSize} KB`);
        console.log(`   🚀 Ready for build.\n`);
    } catch (error) {
        console.error(`❌ Error writing manifest: ${error.message}`);
        process.exit(1);
    }
})();
