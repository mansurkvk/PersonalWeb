export type BrokerEventType =
  | "sensor.reading.created"
  | "email.queued"
  | "user.created"
  | "admin.action"
  | "broker.test";

export type BrokerEvent = {
  topic: string;
  type: BrokerEventType;
  deviceId?: string;
  payload: Record<string, unknown>;
};

export type BrokerAdapter = {
  publish(event: BrokerEvent): Promise<{ id?: string; status: "queued" | "processed" | "failed" }>;
};
