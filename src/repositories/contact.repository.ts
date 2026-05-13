import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import type { ContactMessageDocument, ContactMessageStatus } from "@/types/database";

export type ContactMessageListFilter = {
  status?: ContactMessageStatus;
  limit?: number;
};

export async function contactMessagesCollection() {
  const db = await getDb();
  return db.collection<ContactMessageDocument>("contactMessages");
}

export async function createContactMessage(input: Omit<ContactMessageDocument, "_id" | "createdAt" | "updatedAt" | "status">) {
  const now = new Date();
  const messages = await contactMessagesCollection();
  const result = await messages.insertOne({
    ...input,
    status: "new",
    createdAt: now,
    updatedAt: now
  });

  return result.insertedId.toHexString();
}

export async function listContactMessages(filter: ContactMessageListFilter = {}) {
  const messages = await contactMessagesCollection();
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;

  return messages
    .find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(filter.limit ?? 100, 250))
    .toArray();
}

export async function getContactMessageById(id: string) {
  const messages = await contactMessagesCollection();
  return messages.findOne({ _id: toObjectId(id) });
}

export async function updateContactMessageStatus(id: string, status: ContactMessageStatus) {
  const messages = await contactMessagesCollection();
  await messages.updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        status,
        updatedAt: new Date()
      }
    }
  );
}

export async function countContactMessages(status?: ContactMessageStatus) {
  try {
    const messages = await contactMessagesCollection();
    return messages.countDocuments(status ? { status } : {});
  } catch {
    return 0;
  }
}
