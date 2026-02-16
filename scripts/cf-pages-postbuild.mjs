
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Source: OpenNext build output
const openNextDir = path.join(projectRoot, '.open-next');
const sourceWorker = path.join(openNextDir, 'worker.js');
const assetsSourceDir = path.join(openNextDir, 'assets');

// Destination: Cloudflare Pages Output Directory = .open-next (root)
// We are deploying the ENTIRE .open-next folder contents.
const destWorker = path.join(openNextDir, '_worker.js');
const destRoutes = path.join(openNextDir, '_routes.json');

console.log('🔄 Running Cloudflare Pages Advanced Mode post-build script (Root Fix)...');
console.log(`📂 Output Directory: ${openNextDir}`);

// 1. Validate Source
if (!fs.existsSync(sourceWorker)) {
    console.error(`❌ Error: Source worker file not found at ${sourceWorker}`);
    process.exit(1);
}

// 2. Copy Worker to _worker.js (Beside cloudflare/ and middleware/ folders)
try {
    fs.copyFileSync(sourceWorker, destWorker);
    const workerStats = fs.statSync(destWorker);
    console.log(`✅ Success: Copied worker to ${destWorker} (${workerStats.size} bytes)`);
} catch (error) {
    console.error(`❌ Error copying worker file: ${error.message}`);
    process.exit(1);
}

// 3. Recursive Copy Function
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// 4. Move Assets Up (Merge assets/* into .open-next/*)
// This ensures /_next, /images, etc. are at the root for static serving
if (fs.existsSync(assetsSourceDir)) {
    console.log(`📦 Merging assets from ${assetsSourceDir} into ${openNextDir}...`);
    try {
        // Copy everything inside .open-next/assets/ to .open-next/
        const assetChildren = fs.readdirSync(assetsSourceDir);
        assetChildren.forEach(child => {
            const srcPath = path.join(assetsSourceDir, child);
            const destPath = path.join(openNextDir, child);
            copyRecursiveSync(srcPath, destPath);
            console.log(`   -> Copied ${child}`);
        });
        console.log('✅ Success: Assets merged to root.');
    } catch (error) {
        console.error(`❌ Error merging assets: ${error.message}`);
        process.exit(1);
    }
} else {
    console.warn(`⚠️ Warning: No assets directory found at ${assetsSourceDir}`);
}

// 5. Generate _routes.json (Strict Schema)
const routesConfig = {
    version: 1,
    include: ["/*"],
    exclude: [
        "/_next/*",
        "/favicon.ico",
        "/robots.txt",
        "/sitemap.xml",
        "/assets/*",
        "/images/*",
        "/*.png",
        "/*.jpg",
        "/*.jpeg",
        "/*.webp",
        "/*.svg",
        "/*.ico",
        "/*.css",
        "/*.js",
        "/*.map",
        "/*.txt"
    ]
};

try {
    fs.writeFileSync(destRoutes, JSON.stringify(routesConfig, null, 2));

    // Verify
    const writtenContent = fs.readFileSync(destRoutes, 'utf8');
    const parsedContent = JSON.parse(writtenContent);
    if (parsedContent.version !== 1) throw new Error('Invalid version');

    console.log(`✅ Success: Generated _routes.json at ${destRoutes}`);
} catch (error) {
    console.error(`❌ Error generating _routes.json: ${error.message}`);
    process.exit(1);
}

// 6. Final Verification Logic
const rWorker = fs.existsSync(destWorker);
const rRoutes = fs.existsSync(destRoutes);
const rNext = fs.existsSync(path.join(openNextDir, '_next'));

if (!rWorker || !rRoutes || !rNext) {
    console.error('❌ Final Verification Failed: Missing required files in .open-next root.');
    if (!rWorker) console.error('   Missing: _worker.js');
    if (!rRoutes) console.error('   Missing: _routes.json');
    if (!rNext) console.error('   Missing: _next folder');
    process.exit(1);
}

console.log('🚀 Ready for Cloudflare Pages deployment!');
console.log('👉 Build Command: npm run build:cf');
console.log('👉 Output Directory: .open-next (Root)');
