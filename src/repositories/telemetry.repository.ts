import { getDb } from "@/lib/db/mongodb";
import { getStaticStore, nextStaticObjectId } from "@/server/static-data/static-store";
import type { TelemetryReadingDocument } from "@/types/database";

function isStaticDataOnly() {
  return process.env.DATA_SOURCE !== "mongodb";
}

export async function telemetryReadingsCollection() {
  const db = await getDb();
  return db.collection<TelemetryReadingDocument>("telemetryReadings");
}

export async function insertTelemetryReading(input: Omit<TelemetryReadingDocument, "_id" | "createdAt">) {
  if (isStaticDataOnly()) {
    const store = await getStaticStore();
    const reading: TelemetryReadingDocument = { ...input, _id: nextStaticObjectId(7), createdAt: new Date() };
    store.telemetryReadings.unshift(reading);
    return String(reading._id);
  }

  const readings = await telemetryReadingsCollection();
  const result = await readings.insertOne({ ...input, createdAt: new Date() });
  return result.insertedId.toHexString();
}

export async function listLatestReadings(limit = 20, deviceId?: string) {
  if (isStaticDataOnly()) {
    const store = await getStaticStore();
    return store.telemetryReadings
      .filter((reading) => !deviceId || reading.deviceId === deviceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  try {
    const readings = await telemetryReadingsCollection();
    const dbReadings = await readings
      .find(deviceId ? { deviceId } : {})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return dbReadings;
  } catch {
    const store = await getStaticStore();
    return store.telemetryReadings
      .filter((reading) => !deviceId || reading.deviceId === deviceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export async function listTelemetryHistory(input: { deviceId?: string; from?: Date; to?: Date; limit?: number }) {
  if (isStaticDataOnly()) {
    const store = await getStaticStore();
    return store.telemetryReadings
      .filter((reading) => !input.deviceId || reading.deviceId === input.deviceId)
      .filter((reading) => !input.from || reading.createdAt >= input.from)
      .filter((reading) => !input.to || reading.createdAt <= input.to)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, input.limit ?? 200);
  }

  try {
    const readings = await telemetryReadingsCollection();
    const query: Record<string, unknown> = {};
    if (input.deviceId) query.deviceId = input.deviceId;
    if (input.from || input.to) {
      query.createdAt = { ...(input.from ? { $gte: input.from } : {}), ...(input.to ? { $lte: input.to } : {}) };
    }
    return readings.find(query).sort({ createdAt: -1 }).limit(input.limit ?? 200).toArray();
  } catch {
    const store = await getStaticStore();
    return store.telemetryReadings
      .filter((reading) => !input.deviceId || reading.deviceId === input.deviceId)
      .filter((reading) => !input.from || reading.createdAt >= input.from)
      .filter((reading) => !input.to || reading.createdAt <= input.to)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, input.limit ?? 200);
  }
}

export async function latestTelemetryReading() {
  const readings = await listLatestReadings(1);
  return readings[0] ?? null;
}
