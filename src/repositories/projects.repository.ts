import { ObjectId } from "mongodb";
import { projectSeeds } from "@/config/content-seeds";
import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import type { ProjectDocument } from "@/types/database";

export type ProjectListFilter = {
  category?: string;
  technology?: string;
  featured?: boolean;
  limit?: number;
};

function staticId(index: number) {
  return new ObjectId(`200000000000000000000${String(index + 1).padStart(3, "0")}`);
}

function staticProjects(): ProjectDocument[] {
  const now = new Date("2026-01-01T00:00:00.000Z");
  return projectSeeds.map((project, index) => ({
    ...project,
    _id: staticId(index),
    createdAt: now,
    updatedAt: now
  }));
}

function applyProjectFilter(projects: ProjectDocument[], filter: ProjectListFilter = {}) {
  let result = [...projects];
  if (filter.category) result = result.filter((project) => project.category === filter.category);
  if (filter.technology) result = result.filter((project) => project.technologies.includes(filter.technology as string));
  if (typeof filter.featured === "boolean") result = result.filter((project) => project.featured === filter.featured);

  return result
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, filter.limit ?? 100);
}

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
  try {
    const projects = await projectsCollection();
    const query: Record<string, unknown> = {};
    if (filter.category) query.category = filter.category;
    if (filter.technology) query.technologies = filter.technology;
    if (typeof filter.featured === "boolean") query.featured = filter.featured;

    const dbProjects = await projects
      .find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(filter.limit ?? 100)
      .toArray();

    return dbProjects.length > 0 ? dbProjects : applyProjectFilter(staticProjects(), filter);
  } catch {
    return applyProjectFilter(staticProjects(), filter);
  }
}

export async function findProjectBySlug(slug: string) {
  try {
    const projects = await projectsCollection();
    const project = await projects.findOne({ slug });
    if (project) return project;
  } catch {
    // MongoDB yoksa GitHub icindeki statik seed icerigine dusulur.
  }

  return staticProjects().find((project) => project.slug === slug) ?? null;
}

export async function findProjectById(id: string) {
  try {
    const projects = await projectsCollection();
    const project = await projects.findOne({ _id: toObjectId(id) });
    if (project) return project;
  } catch {
    // MongoDB yoksa statik icerik aranir.
  }

  return staticProjects().find((project) => String(project._id) === id) ?? null;
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
  try {
    const projects = await projectsCollection();
    const count = await projects.countDocuments();
    return count || staticProjects().length;
  } catch {
    return staticProjects().length;
  }
}
