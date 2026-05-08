import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import type { ProjectDocument } from "@/types/database";

export type ProjectListFilter = {
  category?: string;
  technology?: string;
  featured?: boolean;
  limit?: number;
};

export async function projectsCollection() {
  const db = await getDb();
  return db.collection<ProjectDocument>("projects");
}

export async function createProject(input: Omit<ProjectDocument, "_id" | "createdAt" | "updatedAt">) {
  const now = new Date();
  const projects = await projectsCollection();
  const result = await projects.insertOne({
    ...input,
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId.toHexString();
}

export async function listProjects(filter: ProjectListFilter = {}) {
  const projects = await projectsCollection();
  const query: Record<string, unknown> = {};
  if (filter.category) query.category = filter.category;
  if (filter.technology) query.technologies = filter.technology;
  if (typeof filter.featured === "boolean") query.featured = filter.featured;

  return projects
    .find(query)
    .sort({ featured: -1, createdAt: -1 })
    .limit(filter.limit ?? 100)
    .toArray();
}

export async function findProjectBySlug(slug: string) {
  const projects = await projectsCollection();
  return projects.findOne({ slug });
}

export async function findProjectById(id: string) {
  const projects = await projectsCollection();
  return projects.findOne({ _id: toObjectId(id) });
}

export async function updateProject(id: string, patch: Partial<ProjectDocument>) {
  const projects = await projectsCollection();
  await projects.updateOne({ _id: toObjectId(id) }, { $set: { ...patch, updatedAt: new Date() } });
}

export async function deleteProject(id: string) {
  const projects = await projectsCollection();
  await projects.deleteOne({ _id: toObjectId(id) });
}

export async function countProjects() {
  const projects = await projectsCollection();
  return projects.countDocuments();
}
