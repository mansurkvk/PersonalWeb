import "server-only";
import { httpIngestAdapter } from "@/server/broker/adapters/http-ingest.adapter";
import { mockBrokerAdapter } from "@/server/broker/adapters/mock-broker.adapter";
import { mongodbOutboxAdapter } from "@/server/broker/adapters/mongodb-outbox.adapter";
import { mqttPlaceholderAdapter } from "@/server/broker/adapters/mqtt-placeholder.adapter";
import type { BrokerAdapter, BrokerEvent } from "@/server/broker/broker.types";

function getBrokerAdapter(): BrokerAdapter {
  const driver = process.env.BROKER_DRIVER ?? "mongodb";
  if (driver === "mock" || driver === "memory") return mockBrokerAdapter;
  if (driver === "http") return httpIngestAdapter;
  if (driver === "mqtt") return mqttPlaceholderAdapter;
  return mongodbOutboxAdapter;
}

export async function publishBrokerEvent(event: BrokerEvent) {
  return getBrokerAdapter().publish(event);
}

export async function publishTestBrokerMessage() {
  return publishBrokerEvent({
    topic: "system.broker.test",
    type: "broker.test",
    payload: {
      message: "Broker test message",
      createdAt: new Date().toISOString()
    }
  });
}
