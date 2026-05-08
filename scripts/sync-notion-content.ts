import { getDb } from "../src/lib/db/mongodb";
import { ensureDatabaseIndexes } from "../src/lib/db/indexes";
import { toObjectId } from "../src/lib/db/object-id";
import type { BlogPostDocument, ProjectDocument, UserDocument } from "../src/types/database";

type NotionRichText = { plain_text?: string };
type NotionSelect = { name?: string } | null;
type NotionMultiSelect = Array<{ name?: string }>;
type NotionPage = {
  properties: Record<string, unknown>;
};

const notionVersion = "2022-06-28";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} tanimli degil.`);
  return value;
}

function plainText(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const prop = value as Record<string, unknown>;
  const richText = (prop.rich_text ?? prop.title) as NotionRichText[] | undefined;
  return richText?.map((item) => item.plain_text ?? "").join("").trim() ?? "";
}

function selectName(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const prop = value as Record<string, unknown>;
  const select = prop.select as NotionSelect;
  return select?.name ?? "";
}

function multiSelectNames(value: unknown) {
  if (!value || typeof value !== "object") return [];
  const prop = value as Record<string, unknown>;
  const values = prop.multi_select as NotionMultiSelect | undefined;
  return values?.map((item) => item.name).filter(Boolean) as string[] ?? [];
}

function checkboxValue(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const prop = value as Record<string, unknown>;
  return Boolean(prop.checkbox);
}

async function queryNotionDatabase(databaseId: string) {
  const token = requiredEnv("NOTION_API_KEY");
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "notion-version": notionVersion
    },
    body: JSON.stringify({ page_size: 100 })
  });

  if (!response.ok) {
    throw new Error(`Notion query failed for ${databaseId}: ${response.status} ${await response.text()}`);
  }

  const data = await response.json() as { results: NotionPage[] };
  return data.results;
}

async function main() {
  await ensureDatabaseIndexes();
  const db = await getDb();

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "mansurkvk000@gmail.com";
  const admin = await db.collection<UserDocument>("users").findOne({ email: adminEmail.toLowerCase().trim() });
  if (!admin?._id) {
    throw new Error("Notion sync icin once npm run seed ile admin kullanici olusturulmali.");
  }

  const now = new Date();
  const blogDatabaseId = process.env.NOTION_BLOG_DATABASE_ID;
  const projectsDatabaseId = process.env.NOTION_PROJECTS_DATABASE_ID;

  if (blogDatabaseId) {
    const pages = await queryNotionDatabase(blogDatabaseId);
    const posts = db.collection<BlogPostDocument>("blogPosts");

    for (const page of pages) {
      const props = page.properties;
      const title = plainText(props.Title);
      const slug = plainText(props.Slug);
      if (!title || !slug) continue;

      const status = selectName(props.Status) === "Published" ? "published" : "draft";
      await posts.updateOne(
        { slug },
        {
          $set: {
            title,
            slug,
            excerpt: plainText(props.Excerpt),
            content: plainText(props.Content) || plainText(props.Excerpt),
            coverImage: "",
            tags: multiSelectNames(props.Tags),
            category: selectName(props.Category) || "Engineering Notes",
            status,
            authorId: toObjectId(admin._id),
            featured: checkboxValue(props.Featured),
            updatedAt: now,
            publishedAt: status === "published" ? now : undefined
          },
          $setOnInsert: { viewCount: 0, createdAt: now }
        },
        { upsert: true }
      );
    }
  }

  if (projectsDatabaseId) {
    const pages = await queryNotionDatabase(projectsDatabaseId);
    const projects = db.collection<ProjectDocument>("projects");

    for (const page of pages) {
      const props = page.properties;
      const title = plainText(props.Title);
      const slug = plainText(props.Slug);
      if (!title || !slug) continue;

      const status = selectName(props.Status).toLowerCase() as ProjectDocument["status"];
      await projects.updateOne(
        { slug },
        {
          $set: {
            title,
            slug,
            summary: plainText(props.Summary),
            description: plainText(props.Description) || plainText(props.Summary),
            coverImage: "",
            images: [],
            technologies: multiSelectNames(props.Technologies),
            category: selectName(props.Category) || "Engineering",
            status: status || "active",
            links: {},
            featured: checkboxValue(props.Featured),
            updatedAt: now
          },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      );
    }
  }

  console.log("Notion sync tamamlandi.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
