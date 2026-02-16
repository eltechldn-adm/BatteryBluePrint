
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Source: OpenNext build output
const sourceWorker = path.join(projectRoot, '.open-next', 'worker.js');

// Destination: Pages Advanced Mode output directory (must be the same as assets)
const destDir = path.join(projectRoot, '.open-next', 'assets');
const destWorker = path.join(destDir, '_worker.js');
const destRoutes = path.join(destDir, '_routes.json');

console.log('🔄 Running Cloudflare Pages Advanced Mode post-build script (Strict Mode)...');
console.log(`📂 Output Directory: ${destDir}`);

// 1. Validate Source
if (!fs.existsSync(sourceWorker)) {
    console.error(`❌ Error: Source worker file not found at ${sourceWorker}`);
    console.error('Make sure "npm run build:cf" ran successfully and produced the OpenNext output.');
    process.exit(1);
}

// 2. Validate/Create Destination
if (!fs.existsSync(destDir)) {
    console.log(`Creating assets directory at ${destDir}...`);
    fs.mkdirSync(destDir, { recursive: true });
}

// 3. Copy Worker to _worker.js (Advanced Mode)
try {
    fs.copyFileSync(sourceWorker, destWorker);
    const workerStats = fs.statSync(destWorker);
    console.log(`✅ Success: Copied worker to ${destWorker} (${workerStats.size} bytes)`);
} catch (error) {
    console.error(`❌ Error copying worker file: ${error.message}`);
    process.exit(1);
}

// 4. Generate _routes.json (Strict Schema)
// Cloudflare Pages Advanced Mode REQUIRES "version": 1
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
    // Write file
    fs.writeFileSync(destRoutes, JSON.stringify(routesConfig, null, 2));

    // VERIFY file content (Crucial step)
    const writtenContent = fs.readFileSync(destRoutes, 'utf8');
    const parsedContent = JSON.parse(writtenContent);

    if (parsedContent.version !== 1) {
        throw new Error(`Validation failed: _routes.json version is ${parsedContent.version}, expected 1`);
    }

    if (!parsedContent.include || !parsedContent.include.includes("/*")) {
        throw new Error('Validation failed: _routes.json missing include: ["/*"]');
    }

    const routesStats = fs.statSync(destRoutes);
    console.log(`✅ Success: Generated and verified _routes.json at ${destRoutes} (${routesStats.size} bytes)`);
    console.log('📄 _routes.json preview:', writtenContent.substring(0, 200).replace(/\n/g, ' '));

} catch (error) {
    console.error(`❌ Error generating/verifying _routes.json: ${error.message}`);
    process.exit(1);
}

// 5. Cleanup /functions if it exists
const functionsDir = path.join(projectRoot, 'functions');
if (fs.existsSync(functionsDir)) {
    console.log('🧹 Cleaning up legacy /functions directory...');
    fs.rmSync(functionsDir, { recursive: true, force: true });
}

console.log('🚀 Ready for Cloudflare Pages deployment (Advanced Mode)!');
