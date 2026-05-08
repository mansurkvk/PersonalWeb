import { toObjectId } from "@/lib/db/object-id";
import { slugify } from "@/lib/slug";
import { createAuditLog } from "@/repositories/audit.repository";
import { createBlogPost, updateBlogPost } from "@/repositories/blog.repository";
import { createProject, updateProject } from "@/repositories/projects.repository";
import type { BlogPostDocument, ProjectDocument } from "@/types/database";

function cleanStringList(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

export async function createAdminBlogPost(input: {
  data: {
    title: string;
    slug?: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    tags: string[];
    category: string;
    status: "draft" | "published";
    featured: boolean;
  };
  authorId: string;
}) {
  const now = new Date();
  const id = await createBlogPost({
    ...input.data,
    slug: slugify(input.data.slug || input.data.title),
    tags: cleanStringList(input.data.tags),
    authorId: toObjectId(input.authorId),
    publishedAt: input.data.status === "published" ? now : undefined
  });
  await createAuditLog({ actorUserId: input.authorId, action: "blog.create", entityType: "blogPost", entityId: id });
  return id;
}

export async function updateAdminBlogPost(input: { id: string; data: Partial<BlogPostDocument>; actorUserId: string }) {
  const patch = { ...input.data };
  if (patch.slug) patch.slug = slugify(patch.slug);
  if (patch.tags) patch.tags = cleanStringList(patch.tags);
  await updateBlogPost(input.id, patch);
  await createAuditLog({ actorUserId: input.actorUserId, action: "blog.update", entityType: "blogPost", entityId: input.id });
}

export async function createAdminProject(input: {
  data: {
    title: string;
    slug?: string;
    summary: string;
    description: string;
    coverImage?: string;
    images: string[];
    technologies: string[];
    category: string;
    status: "idea" | "prototype" | "active" | "archived";
    links: ProjectDocument["links"];
    featured: boolean;
  };
  actorUserId: string;
}) {
  const id = await createProject({
    ...input.data,
    slug: slugify(input.data.slug || input.data.title),
    images: cleanStringList(input.data.images),
    technologies: cleanStringList(input.data.technologies),
    links: input.data.links ?? {},
    featured: input.data.featured
  });
  await createAuditLog({ actorUserId: input.actorUserId, action: "project.create", entityType: "project", entityId: id });
  return id;
}

export async function updateAdminProject(input: { id: string; data: Partial<ProjectDocument>; actorUserId: string }) {
  const patch = { ...input.data };
  if (patch.slug) patch.slug = slugify(patch.slug);
  if (patch.images) patch.images = cleanStringList(patch.images);
  if (patch.technologies) patch.technologies = cleanStringList(patch.technologies);
  await updateProject(input.id, patch);
  await createAuditLog({ actorUserId: input.actorUserId, action: "project.update", entityType: "project", entityId: input.id });
}
