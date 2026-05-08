import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/mongodb";
import type { BrokerMessageDocument, BrokerMessageStatus } from "@/types/database";

export async function brokerMessagesCollection() {
  const db = await getDb();
  return db.collection<BrokerMessageDocument>("brokerMessages");
}

export async function createBrokerMessage(input: {
  topic: string;
  deviceId?: string;
  payload: Record<string, unknown>;
  status?: BrokerMessageStatus;
}) {
  const messages = await brokerMessagesCollection();
  const result = await messages.insertOne({
    topic: input.topic,
    deviceId: input.deviceId,
    payload: input.payload,
    status: input.status ?? "queued",
    createdAt: new Date()
  });
  return result.insertedId.toHexString();
}

export async function listBrokerMessages(limit = 100, deviceId?: string) {
  const messages = await brokerMessagesCollection();
  return messages
    .find(deviceId ? { deviceId } : {})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function countBrokerMessages() {
  const messages = await brokerMessagesCollection();
  return messages.countDocuments();
}

export async function updateBrokerMessageStatus(id: string, status: BrokerMessageStatus) {
  const messages = await brokerMessagesCollection();
  await messages.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, processedAt: status === "processed" ? new Date() : undefined } }
  );
}
