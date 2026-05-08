# Architecture

PersonalWeb, Mansur Kavak Engineering Lab icin hazirlanan modular monolith bir Next.js uygulamasidir. Uygulama tek repoda kalir, fakat dosya sinirlari frontend/backend ayrimina uygun olacak sekilde duzenlenmistir.

## Moduler Monolith

Bu yapi su an tek Vercel projesi olarak calisir. Ileride trafik veya ekip ihtiyaci artarsa ayni domain mantigi korunarak frontend, API ve IoT gateway ayri servisler haline getirilebilir.

Olasi gelecek ayrim:

- `apps/web`: Next.js frontend
- `apps/api`: Auth, admin, blog ve project API katmani
- `apps/iot-gateway`: HTTP/MQTT telemetry ingest servisi
- `packages/shared`: Ortak type, validator ve config
- `packages/ui`: Ortak UI bilesenleri

## Klasor Gorevleri

- `src/app`: Sadece route, page, layout, loading, error ve route handler dosyalari.
- `src/components`: Ortak UI ve layout bilesenleri.
- `src/features`: Belirli urun alanlarina ait UI. ESP dashboard `src/features/esp-dashboard` altindadir.
- `src/services`: Is mantigi ve akislari. API route handlerlari agir isi buraya devreder.
- `src/repositories`: MongoDB CRUD ve query fonksiyonlari.
- `src/server`: Sadece server tarafinda calisan altyapi kodlari.
- `src/server/broker`: Broker abstraction ve adapter dosyalari.
- `src/lib`: DB baglantisi, auth, validator, queue, email ve genel yardimci fonksiyonlar.
- `src/config`: Site, IoT ve tema konfigurasyonlari.
- `src/types`: Ortak veri kontratlari.
- `src/constants`: Sabit kategori ve domain degerleri.

## Auth Akisi

Tek login sayfasi `/login` adresidir. Admin ve normal kullanici ayni formdan girer.

- `role: "admin"` olan kullanici `/admin` sayfasina gider.
- `role: "user"` olan kullanici `/profile` sayfasina gider.
- `/admin/login` eski adresi korunur ve `/login` sayfasina redirect eder.

JWT httpOnly cookie icinde tutulur. Middleware `/admin/*` ve `/profile` route'larini korur; route handler ve servis katmanlari da kritik yetki kontrollerini yapmaya devam etmelidir.

## IoT Akisi

```text
ESP32 -> POST /api/iot/ingest -> telemetry.service -> telemetry.repository -> MongoDB telemetryReadings -> /esp dashboard
```

Telemetry akisi HTTP ingest ile baslar. Gelen veri MongoDB'ye yazilir ve dashboard belirli araliklarla `/api/iot/latest` endpointinden son verileri okur.

## Broker Akisi

Broker kodu `src/server/broker` altindadir. Su an MongoDB outbox modeli kullanilir. Gelecekte MQTT, Redis, Upstash, QStash veya WebSocket eklemek icin adapter yapisi hazirdir.
