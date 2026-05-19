import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createAuditLog } from "@/repositories/audit.repository";
import {
  createTelemetryDevice,
  findTelemetryDeviceByDeviceId,
  listTelemetryDevices,
  updateTelemetryDeviceSeen
} from "@/repositories/devices.repository";
import { insertTelemetryReading, listLivePerformance, listLiveReadings } from "@/repositories/telemetry.repository";
import { publishBrokerEvent } from "@/server/broker/broker.service";
import type { TelemetryReadingDocument } from "@/types/database";

export async function createDevice(input: {
  deviceId: string;
  name: string;
  description?: string;
  deviceKey?: string;
  type: string;
  location?: string;
  locationLabel?: string;
  firmwareVersion?: string;
  isActive: boolean;
  actorUserId: string;
}) {
  const id = await createTelemetryDevice({
    deviceId: input.deviceId,
    name: input.name,
    description: input.description,
    deviceKeyHash: input.deviceKey ? await hashPassword(input.deviceKey) : undefined,
    type: input.type,
    location: input.location,
    locationLabel: input.locationLabel ?? input.location,
    firmwareVersion: input.firmwareVersion,
    isActive: input.isActive
  });
  await createAuditLog({ actorUserId: input.actorUserId, action: "device.create", entityType: "telemetryDevice", entityId: id });
  return id;
}

async function validateDeviceKey(deviceId: string, deviceKey: string | null) {
  const globalKey = process.env.ESP32_DEVICE_KEY;
  if (globalKey && deviceKey === globalKey) return true;

  const device = await findTelemetryDeviceByDeviceId(deviceId);
  if (!device || !device.isActive || !device.deviceKeyHash || !deviceKey) return false;
  return verifyPassword(deviceKey, device.deviceKeyHash);
}

export async function ingestTelemetry(input: {
  deviceKey: string | null;
  payload: Omit<TelemetryReadingDocument, "_id" | "createdAt">;
}) {
  const allowed = await validateDeviceKey(input.payload.deviceId, input.deviceKey);
  if (!allowed) throw new Error("Cihaz anahtari gecersiz.");

  const id = await insertTelemetryReading(input.payload);
  await updateTelemetryDeviceSeen(input.payload.deviceId, {
    firmwareVersion: input.payload.firmwareVersion,
    locationLabel: input.payload.locationLabel
  }).catch(() => undefined);

  await publishBrokerEvent({
    topic: `devices.${input.payload.deviceId}.readings`,
    type: "sensor.reading.created",
    deviceId: input.payload.deviceId,
    payload: { id, ...input.payload }
  });
  return id;
}

export async function getLiveTelemetry() {
  const [devices, readings, performance] = await Promise.all([
    listTelemetryDevices().catch(() => []),
    listLiveReadings().catch(() => []),
    listLivePerformance().catch(() => [])
  ]);

  return {
    devices,
    readings,
    performance,
    meta: {
      source: readings.length > 0 ? "mongodb-live" : "sample-fallback",
      hasLiveData: readings.length > 0,
      packetsUpdated: readings.length,
      performanceUpdated: performance.length
    }
  };
}
