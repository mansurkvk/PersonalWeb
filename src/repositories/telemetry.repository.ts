import { getDb } from "@/lib/db/mongodb";
import type { TelemetryReadingDocument } from "@/types/database";

export async function telemetryReadingsCollection() {
  const db = await getDb();
  return db.collection<TelemetryReadingDocument>("telemetryReadings");
}

export async function insertTelemetryReading(input: Omit<TelemetryReadingDocument, "_id" | "createdAt">) {
  const readings = await telemetryReadingsCollection();
  const result = await readings.insertOne({ ...input, createdAt: new Date() });
  return result.insertedId.toHexString();
}

export async function listLatestReadings(limit = 20, deviceId?: string) {
  const readings = await telemetryReadingsCollection();
  return readings
    .find(deviceId ? { deviceId } : {})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function listTelemetryHistory(input: { deviceId?: string; from?: Date; to?: Date; limit?: number }) {
  const readings = await telemetryReadingsCollection();
  const query: Record<string, unknown> = {};
  if (input.deviceId) query.deviceId = input.deviceId;
  if (input.from || input.to) {
    query.createdAt = { ...(input.from ? { $gte: input.from } : {}), ...(input.to ? { $lte: input.to } : {}) };
  }
  return readings.find(query).sort({ createdAt: -1 }).limit(input.limit ?? 200).toArray();
}

export async function latestTelemetryReading() {
  const readings = await telemetryReadingsCollection();
  return readings.findOne({}, { sort: { createdAt: -1 } });
}
