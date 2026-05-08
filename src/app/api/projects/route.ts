import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { projectInputSchema } from "@/lib/validators";
import { listProjects } from "@/repositories/projects.repository";
import { createAdminProject } from "@/services/content.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projects = await listProjects({
    category: searchParams.get("category") ?? undefined,
    technology: searchParams.get("technology") ?? undefined,
    limit: Number(searchParams.get("limit") ?? 100)
  });
  return NextResponse.json({ ok: true, projects: serializeMongoArray(projects) });
}

export async function POST(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const input = projectInputSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Proje verisi gecersiz.", 400, input.error.flatten());

  const id = await createAdminProject({ data: input.data, actorUserId: session.userId });
  return NextResponse.json({ ok: true, id });
}
