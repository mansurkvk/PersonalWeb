# ESP32

PersonalWeb icinde ESP32 telemetry verileri HTTP endpoint uzerinden alinir ve MongoDB'ye yazilir.

## Ingest Endpoint

```text
POST /api/iot/ingest
```

Headers:

```text
content-type: application/json
x-device-key: ESP32_DEVICE_KEY
```

`x-device-key` degeri `.env.local` veya Vercel Environment Variables icindeki `ESP32_DEVICE_KEY` ile eslesmelidir. Admin panelinden cihaz bazli key olusturuldugunda key hash olarak saklanir.

## Ornek Payload

```json
{
  "deviceId": "esp32-lab-01",
  "temperature": 31.2,
  "humidity": 48.5,
  "pressure": 1012.4,
  "voltage": 4.92,
  "current": 0.42,
  "batteryPercent": 86,
  "signalStrength": -57,
  "distance": 23.8,
  "motionState": "idle",
  "deviceStatus": "online",
  "uptime": 120,
  "errorCode": "",
  "firmwareVersion": "1.0.0",
  "locationLabel": "Engineering Lab",
  "source": "http",
  "rawPayload": {
    "source": "esp32"
  }
}
```

## Dashboard Akisi

```text
ESP32 -> /api/iot/ingest -> telemetryReadings -> /api/iot/latest -> /esp dashboard
```

`/esp` sayfasi ilk yuklemede server tarafindan son kayitlari okur. Client tarafinda belirli araliklarla `/api/iot/latest` endpointine istek atilir ve son telemetry verileri guncellenir.

## Guvenlik

- Production device key kaynak koda yazilmaz.
- `ESP32_DEVICE_KEY` Vercel env icinde saklanir.
- Payload icinde kisisel veri veya gizli bilgi gonderilmez.
- `rawPayload` debug icin kullanilir, bu yuzden sade tutulmalidir.

## Arduino Ornegi

ESP32 icin basit HTTP POST ornegi:

```text
esp32/esp32-post-example.ino
```
