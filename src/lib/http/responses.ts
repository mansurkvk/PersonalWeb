import { NextResponse } from "next/server";

export function jsonError(message = "Istek islenemedi.", status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, details }, { status });
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
