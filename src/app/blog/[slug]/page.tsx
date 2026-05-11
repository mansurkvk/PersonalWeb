import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { readSession } from "@/lib/auth/session";
import { findBlogPostBySlug, incrementBlogPostViews } from "@/repositories/blog.repository";
import { listCommentsByPost } from "@/repositories/comments.repository";
import { CommentForm } from "@/components/blog/comment-form";

export const dynamic = "force-dynamic";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProductionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  const vercelDeploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const url = configuredUrl || (vercelProductionUrl ? `https://${vercelProductionUrl}` : undefined) || (vercelDeploymentUrl ? `https://${vercelDeploymentUrl}` : undefined) || "https://harezmirobotics.vercel.app";

  return url.replace(/\/+$/, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogPostBySlug(slug).catch(() => null);
  const siteUrl = getSiteUrl();

  if (!post) {
    return {
      title: "Blog yazisi bulunamadi",
      robots: { index: false, follow: false }
    };
  }

  const canonicalPath = `/blog/${post.slug}`;
  const image = post.coverImage || "/images/hero.png";

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.title, post.category, ...post.tags, "Mansur Kavak", "mekatronik", "robotik", "ESP32", "IoT"],
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}${canonicalPath}`,
      siteName: siteConfig.title,
      locale: "tr_TR",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [siteConfig.owner.name],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image]
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await readSession();
  const post = await findBlogPostBySlug(slug).catch(() => null);
  if (!post || !post._id) notFound();

  await incrementBlogPostViews(String(post._id)).catch(() => undefined);
  const comments = await listCommentsByPost(String(post._id)).catch(() => []);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono-lab text-sm uppercase tracking-[0.35em] text-[#8bd3dd]">{post.category}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">{post.title}</h1>
      <p className="mt-4 text-lg leading-8 text-slate-300">{post.excerpt}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{tag}</span>
        ))}
      </div>
      <div className="prose prose-invert prose-cyan mt-10 max-w-none whitespace-pre-wrap leading-8">{post.content}</div>

      <section className="mt-14 border-t border-white/10 pt-8">
        <h2 className="text-2xl font-semibold text-white">Yorumlar</h2>
        <CommentForm postId={String(post._id)} isLoggedIn={Boolean(session)} />

        <div className="mt-8 grid gap-4">
          {comments.length === 0 ? (
            <p className="text-sm text-slate-400">Henuz yorum yok.</p>
          ) : comments.map((comment) => (
            <div key={String(comment._id)} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-medium text-white">{comment.authorName}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
