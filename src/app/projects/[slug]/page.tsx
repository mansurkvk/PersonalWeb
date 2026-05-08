import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { findProjectBySlug } from "@/repositories/projects.repository";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await findProjectBySlug(slug).catch(() => null);
  if (!project) notFound();

  const links = [
    { label: "GitHub", href: project.links.github },
    { label: "Demo", href: project.links.demo },
    { label: "Article", href: project.links.article },
    { label: "Old Site", href: project.links.oldSite || siteConfig.links.oldSite }
  ].filter((item) => item.href);

  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono-lab text-sm uppercase tracking-[0.35em] text-[#8bd3dd]">{project.category}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{project.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{project.summary}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{tech}</span>
        ))}
      </div>

      <div className="prose prose-invert prose-cyan mt-10 max-w-none whitespace-pre-wrap leading-8">{project.description}</div>

      {links.length ? (
        <div className="mt-10 flex flex-wrap gap-3">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm text-slate-100 hover:bg-white/10">
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
