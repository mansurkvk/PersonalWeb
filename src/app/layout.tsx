import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/config/site";
import { SpeedInsights } from "@vercel/speed-insights/next";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.title,
    images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: siteConfig.title }],
    locale: "tr_TR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    images: ["/images/hero.png"]
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${displayFont.variable} ${monoFont.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
        <SpeedInsights />
      </body>
    </html>
  );
}
