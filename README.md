# PersonalWeb

Mansur Kavak | Engineering Lab

Personal website + IoT telemetry dashboard + engineering lab platform.

PersonalWeb, Mansur Kavak icin gelistirilen Next.js tabanli modular monolith bir platformdur. Ana kapsam kisisel site, blog, proje vitrini, admin paneli, ESP32 telemetry akisi ve MongoDB destekli engineering lab altyapisidir.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- MongoDB native driver
- JWT cookie auth
- Resend entegrasyonu ve MongoDB email outbox
- Vercel deploy hedefi

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
```

## Main Routes

- `/`
- `/info`
- `/projects`
- `/blog`
- `/esp`
- `/login`
- `/register`
- `/admin`

Admin ve normal kullanici tek login sayfasi olan `/login` uzerinden giris yapar. Admin rolune sahip kullanici `/admin` sayfasina, normal kullanici `/profile` sayfasina yonlendirilir. `/admin/login` adresi `/login` sayfasina redirect eder.

## API Routes

- `/api/iot/ingest`
- `/api/iot/latest`
- `/api/system/mongodb-ping`
- `/api/system/health`

Ek admin, auth, blog, project, broker ve queue route handlerlari `src/app/api` altindadir.

## GitHub Upload Checklist

- `.env.local`, `.next`, `node_modules`, `.vercel`, build klasorleri ve cache dosyalari commit edilmez.
- `.env.example` commit edilir.
- `npm run typecheck`, `npm run lint` ve `npm run build` calistirilir.
- `git status --ignored` ile ignore kurallari kontrol edilir.
- Gercek MongoDB URI, JWT secret, API key veya sifre kaynak kodda birakilmaz.

## Vercel Deployment

1. GitHub reposunu Vercel'e import et.
2. Project Settings > Environment Variables altina gerekli degerleri ekle.
3. Build command olarak `npm run build` kullan.
4. Deploy sonrasinda `/api/system/health` ve `/api/system/mongodb-ping` endpointlerini kontrol et.
5. Seed islemini yerelde veya kontrollu bir ortamda `npm run seed` ile calistir.

## GitHub Commands

```bash
git status
git add .
git commit -m "Prepare PersonalWeb for GitHub"
git branch -M main
git remote add origin REPO_URL
git push -u origin main
```
