import { AdminShell } from "@/features/admin/admin-shell";
import { getAdminStats } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await getAdminStats().catch(() => ({
    userCount: 0,
    blogCount: 0,
    projectCount: 0,
    commentCount: 0,
    deviceCount: 0,
    brokerMessageCount: 0,
    latestTelemetry: null
  }));

  const cards = [
    { label: "Users", value: stats.userCount },
    { label: "Blog", value: stats.blogCount },
    { label: "Projects", value: stats.projectCount },
    { label: "Comments", value: stats.commentCount },
    { label: "ESP Devices", value: stats.deviceCount },
    { label: "Broker Messages", value: stats.brokerMessageCount },
    { label: "Last telemetry", value: stats.latestTelemetry?.deviceId ?? "N/A" }
  ];

  return (
    <AdminShell title="Admin Dashboard" description="Icerik, kullanici, yorum, ESP cihaz ve telemetry akisini yoneten sade control plane.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <section key={card.label} className="glass-panel rounded-[2rem] p-6">
            <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{card.value}</p>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
