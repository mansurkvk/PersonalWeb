"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProductShowcaseItem } from "@/config/products";

const accentClasses: Record<ProductShowcaseItem["accent"], string> = {
  cyan: "border-[#8bd3dd]/40 bg-[#8bd3dd]/10 text-[#c9f8ff]",
  gold: "border-[#d5b46a]/40 bg-[#d5b46a]/10 text-[#ffe7a3]",
  green: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
};

function productContactHref(product: ProductShowcaseItem) {
  return `/contact?product=${encodeURIComponent(product.slug)}`;
}

export function ProductShowcaseCarousel({ products }: { products: ProductShowcaseItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (products.length === 0) return null;

  const activeProduct = products[activeIndex] ?? products[0]!;
  const capabilityPreview = useMemo(() => activeProduct.capabilities.slice(0, 4), [activeProduct]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [products.length]);

  function move(delta: number) {
    setActiveIndex((current) => (current + delta + products.length) % products.length);
  }

  return (
    <section className="relative overflow-hidden rounded-[2.8rem] bg-[#05070d] p-1 shadow-[0_36px_140px_rgba(0,0,0,0.48)]">
      <div className="glass-panel lab-border product-showroom-scan grid min-h-[640px] gap-8 overflow-hidden rounded-[2.65rem] p-5 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="relative grid min-h-[360px] place-items-center overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/25 lab-grid">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(139,211,221,0.18),transparent_42%),linear-gradient(120deg,transparent,rgba(213,180,106,0.08),transparent)]" />
          <div className="product-float relative h-[280px] w-full max-w-[620px] transition duration-700 md:h-[390px]">
            <Image
              key={activeProduct.image}
              src={activeProduct.image}
              alt={activeProduct.title}
              fill
              sizes="(max-width: 768px) 92vw, 56vw"
              className="object-contain drop-shadow-[0_0_42px_rgba(139,211,221,0.22)]"
              priority
            />
          </div>
          <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-center justify-between font-mono-lab text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">
            <span>Telemetry-ready</span>
            <span>Showroom {String(activeIndex + 1).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 font-mono-lab text-[0.65rem] uppercase tracking-[0.24em] ${accentClasses[activeProduct.accent]}`}>
              {activeProduct.category}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono-lab text-[0.65rem] uppercase tracking-[0.24em] text-slate-300">
              {activeProduct.status}
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-6xl">{activeProduct.title}</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">{activeProduct.description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {capabilityPreview.map((capability) => (
              <div key={capability} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-200">
                {capability}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-black/25 p-5">
            <p className="font-mono-lab text-xs uppercase tracking-[0.28em] text-[#8bd3dd]">Package contents</p>
            <ul className="mt-4 grid gap-2 text-sm text-slate-300">
              {activeProduct.packageContents.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-[#d5b46a] shadow-[0_0_16px_rgba(213,180,106,0.7)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={productContactHref(activeProduct)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#8bd3dd] px-6 text-sm font-semibold text-[#051017] transition hover:bg-white">
              {activeProduct.ctaLabel}
            </Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/10">
              Ozel teklif iste
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 lg:col-span-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => move(-1)} className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10" aria-label="Onceki urun">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => move(1)} className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10" aria-label="Sonraki urun">
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {products.map((product, index) => (
              <button
                key={product.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-12 bg-[#8bd3dd]" : "w-2.5 bg-white/20 hover:bg-white/40"}`}
                aria-label={`${product.title} goster`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
