import Link from "next/link";
import { AdminShell } from "@/features/admin/admin-shell";
import { listProjects } from "@/repositories/projects.repository";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listProjects({ limit: 200 }).catch(() => []);

  return (
    <AdminShell title="Proje Yonetimi" description="Vitrin projelerini ve teknik etiketleri yonet.">
      <Link href="/admin/projects/new" className="mb-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Yeni proje</Link>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={String(project._id)} className="glass-panel rounded-[1.6rem] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-[#8bd3dd]">{project.category} | {project.status}</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{project.title}</h2>
              </div>
              <Link href={`/admin/projects/${String(project._id)}/edit`} className="text-sm text-[#8bd3dd] hover:text-white">Duzenle</Link>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
