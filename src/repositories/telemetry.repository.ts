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

function readingSort() {
  return { updatedAt: -1, cloudReceivedAtMs: -1, brokerReceivedAtMs: -1, createdAt: -1 } as const;
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
      .sort((a, b) => (b.updatedAt?.getTime?.() ?? b.createdAt?.getTime?.() ?? 0) - (a.updatedAt?.getTime?.() ?? a.createdAt?.getTime?.() ?? 0))
      .slice(0, limit);
  }

  try {
    const readings = await telemetryReadingsCollection();
    const query: Record<string, unknown> = { packetType: "telemetry" };
    if (deviceId) query.deviceId = deviceId;

    return readings.find(query).sort(readingSort()).limit(limit).toArray();
  } catch {
    const store = await getStaticStore();
    return store.telemetryReadings
      .filter((reading) => !deviceId || reading.deviceId === deviceId)
      .sort((a, b) => (b.updatedAt?.getTime?.() ?? b.createdAt?.getTime?.() ?? 0) - (a.updatedAt?.getTime?.() ?? a.createdAt?.getTime?.() ?? 0))
      .slice(0, limit);
  }
}

export async function listTelemetryHistory(input: { deviceId?: string; from?: Date; to?: Date; limit?: number }) {
  if (isStaticDataOnly()) {
    const store = await getStaticStore();
    return store.telemetryReadings
      .filter((reading) => !input.deviceId || reading.deviceId === input.deviceId)
      .filter((reading) => !input.from || (reading.createdAt ? reading.createdAt >= input.from : true))
      .filter((reading) => !input.to || (reading.createdAt ? reading.createdAt <= input.to : true))
      .sort((a, b) => (b.updatedAt?.getTime?.() ?? b.createdAt?.getTime?.() ?? 0) - (a.updatedAt?.getTime?.() ?? a.createdAt?.getTime?.() ?? 0))
      .slice(0, input.limit ?? 200);
  }

  try {
    const readings = await telemetryReadingsCollection();
    const query: Record<string, unknown> = { packetType: "telemetry" };
    if (input.deviceId) query.deviceId = input.deviceId;
    if (input.from || input.to) {
      query.updatedAt = { ...(input.from ? { $gte: input.from } : {}), ...(input.to ? { $lte: input.to } : {}) };
    }
    return readings.find(query).sort(readingSort()).limit(input.limit ?? 200).toArray();
  } catch {
    const store = await getStaticStore();
    return store.telemetryReadings
      .filter((reading) => !input.deviceId || reading.deviceId === input.deviceId)
      .filter((reading) => !input.from || (reading.createdAt ? reading.createdAt >= input.from : true))
      .filter((reading) => !input.to || (reading.createdAt ? reading.createdAt <= input.to : true))
      .sort((a, b) => (b.updatedAt?.getTime?.() ?? b.createdAt?.getTime?.() ?? 0) - (a.updatedAt?.getTime?.() ?? a.createdAt?.getTime?.() ?? 0))
      .slice(0, input.limit ?? 200);
  }
}

export async function latestTelemetryReading() {
  const readings = await listLatestReadings(1);
  return readings[0] ?? null;
}
