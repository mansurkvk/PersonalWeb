import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { commentModerationSchema } from "@/lib/validators";
import { createAuditLog } from "@/repositories/audit.repository";
import { deleteComment, updateCommentStatus } from "@/repositories/comments.repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const { id } = await params;
  const input = commentModerationSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Yorum durumu gecersiz.", 400, input.error.flatten());

  await updateCommentStatus(id, input.data.status);
  await createAuditLog({ actorUserId: session.userId, action: "comment.moderate", entityType: "blogComment", entityId: id });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const { id } = await params;
  await deleteComment(id);
  await createAuditLog({ actorUserId: session.userId, action: "comment.delete", entityType: "blogComment", entityId: id });
  return NextResponse.json({ ok: true });
}
