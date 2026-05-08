import type { BrokerAdapter } from "@/server/broker/broker.types";

// MQTT gecisi icin placeholder adapter; ileride gercek broker client buraya baglanir.
export const mqttPlaceholderAdapter: BrokerAdapter = {
  async publish(event) {
    console.log("[broker:mqtt-placeholder]", JSON.stringify(event));
    return { status: "queued" };
  }
};
