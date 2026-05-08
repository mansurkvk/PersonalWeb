"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-4xl place-items-center px-4 py-16">
      <div className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="font-mono-lab text-xs uppercase tracking-[0.3em] text-red-200">Error</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Bir seyler ters gitti.</h1>
        <p className="mt-3 text-slate-300">Sayfayi tekrar denemek icin asagidaki butonu kullanabilirsin.</p>
        <button onClick={reset} className="mt-6 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">
          Tekrar dene
        </button>
      </div>
    </div>
  );
}
