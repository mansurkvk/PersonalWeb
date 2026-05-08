import { NextResponse } from "next/server";
import { getClientIp, jsonError } from "@/lib/http/responses";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators";
import { queueContactEmail } from "@/services/email.service";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`contact:${ip}`, 5, 60_000);
  if (!limited.ok) return jsonError("Cok fazla mesaj denemesi.", 429);

  const input = contactSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Mesaj formati gecersiz.", 400, input.error.flatten());

  const id = await queueContactEmail(input.data);
  return NextResponse.json({ ok: true, id });
}
