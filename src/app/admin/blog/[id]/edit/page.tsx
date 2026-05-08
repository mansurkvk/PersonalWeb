import { notFound } from "next/navigation";
import { AdminShell } from "@/features/admin/admin-shell";
import { BlogPostForm } from "@/features/admin/admin-forms";
import { findBlogPostById } from "@/repositories/blog.repository";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await findBlogPostById(id).catch(() => null);
  if (!post) notFound();

  return (
    <AdminShell title="Blog Duzenle">
      <BlogPostForm
        id={id}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          tags: post.tags,
          category: post.category,
          status: post.status,
          featured: post.featured
        }}
      />
    </AdminShell>
  );
}
