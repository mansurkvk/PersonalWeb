import { AdminShell } from "@/features/admin/admin-shell";
import { ProjectForm } from "@/features/admin/admin-forms";

export default function NewProjectPage() {
  return (
    <AdminShell title="Yeni Proje">
      <ProjectForm />
    </AdminShell>
  );
}
