import { getDb } from "@/lib/db/mongodb";
import { siteConfig } from "@/config/site";
import type { SiteSettingsDocument } from "@/types/database";

export async function siteSettingsCollection() {
  const db = await getDb();
  return db.collection<SiteSettingsDocument>("siteSettings");
}

export async function getSiteSettings() {
  const settings = await siteSettingsCollection();
  const current = await settings.findOne();
  if (current) return current;

  const now = new Date();
  const fallback: SiteSettingsDocument = {
    siteTitle: siteConfig.title,
    siteDescription: siteConfig.description,
    heroTitle: siteConfig.hero.title,
    heroSubtitle: siteConfig.hero.subtitle,
    oldSiteUrl: siteConfig.links.oldSite,
    socialLinks: {
      github: siteConfig.links.github,
      linkedin: siteConfig.links.linkedin,
      x: siteConfig.links.x,
      instagram: siteConfig.links.instagram,
      youtube: siteConfig.links.youtube
    },
    theme: "dark",
    createdAt: now,
    updatedAt: now
  };

  const result = await settings.insertOne(fallback);
  return { ...fallback, _id: result.insertedId };
}

export async function updateSiteSettings(input: Partial<SiteSettingsDocument>) {
  const settings = await siteSettingsCollection();
  const current = await getSiteSettings();
  await settings.updateOne({ _id: current._id }, { $set: { ...input, updatedAt: new Date() } });
}
