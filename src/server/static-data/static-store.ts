import { ObjectId } from "mongodb";
import { hashPassword } from "@/lib/auth/password";
import { blogPostSeeds, projectSeeds } from "@/config/content-seeds";
import type { AuthLogDocument, BlogPostDocument, ProjectDocument, TelemetryDeviceDocument, TelemetryReadingDocument, UserDocument, UserRole } from "@/types/database";

const now = new Date("2026-01-01T00:00:00.000Z");

function objectId(prefix: number, index: number) {
  return new ObjectId(`${prefix}${String(index + 1).padStart(23, "0")}`.slice(0, 24));
}

function adminEmail() {
  return (process.env.SEED_ADMIN_EMAIL ?? "mansurkvk000@gmail.com").toLowerCase().trim();
}

function adminUsername() {
  return (process.env.SEED_ADMIN_USERNAME ?? "mansurkvk").toLowerCase().trim();
}

function adminDisplayName() {
  return process.env.SEED_ADMIN_DISPLAY_NAME ?? "Muhammed Mansur Kavak";
}

async function adminPasswordHash() {
  return hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "Mansur1453");
}

type StaticStore = {
  initialized: boolean;
  users: UserDocument[];
  blogPosts: BlogPostDocument[];
  projects: ProjectDocument[];
  telemetryDevices: TelemetryDeviceDocument[];
  telemetryReadings: TelemetryReadingDocument[];
  authLogs: AuthLogDocument[];
};

const globalForStaticStore = globalThis as unknown as { personalWebStaticStore?: StaticStore };

function createStaticStore(): StaticStore {
  return {
    initialized: false,
    users: [],
    blogPosts: [],
    projects: [],
    telemetryDevices: [],
    telemetryReadings: [],
    authLogs: []
  };
}

const store = globalForStaticStore.personalWebStaticStore ?? createStaticStore();
globalForStaticStore.personalWebStaticStore = store;

export async function getStaticStore() {
  if (store.initialized) return store;

  const adminId = new ObjectId("000000000000000000000001");
  store.users = [
    {
      _id: adminId,
      username: adminUsername(),
      email: adminEmail(),
      passwordHash: await adminPasswordHash(),
      role: "admin",
      displayName: adminDisplayName(),
      bio: "Mechatronics engineer, physics researcher and PersonalWeb engineering lab owner.",
      socialLinks: {
        github: "https://github.com/mansurkvk",
        linkedin: "https://www.linkedin.com/in/muhammedmansurkavak/",
        x: "https://x.com/mansurkvk",
        instagram: "https://www.instagram.com/mansurkvk/",
        youtube: "https://www.youtube.com/@mansurkvk",
        website: "https://mansurkvk.vercel.app/"
      },
      isActive: true,
      createdAt: now,
      updatedAt: now
    }
  ];

  store.blogPosts = blogPostSeeds.map((post, index) => ({
    ...post,
    _id: objectId(1, index),
    authorId: adminId,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: post.status === "published" ? now : undefined
  }));

  store.projects = projectSeeds.map((project, index) => ({
    ...project,
    _id: objectId(2, index),
    createdAt: now,
    updatedAt: now
  }));

  store.telemetryDevices = [
    {
      _id: objectId(3, 0),
      deviceId: "esp32-lab-01",
      name: "ESP32 Lab Device",
      description: "GitHub static store uzerinden gelen ornek ESP32 telemetry cihazi.",
      type: "esp32",
      location: "Engineering Lab",
      locationLabel: "Engineering Lab",
      firmwareVersion: "1.0.0",
      isActive: true,
      lastSeenAt: now,
      createdAt: now,
      updatedAt: now
    }
  ];

  store.telemetryReadings = [
    {
      _id: objectId(4, 0),
      deviceId: "esp32-lab-01",
      temperature: 24.6,
      humidity: 42,
      voltage: 7.4,
      current: 1.2,
      batteryPercent: 86,
      signalStrength: -58,
      motionState: "idle",
      deviceStatus: "online",
      uptime: 3600,
      firmwareVersion: "1.0.0",
      locationLabel: "Engineering Lab",
      source: "static-store",
      rawPayload: { source: "github-static-store" },
      createdAt: now
    }
  ];

  store.initialized = true;
  return store;
}

export function publicUser(user: UserDocument) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export function nextStaticObjectId(prefix = 9) {
  return objectId(prefix, Date.now() % 1000000);
}

export function normalizeIdentifier(identifier: string) {
  return identifier.toLowerCase().trim();
}

export function isRole(value: unknown): value is UserRole {
  return value === "admin" || value === "user";
}
