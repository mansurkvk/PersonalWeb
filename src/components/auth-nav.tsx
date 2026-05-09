import Link from "next/link";
import { readSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/logout-button";

export async function AuthNav() {
  const session = await readSession();

  if (!session) {
    return (
      <>
        <Link
          href="/register"
          className="hidden rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-slate-100 backdrop-blur-xl transition hover:bg-white/10 sm:inline-flex"
        >
          Kayit Ol
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-slate-100 backdrop-blur-xl transition hover:bg-white/10"
        >
          Giris
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/profile"
        className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-slate-100 backdrop-blur-xl transition hover:bg-white/10"
      >
        Profil
      </Link>
      {session.role === "admin" ? (
        <Link
          href="/admin"
          className="rounded-full border border-[#8bd3dd]/30 bg-[#8bd3dd]/10 px-4 py-2 text-sm font-semibold text-[#c9f8ff] backdrop-blur-xl transition hover:bg-[#8bd3dd]/18 hover:text-white"
        >
          Admin
        </Link>
      ) : null}
      <LogoutButton />
    </>
  );
}
