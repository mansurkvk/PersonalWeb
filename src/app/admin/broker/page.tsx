import { AdminShell } from "@/features/admin/admin-shell";
import { listBrokerMessages } from "@/repositories/broker.repository";

export const dynamic = "force-dynamic";

export default async function AdminBrokerPage() {
  const messages = await listBrokerMessages(120).catch(() => []);

  return (
    <AdminShell title="Broker Mesajlari" description="MQTT, HTTP ingest, MongoDB outbox ve gelecek realtime adapter akislari icin mesaj izleme alani.">
      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="glass-panel rounded-[1.6rem] p-6 text-sm text-slate-400">Henuz broker mesaji yok.</div>
        ) : messages.map((message) => (
          <div key={String(message._id)} className="glass-panel rounded-[1.6rem] p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">{message.topic}</p>
                <p className="mt-2 text-sm text-slate-400">{message.deviceId ?? "system"} | {message.status}</p>
              </div>
              <p className="text-xs text-slate-500">{message.createdAt.toLocaleString("tr-TR")}</p>
            </div>
            <pre className="mt-4 max-h-44 overflow-auto rounded-2xl bg-black/25 p-4 text-xs text-slate-300">
              {JSON.stringify(message.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
