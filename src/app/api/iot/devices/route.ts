import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { telemetryDeviceInputSchema } from "@/lib/validators";
import { listTelemetryDevices } from "@/repositories/devices.repository";
import { createDevice } from "@/services/telemetry.service";

export async function GET() {
  const devices = await listTelemetryDevices();
  return NextResponse.json({ ok: true, devices: serializeMongoArray(devices) });
}

export async function POST(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const input = telemetryDeviceInputSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Cihaz verisi gecersiz.", 400, input.error.flatten());

  const id = await createDevice({ ...input.data, actorUserId: session.userId });
  return NextResponse.json({ ok: true, id });
}
