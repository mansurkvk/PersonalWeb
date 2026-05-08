import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";
import { listCommentsByUser } from "@/repositories/comments.repository";
import { findUserById } from "@/repositories/users.repository";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await readSession();
  if (!session) redirect("/login");

  const [user, comments] = await Promise.all([
    findUserById(session.userId).catch(() => null),
    listCommentsByUser(session.userId).catch(() => [])
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Profile</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Merhaba, {session.displayName}</h1>
      <p className="mt-3 text-slate-300">Rol: {session.role}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-white">Hesap bilgileri</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <p><span className="text-slate-500">Kullanici adi:</span> {user?.username ?? session.username}</p>
            <p><span className="text-slate-500">E-posta:</span> {user?.email ?? session.email}</p>
            <p><span className="text-slate-500">Durum:</span> {user?.isActive ? "Aktif" : "Bilinmiyor"}</p>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-white">Yorumlarin</h2>
          <div className="mt-5 grid gap-3">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-400">Henuz yorum yazmadin.</p>
            ) : comments.map((comment) => (
              <div key={String(comment._id)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-sm leading-6 text-slate-300">{comment.content}</p>
                <p className="mt-2 text-xs text-slate-500">{comment.status} | {comment.createdAt.toLocaleString("tr-TR")}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
