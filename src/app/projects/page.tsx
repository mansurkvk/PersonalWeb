import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { siteConfig } from "@/config/site";
import { listProjects } from "@/repositories/projects.repository";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams?: Promise<{ category?: string; technology?: string }> }) {
  const params = (await searchParams) ?? {};
  const projects = await listProjects({ category: params.category, technology: params.technology }).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Projects</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Robotik, IoT, AI ve fizik odakli proje vitrini.</h1>
        <p className="mt-4 text-slate-300">Featured projeler, teknoloji etiketleri ve detay sayfalari MongoDB uzerinden yonetilir.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {siteConfig.projectCategories.map((category) => (
          <Link key={category} href={`/projects?category=${encodeURIComponent(category)}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white">
            {category}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState title="Henuz proje kaydi yok" description="Seed komutu veya admin panelinden proje eklendiginde burada gorunecek." />
          </div>
        ) : (
          projects.map((project) => (
            <article key={String(project._id)} className="glass-panel lab-border rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono-lab text-xs uppercase tracking-[0.28em] text-[#8bd3dd]">{project.category}</p>
                {project.featured ? <span className="rounded-full bg-[#d5b46a]/15 px-3 py-1 text-xs text-[#f3d88a]">Featured</span> : null}
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{project.title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{project.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-slate-300">{tech}</span>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`} className="mt-5 inline-block text-[#8bd3dd] hover:text-white">
                Detaylari gor
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
