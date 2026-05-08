import { ObjectId } from "mongodb";
import { blogPostSeeds } from "@/config/content-seeds";
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

const staticAuthorId = new ObjectId("000000000000000000000001");

function staticId(index: number) {
  return new ObjectId(`100000000000000000000${String(index + 1).padStart(3, "0")}`);
}

function staticBlogPosts(): BlogPostDocument[] {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return blogPostSeeds.map((post, index) => ({
    ...post,
    _id: staticId(index),
    authorId: staticAuthorId,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: post.status === "published" ? now : undefined
  }));
}

function applyBlogFilter(posts: BlogPostDocument[], filter: BlogListFilter = {}) {
  let result = [...posts];
  if (filter.status) result = result.filter((post) => post.status === filter.status);
  if (filter.category) result = result.filter((post) => post.category === filter.category);
  if (filter.tag) result = result.filter((post) => post.tags.includes(filter.tag as string));
  if (typeof filter.featured === "boolean") result = result.filter((post) => post.featured === filter.featured);

  return result
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.publishedAt?.getTime() ?? b.createdAt.getTime()) - (a.publishedAt?.getTime() ?? a.createdAt.getTime()))
    .slice(0, filter.limit ?? 100);
}

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
  try {
    const posts = await blogPostsCollection();
    const query: Record<string, unknown> = {};
    if (filter.status) query.status = filter.status;
    if (filter.category) query.category = filter.category;
    if (filter.tag) query.tags = filter.tag;
    if (typeof filter.featured === "boolean") query.featured = filter.featured;

    const dbPosts = await posts
      .find(query)
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .limit(filter.limit ?? 100)
      .toArray();

    return dbPosts.length > 0 ? dbPosts : applyBlogFilter(staticBlogPosts(), filter);
  } catch {
    return applyBlogFilter(staticBlogPosts(), filter);
  }
}

export async function findBlogPostBySlug(slug: string, includeDrafts = false) {
  try {
    const posts = await blogPostsCollection();
    const post = await posts.findOne(includeDrafts ? { slug } : { slug, status: "published" });
    if (post) return post;
  } catch {
    // MongoDB yoksa GitHub icindeki statik seed icerigine dusulur.
  }

  return staticBlogPosts().find((post) => post.slug === slug && (includeDrafts || post.status === "published")) ?? null;
}

export async function findBlogPostById(id: string) {
  try {
    const posts = await blogPostsCollection();
    const post = await posts.findOne({ _id: toObjectId(id) });
    if (post) return post;
  } catch {
    // MongoDB yoksa statik icerik aranir.
  }

  return staticBlogPosts().find((post) => String(post._id) === id) ?? null;
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
  try {
    const posts = await blogPostsCollection();
    await posts.updateOne({ _id: toObjectId(id) }, { $inc: { viewCount: 1 } });
  } catch {
    // Statik GitHub iceriginde view count yazilamaz.
  }
}

export async function countBlogPosts() {
  try {
    const posts = await blogPostsCollection();
    const count = await posts.countDocuments();
    return count || staticBlogPosts().length;
  } catch {
    return staticBlogPosts().length;
  }
}
