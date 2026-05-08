import { notFound } from "next/navigation";
import { AdminShell } from "@/features/admin/admin-shell";
import { ProjectForm } from "@/features/admin/admin-forms";
import { findProjectById } from "@/repositories/projects.repository";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await findProjectById(id).catch(() => null);
  if (!project) notFound();

  return (
    <AdminShell title="Proje Duzenle">
      <ProjectForm
        id={id}
        initial={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description,
          coverImage: project.coverImage,
          images: project.images,
          technologies: project.technologies,
          category: project.category,
          status: project.status,
          links: project.links,
          featured: project.featured
        }}
      />
    </AdminShell>
  );
}
