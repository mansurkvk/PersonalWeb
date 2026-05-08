import { NextResponse } from "next/server";
import { getClientIp, jsonError } from "@/lib/http/responses";
import { checkRateLimit } from "@/lib/rate-limit";
import { telemetryReadingSchema } from "@/lib/validators";
import { ingestTelemetry } from "@/services/telemetry.service";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`iot:${ip}`, 120, 60_000);
  if (!limited.ok) return jsonError("Telemetry istek limiti asildi.", 429);

  const body = await request.json();
  const input = telemetryReadingSchema.safeParse(body);
  if (!input.success) return jsonError("Sensor verisi gecersiz.", 400, input.error.flatten());

  try {
    const id = await ingestTelemetry({
      deviceKey: request.headers.get("x-device-key") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null,
      payload: {
        ...input.data,
        source: input.data.source ?? "http",
        rawPayload: input.data.rawPayload ?? input.data.payload ?? body
      }
    });
    return NextResponse.json({ ok: true, id });
  } catch {
    return jsonError("Cihaz anahtari gecersiz.", 401);
  }
}
