import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://batteryblueprint.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BatteryBlueprint | Engineering-Grade Solar Battery Sizing",
    template: "%s | BatteryBlueprint",
  },
  description: "Calculate your solar battery needs without the sales fluff. Accurate sizing for specialized off-grid and hybrid systems.",
  keywords: ["solar battery", "battery sizing", "off-grid", "solar calculator", "energy storage", "battery backup"],
  authors: [{ name: "BatteryBlueprint" }],
  creator: "BatteryBlueprint",
  publisher: "BatteryBlueprint",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "BatteryBlueprint",
    title: "BatteryBlueprint | Engineering-Grade Solar Battery Sizing",
    description: "Calculate your solar battery needs without the sales fluff. Accurate sizing for specialized off-grid and hybrid systems.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "BatteryBlueprint - Solar Battery Sizing Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BatteryBlueprint | Engineering-Grade Solar Battery Sizing",
    description: "Calculate your solar battery needs without the sales fluff. Accurate sizing for specialized off-grid and hybrid systems.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@batteryblueprint",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteUrl}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Subtle grain texture overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
