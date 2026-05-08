import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { commentSchema } from "@/lib/validators";
import { createBlogComment, listCommentsByPost } from "@/repositories/comments.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  if (!postId) return jsonError("postId gerekli.", 400);

  const comments = await listCommentsByPost(postId, searchParams.get("all") !== "true");
  return NextResponse.json({ ok: true, comments: serializeMongoArray(comments) });
}

export async function POST(request: Request) {
  let session;
  try {
    session = await requireUser();
  } catch {
    return jsonError("Yorum yazmak icin giris gerekli.", 401);
  }

  const input = commentSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Yorum verisi gecersiz.", 400, input.error.flatten());

  const id = await createBlogComment({
    ...input.data,
    userId: session.userId,
    authorName: session.displayName || session.username
  });
  return NextResponse.json({ ok: true, id });
}
