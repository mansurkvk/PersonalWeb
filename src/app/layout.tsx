import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/config/site";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProductionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  const vercelDeploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const url =
    configuredUrl ||
    (vercelProductionUrl ? `https://${vercelProductionUrl}` : undefined) ||
    (vercelDeploymentUrl ? `https://${vercelDeploymentUrl}` : undefined) ||
    "https://harezmirobotics.vercel.app";

  return url.replace(/\/+$/, "");
}

const siteUrl = getSiteUrl();
const ogImageUrl = `${siteUrl}/images/hero.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.title,
  authors: [{ name: siteConfig.owner.name, url: siteUrl }],
  creator: siteConfig.owner.name,
  publisher: siteConfig.owner.name,
  keywords: [
    "Mansur Kavak",
    "Muhammed Mansur Kavak",
    "mekatronik",
    "robotik",
    "ESP32",
    "IoT telemetry",
    "yapay zeka",
    "fizik",
    "kuantum programlama",
    "muhendislik laboratuvari"
  ],
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.title,
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteConfig.title }],
    locale: "tr_TR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    images: [ogImageUrl]
  },
  icons: {
    icon: "/favicon.ico"
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.owner.name,
  alternateName: siteConfig.owner.shortName,
  url: siteUrl,
  email: siteConfig.owner.email,
  jobTitle: "Mekatronik Muhendisi",
  description: siteConfig.owner.positioning,
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.x,
    siteConfig.links.instagram,
    siteConfig.links.youtube
  ],
  knowsAbout: [
    "Mekatronik",
    "Robotik",
    "ESP32",
    "IoT telemetry",
    "Yapay zeka",
    "Fizik",
    "Kuantum programlama",
    "Deneysel muhendislik"
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${displayFont.variable} ${monoFont.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
