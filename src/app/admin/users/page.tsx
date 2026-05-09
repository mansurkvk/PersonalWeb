import { redirect } from "next/navigation";
import { AdminShell } from "@/features/admin/admin-shell";
import { readSession } from "@/lib/auth/session";
import { listUsers } from "@/repositories/users.repository";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await readSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/profile");

  const users = await listUsers().catch(() => []);

  return (
    <AdminShell title="Kullanici Yonetimi" description="Yerel database veya MongoDB uzerindeki kayitli kullanicilari goruntule.">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
        <div className="grid grid-cols-4 gap-4 border-b border-white/10 px-5 py-3 font-mono-lab text-xs uppercase tracking-[0.22em] text-slate-500">
          <span>Kullanici</span>
          <span>E-posta</span>
          <span>Rol</span>
          <span>Durum</span>
        </div>
        <div className="divide-y divide-white/10">
          {users.map((user) => (
            <div key={String(user._id)} className="grid grid-cols-1 gap-2 px-5 py-4 text-sm text-slate-300 md:grid-cols-4 md:gap-4">
              <div>
                <p className="font-semibold text-white">{user.displayName}</p>
                <p className="text-xs text-slate-500">@{user.username}</p>
              </div>
              <p>{user.email}</p>
              <p>{user.role}</p>
              <p>{user.isActive ? "Aktif" : "Pasif"}</p>
            </div>
          ))}
          {users.length === 0 ? <p className="px-5 py-6 text-sm text-slate-400">Kayitli kullanici bulunamadi.</p> : null}
        </div>
      </div>
    </AdminShell>
  );
}
