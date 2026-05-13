# PersonalWeb / Harezmi Robotics

**Mansur Kavak | Engineering Lab Platform**

PersonalWeb, Mansur Kavak icin gelistirilen Next.js tabanli bir **portfolio + engineering lab + robotik urun vitrini + IoT telemetry platformudur**. Proje artik sadece kisisel portfolyo degil; robotik sistemler, IoT paketleri, teknik icerik, ESP32 veri akisi, admin paneli ve musteri iletisim surecini tek modular monolith mimaride birlestiren bir muhendislik platformudur.

Canli site hedefi:

```text
https://harezmirobotics.vercel.app/
```

Eski portfolio referansi:

```text
https://mansurkvk.netlify.app/
```

## Platform Kapsami

Bu repository su ana sistemleri icerir:

- Kisisel / kurumsal engineering lab ana sayfasi
- Info sayfasi
- Proje vitrini
- Blog ve teknik icerik yapisi
- Robotik ve IoT urun vitrini
- Product showroom / carousel deneyimi
- Urun odakli iletisim formu
- MongoDB destekli contact message kaydi
- Admin paneli
- Admin mesaj yonetimi
- ESP32 telemetry dashboard
- Mobil ESP dashboard arayuzu
- MongoDB native driver ile veri katmani
- JWT cookie tabanli auth sistemi
- Email outbox mimarisi
- Broker / telemetry altyapisina hazir modular monolith yapi

## Tech Stack

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- MongoDB native driver
- JWT cookie auth
- Resend entegrasyonu ve MongoDB email outbox
- Vercel deploy hedefi
- Modular monolith mimari

## Mimari Kurallar

Proje klasorleri bilincli olarak katmanlara ayrilmistir:

```text
src/app/              Route, layout ve API route handler katmani
src/components/       Ortak reusable UI componentleri
src/features/         Domain odakli UI ve feature componentleri
src/services/         Business logic katmani
src/repositories/     MongoDB okuma/yazma islemleri
src/lib/              Auth, db, rate limit, helper ve altyapi fonksiyonlari
src/config/           Statik site, seed ve urun konfigleri
src/types/            Paylasilan TypeScript tipleri
public/images/        Statik gorseller ve urun SVG konseptleri
```

Temel API akis kuralı:

```text
API route -> service -> repository -> MongoDB
```

`src/app/` icinde business logic tutulmaz. Route handler sadece request parse eder, session/guard okur, service fonksiyonunu cagirir ve response uretir.

## Ana Route'lar

| Route | Aciklama |
| --- | --- |
| `/` | Engineering lab ana sayfasi |
| `/info` | Mansur Kavak / platform bilgi sayfasi |
| `/projects` | Proje vitrini |
| `/blog` | Teknik blog ve icerik alani |
| `/esp` | ESP32 telemetry dashboard |
| `/products` | Robotik ve IoT urun vitrini |
| `/contact` | Urun veya ozel muhendislik talep formu |
| `/login` | Kullanici/admin girisi |
| `/register` | Kullanici kaydi |
| `/profile` | Kullanici profili |
| `/admin` | Admin dashboard |
| `/admin/messages` | Contact message yonetimi |

Admin ve normal kullanici tek login sayfasi olan `/login` uzerinden giris yapar. Admin rolune sahip kullanici `/admin` sayfasina, normal kullanici `/profile` sayfasina yonlendirilir. `/admin/login` adresi `/login` sayfasina redirect eder.

## Urun Vitrini

`/products` sayfasi Harezmi Robotics tarafini urun vitrini gibi konumlandirir.

### Robotik urunler

- Hexapod Robot
- Kopek Robot / Quadruped Dog Robot
- Drone
- Konveyor Bant
- Palet Tasima Robotu
- KUKA benzeri 6 DOF Robot Kol

### IoT paketleri

- IoT Basic
- IoT Pro
- IoT Ultra

Urun verileri `src/config/products.ts` icindedir. Urun gorselleri `public/images/products/*.svg` altindadir. Urun kartlarindaki CTA butonlari kullaniciyi urune bagli contact akisina yonlendirir:

```text
/contact?product=<product-slug>
```

Bu query ile `/contact` sayfasinda konu alani otomatik doldurulur ve secili urun form icinde gosterilir.

## Iletisim ve Contact Message Akisi

`/contact` sayfasi robotik urun talepleri, IoT telemetry cozumleri, teknik danismanlik ve ozel muhendislik sistemleri icin form sunar.

Form alanlari:

- Isim / kurum, opsiyonel
- E-posta, oturum yoksa zorunlu
- Konu
- Secili urun slug'i, opsiyonel
- Mesaj

Oturum varsa kullanicinin e-postasi session uzerinden okunur ve formda readonly bilgi olarak gosterilir. Oturum yoksa e-posta alani zorunlu input olarak gosterilir.

POST akisi:

```text
/contact form -> POST /api/contact -> contact.service.ts -> contact.repository.ts -> MongoDB contactMessages
```

`/api/contact` mevcut rate-limit katmanini kullanir ve kullanici girdilerini service katmaninda validate eder.

## MongoDB Koleksiyonlari

Baslica koleksiyonlar:

- `users`
- `authLogs`
- `blogPosts`
- `blogComments`
- `projects`
- `contactMessages`
- `telemetryDevices`
- `telemetryReadings`
- `emailOutbox`
- `auditLogs`
- `brokerMessages`
- `siteSettings`

### contactMessages semasi

