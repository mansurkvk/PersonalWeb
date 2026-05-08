import { NextResponse } from "next/server";
import { createSessionToken, sessionCookieName } from "@/lib/auth/token";
import { getClientIp, jsonError } from "@/lib/http/responses";
import { checkRateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validators";
import { registerUser } from "@/services/auth.service";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`register:${ip}`, 6, 60_000);
  if (!limited.ok) return jsonError("Cok fazla kayit denemesi.", 429);

  const input = registerSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Kayit bilgileri gecersiz.", 400, input.error.flatten());

  try {
    const payload = await registerUser(input.data);
    const token = await createSessionToken(payload);
    const response = NextResponse.json({ ok: true, role: payload.role, redirectTo: "/profile" });

    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kayit tamamlanamadi.", 409);
  }
}
