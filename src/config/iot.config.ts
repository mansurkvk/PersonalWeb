import { telemetryFields } from "@/constants/categories";

// IoT alanlari dashboard, API ve dokumantasyon icin ortak kaynak olarak kullanilir.
export const iotConfig = {
  defaultDeviceId: "esp32-lab-01",
  ingestEndpoint: "/api/iot/ingest",
  refreshMs: 10_000,
  telemetryFields,
  futureFlow: "ESP32 -> MQTT broker -> iot-gateway -> MongoDB -> realtime dashboard"
} as const;
