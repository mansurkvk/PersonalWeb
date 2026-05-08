import { AdminShell } from "@/features/admin/admin-shell";
import { BlogPostForm } from "@/features/admin/admin-forms";

export default function NewBlogPage() {
  return (
    <AdminShell title="Yeni Blog Yazisi">
      <BlogPostForm />
    </AdminShell>
  );
}
