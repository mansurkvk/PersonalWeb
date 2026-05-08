import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { deleteUser, findUserById, updateUser } from "@/repositories/users.repository";
import type { UserRole } from "@/types/database";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const user = await findUserById(id);
    if (!user) return jsonError("Kullanici bulunamadi.", 404);

    const safeUser = Object.fromEntries(Object.entries(user).filter(([key]) => key !== "passwordHash"));
    return NextResponse.json({ ok: true, dataSource: process.env.DATA_SOURCE ?? "static", user: safeUser });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kullanici alinamadi.", 401);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();

    const patch: {
      username?: string;
      email?: string;
      displayName?: string;
      role?: UserRole;
      isActive?: boolean;
      bio?: string;
      avatarUrl?: string;
    } = {};

    if (typeof body.username === "string") patch.username = body.username.toLowerCase().trim();
    if (typeof body.email === "string") patch.email = body.email.toLowerCase().trim();
    if (typeof body.displayName === "string") patch.displayName = body.displayName.trim();
    if (body.role === "admin" || body.role === "user") patch.role = body.role;
    if (typeof body.isActive === "boolean") patch.isActive = body.isActive;
    if (typeof body.bio === "string") patch.bio = body.bio;
    if (typeof body.avatarUrl === "string") patch.avatarUrl = body.avatarUrl;

    await updateUser(id, patch);
    return NextResponse.json({ ok: true, dataSource: process.env.DATA_SOURCE ?? "static" });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kullanici guncellenemedi.", 400);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await deleteUser(id);
    return NextResponse.json({ ok: true, dataSource: process.env.DATA_SOURCE ?? "static" });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kullanici silinemedi.", 400);
  }
}
