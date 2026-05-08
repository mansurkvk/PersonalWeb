import { getDb } from "@/lib/db/mongodb";
import { toObjectId, tryObjectId } from "@/lib/db/object-id";
import type { BlogCommentDocument, BlogCommentStatus } from "@/types/database";

export async function blogCommentsCollection() {
  const db = await getDb();
  return db.collection<BlogCommentDocument>("blogComments");
}

export async function createBlogComment(input: {
  postId: string;
  userId: string;
  parentCommentId?: string;
  authorName: string;
  content: string;
}) {
  const now = new Date();
  const comments = await blogCommentsCollection();
  const result = await comments.insertOne({
    postId: toObjectId(input.postId),
    userId: toObjectId(input.userId),
    parentCommentId: tryObjectId(input.parentCommentId) ?? undefined,
    authorName: input.authorName,
    content: input.content,
    status: "visible",
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId.toHexString();
}

export async function listCommentsByPost(postId: string, visibleOnly = true) {
  const comments = await blogCommentsCollection();
  return comments
    .find({ postId: toObjectId(postId), ...(visibleOnly ? { status: "visible" } : {}) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function listCommentsByUser(userId: string) {
  const comments = await blogCommentsCollection();
  return comments.find({ userId: toObjectId(userId) }).sort({ createdAt: -1 }).limit(50).toArray();
}

export async function listAllComments(limit = 100) {
  const comments = await blogCommentsCollection();
  return comments.find().sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function updateCommentStatus(id: string, status: BlogCommentStatus) {
  const comments = await blogCommentsCollection();
  await comments.updateOne({ _id: toObjectId(id) }, { $set: { status, updatedAt: new Date() } });
}

export async function deleteComment(id: string) {
  const comments = await blogCommentsCollection();
  await comments.deleteOne({ _id: toObjectId(id) });
}

export async function countComments() {
  const comments = await blogCommentsCollection();
  return comments.countDocuments();
}
