import "server-only";
import { Resend } from "resend";

export type EmailMessage = {
  to: string;
  subject: string;
  body: string;
};

export type EmailProvider = {
  send(message: EmailMessage): Promise<{ id?: string }>;
};

const devEmailProvider: EmailProvider = {
  async send(message) {
    console.log("[email:dev]", message);
    return { id: "dev-email" };
  }
};

const resendEmailProvider: EmailProvider = {
  async send(message) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Mansur Kavak Engineering Lab <noreply@example.com>",
      to: message.to,
      subject: message.subject,
      text: message.body
    });
    return { id: result.data?.id };
  }
};

export function getEmailProvider(): EmailProvider {
  return process.env.RESEND_API_KEY ? resendEmailProvider : devEmailProvider;
}

export async function sendEmail(message: EmailMessage) {
  return getEmailProvider().send(message);
}
