import { NextResponse } from "next/server";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { listLatestReadings } from "@/repositories/telemetry.repository";

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as AnyRecord) : {};
}

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeReading(reading: AnyRecord) {
  const data = {
    ...asRecord(reading.rawPayload),
    ...asRecord(reading.normalized),
    ...asRecord(reading.data),
    ...reading
  };

  const inaCurrentmA = num(data.inaCurrentmA) ?? num(data.currentmA);
  const currentA = num(data.currentA) ?? (typeof inaCurrentmA === "number" ? inaCurrentmA / 1000 : num(data.current));
  const temperature = num(data.lm35TempC) ?? num(data.dhtTempC) ?? num(data.temperature);
  const createdAt = reading.updatedAt ?? reading.createdAt;

  return {
    ...reading,
    deviceId: String(data.deviceId ?? reading.deviceId ?? "unknown-device"),
    temperature,
    humidity: num(data.dhtHumidity) ?? num(data.humidity),
    voltage: num(data.inaBusV) ?? num(data.voltage),
    current: currentA,
    signalStrength: num(data.wifiRssi) ?? num(data.signal) ?? num(data.signalStrength),
    motionState: String(data.motionState ?? data.nodeType ?? data.packetType ?? "idle"),
    deviceStatus: String(data.status ?? (data.edgeValid === false ? "edge-warning" : "online")),
    firmwareVersion: String(data.firmwareVersion ?? "mqtt-bridge"),
    locationLabel: String(data.locationLabel ?? "Engineering Lab"),
    source: String(data.source ?? reading.source ?? "mqtt-bridge"),
    rawPayload: data,
    createdAt
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 20);
  const deviceId = searchParams.get("deviceId") ?? undefined;
  const readings = await listLatestReadings(Number.isFinite(limit) ? limit : 20, deviceId);
  const serialized = serializeMongoArray(readings) as unknown as AnyRecord[];
  return NextResponse.json({ ok: true, readings: serialized.map(normalizeReading) });
}
