import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { serializeMongo } from "@/lib/utils/serialize";
import { projectInputSchema } from "@/lib/validators";
import { createAuditLog } from "@/repositories/audit.repository";
import { deleteProject, findProjectBySlug } from "@/repositories/projects.repository";
import { updateAdminProject } from "@/services/content.service";

export async function GET(_request: Request, { params }: { params: Promise<{ identifier: string }> }) {
  const { identifier } = await params;
  const project = await findProjectBySlug(identifier);
  if (!project) return jsonError("Proje bulunamadi.", 404);
  return NextResponse.json({ ok: true, project: serializeMongo(project) });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ identifier: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const { identifier } = await params;
  const input = projectInputSchema.partial().safeParse(await request.json());
  if (!input.success) return jsonError("Proje verisi gecersiz.", 400, input.error.flatten());

  await updateAdminProject({ id: identifier, data: input.data, actorUserId: session.userId });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ identifier: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const { identifier } = await params;
  await deleteProject(identifier);
  await createAuditLog({ actorUserId: session.userId, action: "project.delete", entityType: "project", entityId: identifier });
  return NextResponse.json({ ok: true });
}
