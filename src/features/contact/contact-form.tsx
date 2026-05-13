"use client";

import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProductShowcaseItem } from "@/config/products";

type ContactFormProps = {
  product: ProductShowcaseItem | null;
  sessionEmail?: string;
  sessionDisplayName?: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactForm({ product, sessionEmail, sessionDisplayName }: ContactFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState(sessionEmail ?? "");
  const [name, setName] = useState(sessionDisplayName ?? "");
  const [subject, setSubject] = useState(product ? `Urun talebi: ${product.title}` : "");
  const [message, setMessage] = useState("");

  const messagePlaceholder = useMemo(() => {
    if (product) return `${product.title} hakkinda bilgi almak istiyorum...`;
    return "Robotik urun, IoT telemetry paketi veya teknik danismanlik ihtiyacini kisaca anlatabilirsin...";
  }, [product]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          productSlug: product?.slug,
          message,
          source: product ? "product-page" : "contact-page"
        })
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.message ?? "Mesaj gonderilirken bir hata olustu.");

      setState("success");
      setFeedback("Mesajiniz alindi. En kisa zamanda donus yapilacak.");
      setMessage("");
    } catch (error) {
      setState("error");
      setFeedback(error instanceof Error ? error.message : "Mesaj gonderilirken bir hata olustu.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel lab-border rounded-[2.4rem] p-5 md:p-7">
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Isim / kurum
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={120}
            className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-[#8bd3dd]/50 focus:shadow-[0_0_0_4px_rgba(139,211,221,0.08)]"
            placeholder="Mansur Kavak / Harezmi Robotics"
          />
        </label>

        {sessionEmail ? (
          <div className="grid gap-2 text-sm text-slate-300">
            Oturum e-postasi
            <div className="flex min-h-12 items-center rounded-2xl border border-[#8bd3dd]/20 bg-[#8bd3dd]/[0.055] px-4 text-[#c9f8ff]">
              {sessionEmail}
            </div>
          </div>
        ) : (
          <label className="grid gap-2 text-sm text-slate-300">
            E-posta <span className="sr-only">zorunlu</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={180}
              className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-[#8bd3dd]/50 focus:shadow-[0_0_0_4px_rgba(139,211,221,0.08)]"
              placeholder="mail@example.com"
            />
          </label>
        )}

        <label className="grid gap-2 text-sm text-slate-300">
          Konu
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
            minLength={3}
            maxLength={180}
            className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-[#d5b46a]/50 focus:shadow-[0_0_0_4px_rgba(213,180,106,0.08)]"
            placeholder="Urun talebi / teknik danismanlik / IoT telemetry"
          />
        </label>

        {product ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="font-mono-lab text-[0.65rem] uppercase tracking-[0.25em] text-[#8bd3dd]">Secili urun</p>
            <p className="mt-2 text-lg font-semibold text-white">{product.title}</p>
            <p className="mt-1 text-sm text-slate-400">{product.summary}</p>
          </div>
        ) : null}

        <label className="grid gap-2 text-sm text-slate-300">
          Mesaj
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            minLength={10}
            maxLength={5000}
            rows={7}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#8bd3dd]/50 focus:shadow-[0_0_0_4px_rgba(139,211,221,0.08)]"
            placeholder={messagePlaceholder}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8bd3dd] px-6 text-sm font-semibold text-[#051017] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="size-4" />
        {state === "loading" ? "Gonderiliyor..." : "Mesaji Gonder"}
      </button>

      {feedback ? (
        <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${state === "success" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : "border-red-300/20 bg-red-300/10 text-red-100"}`}>
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
