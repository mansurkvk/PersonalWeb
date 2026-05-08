import { AdminShell } from "@/features/admin/admin-shell";
import { listUsers } from "@/repositories/users.repository";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await listUsers().catch(() => []);

  return (
    <AdminShell title="Kullanici Yonetimi">
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={String(user._id)} className="glass-panel rounded-[1.6rem] p-5">
            <p className="text-lg font-semibold text-white">{user.displayName}</p>
            <p className="mt-1 text-sm text-slate-400">{user.username} | {user.email} | {user.role}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
