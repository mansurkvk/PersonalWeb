import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jsonError } from "@/lib/http/responses";
import { serializeMongoArray } from "@/lib/utils/serialize";
import { blogPostInputSchema } from "@/lib/validators";
import { listBlogPosts } from "@/repositories/blog.repository";
import { createAdminBlogPost } from "@/services/content.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const posts = await listBlogPosts({
    status: searchParams.get("status") === "draft" ? "draft" : "published",
    category: searchParams.get("category") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    limit: Number(searchParams.get("limit") ?? 100)
  });
  return NextResponse.json({ ok: true, posts: serializeMongoArray(posts) });
}

export async function POST(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return jsonError("Admin yetkisi gerekli.", 403);
  }

  const input = blogPostInputSchema.safeParse(await request.json());
  if (!input.success) return jsonError("Blog verisi gecersiz.", 400, input.error.flatten());

  const id = await createAdminBlogPost({ data: input.data, authorId: session.userId });
  return NextResponse.json({ ok: true, id });
}
