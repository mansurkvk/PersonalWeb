import { NextResponse } from "next/server";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { listTelemetryHistory } from "@/repositories/telemetry.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const readings = await listTelemetryHistory({
    deviceId: searchParams.get("deviceId") ?? undefined,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
    limit: Number(searchParams.get("limit") ?? 200)
  });
  return NextResponse.json({ ok: true, readings: serializeMongoArray(readings) });
}
