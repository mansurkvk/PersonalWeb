import Link from "next/link";
import { AdminShell } from "@/features/admin/admin-shell";
import { listBlogPosts } from "@/repositories/blog.repository";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await listBlogPosts({ limit: 200 }).catch(() => []);

  return (
    <AdminShell title="Blog Yonetimi" description="Blog yazilarini olustur, duzenle ve yayin durumunu kontrol et.">
      <Link href="/admin/blog/new" className="mb-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Yeni blog</Link>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={String(post._id)} className="glass-panel rounded-[1.6rem] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-[#8bd3dd]">{post.category} | {post.status}</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{post.title}</h2>
              </div>
              <Link href={`/admin/blog/${String(post._id)}/edit`} className="text-sm text-[#8bd3dd] hover:text-white">Duzenle</Link>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
