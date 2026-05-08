import { getDb } from "@/lib/db/mongodb";
import { toObjectId } from "@/lib/db/object-id";
import type { AuthLogDocument, UserDocument, UserRole } from "@/types/database";

export async function usersCollection() {
  const db = await getDb();
  return db.collection<UserDocument>("users");
}

export async function authLogsCollection() {
  const db = await getDb();
  return db.collection<AuthLogDocument>("authLogs");
}

export async function findUserByIdentifier(identifier: string) {
  const normalized = identifier.toLowerCase().trim();
  const users = await usersCollection();
  return users.findOne({ $or: [{ email: normalized }, { username: normalized }] });
}

export async function findUserById(id: string) {
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
  const now = new Date();
  const users = await usersCollection();
  const result = await users.insertOne({
    username: input.username.toLowerCase().trim(),
    email: input.email.toLowerCase().trim(),
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

export async function updateLastLogin(userId: string) {
  const users = await usersCollection();
  await users.updateOne({ _id: toObjectId(userId) }, { $set: { lastLoginAt: new Date(), updatedAt: new Date() } });
}

export async function createAuthLog(input: { userId: string; ip?: string; userAgent?: string }) {
  const authLogs = await authLogsCollection();
  await authLogs.insertOne({
    userId: toObjectId(input.userId),
    ip: input.ip,
    userAgent: input.userAgent,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });
}

export async function listUsers(limit = 100) {
  const users = await usersCollection();
  return users
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function countUsers() {
  const users = await usersCollection();
  return users.countDocuments();
}
