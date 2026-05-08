"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        displayName: form.get("displayName"),
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password")
      })
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Kayit tamamlanamadi.");
      return;
    }

    router.push(data.redirectTo ?? "/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <section>
        <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Register</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Lab deneyimine kullanici olarak katil.</h1>
        <p className="mt-5 max-w-xl leading-8 text-slate-300">
          Public kayitlar her zaman `user` rolunde acilir. Admin yetkisi sadece seed veya admin panelinden verilebilir.
        </p>
      </section>

      <form onSubmit={onSubmit} className="glass-panel w-full rounded-[2rem] p-7">
        <label className="block text-sm text-slate-300">Ad Soyad</label>
        <input name="displayName" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-[#8bd3dd]/60" />
        <label className="mt-4 block text-sm text-slate-300">Kullanici adi</label>
        <input name="username" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-[#8bd3dd]/60" />
        <label className="mt-4 block text-sm text-slate-300">E-posta</label>
        <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-[#8bd3dd]/60" />
        <label className="mt-4 block text-sm text-slate-300">Sifre</label>
        <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-[#8bd3dd]/60" />

        {error ? <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

        <button disabled={loading} className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-[#dff8fb] disabled:opacity-60">
          {loading ? "Olusturuluyor..." : "Kullanici Olustur"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-400">
          Zaten hesabin var mi? <Link href="/login" className="text-[#8bd3dd] hover:text-white">Giris yap</Link>
        </p>
      </form>
    </div>
  );
}
