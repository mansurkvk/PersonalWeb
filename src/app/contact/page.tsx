import type { Metadata } from "next";
import { Bot, Cpu, Mail, RadioTower } from "lucide-react";
import { findProductBySlug } from "@/config/products";
import { readSession } from "@/lib/auth/session";
import { ContactForm } from "@/features/contact/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Iletisim",
  description: "Robotik urun talepleri, IoT telemetry cozumleri, teknik danismanlik ve ozel muhendislik sistemleri icin iletisim formu."
};

const requestAreas = [
  { title: "Robotik urun talepleri", description: "Hexapod, quadruped, drone, konveyor ve robot kol platformlari.", icon: Bot },
  { title: "IoT telemetry cozumleri", description: "ESP32 veri toplama, MongoDB kayit, dashboard ve broker mimarisi.", icon: RadioTower },
  { title: "Teknik danismanlik", description: "Mekatronik, otomasyon, kontrol ve web tabanli izleme akislari.", icon: Cpu },
  { title: "Ozel muhendislik sistemleri", description: "Urun fikrinden prototipe kadar moduler sistem gelistirme.", icon: Mail }
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const params = await searchParams;
  const product = findProductBySlug(params.product);
  const session = await readSession();

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <section className="page-section mx-auto grid max-w-7xl gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Contact Channel</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white md:text-7xl">Engineering request line</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Robotik platform, IoT telemetry paketi, teknik danismanlik veya ozel muhendislik sistemi icin talebini yaz. Mesajlar guvenli sekilde MongoDB contactMessages koleksiyonuna kaydedilir.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {requestAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article key={area.title} className="glass-panel lab-border rounded-[1.8rem] p-5">
                  <Icon className="size-6 text-[#8bd3dd]" />
                  <h2 className="mt-4 text-lg font-semibold text-white">{area.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{area.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <ContactForm product={product} sessionEmail={session?.email} sessionDisplayName={session?.displayName} />
      </section>
    </div>
  );
}
