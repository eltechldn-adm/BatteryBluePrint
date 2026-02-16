
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

console.log('🔄 Running Cloudflare Pages Advanced Mode post-build script...');

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
    console.log(`✅ Success: Copied worker to ${destWorker}`);
} catch (error) {
    console.error(`❌ Error copying worker file: ${error.message}`);
    process.exit(1);
}

// 4. Generate _routes.json
// Exclude static assets to bypass the worker, include everything else
const routesConfig = {
    version: 1,
    include: ["/*"],
    exclude: [
        "/_next/*",
        "/favicon.ico",
        "/robots.txt",
        "/sitemap.xml",
        "/images/*",
        "/assets/*",
        "/ads.txt",
        "/file.svg",
        "/globe.svg",
        "/hero-solar-system.jpg",
        "/next.svg",
        "/vercel.svg",
        "/window.svg",
        "/_headers"
    ]
};

try {
    fs.writeFileSync(destRoutes, JSON.stringify(routesConfig, null, 2));
    console.log(`✅ Success: Generated _routes.json at ${destRoutes}`);
} catch (error) {
    console.error(`❌ Error generating _routes.json: ${error.message}`);
    process.exit(1);
}

// 5. Cleanup /functions if it exists (Optional, to avoid confusion)
const functionsDir = path.join(projectRoot, 'functions');
if (fs.existsSync(functionsDir)) {
    console.log('🧹 Cleaning up legacy /functions directory...');
    fs.rmSync(functionsDir, { recursive: true, force: true });
}

console.log('🚀 Ready for Cloudflare Pages deployment (Advanced Mode)!');
console.log(`👉 Build Command: npm run build:cf`);
console.log(`👉 Output Directory: .open-next/assets`);
