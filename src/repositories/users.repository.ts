import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import {
  countLocalUsers,
  createLocalAuthLog,
  createLocalUser,
  findLocalUserById,
  findLocalUserByIdentifier,
  listLocalUsers,
  updateLocalUser
} from "@/server/local-db/local-store";
import { getStaticStore, isRole, nextStaticObjectId, normalizeIdentifier, publicUser } from "@/server/static-data/static-store";
import type { AuthLogDocument, UserDocument, UserRole } from "@/types/database";

function isVercelRuntime() {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

function shouldUseMongoDb() {
  return process.env.DATA_SOURCE === "mongodb" || (process.env.DATA_SOURCE === "local" && isVercelRuntime());
}

function shouldUseLocalDb() {
  return process.env.DATA_SOURCE === "local" && !isVercelRuntime();
}

export async function usersCollection() {
  const db = await getDb();
  return db.collection<UserDocument>("users");
}

export async function authLogsCollection() {
  const db = await getDb();
  return db.collection<AuthLogDocument>("authLogs");
}

export async function findUserByIdentifier(identifier: string) {
  const normalized = normalizeIdentifier(identifier);

  if (shouldUseLocalDb()) {
    return findLocalUserByIdentifier(normalized);
  }

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    return store.users.find((user) => user.email === normalized || user.username === normalized) ?? null;
  }

  const users = await usersCollection();
  return users.findOne({ $or: [{ email: normalized }, { username: normalized }] });
}

export async function findUserById(id: string) {
  if (shouldUseLocalDb()) {
    return findLocalUserById(id);
  }

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    return store.users.find((user) => String(user._id) === id) ?? null;
  }

  const users = await usersCollection();
  return users.findOne({ _id: toObjectId(id) });
}

export async function createUser(input: {
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role?: UserRole;
}) {
  const normalizedUsername = normalizeIdentifier(input.username);
  const normalizedEmail = normalizeIdentifier(input.email);
  const now = new Date();

  if (shouldUseLocalDb()) {
    return createLocalUser({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      displayName: input.displayName,
      role: input.role ?? "user",
      isActive: true,
      socialLinks: {}
    });
  }

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    const existing = store.users.find((user) => user.email === normalizedEmail || user.username === normalizedUsername);
    if (existing) throw new Error("Bu kullanici zaten mevcut.");

    const user: UserDocument = {
      _id: nextStaticObjectId(5),
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      displayName: input.displayName,
      role: input.role ?? "user",
      isActive: true,
      socialLinks: {},
      createdAt: now,
      updatedAt: now
    };
    store.users.unshift(user);
    return String(user._id);
  }

  const users = await usersCollection();
  const result = await users.insertOne({
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash: input.passwordHash,
    displayName: input.displayName,
    role: input.role ?? "user",
    isActive: true,
    socialLinks: {},
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId.toHexString();
}

export async function updateUser(id: string, patch: Partial<Omit<UserDocument, "_id" | "createdAt">>) {
  const safePatch = { ...patch, updatedAt: new Date() };
  if (safePatch.role && !isRole(safePatch.role)) delete safePatch.role;

  if (shouldUseLocalDb()) {
    await updateLocalUser(id, safePatch);
    return;
  }

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    const index = store.users.findIndex((user) => String(user._id) === id);
    if (index === -1) throw new Error("Kullanici bulunamadi.");
    store.users[index] = { ...store.users[index], ...safePatch };
    return;
  }

  const users = await usersCollection();
  await users.updateOne({ _id: toObjectId(id) }, { $set: safePatch });
}

export async function deleteUser(id: string) {
  if (shouldUseMongoDb()) {
    const users = await usersCollection();
    await users.deleteOne({ _id: toObjectId(id) });
    return;
  }

  const store = await getStaticStore();
  const user = store.users.find((item) => String(item._id) === id);
  if (user?.role === "admin") throw new Error("Yerel modda admin kullanici silinemez.");
  store.users = store.users.filter((item) => String(item._id) !== id);
}

export async function updateLastLogin(userId: string) {
  if (shouldUseLocalDb()) {
    await updateLocalUser(userId, { lastLoginAt: new Date() });
    return;
  }

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    const user = store.users.find((item) => String(item._id) === userId);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
    }
    return;
  }

  const users = await usersCollection();
  await users.updateOne({ _id: toObjectId(userId) }, { $set: { lastLoginAt: new Date(), updatedAt: new Date() } });
}

export async function createAuthLog(input: { userId: string; ip?: string; userAgent?: string }) {
  if (shouldUseLocalDb()) {
    await createLocalAuthLog(input);
    return;
  }

  const log: AuthLogDocument = {
    userId: toObjectId(input.userId),
    ip: input.ip,
    userAgent: input.userAgent,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  };

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    store.authLogs.unshift({ ...log, _id: nextStaticObjectId(6) });
    return;
  }

  const authLogs = await authLogsCollection();
  await authLogs.insertOne(log);
}

export async function listUsers(limit = 100) {
  if (shouldUseLocalDb()) {
    return listLocalUsers(limit);
  }

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    return store.users.map(publicUser).slice(0, limit);
  }

  const users = await usersCollection();
  return users
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function countUsers() {
  if (shouldUseLocalDb()) {
    return countLocalUsers();
  }

  if (!shouldUseMongoDb()) {
    const store = await getStaticStore();
    return store.users.length;
  }

  const users = await usersCollection();
  return users.countDocuments();
}
