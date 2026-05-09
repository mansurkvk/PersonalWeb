import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { hashPassword } from "@/lib/auth/password";
import type { AuthLogDocument, UserDocument } from "@/types/database";

type LocalDbFile = {
  users: Array<Omit<UserDocument, "_id" | "createdAt" | "updatedAt" | "lastLoginAt"> & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
  }>;
  authLogs: Array<Omit<AuthLogDocument, "_id" | "userId" | "createdAt" | "expiresAt"> & {
    _id: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
  }>;
};

const localDbPath = path.join(process.cwd(), "data", "local-db.json");

type LocalDbCache = {
  data?: LocalDbFile;
  promise?: Promise<LocalDbFile>;
};

const globalForLocalDb = globalThis as unknown as { personalWebLocalDb?: LocalDbCache };
const cache = globalForLocalDb.personalWebLocalDb ?? {};
globalForLocalDb.personalWebLocalDb = cache;

function normalizeIdentifier(identifier: string) {
  return identifier.toLowerCase().trim();
}

function adminEmail() {
  return normalizeIdentifier(process.env.SEED_ADMIN_EMAIL ?? "mansurkvk000@gmail.com");
}

function adminUsername() {
  return normalizeIdentifier(process.env.SEED_ADMIN_USERNAME ?? "mansurkvk");
}

function adminDisplayName() {
  return process.env.SEED_ADMIN_DISPLAY_NAME ?? "Muhammed Mansur Kavak";
}

function serializeUser(user: UserDocument): LocalDbFile["users"][number] {
  return {
    ...user,
    _id: String(user._id),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString()
  };
}

function deserializeUser(user: LocalDbFile["users"][number]): UserDocument {
  return {
    ...user,
    _id: new ObjectId(user._id),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
  };
}

function serializeAuthLog(log: AuthLogDocument): LocalDbFile["authLogs"][number] {
  return {
    ...log,
    _id: String(log._id),
    userId: String(log.userId),
    createdAt: log.createdAt.toISOString(),
    expiresAt: log.expiresAt.toISOString()
  };
}

async function defaultLocalDb(): Promise<LocalDbFile> {
  const now = new Date();
  const admin: UserDocument = {
    _id: new ObjectId("000000000000000000000001"),
    username: adminUsername(),
    email: adminEmail(),
    passwordHash: await hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "Mansur1453"),
    role: "admin",
    displayName: adminDisplayName(),
    bio: "PersonalWeb local admin user.",
    socialLinks: {},
    isActive: true,
    createdAt: now,
    updatedAt: now
  };

  return {
    users: [serializeUser(admin)],
    authLogs: []
  };
}

async function writeLocalDb(data: LocalDbFile) {
  await fs.mkdir(path.dirname(localDbPath), { recursive: true });
  await fs.writeFile(localDbPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  cache.data = data;
}

export async function getLocalDb() {
  if (cache.data) return cache.data;

  if (!cache.promise) {
    cache.promise = fs
      .readFile(localDbPath, "utf-8")
      .then((content) => JSON.parse(content) as LocalDbFile)
      .catch(async () => {
        const initial = await defaultLocalDb();
        await writeLocalDb(initial);
        return initial;
      });
  }

  cache.data = await cache.promise;
  return cache.data;
}

export async function findLocalUserByIdentifier(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  const db = await getLocalDb();
  const user = db.users.find((item) => item.email === normalized || item.username === normalized);
  return user ? deserializeUser(user) : null;
}

export async function findLocalUserById(id: string) {
  const db = await getLocalDb();
  const user = db.users.find((item) => item._id === id);
  return user ? deserializeUser(user) : null;
}

export async function createLocalUser(input: Omit<UserDocument, "_id" | "createdAt" | "updatedAt">) {
  const db = await getLocalDb();
  const username = normalizeIdentifier(input.username);
  const email = normalizeIdentifier(input.email);
  const existing = db.users.find((item) => item.email === email || item.username === username);
  if (existing) throw new Error("Bu kullanici zaten mevcut.");

  const now = new Date();
  const user: UserDocument = {
    ...input,
    _id: new ObjectId(),
    username,
    email,
    createdAt: now,
    updatedAt: now
  };

  db.users.unshift(serializeUser(user));
  await writeLocalDb(db);
  return String(user._id);
}

export async function updateLocalUser(id: string, patch: Partial<Omit<UserDocument, "_id" | "createdAt">>) {
  const db = await getLocalDb();
  const index = db.users.findIndex((item) => item._id === id);
  if (index === -1) throw new Error("Kullanici bulunamadi.");

  const current = deserializeUser(db.users[index]);
  const next: UserDocument = {
    ...current,
    ...patch,
    username: patch.username ? normalizeIdentifier(patch.username) : current.username,
    email: patch.email ? normalizeIdentifier(patch.email) : current.email,
    updatedAt: new Date()
  };

  db.users[index] = serializeUser(next);
  await writeLocalDb(db);
}

export async function listLocalUsers(limit = 100) {
  const db = await getLocalDb();
  return db.users.slice(0, limit).map((user) => {
    const { passwordHash: _passwordHash, ...safeUser } = deserializeUser(user);
    return safeUser;
  });
}

export async function countLocalUsers() {
  const db = await getLocalDb();
  return db.users.length;
}

export async function createLocalAuthLog(input: { userId: string; ip?: string; userAgent?: string }) {
  const db = await getLocalDb();
  const log: AuthLogDocument = {
    _id: new ObjectId(),
    userId: new ObjectId(input.userId),
    ip: input.ip,
    userAgent: input.userAgent,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  };

  db.authLogs.unshift(serializeAuthLog(log));
  await writeLocalDb(db);
}
