#!/usr/bin/env node
/**
 * verify-static-export.mjs
 * Hard-fail postbuild check: ensures next build produced a valid /out directory.
 * Runs automatically via "postbuild" npm hook after every `npm run build`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');

const REQUIRED_FILES = [
    'index.html',
    'sitemap.xml',
    'robots.txt',
];

let failed = false;

// 1. Check out/ directory exists
if (!fs.existsSync(OUT_DIR)) {
    console.error('\n❌ [STATIC EXPORT FAIL] out/ directory does not exist.');
    console.error('   next build with output: "export" should have created it.');
    process.exit(1);
}

// 2. Check required files
for (const file of REQUIRED_FILES) {
    const filePath = path.join(OUT_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ [STATIC EXPORT FAIL] Missing required file: out/${file}`);
        failed = true;
    }
}

if (failed) {
    process.exit(1);
}

// 3. Count HTML files
const countHtml = (dir) => {
    let count = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) count += countHtml(full);
        else if (entry.name.endsWith('.html')) count++;
    }
    return count;
};

const htmlCount = countHtml(OUT_DIR);
if (htmlCount < 10) {
    console.error(`❌ [STATIC EXPORT FAIL] Only ${htmlCount} HTML files in out/ — expected at least 10.`);
    process.exit(1);
}

console.log(`\n✅ STATIC EXPORT OK: out/ exists with ${htmlCount} HTML pages.`);
console.log(`   Required files: ${REQUIRED_FILES.join(', ')} — all present.`);
console.log(`   Ready for Cloudflare Pages deployment.\n`);
