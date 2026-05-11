"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={logout}
      className="rounded-full border border-red-300/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-100 backdrop-blur-xl transition hover:bg-red-400/15 disabled:opacity-60"
    >
      {loading ? "Çıkılıyor..." : "Çıkış"}
    </button>
  );
}
