import { createSessionToken } from "@/lib/auth/token";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { publishBrokerEvent } from "@/server/broker/broker.service";
import { createAuthLog, createUser, findUserByIdentifier, updateLastLogin, updateUser } from "@/repositories/users.repository";

function normalizeIdentifier(value: string) {
  return value.toLowerCase().trim();
}

function seedAdminEmail() {
  return normalizeIdentifier(process.env.SEED_ADMIN_EMAIL ?? "");
}

function seedAdminUsername() {
  return normalizeIdentifier(process.env.SEED_ADMIN_USERNAME ?? "");
}

function seedAdminPassword() {
  return process.env.SEED_ADMIN_PASSWORD ?? "";
}

function seedAdminDisplayName() {
  return process.env.SEED_ADMIN_DISPLAY_NAME ?? "Admin";
}

function isSeedAdminIdentifier(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  return Boolean(normalized) && (normalized === seedAdminEmail() || normalized === seedAdminUsername());
}

async function ensureSeedAdminForLogin(identifier: string) {
  if (!isSeedAdminIdentifier(identifier) || !seedAdminPassword()) return null;

  const email = seedAdminEmail();
  const username = seedAdminUsername();
  if (!email || !username) return null;

  const existing = (await findUserByIdentifier(email)) ?? (await findUserByIdentifier(username));
  const passwordHash = await hashPassword(seedAdminPassword());

  if (existing) {
    await updateUser(String(existing._id), {
      email,
      username,
      displayName: existing.displayName || seedAdminDisplayName(),
      passwordHash,
      role: "admin",
      isActive: true
    });
    return findUserByIdentifier(identifier);
  }

  const userId = await createUser({
    displayName: seedAdminDisplayName(),
    username,
    email,
    passwordHash,
    role: "admin"
  });

  return findUserByIdentifier(userId) ?? findUserByIdentifier(identifier);
}

export async function registerUser(input: { displayName: string; username: string; email: string; password: string }) {
  const existing = await findUserByIdentifier(input.email);
  if (existing) throw new Error("Bu e-posta zaten kayitli.");

  const existingUsername = await findUserByIdentifier(input.username);
  if (existingUsername) throw new Error("Bu kullanici adi zaten kayitli.");

  const passwordHash = await hashPassword(input.password);
  const userId = await createUser({
    displayName: input.displayName,
    username: input.username,
    email: input.email,
    passwordHash,
    role: "user"
  });

  await publishBrokerEvent({
    topic: "users.created",
    type: "user.created",
    payload: { userId, username: input.username }
  });

  return {
    userId,
    email: input.email.toLowerCase().trim(),
    username: input.username.toLowerCase().trim(),
    displayName: input.displayName,
    role: "user" as const
  };
}

export async function loginUser(input: { identifier: string; password: string; ip?: string; userAgent?: string }) {
  let user = await findUserByIdentifier(input.identifier);

  if (!user && isSeedAdminIdentifier(input.identifier) && input.password === seedAdminPassword()) {
    user = await ensureSeedAdminForLogin(input.identifier);
  }

  if (!user || !user.isActive) throw new Error("Kullanici bulunamadi.");

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new Error("Giris bilgileri hatali.");

  if (isSeedAdminIdentifier(input.identifier) && user.role !== "admin") {
    user = await ensureSeedAdminForLogin(input.identifier) ?? user;
  }

  const userId = String(user._id);
  await updateLastLogin(userId);
  await createAuthLog({ userId, ip: input.ip, userAgent: input.userAgent });

  const payload = {
    userId,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    role: user.role
  };

  return {
    sessionToken: await createSessionToken(payload),
    payload
  };
}
