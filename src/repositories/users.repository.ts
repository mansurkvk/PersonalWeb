import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import { getStaticStore, isRole, nextStaticObjectId, normalizeIdentifier, publicUser } from "@/server/static-data/static-store";
import type { AuthLogDocument, UserDocument, UserRole } from "@/types/database";

function shouldUseStaticDataOnly() {
  return process.env.DATA_SOURCE !== "mongodb";
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

  if (shouldUseStaticDataOnly()) {
    const store = await getStaticStore();
    return store.users.find((user) => user.email === normalized || user.username === normalized) ?? null;
  }

  try {
    const users = await usersCollection();
    const user = await users.findOne({ $or: [{ email: normalized }, { username: normalized }] });
    if (user) return user;
  } catch {
    // MongoDB hazir degilse statik store'a dus.
  }

  const store = await getStaticStore();
  return store.users.find((user) => user.email === normalized || user.username === normalized) ?? null;
}

export async function findUserById(id: string) {
  if (shouldUseStaticDataOnly()) {
    const store = await getStaticStore();
    return store.users.find((user) => String(user._id) === id) ?? null;
  }

  try {
    const users = await usersCollection();
    const user = await users.findOne({ _id: toObjectId(id) });
    if (user) return user;
  } catch {
    // MongoDB hazir degilse statik store'a dus.
  }

  const store = await getStaticStore();
  return store.users.find((user) => String(user._id) === id) ?? null;
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

  if (shouldUseStaticDataOnly()) {
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

  if (shouldUseStaticDataOnly()) {
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
  if (shouldUseStaticDataOnly()) {
    const store = await getStaticStore();
    const user = store.users.find((item) => String(item._id) === id);
    if (user?.role === "admin") throw new Error("Statik modda admin kullanici silinemez.");
    store.users = store.users.filter((item) => String(item._id) !== id);
    return;
  }

  const users = await usersCollection();
  await users.deleteOne({ _id: toObjectId(id) });
}

export async function updateLastLogin(userId: string) {
  if (shouldUseStaticDataOnly()) {
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
  const log: AuthLogDocument = {
    userId: toObjectId(input.userId),
    ip: input.ip,
    userAgent: input.userAgent,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  };

  if (shouldUseStaticDataOnly()) {
    const store = await getStaticStore();
    store.authLogs.unshift({ ...log, _id: nextStaticObjectId(6) });
    return;
  }

  const authLogs = await authLogsCollection();
  await authLogs.insertOne(log);
}

export async function listUsers(limit = 100) {
  if (shouldUseStaticDataOnly()) {
    const store = await getStaticStore();
    return store.users.map(publicUser).slice(0, limit);
  }

  try {
    const users = await usersCollection();
    return users
      .find({}, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  } catch {
    const store = await getStaticStore();
    return store.users.map(publicUser).slice(0, limit);
  }
}

export async function countUsers() {
  if (shouldUseStaticDataOnly()) {
    const store = await getStaticStore();
    return store.users.length;
  }

  try {
    const users = await usersCollection();
    return users.countDocuments();
  } catch {
    const store = await getStaticStore();
    return store.users.length;
  }
}
