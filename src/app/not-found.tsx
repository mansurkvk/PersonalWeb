import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-4xl place-items-center px-4 py-16">
      <div className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="font-mono-lab text-xs uppercase tracking-[0.3em] text-[#8bd3dd]">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Sayfa bulunamadı.</h1>
        <Link href="/" className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
