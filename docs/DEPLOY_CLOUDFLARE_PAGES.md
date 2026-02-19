# Deploying BatteryBlueprint to Cloudflare Pages

This project is configured as a **pure static export** (Next.js `output: "export"`). It does NOT use Cloudflare Workers, Functions, or OpenNext. It serves pre-built HTML/CSS/JS files.

## 1. Cloudflare Pages Configuration

Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > Pages > Connect Git > Select Repo.

### Build Settings
| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | `None` | **CRITICAL**: Do NOT select "Next.js". That preset attempts to use `@cloudflare/next-on-pages` which we are not using. |
| **Build Command** | `npm run build` | Runs content generation + Next.js build |
| **Build Output Directory** | `out` | Next.js exports static files here |
| **Root Directory** | *(leave blank)* | Root of the repo |

### Environment Variables
| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_VERSION` | `20` | Ensures compatible Node.js runtime |
| `NEXT_PUBLIC_SITE_URL` | `https://batteryblueprint.com` | Used for SEO, Sitemap, Canonical URLs |

## 2. Local Verification

To verify the build locally before pushing:

```bash
npm run build
```

**Success Criteria:**
1.  Build completes without error.
2.  `src/lib/content/content-manifest.generated.ts` is created.
3.  `out/` directory is created.
4.  `out/index.html` exists.
5.  `node scripts/verify-static-export.mjs` prints "✅ STATIC EXPORT OK".

## 3. Project Structure Constraints

*   **No API Routes**: `src/app/api/` has been removed. Dynamic logic must be client-side or build-time.
*   **No Server Components (Runtime)**: Components can be "Server Components" (RSC) but they only run *at build time* to generate HTML. They cannot handle runtime requests.
*   **Image Optimization**: Next.js Image Optimization is disabled (`unoptimized: true` in `next.config.ts`). Images are served as-is.
*   **Forms/Leads**: Must use external services (e.g., Formspree, Airtable, ConvertKit) or client-side APIs.

## 4. Troubleshooting

**Issue: "Error: No Output Directory found"**
*   **Fix**: Ensure **Build Output Directory** is set to `out` in Cloudflare settings.

**Issue: 404 on subpages**
*   **Fix**: Cloudflare Pages automatically handles `index.html` resolution. Ensure `trailingSlash: true` is set in `next.config.ts` (it is) associated with standard behavior.

**Issue: "Check your build settings" / Build Fail**
*   **Fix**: Check if `NODE_VERSION` is set to `20`. Check build logs. Ensure duplicate lockfiles are not causing conflicts.
