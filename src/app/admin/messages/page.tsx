import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/features/admin/admin-shell";
import { ContactMessageActions } from "@/features/admin/contact-message-actions";
import { readSession } from "@/lib/auth/session";
import { isContactMessageStatus, listAdminContactMessages } from "@/services/contact.service";
import type { ContactMessageStatus } from "@/types/database";

export const dynamic = "force-dynamic";

const filters: { label: string; value?: ContactMessageStatus }[] = [
  { label: "All" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Replied", value: "replied" },
  { label: "Archived", value: "archived" }
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await readSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/profile");

  const params = await searchParams;
  const status = params.status && isContactMessageStatus(params.status) ? params.status : undefined;
  const messages = await listAdminContactMessages(status).catch(() => []);

  return (
    <AdminShell title="Contact Messages" description="Urun vitrini ve iletisim sayfasindan gelen talepleri goruntule, oku, yanitlandi olarak isaretle veya arsivle.">
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const href = filter.value ? `/admin/messages?status=${filter.value}` : "/admin/messages";
          const active = filter.value === status || (!filter.value && !status);
          return (
            <Link
              key={filter.label}
              href={href}
              className={`rounded-full border px-4 py-2 text-sm transition ${active ? "border-[#8bd3dd]/40 bg-[#8bd3dd]/10 text-[#c9f8ff]" : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10"}`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <section className="glass-panel rounded-[2rem] p-6 text-slate-300">Bu filtrede mesaj bulunamadi.</section>
        ) : (
          messages.map((message) => (
            <article key={message._id?.toHexString()} className="glass-panel lab-border rounded-[2rem] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#8bd3dd]/25 bg-[#8bd3dd]/10 px-3 py-1 font-mono-lab text-[0.65rem] uppercase tracking-[0.22em] text-[#c9f8ff]">{message.status}</span>
                    {message.productSlug ? (
                      <span className="rounded-full border border-[#d5b46a]/25 bg-[#d5b46a]/10 px-3 py-1 font-mono-lab text-[0.65rem] uppercase tracking-[0.22em] text-[#ffe7a3]">{message.productSlug}</span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white">{message.subject}</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {message.name ? `${message.name} · ` : ""}{message.email}
                  </p>
                </div>
                <time className="font-mono-lab text-xs uppercase tracking-[0.2em] text-slate-500">{formatDate(message.createdAt)}</time>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/25 p-4 text-sm leading-7 text-slate-300 whitespace-pre-wrap">
                {message.message}
              </div>

              {message._id ? <ContactMessageActions messageId={message._id.toHexString()} currentStatus={message.status} /> : null}
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
