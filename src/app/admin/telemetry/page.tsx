import { AdminShell } from "@/features/admin/admin-shell";
import { listLatestReadings } from "@/repositories/telemetry.repository";

export const dynamic = "force-dynamic";

export default async function AdminTelemetryPage() {
  const readings = await listLatestReadings(100).catch(() => []);

  return (
    <AdminShell title="Telemetry Verileri" description="ESP32 ve robot sensorlerinden gelen son okumalar.">
      <div className="grid gap-4">
        {readings.length === 0 ? (
          <div className="glass-panel rounded-[1.6rem] p-6 text-sm text-slate-400">Henuz telemetry verisi yok.</div>
        ) : readings.map((reading) => (
          <div key={String(reading._id)} className="glass-panel rounded-[1.6rem] p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{reading.deviceId}</p>
                <p className="text-sm text-slate-400">
                  {reading.temperature ?? "N/A"} C | {reading.humidity ?? "N/A"}% | {reading.voltage ?? "N/A"}V | {reading.deviceStatus ?? "unknown"}
                </p>
              </div>
              <p className="text-xs text-slate-500">{reading.createdAt.toLocaleString("tr-TR")}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
