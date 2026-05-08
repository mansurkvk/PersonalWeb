import { createSessionToken } from "@/lib/auth/token";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { publishBrokerEvent } from "@/server/broker/broker.service";
import { createAuthLog, createUser, findUserByIdentifier, updateLastLogin } from "@/repositories/users.repository";

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
  const user = await findUserByIdentifier(input.identifier);
  if (!user || !user.isActive) throw new Error("Kullanici bulunamadi.");

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new Error("Giris bilgileri hatali.");

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
