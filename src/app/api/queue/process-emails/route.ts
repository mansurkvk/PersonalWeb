import { NextResponse } from "next/server";
import { jsonError } from "@/lib/http/responses";
import { processQueuedEmails } from "@/services/email.service";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return jsonError("Yetkisiz cron istegi.", 401);

  const processed = await processQueuedEmails(10);
  return NextResponse.json({ ok: true, processed });
}
