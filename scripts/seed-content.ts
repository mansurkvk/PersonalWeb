import { getDb } from "../src/lib/db/mongodb";
import { ensureDatabaseIndexes } from "../src/lib/db/indexes";
import { toObjectId } from "../src/lib/db/object-id";
import { blogPostSeeds, projectSeeds } from "../src/config/content-seeds";
import type { BlogPostDocument, ProjectDocument, UserDocument } from "../src/types/database";

async function main() {
  await ensureDatabaseIndexes();
  const db = await getDb();

  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "mansurkvk000@gmail.com").toLowerCase().trim();
  const admin = await db.collection<UserDocument>("users").findOne({ email: adminEmail });
  if (!admin?._id) {
    throw new Error("Icerik seed icin once admin kullanici olusturulmali. Once npm run seed calistir.");
  }

  const now = new Date();
  const posts = db.collection<BlogPostDocument>("blogPosts");
  for (const post of blogPostSeeds) {
    await posts.updateOne(
      { slug: post.slug },
      {
        $set: {
          ...post,
          authorId: toObjectId(admin._id),
          updatedAt: now,
          publishedAt: post.status === "published" ? now : undefined
        },
        $setOnInsert: { viewCount: 0, createdAt: now }
      },
      { upsert: true }
    );
  }

  const projects = db.collection<ProjectDocument>("projects");
  for (const project of projectSeeds) {
    await projects.updateOne(
      { slug: project.slug },
      {
        $set: { ...project, updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );
  }

  console.log("Content seed tamamlandi", { blogPosts: blogPostSeeds.length, projects: projectSeeds.length });
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
