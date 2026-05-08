import { AdminShell } from "@/features/admin/admin-shell";
import { SettingsForm } from "@/features/admin/admin-forms";
import { getSiteSettings } from "@/repositories/site-settings.repository";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell title="Site Ayarlari" description="Ilk surumde dark tema varsayilan; metinler sonradan tr/en yapisina genisletilebilir.">
      <SettingsForm
        initial={{
          siteTitle: settings.siteTitle,
          siteDescription: settings.siteDescription,
          heroTitle: settings.heroTitle,
          heroSubtitle: settings.heroSubtitle,
          oldSiteUrl: settings.oldSiteUrl,
          theme: settings.theme
        }}
      />
    </AdminShell>
  );
}
