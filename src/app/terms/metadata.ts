import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for BatteryBlueprint. Review our terms and conditions for using the solar battery sizing calculator.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | BatteryBlueprint",
    description: "Terms of service for BatteryBlueprint. Review our terms and conditions for using the solar battery sizing calculator.",
    url: `${siteUrl}/terms`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
};
