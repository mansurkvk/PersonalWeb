# Deployment

Bu dokuman PersonalWeb projesini GitHub ve Vercel icin hazir tutmak amaciyla yazilmistir.

## GitHub'a Yukleme

1. `.gitignore` dosyasinin guncel oldugunu kontrol et.
2. `.env.local`, `.next`, `node_modules`, `.vercel`, build klasorleri, cache dosyalari ve arsiv dosyalarinin commit edilmediginden emin ol.
3. `npm run typecheck`, `npm run lint` ve `npm run build` calistir.
4. `git status --ignored` ile GitHub'a gitmeyecek dosyalari dogrula.
5. Commit ve push islemini yap.

```bash
git status
git add .
git commit -m "Prepare PersonalWeb for GitHub"
git branch -M main
git remote add origin REPO_URL
git push -u origin main
```

## Vercel Deploy

1. GitHub reposunu Vercel'e import et.
2. Framework olarak Next.js otomatik algilanir.
3. Build command: `npm run build`
4. Install command: `npm install`
5. Environment variables degerlerini Vercel Project Settings altina ekle.
6. Deploy bittikten sonra `/api/system/health` endpointini kontrol et.
7. MongoDB kontrolu icin `/api/system/mongodb-ping` endpointini kullan.

## Vercel Environment Variables

Zorunlu:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_USERNAME`
- `SEED_ADMIN_DISPLAY_NAME`
- `SEED_ADMIN_PASSWORD`
- `ESP32_DEVICE_KEY`
- `CRON_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Email icin:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

`RESEND_API_KEY` bos olabilir. Bos kalirsa sistem email kayitlarini `emailOutbox` koleksiyonuna `queued` olarak yazar ve gonderildi kabul etmez.

Opsiyonel:

- `CONTACT_TO_EMAIL`
- `BROKER_DRIVER`
- `BROKER_WEBHOOK_URL`
- `BROKER_WEBHOOK_TOKEN`

## Secret Kurallari

- `.env.example` commit edilir.
- `.env.local` commit edilmez.
- Gercek MongoDB URI, JWT secret, ESP32 device key, Resend key veya admin sifresi kaynak kodda bulunmaz.
- Vercel production secret degerleri sadece Vercel Environment Variables icinde tutulur.

## MongoDB Atlas

1. Atlas cluster olustur.
2. Database user olustur.
3. Vercel IP modeli icin network access ayarlarini yap.
4. SRV connection string degerini `MONGODB_URI` olarak ekle.
5. Database adini `MONGODB_DB_NAME` olarak ekle.

## Queue Processing

Email outbox isleme endpointi:

```bash
curl -X POST https://your-site.vercel.app/api/queue/process-emails \
  -H "authorization: Bearer YOUR_CRON_SECRET"
```

Bu endpoint `CRON_SECRET` ile korunur.
