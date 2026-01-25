import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for BatteryBlueprint. Learn how we handle your data and protect your information.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | BatteryBlueprint",
    description: "Privacy policy for BatteryBlueprint. Learn how we handle your data and protect your information.",
    url: `${siteUrl}/privacy`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
};
