# Cloudflare Pages Deployment Guide

## Quick Start

**Build Command**: `npm run build:cf`  
**Output Directory**: `.open-next`  
**Build System**: OpenNext Cloudflare Adapter

---

## Prerequisites

1. **Node.js Version**: Set in Cloudflare Pages environment
   ```
   NODE_VERSION=22
   ```

2. **Required Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., `https://batteryblueprint.com`)
   - `RESEND_API_KEY` - Resend.com API key for email delivery
   - `EMAIL_FROM` - Sender email address (must be verified in Resend)
   - `UPSTASH_REDIS_REST_URL` - Upstash Redis REST endpoint
   - `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis authentication token
   - `ADMIN_PASSWORD` - Password for `/admin/leads` access

---

## Cloudflare Pages Settings

### Build Configuration

```
Build command: npm run build:cf
Build output directory: .open-next
Root directory: /
```

### Framework Preset

- **Framework**: Next.js
- **Build system**: Custom (OpenNext)

### Compatibility Flags

Add these in **Settings → Functions → Compatibility Flags**:
```
nodejs_compat
transformstream_enable_standard_constructor
```

### Compatibility Date

Set in **Settings → Functions → Compatibility Date**:
```
2024-11-28
```

---

## Environment Variables Setup

In **Settings → Environment Variables**, add:

### Production & Preview

| Variable | Example Value | Required |
|----------|---------------|----------|
| `NODE_VERSION` | `22` | Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://batteryblueprint.com` | Yes |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | Yes |
| `EMAIL_FROM` | `BatteryBlueprint <hello@batteryblueprint.com>` | Yes |
| `UPSTASH_REDIS_REST_URL` | `https://xxx.upstash.io` | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | `AYxxxx` | Yes |
| `ADMIN_PASSWORD` | `your-secure-password` | Yes |

---

## Build Process

The `build:cf` script performs:

1. **Next.js Build with Webpack**  
   `next build --webpack`  
   - Avoids Turbopack issues
   - Generates `.next` directory
   - Compiles all routes and API endpoints

2. **OpenNext Cloudflare Adapter**  
   `opennextjs-cloudflare build`  
   - Adapts Next.js build for Cloudflare Workers
   - Creates `.open-next/worker.js` entry point
   - Bundles static assets to `.open-next/assets`
   - Configures incremental cache for R2

**Output Structure**:
```
.open-next/
├── worker.js          # Cloudflare Worker entry
├── assets/            # Static assets
├── server-functions/  # API route handlers
└── cache/            # Build cache
```

---

## R2 Bucket Setup (Required)

Cloudflare Pages needs an R2 bucket for Next.js incremental cache.

### Create R2 Bucket

1. Go to **R2 → Create Bucket**
2. Name: `batteryblueprint-cache`
3. Location: Auto (or near your users)

### Link to Pages

In **Settings → Functions → R2 Bucket Bindings**:

| Binding Name | R2 Bucket |
|--------------|-----------|
| `NEXT_INC_CACHE_R2_BUCKET` | `batteryblueprint-cache` |

---

## Local Testing

### Test Production Build

```bash
npm run build:cf
```

Verify:
- ✅ Build completes without errors
- ✅ `.open-next/worker.js` exists
- ✅ `.open-next/assets/` contains static files
- ✅ All 20 routes compiled

### Preview Locally

```bash
npm run preview
```

This requires R2 bucket to be configured in `wrangler.jsonc`.

---

## Deployment

### First Deployment

1. **Connect Git Repository**  
   Link your GitHub/GitLab repo in Cloudflare Pages

2. **Configure Build**  
   - Build command: `npm run build:cf`
   - Build output: `.open-next`

3. **Set Environment Variables**  
   Add all required variables listed above

4. **Set Compatibility Flags**  
   Add `nodejs_compat` and `transformstream_enable_standard_constructor`

5. **Create R2 Bucket**  
   Create and link `batteryblueprint-cache`

6. **Deploy**  
   Trigger first deployment

### Subsequent Deployments

Automatic on every git push to `main` (or configured branch)

---

## Troubleshooting

### Build Fails: "Invalid distDirRoot"

**Solution**: Ensure `build:cf` uses `--webpack` flag
```json
"build:cf": "next build --webpack && opennextjs-cloudflare build"
```

### Build Fails: "TurbopackInternalError"

**Solution**: The `--webpack` flag disables Turbopack. Verify it's in the build script.

### Runtime Error: "R2 binding not found"

**Solution**: 
1. Create R2 bucket `batteryblueprint-cache`
2. Add binding in Pages Functions settings
3. Redeploy

### Email Not Sending

**Solution**:
1. Verify `RESEND_API_KEY` is set
2. Verify `EMAIL_FROM` domain is verified in Resend
3. Check Resend dashboard for error logs

### Redis Errors

**Solution**:
1. Verify `UPSTASH_REDIS_REST_URL` is set correctly
2. Verify `UPSTASH_REDIS_REST_TOKEN` is set
3. Test connection in Upstash dashboard

---

## Routes & Features

All routes preserved:

**Pages** (13):
- `/` - Homepage
- `/calculator` - Battery calculator
- `/guide` - User guide
- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/blueprint/confirmed` - Email confirmation success
- `/blueprint/expired` - Expired token page
- `/admin/leads` - Admin dashboard
- `/robots.txt` - SEO
- `/sitemap.xml` - SEO

**API Routes** (5):
- `/api/blueprint/request` - PDF request (double opt-in)
- `/api/blueprint/confirm` - Email confirmation
- `/api/blueprint/download` - PDF download
- `/api/events` - Analytics
- `/api/leads` - Lead storage

---

## Performance

**Expected Metrics**:
- Cold start: <50ms (Cloudflare Workers)
- Static page load: <100ms (edge-cached)
- API response: <200ms (with Redis)
- PDF generation: 1-2s (server-side React PDF)

---

## Monitoring

### Cloudflare Dashboard

- **Analytics → Web Analytics**: Page views, visitors
- **Workers & Pages → Logs**: Real-time logs
- **R2 → Metrics**: Cache hit rate

### Recommended Setup

1. Enable **Web Analytics** for visitor tracking
2. Set up **Email Alerts** for:
   - Build failures
   - High error rates
   - R2 quota warnings

---

## Security

- ✅ All secrets encrypted (environment variables)
- ✅ Double opt-in email flow (prevent spam)
- ✅ Rate limiting (5 req/hour per IP)
- ✅ Token expiration (24h)
- ✅ Admin password protection
- ✅ HTTPS only (automatic on Cloudflare)

---

## Support

**Documentation**:
- [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

**Issues**:
- Check Cloudflare Pages build logs
- Review Wrangler CLI output locally
- Verify all environment variables set
