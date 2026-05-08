import { createBrokerMessage } from "@/repositories/broker.repository";
import type { BrokerAdapter } from "@/server/broker/broker.types";

// Broker eventlerini MongoDB outbox koleksiyonuna yazar.
export const mongodbOutboxAdapter: BrokerAdapter = {
  async publish(event) {
    const id = await createBrokerMessage({
      topic: event.topic,
      deviceId: event.deviceId,
      payload: {
        type: event.type,
        ...event.payload
      },
      status: "queued"
    });
    return { id, status: "queued" };
  }
};
