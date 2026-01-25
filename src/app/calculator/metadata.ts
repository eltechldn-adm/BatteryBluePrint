import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
  title: "Solar Battery Calculator",
  description: "Engineering-grade solar battery sizing calculator. Input your daily load and get precise recommendations for off-grid and hybrid systems.",
  keywords: ["battery calculator", "solar sizing", "off-grid calculator", "battery capacity calculator"],
  openGraph: {
    title: "Solar Battery Calculator | BatteryBlueprint",
    description: "Engineering-grade solar battery sizing calculator. Get precise recommendations for your off-grid or hybrid system.",
    url: `${siteUrl}/calculator`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-calculator.png`,
        width: 1200,
        height: 630,
        alt: "BatteryBlueprint Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Battery Calculator | BatteryBlueprint",
    description: "Engineering-grade solar battery sizing calculator. Get precise recommendations for your off-grid or hybrid system.",
    images: [`${siteUrl}/og-calculator.png`],
  },
  alternates: {
    canonical: `${siteUrl}/calculator`,
  },
};
