import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, RadioTower } from "lucide-react";
import { iotProducts, roboticsProducts, products } from "@/config/products";
import type { ProductShowcaseItem } from "@/config/products";
import { ProductShowcaseCarousel } from "@/features/products/product-showcase-carousel";

const accentRing: Record<ProductShowcaseItem["accent"], string> = {
  cyan: "group-hover:border-[#8bd3dd]/40 group-hover:shadow-[0_0_60px_rgba(139,211,221,0.1)]",
  gold: "group-hover:border-[#d5b46a]/40 group-hover:shadow-[0_0_60px_rgba(213,180,106,0.1)]",
  green: "group-hover:border-emerald-300/40 group-hover:shadow-[0_0_60px_rgba(110,231,183,0.1)]"
};

function contactHref(product: ProductShowcaseItem) {
  return `/contact?product=${encodeURIComponent(product.slug)}`;
}

function ProductCard({ product }: { product: ProductShowcaseItem }) {
  return (
    <article className={`group glass-panel lab-border overflow-hidden rounded-[2rem] p-5 ${accentRing[product.accent]}`}>
      <div className="relative h-48 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 lab-grid">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 92vw, 30vw" className="object-contain p-6 transition duration-500 group-hover:scale-105" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-semibold text-white">{product.title}</h3>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono-lab text-[0.62rem] uppercase tracking-[0.18em] text-slate-300">{product.status}</span>
      </div>
      <p className="mt-3 min-h-16 text-sm leading-6 text-slate-300">{product.summary}</p>
      <ul className="mt-5 grid gap-2 text-sm text-slate-300">
        {product.capabilities.slice(0, 3).map((capability) => (
          <li key={capability} className="flex gap-2">
            <span className="mt-2 size-1.5 rounded-full bg-[#8bd3dd]" />
            <span>{capability}</span>
          </li>
        ))}
      </ul>
      <Link href={contactHref(product)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#8bd3dd]/25 bg-[#8bd3dd]/10 px-5 text-sm font-semibold text-[#c9f8ff] transition hover:bg-[#8bd3dd] hover:text-[#051017]">
        Bu urunle ilgileniyorum
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

function IotPackageCard({ product, featured = false }: { product: ProductShowcaseItem; featured?: boolean }) {
  return (
    <article className={`glass-panel lab-border rounded-[2.2rem] p-6 ${featured ? "border-[#d5b46a]/30 bg-[#d5b46a]/[0.055]" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-lab text-xs uppercase tracking-[0.28em] text-[#8bd3dd]">IoT Package</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{product.title}</h3>
        </div>
        {featured ? <span className="rounded-full bg-[#d5b46a] px-3 py-1 text-xs font-semibold text-[#151007]">Onerilen</span> : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{product.summary}</p>
      <div className="relative mt-5 h-36 rounded-[1.4rem] border border-white/10 bg-black/25 lab-grid">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 92vw, 28vw" className="object-contain p-5" />
      </div>
      <div className="mt-6 grid gap-2 text-sm text-slate-300">
        {product.packageContents.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <p className="font-mono-lab text-xs uppercase tracking-[0.24em] text-slate-400">Use cases</p>
        <p className="mt-2 text-sm text-slate-300">{product.useCases.join(" · ")}</p>
      </div>
      <Link href={contactHref(product)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#05070d] transition hover:bg-[#8bd3dd]">
        Paket hakkinda sor
      </Link>
    </article>
  );
}

export function ProductsPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <section className="page-section mx-auto max-w-7xl pb-12 pt-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Engineering Products</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Robotics platforms and IoT systems built for real deployment
            </h1>
          </div>
          <div className="glass-panel lab-border rounded-[2rem] p-6">
            <p className="text-lg leading-8 text-slate-300">
              Robotik sistemler, egitim platformlari, uretim otomasyonu ve IoT telemetry paketleri icin gelistirilebilir urun vitrini.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#8bd3dd] px-6 text-sm font-semibold text-[#051017] transition hover:bg-white">
                Iletisime Gec
              </Link>
              <Link href="#iot-packages" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/10">
                IoT Paketlerini Gor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-8">
        <ProductShowcaseCarousel products={products} />
      </section>

      <section className="page-section mx-auto max-w-7xl py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Robotics Platforms</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">Robotik urun vitrini</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Boxes className="size-4 text-[#d5b46a]" />
            Modular engineering lab systems
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roboticsProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section id="iot-packages" className="page-section mx-auto max-w-7xl py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">IoT Telemetry</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">Basic / Pro / Ultra paketleri</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <RadioTower className="size-4 text-[#8bd3dd]" />
            ESP32, MongoDB, dashboard and broker-ready flow
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {iotProducts.map((product) => (
            <IotPackageCard key={product.slug} product={product} featured={product.slug === "iot-pro"} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl pb-20">
        <div className="glass-panel lab-border rounded-[2.5rem] p-8 text-center md:p-12">
          <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#d5b46a]">Custom Engineering Request</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold text-white">Bir robot veya IoT sistemi icin ozel teklif almak ister misin?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Urun, egitim, prototip veya telemetry altyapisi ihtiyacini yaz; sistem talebini contactMessages koleksiyonuna kaydeder.</p>
          <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#d5b46a] px-7 text-sm font-semibold text-[#151007] transition hover:bg-white">
            Iletisime Gec
          </Link>
        </div>
      </section>
    </div>
  );
}
