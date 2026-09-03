"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// ============================================================
// EXACT PUBLISHED ROUTE ALLOWLIST — DEFAULT DENY
// ============================================================
// This list is derived from:
//  - Static app routes (app directory pages)
//  - Battery catalog IDs from BATTERY_DATABASE
//  - Article slugs from src/content/* (matches the content manifest)
//  - Region pages
// Anything NOT listed defaults to false — including unknown slugs
// under valid category prefixes (e.g. /batteries/not-real/).
// ============================================================

const ALLOWED_ROUTES = new Set([
  // Core pages
  "/",
  "/methodology",
  "/guide",
  // Tool
  "/calculator",
  // Decision pages
  "/worth-it",
  "/when-not-to-buy",
  "/hidden-costs",
  "/common-mistakes",
  "/payback-reality",
  "/choose-battery",
  // Regions
  "/regions/uk",
  "/regions/us",
  // Battery catalog index
  "/batteries",
  // Battery detail pages — derived from BATTERY_DATABASE ids
  "/batteries/tesla-powerwall-3",
  "/batteries/enphase-iq-5p",
  "/batteries/franklinwh-apower",
  "/batteries/sonnencore-plus",
  "/batteries/eg4-wallmount",
  "/batteries/ruixu-sible",
  "/batteries/pylontech-us5000",
  "/batteries/byd-battery-box-premium-hvs",
  "/batteries/lg-resu-16h-prime",
  "/batteries/solaredge-energy-bank",
  "/batteries/givenergy-all-in-one",
  "/batteries/growatt-ark",
  "/batteries/simpliphi-phi-3-8",
  "/batteries/foxess-ecs",
  "/batteries/sungrow-sbr",
  // Category index hubs
  "/basics",
  "/sizing",
  "/cost",
  "/comparisons",
  "/how-to",
  "/incentives",
  "/future",
  "/markets",
  // basics articles
  "/basics/kwh-explained",
  // sizing articles
  "/sizing/battery-backup-for-power-outages",
  "/sizing/how-to-size-solar-battery-uk-us",
  "/sizing/solar-battery-for-ev-charging",
  // cost articles
  "/cost/us-solar-battery-incentives",
  // comparisons articles
  "/comparisons/ac-coupled-vs-dc-coupled",
  "/comparisons/best-solar-batteries-2026",
  "/comparisons/lithium-vs-lead-acid",
  // how-to articles
  "/how-to/how-to-add-battery-to-existing-solar-system",
  "/how-to/how-to-choose-the-right-solar-battery",
  "/how-to/how-to-monitor-solar-battery-health",
  "/how-to/how-to-read-your-electricity-bill-for-battery-sizing",
  "/how-to/how-to-troubleshoot-solar-battery-problems",
  "/how-to/how-to-verify-installer-certifications",
  // incentives articles
  "/incentives/australia-solar-battery-rebates-incentives-2026",
  "/incentives/how-to-claim-solar-battery-incentives",
  "/incentives/net-metering-3-0-explained",
  "/incentives/sgip-rebate-guide-california",
  "/incentives/uk-solar-battery-incentives-grants-2026",
  "/incentives/us-federal-solar-battery-tax-credit-itc",
  "/incentives/us-state-solar-battery-rebates-guide-2026",
  "/incentives/virtual-power-plant-income-guide",
  // future articles
  "/future/hydrogen-home-storage-vs-batteries",
  "/future/second-life-ev-batteries-home-storage",
  "/future/sodium-ion-batteries-home-storage",
  "/future/solid-state-batteries-home-storage",
  "/future/vehicle-to-home-v2h-ev-as-home-battery",
  // (removed: /future/virtual-power-plants-explained-home-battery — deleted, redirects to /incentives/virtual-power-plant-income-guide/)
  // markets articles
  "/markets/australia-solar-battery-cost-2026",
  "/markets/canada-solar-battery-cost-2026",
  "/markets/eu-solar-battery-cost-2026",
  "/markets/uk-solar-battery-cost-2026",
  "/markets/us-solar-battery-cost-2026",
]);

export function isRouteEligibleForAdSense(pathname: string | null): boolean {
  if (!pathname) return false;
  // Normalise trailing slash
  const clean = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
  return ALLOWED_ROUTES.has(clean);
}

export function AdSenseLoader() {
  const pathname = usePathname();

  if (!isRouteEligibleForAdSense(pathname)) {
    return null;
  }

  return (
    <Script
      id="adsense-init"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7088331504377019"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
