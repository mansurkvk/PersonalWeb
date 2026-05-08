import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types/database";

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
};

export const sessionCookieName = "session";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET tanimli degil.");
  return new TextEncoder().encode(secret);
}

// Kullanici oturumunu imzali JWT olarak uretir.
export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, getSecretKey());
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}
