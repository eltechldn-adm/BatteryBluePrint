import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
  title: "Solar Battery Sizing Guide",
  description: "Learn the fundamentals of solar battery sizing. Understand depth of discharge, inverter efficiency, autonomy days, and winter buffers.",
  keywords: ["solar battery guide", "battery sizing guide", "depth of discharge", "DoD", "inverter efficiency", "solar education"],
  openGraph: {
    title: "Solar Battery Sizing Guide | BatteryBlueprint",
    description: "Learn the fundamentals of solar battery sizing. Understand depth of discharge, inverter efficiency, autonomy days, and winter buffers.",
    url: `${siteUrl}/guide`,
    type: "article",
    images: [
      {
        url: `${siteUrl}/og-guide.png`,
        width: 1200,
        height: 630,
        alt: "BatteryBlueprint Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Battery Sizing Guide | BatteryBlueprint",
    description: "Learn the fundamentals of solar battery sizing. Understand depth of discharge, inverter efficiency, autonomy days, and winter buffers.",
    images: [`${siteUrl}/og-guide.png`],
  },
  alternates: {
    canonical: `${siteUrl}/guide`,
  },
};
