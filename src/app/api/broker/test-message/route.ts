import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { publishTestBrokerMessage } from "@/server/broker/broker.service";

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const result = await publishTestBrokerMessage();
  return NextResponse.json({ ok: true, result });
}
