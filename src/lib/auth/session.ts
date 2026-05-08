import "server-only";
import { cookies } from "next/headers";
import { sessionCookieName, verifySessionToken } from "@/lib/auth/token";
import type { SessionPayload } from "@/lib/auth/token";

export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireUser() {
  const session = await readSession();
  if (!session) throw new Error("Giris yapilmasi gerekli.");
  return session;
}

export async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "admin") throw new Error("Admin yetkisi gerekli.");
  return session;
}
