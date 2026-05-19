import { telemetryFields } from "@/constants/categories";

// IoT alanlari dashboard, API ve dokumantasyon icin ortak kaynak olarak kullanilir.
export const iotConfig = {
  defaultDeviceId: "esp32-node-1",
  ingestEndpoint: "/api/iot/ingest",
  refreshMs: 5_000,
  telemetryFields,
  futureFlow: "ESP32 -> MQTT broker -> Python bridge -> MongoDB Atlas -> dashboard"
} as const;