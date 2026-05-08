/*
  ESP32 ornek veri gonderimi.
  WiFi baglantisi kurar ve Next.js API endpointine telemetry payload yollar.
  SITE_URL degerini Vercel adresinle degistir:
  https://senin-site.vercel.app/api/iot/ingest
*/

#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID = "WIFI_ADI";
const char* WIFI_PASSWORD = "WIFI_SIFRESI";
const char* SITE_URL = "http://localhost:3000/api/iot/ingest";
const char* DEVICE_KEY = "change_this_device_key";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi baglandi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SITE_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-key", DEVICE_KEY);

    String body = "{";
    body += "\"deviceId\":\"esp32-lab-01\",";
    body += "\"temperature\":31.2,";
    body += "\"humidity\":48.5,";
    body += "\"pressure\":1012.4,";
    body += "\"voltage\":4.92,";
    body += "\"current\":0.42,";
    body += "\"batteryPercent\":86,";
    body += "\"signalStrength\":-57,";
    body += "\"distance\":23.8,";
    body += "\"motionState\":\"idle\",";
    body += "\"deviceStatus\":\"online\",";
    body += "\"uptime\":";
    body += String(millis() / 1000);
    body += ",";
    body += "\"firmwareVersion\":\"1.0.0\",";
    body += "\"locationLabel\":\"Engineering Lab\",";
    body += "\"source\":\"http\",";
    body += "\"rawPayload\":{\"source\":\"esp32-post-example\"}";
    body += "}";

    int code = http.POST(body);

    Serial.print("HTTP code: ");
    Serial.println(code);
    Serial.println(http.getString());
    http.end();
  }

  delay(5000);
}
