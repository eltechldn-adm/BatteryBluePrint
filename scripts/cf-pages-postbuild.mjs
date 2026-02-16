
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceWorker = path.join(projectRoot, '.open-next', 'worker.js');
const destDir = path.join(projectRoot, 'functions');
const destWorker = path.join(destDir, '_worker.js');

console.log('🔄 Running Cloudflare Pages post-build script...');

if (!fs.existsSync(sourceWorker)) {
    console.error(`❌ Error: Source worker file not found at ${sourceWorker}`);
    console.error('Make sure "npm run build:cf" ran successfully and produced the OpenNext output.');
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    console.log(`Creating functions directory at ${destDir}...`);
    fs.mkdirSync(destDir, { recursive: true });
}

try {
    fs.copyFileSync(sourceWorker, destWorker);
    console.log(`✅ Success: Copied worker to ${destWorker}`);
    console.log('🚀 Ready for Cloudflare Pages deployment!');
} catch (error) {
    console.error(`❌ Error copying worker file: ${error.message}`);
    process.exit(1);
}