`ContactMessageDocument` tipi `src/types/database.ts` icindedir.

```ts
export type ContactMessageDocument = {
  _id?: ObjectId;
  userId?: ObjectId;
  name?: string;
  email: string;
  subject: string;
  productSlug?: string;
  message: string;
  source: "contact-page" | "product-page";
  status: "new" | "read" | "replied" | "archived";
  createdAt: Date;
  updatedAt: Date;
};
```

Indexler `src/lib/db/indexes.ts` icinde olusturulur:

```ts
db.collection("contactMessages").createIndexes([
  { key: { status: 1, createdAt: -1 } },
  { key: { email: 1, createdAt: -1 } },
  { key: { productSlug: 1, createdAt: -1 } }
]);
```

## Admin Paneli

Admin paneli `/admin` altinda yer alir ve mevcut JWT session/auth helperlari ile korunur.

Admin alanlari:

- Dashboard istatistikleri
- Blog yonetimi
- Project yonetimi
- User yonetimi
- ESP device yonetimi
- Telemetry goruntuleme
- Broker mesajlari
- Blog comments
- Contact messages
- Settings

`/admin/messages` sayfasi iletisim formundan ve urun CTA'larindan gelen mesajlari listeler.

Mesaj durumlari:

- `new`
- `read`
- `replied`
- `archived`

Admin status update akisi:

```text
/admin/messages -> PATCH /api/admin/contact-messages/[id] -> contact.service.ts -> contact.repository.ts
```

Admin API route'lari `requireAdmin()` ile korunur.

## ESP32 / IoT Telemetry

ESP32 telemetry MVP akisi:

```text
ESP32 -> HTTP POST /api/iot/ingest -> telemetry service -> telemetry repository -> MongoDB -> /esp dashboard
```

Gelecek hedef mimari:

```text
ESP32 -> MQTT broker -> iot-gateway -> MongoDB -> realtime websocket dashboard
```

Broker ve telemetry kodlari, ileride MQTT / fleet / realtime dashboard mimarisine genisleyebilecek sekilde ayrik tutulur.

## API Routes

Baslica API route'lari:

| Route | Aciklama |
| --- | --- |
| `/api/contact` | Contact form submit ve MongoDB contactMessages kaydi |
| `/api/admin/contact-messages` | Admin mesaj listeleme |
| `/api/admin/contact-messages/[id]` | Admin mesaj status update |
| `/api/iot/ingest` | ESP32 telemetry ingest |
| `/api/iot/latest` | Son telemetry verisi |
| `/api/system/mongodb-ping` | MongoDB baglanti kontrolu |
| `/api/system/health` | Sistem saglik kontrolu |

Ek admin, auth, blog, project, broker ve queue route handlerlari `src/app/api` altindadir.

## Tasarim Dili

Site koyu engineering lab estetine sahiptir:

- Koyu zemin
- Glass panel yuzeyler
- `lab-border`
- `lab-grid`
- `engineering-surface`
- Cyan ve gold vurgu renkleri
- Telemetry / cockpit hissi
- Robotik teknik konsept gorselleri
- Mobilde yatay overflow kontrollu nav ve buyuk dokunma hedefleri

Global tasarim siniflari ve animasyonlar `src/app/globals.css` icindedir.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run seed
npm run dev
```

Windows PowerShell icin:

```powershell
Copy-Item .env.example .env.local
```

Yerel adres:

```text
http://localhost:3000
```

## Environment Variables

`.env.local` yerel gelistirme icindir ve GitHub'a gitmemelidir. `.env.example` sadece placeholder degerler icerir.

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_USERNAME`
- `SEED_ADMIN_DISPLAY_NAME`
- `SEED_ADMIN_PASSWORD`
- `ESP32_DEVICE_KEY`
- `CRON_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

`RESEND_API_KEY` bos birakilirsa email kayitlari `emailOutbox` koleksiyonunda `queued` olarak kalir.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run seed
npm run seed:content
npm run sync:notion
```

## Gelistirme Kontrol Listesi

Kod degisikligi sonrasinda:

```bash
npm run lint
npm run typecheck
npm run build
```

kontrol edilmelidir.

Ayrica:

- `.env.local`, `.next`, `node_modules`, `.vercel`, build klasorleri ve cache dosyalari commit edilmez.
- `.env.example` commit edilir.
- Gercek MongoDB URI, JWT secret, API key veya sifre kaynak kodda birakilmaz.
- Yeni API route'larda auth guard, rate limit veya validation ihtiyaci kontrol edilir.
- MongoDB'ye yazilan kayitlarda `createdAt` ve `updatedAt` standardi korunur.

## Vercel Deployment

1. GitHub reposunu Vercel'e import et.
2. Project Settings > Environment Variables altina gerekli degerleri ekle.
3. Build command olarak `npm run build` kullan.
4. Deploy sonrasinda `/api/system/health` ve `/api/system/mongodb-ping` endpointlerini kontrol et.
5. Seed islemini yerelde veya kontrollu bir ortamda `npm run seed` ile calistir.
6. Contact form testinde MongoDB `contactMessages` koleksiyonuna kayit dustugunu dogrula.
7. Admin kullaniciyla `/admin/messages` sayfasinda mesajlari goruntule ve status update akisini test et.

## GitHub Commands

```bash
git status
git add .
git commit -m "Prepare PersonalWeb for GitHub"
git branch -M main
git remote add origin REPO_URL
git push -u origin main
```
