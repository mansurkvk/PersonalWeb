import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/mongodb";
import type { EmailOutboxDocument } from "@/types/database";

export type QueueAdapter<T> = {
  enqueue(item: T): Promise<string>;
  process(limit?: number): Promise<number>;
};

export type EmailQueueItem = {
  to: string;
  subject: string;
  body: string;
  template?: string;
};

export async function enqueueEmail(item: EmailQueueItem) {
  const now = new Date();
  const db = await getDb();
  const result = await db.collection<EmailOutboxDocument>("emailOutbox").insertOne({
    ...item,
    status: "queued",
    tryCount: 0,
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId.toHexString();
}

export async function markEmailSent(id: ObjectId) {
  const db = await getDb();
  await db.collection<EmailOutboxDocument>("emailOutbox").updateOne(
    { _id: id },
    { $set: { status: "sent", updatedAt: new Date(), sentAt: new Date() }, $unset: { lastError: "" } }
  );
}

export async function markEmailFailed(id: ObjectId, error: string) {
  const db = await getDb();
  await db.collection<EmailOutboxDocument>("emailOutbox").updateOne(
    { _id: id },
    { $set: { status: "failed", lastError: error, updatedAt: new Date() }, $inc: { tryCount: 1 } }
  );
}

export async function listQueuedEmails(limit = 10) {
  const db = await getDb();
  return db.collection<EmailOutboxDocument>("emailOutbox").find({ status: "queued" }).sort({ createdAt: 1 }).limit(limit).toArray();
}
