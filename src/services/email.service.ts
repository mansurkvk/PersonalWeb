import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email";
import { enqueueEmail, listQueuedEmails, markEmailFailed, markEmailSent } from "@/lib/queue";
import { publishBrokerEvent } from "@/server/broker/broker.service";

export async function queueContactEmail(input: { name: string; email: string; message: string }) {
  const id = await enqueueEmail({
    to: process.env.CONTACT_TO_EMAIL ?? "mansurkvk000@gmail.com",
    subject: `Yeni Engineering Lab mesaji: ${input.name}`,
    body: `Gonderen: ${input.name} <${input.email}>\n\n${input.message}`,
    template: "contact"
  });

  await publishBrokerEvent({
    topic: "emails.outbox",
    type: "email.queued",
    payload: { id, source: "contact-form" }
  });

  return id;
}

export async function processQueuedEmails(limit = 10) {
  if (!process.env.RESEND_API_KEY) return 0;

  const queued = await listQueuedEmails(limit);

  for (const item of queued) {
    try {
      await sendEmail({ to: item.to, subject: item.subject, body: item.body });
      await markEmailSent(item._id as ObjectId);
    } catch (error) {
      await markEmailFailed(item._id as ObjectId, error instanceof Error ? error.message : "Bilinmeyen hata");
    }
  }

  return queued.length;
}
