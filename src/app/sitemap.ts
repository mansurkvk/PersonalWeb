import type { MetadataRoute } from "next";
import { listBlogPosts } from "@/repositories/blog.repository";
import { listProjects } from "@/repositories/projects.repository";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProductionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  const vercelDeploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const url = configuredUrl || (vercelProductionUrl ? `https://${vercelProductionUrl}` : undefined) || (vercelDeploymentUrl ? `https://${vercelDeploymentUrl}` : undefined) || "https://harezmirobotics.vercel.app";

  return url.replace(/\/+$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const [posts, projects] = await Promise.all([
    listBlogPosts({ status: "published", limit: 100 }).catch(() => []),
    listProjects({ limit: 100 }).catch(() => [])
  ]);

  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/info", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/esp", priority: 0.65, changeFrequency: "monthly" as const }
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority
    })),
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt ?? project.createdAt ?? now,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.85 : 0.75
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? post.createdAt ?? now,
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.8 : 0.7
    }))
  ];
}
