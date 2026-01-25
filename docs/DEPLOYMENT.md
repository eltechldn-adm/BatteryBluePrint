# BatteryBlueprint Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Optional (Admin Access)
ADMIN_PASSWORD=your-secure-password-here
```

**Important:** Update `NEXT_PUBLIC_SITE_URL` after your first deployment to match your actual Vercel domain.

---

## Local Development

### Setup
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build Production Locally
```bash
npm run build
npm start
```

---

## Environment Variables Reference

### `NEXT_PUBLIC_SITE_URL`
- **Required for:** SEO metadata, sitemap, Open Graph tags
- **Default:** `https://batteryblueprint.com`
- **Production:** Set to your actual domain (e.g., `https://your-domain.vercel.app`)

### `ADMIN_PASSWORD`
- **Required for:** `/admin/leads` access
- **Default:** `admin123` (NOT SECURE - change this!)
- **Production:** Use a strong password

### `NODE_ENV`
- **Automatic:** Set by Vercel
- **Development:** `development`
- **Production:** `production`

---

## Production Checklist

Before going live:

- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Set strong `ADMIN_PASSWORD`
- [ ] Test all pages load correctly
- [ ] Test calculator flow end-to-end
- [ ] Test PDF generation and download
- [ ] Test lead capture (submit email, check `/admin/leads`)
- [ ] Verify `/sitemap.xml` works
- [ ] Verify `/robots.txt` works
- [ ] Check SEO metadata in browser dev tools
- [ ] Test on mobile devices
- [ ] Verify analytics events are firing (check browser console)

---

## Testing Production Build

```bash
# Clean build
rm -rf .next
npm run build

# Check for errors
npm run lint

# Start production server
npm start
```

Visit each route:
- `/` - Home page
- `/calculator` - Calculator
- `/guide` - Sizing guide
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/sitemap.xml` - Sitemap
- `/robots.txt` - Robots file
- `/admin/leads` - Admin panel (requires password)

---

## Data Storage

### Development
- Events: `.data/events.jsonl`
- Leads: `.data/leads.jsonl`
- Both files are git-ignored

### Production (Vercel)
- Current: In-memory (ephemeral, resets on deployment)
- Future: Migrate to Supabase, Planetscale, or Vercel KV

**Important:** `.data` directory is NOT persistent on Vercel. Leads will be lost on each deployment. For production, integrate a proper database.

---

## Troubleshooting

### Build Fails
1. Clear `.next` directory: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npm run lint`

### PDF Generation Fails
- Ensure `@react-pdf/renderer` is properly installed
- Check browser console for errors
- Try in incognito mode (extensions can interfere)

### Analytics Not Working
- Check browser console for network errors
- Verify `/api/events` endpoint is accessible
- Check localStorage for stored events: `localStorage.getItem('bb_analytics_events')`

### Admin Leads Page Empty
- Verify someone submitted email through PDF modal
- Check `.data/leads.jsonl` exists locally
- On Vercel, leads are ephemeral (will reset)

### SEO Tags Not Showing
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly
- Check page source (View → Developer → View Source)
- Use [OpenGraph.xyz](https://www.opengraph.xyz/) to preview

---

## Custom Domain Setup (Vercel)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
5. Redeploy to regenerate sitemap/metadata

---

## Performance Tips

- Images: Use `next/image` component (currently none in project)
- Analytics: Events are sent asynchronously (non-blocking)
- PDF: Generated on-demand (client-side)
- Sitemap: Static generation (no runtime overhead)

---

## Future Enhancements

### Database Migration
Replace `.data` file storage with:
- **Supabase** (PostgreSQL, free tier, real-time)
- **Vercel Postgres** (integrated, paid)
- **PlanetScale** (MySQL, generous free tier)

Update `/api/leads/route.ts` to use DB client instead of file I/O.

### Analytics Integration
Replace custom analytics with:
- **Google Analytics 4** (free, comprehensive)
- **PostHog** (open source, product analytics)
- **Plausible** (privacy-focused, lightweight)

Modify `src/lib/analytics/track.ts` to forward events.

### Email Notifications
Add email service when lead is captured:
- **Resend** (simple API, generous free tier)
- **SendGrid** (established, free tier)
- **Postmark** (developer-friendly)

---

## Support

For issues:
1. Check this deployment guide
2. Review error logs in Vercel dashboard
3. Test locally with `npm run build && npm start`
4. Check browser console for client-side errors

---

## License & Credits

BatteryBlueprint - Solar Battery Sizing Calculator
Built with Next.js 16, React 19, TailwindCSS 4, React PDF
