import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import type { TelemetryDeviceDocument } from "@/types/database";

export async function telemetryDevicesCollection() {
  const db = await getDb();
  return db.collection<TelemetryDeviceDocument>("telemetryDevices");
}

export async function createTelemetryDevice(input: Omit<TelemetryDeviceDocument, "_id" | "createdAt" | "updatedAt">) {
  const now = new Date();
  const devices = await telemetryDevicesCollection();
  const result = await devices.insertOne({
    ...input,
    isActive: input.isActive ?? true,
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId.toHexString();
}

export async function listTelemetryDevices() {
  const devices = await telemetryDevicesCollection();
  return devices.find().sort({ lastSeenAt: -1, updatedAt: -1, createdAt: -1 }).toArray();
}

export async function findTelemetryDeviceByDeviceId(deviceId: string) {
  const devices = await telemetryDevicesCollection();
  return devices.findOne({ deviceId });
}

export async function updateTelemetryDeviceSeen(deviceId: string, patch?: { firmwareVersion?: string; locationLabel?: string }) {
  const devices = await telemetryDevicesCollection();
  await devices.updateOne(
    { deviceId },
    {
      $set: {
        ...patch,
        lastSeenAt: new Date(),
        updatedAt: new Date()
      }
    }
  );
}

export async function deleteTelemetryDevice(id: string) {
  const devices = await telemetryDevicesCollection();
  await devices.deleteOne({ _id: toObjectId(id) });
}

export async function countTelemetryDevices() {
  const devices = await telemetryDevicesCollection();
  return devices.countDocuments();
}
