import { NextResponse } from "next/server";
import { serializeMongo } from "@/lib/utils/serialize";
import { getLiveTelemetry } from "@/services/telemetry.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getLiveTelemetry();
    return NextResponse.json(serializeMongo({ ok: true, ...snapshot, serverTime: new Date() }), {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
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
