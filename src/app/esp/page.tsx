import { serializeMongoArray } from "@/lib/utils/serialize";
import { listTelemetryDevices } from "@/repositories/devices.repository";
import { listLatestReadings } from "@/repositories/telemetry.repository";
import { EspDashboardResponsiveClient } from "@/features/esp-dashboard/esp-dashboard-responsive-client";
import type { EspDevice, EspReading } from "@/features/esp-dashboard/esp-dashboard-client";

export const dynamic = "force-dynamic";

export default async function EspDashboardPage() {
  const [readings, devices] = await Promise.all([
    listLatestReadings(40).catch(() => []),
    listTelemetryDevices().catch(() => [])
  ]);

  return (
    <EspDashboardResponsiveClient
      initialReadings={serializeMongoArray(readings) as unknown as EspReading[]}
      devices={serializeMongoArray(devices) as unknown as EspDevice[]}
    />
  );
}
