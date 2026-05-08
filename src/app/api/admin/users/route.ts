import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { createUser, listUsers } from "@/repositories/users.repository";

export async function GET() {
  try {
    await requireAdmin();
    const users = await listUsers();
    return NextResponse.json({ ok: true, dataSource: process.env.DATA_SOURCE ?? "static", users });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kullanicilar alinamadi.", 401);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const username = String(body.username ?? "").toLowerCase().trim();
    const email = String(body.email ?? "").toLowerCase().trim();
    const displayName = String(body.displayName ?? "").trim();
    const password = String(body.password ?? "");
    const role = body.role === "admin" ? "admin" : "user";

    if (username.length < 3 || !email.includes("@") || displayName.length < 2 || password.length < 6) {
      return jsonError("Kullanici bilgileri gecersiz.", 400);
    }

    const userId = await createUser({
      username,
      email,
      displayName,
      role,
      passwordHash: await hashPassword(password)
    });

    return NextResponse.json({ ok: true, dataSource: process.env.DATA_SOURCE ?? "static", userId });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kullanici olusturulamadi.", 400);
  }
}
