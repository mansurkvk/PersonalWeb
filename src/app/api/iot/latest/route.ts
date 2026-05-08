import { NextResponse } from "next/server";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { listLatestReadings } from "@/repositories/telemetry.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 20);
  const deviceId = searchParams.get("deviceId") ?? undefined;
  const readings = await listLatestReadings(Number.isFinite(limit) ? limit : 20, deviceId);
  return NextResponse.json({ ok: true, readings: serializeMongoArray(readings) });
}
