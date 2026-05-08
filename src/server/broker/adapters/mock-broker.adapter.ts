import type { BrokerAdapter } from "@/server/broker/broker.types";

// Yerel gelistirme icin broker eventini yalnizca loglar.
export const mockBrokerAdapter: BrokerAdapter = {
  async publish(event) {
    console.log("[broker:mock]", JSON.stringify(event));
    return { status: "processed" };
  }
};
