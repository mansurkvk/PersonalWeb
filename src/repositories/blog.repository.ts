import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import type { BlogPostDocument, BlogPostStatus } from "@/types/database";

export type BlogListFilter = {
  status?: BlogPostStatus;
  category?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
};

export async function blogPostsCollection() {
  const db = await getDb();
  return db.collection<BlogPostDocument>("blogPosts");
}

export async function createBlogPost(input: Omit<BlogPostDocument, "_id" | "createdAt" | "updatedAt" | "viewCount">) {
  const now = new Date();
  const posts = await blogPostsCollection();
  const result = await posts.insertOne({
    ...input,
    viewCount: 0,
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId.toHexString();
}

export async function listBlogPosts(filter: BlogListFilter = {}) {
  const posts = await blogPostsCollection();
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.category) query.category = filter.category;
  if (filter.tag) query.tags = filter.tag;
  if (typeof filter.featured === "boolean") query.featured = filter.featured;

  return posts
    .find(query)
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .limit(filter.limit ?? 100)
    .toArray();
}

export async function findBlogPostBySlug(slug: string, includeDrafts = false) {
  const posts = await blogPostsCollection();
  return posts.findOne(includeDrafts ? { slug } : { slug, status: "published" });
}

export async function findBlogPostById(id: string) {
  const posts = await blogPostsCollection();
  return posts.findOne({ _id: toObjectId(id) });
}

export async function updateBlogPost(id: string, patch: Partial<BlogPostDocument>) {
  const posts = await blogPostsCollection();
  await posts.updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        ...patch,
        updatedAt: new Date(),
        ...(patch.status === "published" ? { publishedAt: patch.publishedAt ?? new Date() } : {})
      }
    }
  );
}

export async function deleteBlogPost(id: string) {
  const posts = await blogPostsCollection();
  await posts.deleteOne({ _id: toObjectId(id) });
}

export async function incrementBlogPostViews(id: string) {
  const posts = await blogPostsCollection();
  await posts.updateOne({ _id: toObjectId(id) }, { $inc: { viewCount: 1 } });
}

export async function countBlogPosts() {
  const posts = await blogPostsCollection();
  return posts.countDocuments();
}
