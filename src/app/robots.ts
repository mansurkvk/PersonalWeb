import type { MetadataRoute } from "next";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProductionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  const vercelDeploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const url = configuredUrl || (vercelProductionUrl ? `https://${vercelProductionUrl}` : undefined) || (vercelDeploymentUrl ? `https://${vercelDeploymentUrl}` : undefined) || "https://harezmirobotics.vercel.app";

  return url.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/login", "/register", "/capture"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
