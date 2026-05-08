# PersonalWeb Notion Content Workflow

Bu dokuman PersonalWeb icin Notion'u blog ve proje iceriklerinin editorial source-of-truth alani olarak kullanma yolunu aciklar.

## Ana karar

- MongoDB: users, auth, telemetry, admin loglari ve operasyonel veriler.
- Notion: blog yazilari, proje aciklamalari, roadmap notlari ve editorial taslaklar.
- Next.js: Notion'dan gelen icerikleri MongoDB'ye senkronize eder veya ileride dogrudan server-side okuyabilir.

## Guvenlik siniri

Notion icinde tutulmamasi gerekenler:

- Kullanici sifreleri
- JWT secret
- ESP32 device key
- MongoDB URI
- Resend API key
- Hassas admin loglari

## Onerilen Blog database property yapisi

| Property | Type | Aciklama |
|---|---|---|
| Title | Title | Yazinin basligi |
| Slug | Text | URL slug |
| Status | Select | Draft / Review / Published |
| Category | Select | Architecture, IoT, Auth, Engineering Lab, Notion CMS |
| Tags | Multi-select | PersonalWeb, Next.js, MongoDB, ESP32 vb. |
| Excerpt | Text | Liste sayfasinda gorunecek ozet |
| Content | Text | Ilk asamada plain text/markdown icerik |
| Featured | Checkbox | One cikan yazi |
| Published At | Date | Yayin tarihi |

## Onerilen Projects database property yapisi

| Property | Type | Aciklama |
|---|---|---|
| Title | Title | Proje adi |
| Slug | Text | URL slug |
| Summary | Text | Kisa ozet |
| Description | Text | Detayli aciklama |
| Status | Select | idea / prototype / active / archived |
| Category | Select | Robotics, IoT, Web Platform, Quantum Programming vb. |
| Technologies | Multi-select | Next.js, ESP32, MongoDB, Robotics vb. |
| Featured | Checkbox | One cikan proje |

## Sync komutu

`.env.local` veya Vercel env icine su degerleri gir:

```env
NOTION_API_KEY="secret_xxx"
NOTION_BLOG_DATABASE_ID="..."
NOTION_PROJECTS_DATABASE_ID="..."
```

Sonra local terminalde:

```bash
npm run sync:notion
```

Bu komut Notion database'lerinden yayinlanabilir icerikleri okuyup MongoDB icindeki `blogPosts` ve `projects` koleksiyonlarina upsert eder.

## Ilk pratik kullanim

1. Once `npm run seed` calistir. Bu admin user, temel projeler ve blog yazilarini olusturur.
2. Notion database'lerini hazirla.
3. Notion integration olustur ve database'leri integration ile share et.
4. `npm run sync:notion` calistir.
5. Site `/blog` ve `/projects` sayfalarinda MongoDB'den gelen icerikleri gosterir.

## Not

Bu kurgu ilk asamada basit tutuldu. Notion blocklarini tam Markdown'a cevirmek ileriki asamada ayri bir `notion-blocks-to-markdown` adaptorune tasinabilir.
