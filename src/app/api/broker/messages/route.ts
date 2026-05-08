import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { listBrokerMessages } from "@/repositories/broker.repository";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 100);
  const deviceId = searchParams.get("deviceId") ?? undefined;
  const messages = await listBrokerMessages(Number.isFinite(limit) ? limit : 100, deviceId);
  return NextResponse.json({ ok: true, messages: serializeMongoArray(messages) });
}
