# Database

Varsayilan database adi: `mansur_platform`

MongoDB baglantisi tek merkezden `src/lib/db/mongodb.ts` dosyasinda yonetilir. Kod `MONGODB_URI` ve `MONGODB_DB_NAME` environment variable degerlerini okur. MongoDB URI client bundle icine sizmaz.

## Koleksiyonlar

### users

Kullanici, admin ve auth bilgileri. Temel alanlar: `username`, `email`, `passwordHash`, `role`, `displayName`, `avatarUrl`, `bio`, `socialLinks`, `isActive`, `createdAt`, `updatedAt`, `lastLoginAt`.

### blogPosts

Blog icerikleri. Temel alanlar: `title`, `slug`, `excerpt`, `content`, `coverImage`, `tags`, `category`, `status`, `authorId`, `viewCount`, `featured`, `createdAt`, `updatedAt`, `publishedAt`.

### blogComments

Blog yorumlari. Temel alanlar: `postId`, `userId`, `parentCommentId`, `authorName`, `content`, `status`, `createdAt`, `updatedAt`.

### projects

Proje vitrini. Temel alanlar: `title`, `slug`, `summary`, `description`, `coverImage`, `images`, `technologies`, `category`, `status`, `links`, `featured`, `createdAt`, `updatedAt`.

### telemetryDevices

ESP32 ve diger telemetry cihazlari. Temel alanlar: `deviceId`, `name`, `description`, `type`, `location`, `locationLabel`, `firmwareVersion`, `deviceKeyHash`, `apiKeyHash`, `isActive`, `lastSeenAt`, `createdAt`, `updatedAt`.

### telemetryReadings

Canli sensor verileri. Temel alanlar: `deviceId`, `temperature`, `humidity`, `pressure`, `voltage`, `current`, `batteryPercent`, `signalStrength`, `distance`, `motionState`, `deviceStatus`, `uptime`, `errorCode`, `firmwareVersion`, `locationLabel`, `rawPayload`, `source`, `createdAt`.

### emailOutbox

Email kuyrugu. Temel alanlar: `to`, `subject`, `body`, `template`, `status`, `tryCount`, `lastError`, `createdAt`, `updatedAt`, `sentAt`.

`RESEND_API_KEY` bos ise email kayitlari `queued` olarak kalir.

### siteSettings

Site ayarlari. Temel alanlar: `siteTitle`, `siteDescription`, `heroTitle`, `heroSubtitle`, `oldSiteUrl`, `socialLinks`, `theme`, `createdAt`, `updatedAt`.

### auditLogs

Auth ve admin hareketleri. Temel alanlar: `actorUserId`, `action`, `entityType`, `entityId`, `metadata`, `createdAt`.

### brokerMessages

Broker outbox kayitlari. Temel alanlar: `topic`, `deviceId`, `payload`, `status`, `createdAt`, `processedAt`.

## Indexler

`scripts/seed.ts`, `ensureDatabaseIndexes()` fonksiyonunu cagirir.

Onemli indexler:

- `users.email` unique
- `users.username` unique
- `blogPosts.slug` unique
- `projects.slug` unique
- `telemetryDevices.deviceId` unique
- `telemetryReadings.deviceId + createdAt`
- `brokerMessages.topic + createdAt`
- `brokerMessages.deviceId + createdAt`
- `emailOutbox.status + createdAt`
