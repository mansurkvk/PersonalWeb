import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { serializeMongo } from "@/lib/utils/serialize";
import { blogPostInputSchema } from "@/lib/validators";
import { deleteBlogPost, findBlogPostBySlug } from "@/repositories/blog.repository";
import { createAuditLog } from "@/repositories/audit.repository";
import { updateAdminBlogPost } from "@/services/content.service";

export async function GET(_request: Request, { params }: { params: Promise<{ identifier: string }> }) {
  const { identifier } = await params;
  const post = await findBlogPostBySlug(identifier);
  if (!post) return jsonError("Blog yazisi bulunamadi.", 404);
  return NextResponse.json({ ok: true, post: serializeMongo(post) });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ identifier: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const { identifier } = await params;
  const input = blogPostInputSchema.partial().safeParse(await request.json());
  if (!input.success) return jsonError("Blog verisi gecersiz.", 400, input.error.flatten());

  await updateAdminBlogPost({ id: identifier, data: input.data, actorUserId: session.userId });
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
  await deleteBlogPost(identifier);
  await createAuditLog({ actorUserId: session.userId, action: "blog.delete", entityType: "blogPost", entityId: identifier });
  return NextResponse.json({ ok: true });
}
