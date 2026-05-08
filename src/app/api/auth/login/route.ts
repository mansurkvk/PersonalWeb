import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/auth/token";
import { getClientIp, jsonError } from "@/lib/http/responses";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";
import { loginUser } from "@/services/auth.service";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`login:${ip}`, 10, 60_000);
  if (!limited.ok) return jsonError("Cok fazla giris denemesi.", 429);

  const input = loginSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Gecersiz giris bilgisi.", 400, input.error.flatten());

  try {
    const { sessionToken, payload } = await loginUser({
      ...input.data,
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined
    });

    const response = NextResponse.json({
      ok: true,
      role: payload.role,
      redirectTo: payload.role === "admin" ? "/admin" : "/profile"
    });

    response.cookies.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch {
    return jsonError("Giris bilgileri hatali.", 401);
  }
}
