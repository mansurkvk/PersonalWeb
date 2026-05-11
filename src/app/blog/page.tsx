import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { siteConfig } from "@/config/site";
import { listBlogPosts } from "@/repositories/blog.repository";

export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ category?: string; tag?: string }> }) {
  const params = (await searchParams) ?? {};
  const posts = await listBlogPosts({ status: "published", category: params.category, tag: params.tag }).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Blog</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Düşünce, Deneyim ve Üretim</h1>
        <p className="mt-4 text-slate-300">Harezmi Robotics ve IoT Sistemlerinin blok sayfasına hoşgeldiniz. Yorum yapmak için lütfen giriş yapınız.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {siteConfig.blogCategories.map((category) => (
          <Link key={category} href={`/blog?category=${encodeURIComponent(category)}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white">
            {category}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState title="Henuz yayinlanmis yazi yok" description="Admin panelinden ilk blog yazisi yayinlandiginda burada gorunecek." />
          </div>
        ) : (
          posts.map((post) => (
            <article key={String(post._id)} className="glass-panel lab-border rounded-[2rem] p-6">
              <p className="font-mono-lab text-xs uppercase tracking-[0.28em] text-[#8bd3dd]">{post.category}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{post.title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-slate-300">{tag}</span>
                ))}
              </div>
              <Link href={`/blog/${post.slug}`} className="mt-5 inline-block text-[#8bd3dd] hover:text-white">
                Devamini oku
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
