// env.d.ts — environment variable type declarations for Next.js
// This site is deployed as a pure static export on Cloudflare Pages.

declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SITE_URL?: string;
        NODE_ENV: 'development' | 'production' | 'test';
    }
}
