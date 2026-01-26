/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
    BATTERYBLUEPRINT_KV: KVNamespace;
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    ADMIN_PASSWORD?: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
}
