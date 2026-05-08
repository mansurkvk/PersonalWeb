"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Giris yapmis kullanici blog yazisina yorum gonderebilir.
export function CommentForm({ postId, isLoggedIn }: { postId: string; isLoggedIn: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId, content: form.get("content") })
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? "Yorum eklenemedi.");
      return;
    }

    event.currentTarget.reset();
    setMessage("Yorum eklendi.");
    router.refresh();
  }

  if (!isLoggedIn) {
    return (
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
        Yorum yazmak icin <Link href="/login" className="text-[#8bd3dd] hover:text-white">giris yap</Link> veya yeni kullanici olustur.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 glass-panel rounded-3xl p-5">
      <label className="text-sm text-slate-300">Yorumun</label>
      <textarea name="content" required rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-[#8bd3dd]/60" />
      <button disabled={loading} className="mt-3 rounded-2xl bg-white px-5 py-2.5 font-semibold text-slate-950 hover:bg-[#dff8fb] disabled:opacity-60">
        {loading ? "Gonderiliyor..." : "Yorum gonder"}
      </button>
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </form>
  );
}
