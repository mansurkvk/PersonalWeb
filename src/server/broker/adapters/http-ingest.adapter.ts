import type { BrokerAdapter } from "@/server/broker/broker.types";

// Harici HTTP broker/webhook servislerine event aktarmak icin kullanilir.
export const httpIngestAdapter: BrokerAdapter = {
  async publish(event) {
    const url = process.env.BROKER_WEBHOOK_URL;
    if (!url) throw new Error("BROKER_WEBHOOK_URL tanimli degil.");

    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.BROKER_WEBHOOK_TOKEN ?? ""}`
      },
      body: JSON.stringify(event)
    });

    return { status: "processed" };
  }
};
