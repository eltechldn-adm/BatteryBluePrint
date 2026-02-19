import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

import { CountryProviderClient } from "@/components/geo/CountryProviderClient";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// ... imports

// ... metadata

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
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7088331504377019"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BatteryBlueprint",
              "url": siteUrl,
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`,
                "width": 512,
                "height": 512
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@batteryblueprint.com",
                "contactType": "customer support"
              },
              "sameAs": []
            })
          }}
        />
        <CountryProviderClient>
          <Header />
          {children}
          <Footer />
        </CountryProviderClient>
      </body>
    </html>
  );
}
