import { ObjectId } from "mongodb";
import {
  createContactMessage,
  listContactMessages,
  updateContactMessageStatus
} from "@/repositories/contact.repository";
import type { ContactMessageStatus } from "@/types/database";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validStatuses: ContactMessageStatus[] = ["new", "read", "replied", "archived"];

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function optionalText(value: unknown, maxLength: number) {
  const cleaned = cleanText(value, maxLength);
  return cleaned.length > 0 ? cleaned : undefined;
}

export type SubmitContactMessageInput = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  productSlug?: unknown;
  message?: unknown;
  source?: unknown;
  userId?: string;
  sessionEmail?: string;
};

export function isContactMessageStatus(value: string): value is ContactMessageStatus {
  return validStatuses.includes(value as ContactMessageStatus);
}

export async function submitContactMessage(input: SubmitContactMessageInput) {
  // TODO: add rate limit by IP/email.
  const name = optionalText(input.name, 120);
  const email = cleanText(input.sessionEmail ?? input.email, 180).toLowerCase();
  const subject = cleanText(input.subject, 180);
  const productSlug = optionalText(input.productSlug, 120);
  const message = cleanText(input.message, 5000);
  const source = input.source === "product-page" ? "product-page" : "contact-page";

  if (!emailRegex.test(email)) {
    throw new Error("Gecerli bir e-posta adresi gerekli.");
  }

  if (subject.length < 3) {
    throw new Error("Konu en az 3 karakter olmali.");
  }

  if (message.length < 10) {
    throw new Error("Mesaj en az 10 karakter olmali.");
  }

  const userId = input.userId && ObjectId.isValid(input.userId) ? new ObjectId(input.userId) : undefined;

  return createContactMessage({
    userId,
    name,
    email,
    subject,
    productSlug,
    message,
    source
  });
}

export async function listAdminContactMessages(status?: ContactMessageStatus) {
  return listContactMessages({ status, limit: 150 });
}

export async function markContactMessageStatus(id: string, status: ContactMessageStatus) {
  await updateContactMessageStatus(id, status);
}

export async function markContactMessageRead(id: string) {
  await updateContactMessageStatus(id, "read");
}
