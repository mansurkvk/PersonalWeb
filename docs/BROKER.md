# Broker

PersonalWeb su an HTTP ingest + MongoDB modelini kullanir. Bu model Vercel uzerinde ek broker servisi olmadan calisir ve ESP32 verilerini kalici olarak saklar.

## Mevcut Akis

```text
ESP32 -> POST /api/iot/ingest -> telemetry.service -> MongoDB telemetryReadings
```

Broker eventleri icin MongoDB outbox kullanilir:

```text
service event -> broker.service -> mongodb-outbox.adapter -> brokerMessages
```

## Konum

```text
src/server/broker/
  broker.types.ts
  broker.service.ts
  adapters/
    mock-broker.adapter.ts
    mongodb-outbox.adapter.ts
    mqtt-placeholder.adapter.ts
    http-ingest.adapter.ts
```

## Adapter Mantigi

`broker.service.ts`, `BROKER_DRIVER` degerine gore adapter secer. Varsayilan guvenli secim `mongodb` davranisidir.

- `mongodb`: Eventleri `brokerMessages` koleksiyonuna yazar.
- `mock` veya `memory`: Lokal gelistirmede log uretir.
- `http`: Eventleri `BROKER_WEBHOOK_URL` adresine iletir.
- `mqtt`: Gelecekte gercek MQTT client icin placeholder olarak durur.

## Gelecek Secenekleri

Bu yapi su servislerin eklenmesine uygundur:

- MQTT broker: HiveMQ Cloud, EMQX Cloud veya Mosquitto
- Queue/cache: Redis, Upstash Redis veya QStash
- Realtime: WebSocket, Server-Sent Events veya managed realtime servisleri

Gelecekte ideal akis:

```text
ESP32 -> MQTT broker -> iot gateway -> MongoDB -> realtime dashboard
```

## API

Admin session gerektiren broker endpointleri:

```text
GET /api/broker/messages
POST /api/broker/test-message
```
