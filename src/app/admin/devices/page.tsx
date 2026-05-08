import { AdminShell } from "@/features/admin/admin-shell";
import { DeviceForm } from "@/features/admin/admin-forms";
import { listTelemetryDevices } from "@/repositories/devices.repository";

export const dynamic = "force-dynamic";

export default async function AdminDevicesPage() {
  const devices = await listTelemetryDevices().catch(() => []);

  return (
    <AdminShell title="ESP Cihaz Yonetimi" description="ESP32 veya robot sensor cihazlarini ekle ve durumlarini izle.">
      <DeviceForm />
      <div className="mt-6 grid gap-4">
        {devices.map((device) => (
          <div key={String(device._id)} className="glass-panel rounded-[1.6rem] p-5">
            <p className="text-lg font-semibold text-white">{device.name}</p>
            <p className="mt-1 text-sm text-slate-400">{device.deviceId} | {device.type} | {device.isActive ? "active" : "inactive"}</p>
            <p className="mt-1 text-xs text-slate-500">Last seen: {device.lastSeenAt?.toLocaleString("tr-TR") ?? "N/A"}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
