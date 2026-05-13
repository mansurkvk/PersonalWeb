import { getDb } from "@/lib/db/mongodb";

// MongoDB indexlerini tek noktadan olusturur.
export async function ensureDatabaseIndexes() {
  const db = await getDb();

  await Promise.all([
    db.collection("users").createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
      { key: { role: 1 } }
    ]),
    db.collection("authLogs").createIndexes([
      { key: { userId: 1, createdAt: -1 } },
      { key: { expiresAt: 1 }, expireAfterSeconds: 0 }
    ]),
    db.collection("blogPosts").createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { status: 1, publishedAt: -1 } },
      { key: { category: 1 } },
      { key: { tags: 1 } }
    ]),
    db.collection("blogComments").createIndexes([
      { key: { postId: 1, createdAt: -1 } },
      { key: { userId: 1, createdAt: -1 } },
      { key: { status: 1 } }
    ]),
    db.collection("contactMessages").createIndexes([
      { key: { status: 1, createdAt: -1 } },
      { key: { email: 1, createdAt: -1 } },
      { key: { productSlug: 1, createdAt: -1 } }
    ]),
    db.collection("projects").createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { category: 1, featured: -1 } },
      { key: { technologies: 1 } }
    ]),
    db.collection("telemetryDevices").createIndexes([
      { key: { deviceId: 1 }, unique: true },
      { key: { isActive: 1, lastSeenAt: -1 } },
      { key: { type: 1, locationLabel: 1 } }
    ]),
    db.collection("telemetryReadings").createIndexes([
      { key: { deviceId: 1, createdAt: -1 } },
      { key: { createdAt: -1 } },
      { key: { source: 1, createdAt: -1 } }
    ]),
    db.collection("emailOutbox").createIndexes([
      { key: { status: 1, createdAt: 1 } },
      { key: { sentAt: -1 } }
    ]),
    db.collection("auditLogs").createIndexes([
      { key: { actorUserId: 1, createdAt: -1 } },
      { key: { entityType: 1, entityId: 1 } }
    ]),
    db.collection("brokerMessages").createIndexes([
      { key: { topic: 1, createdAt: -1 } },
      { key: { deviceId: 1, createdAt: -1 } },
      { key: { status: 1, createdAt: 1 } }
    ])
  ]);
}
