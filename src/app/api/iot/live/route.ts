import { NextResponse } from "next/server";
import { serializeMongo } from "@/lib/utils/serialize";
import { getLiveTelemetry } from "@/services/telemetry.service";

export const dynamic = "force-dynamic";

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

  return {
    ...reading,
    deviceId: String(data.deviceId ?? reading.deviceId ?? "unknown-device"),
    temperature: num(data.lm35TempC) ?? num(data.dhtTempC) ?? num(data.temperature),
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
    createdAt: String(reading.updatedAt ?? reading.createdAt ?? new Date().toISOString())
  };
}

export async function GET() {
  try {
    const snapshot = await getLiveTelemetry();
    const serialized = serializeMongo({ ok: true, ...snapshot, serverTime: new Date() }) as AnyRecord;
    const readings = Array.isArray(serialized.readings) ? (serialized.readings as AnyRecord[]).map(normalizeReading) : [];
    const performance = Array.isArray(serialized.performance) ? serialized.performance : [];

    return NextResponse.json(
      {
        ...serialized,
        readings,
        performance
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        devices: [],
        readings: [],
        performance: [],
        error: error instanceof Error ? error.message : "Live telemetry okunamadi."
      },
      { status: 500 }
    );
  }
}
