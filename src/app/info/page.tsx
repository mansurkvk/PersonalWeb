import { SectionCard } from "@/components/section-card";
import { siteConfig } from "@/config/site";

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Info</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Harezmi Robotics ve IoT Sistemleri</h1>
        <p className="mt-5 leading-8 text-slate-300">{siteConfig.owner.positioning}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <SectionCard title="Ben kimim?" eyebrow="Profile">
          Ben Muhammed Mansur KAVAK, mühendisim ve Harezmi Robotics ve IoT Sistemleri Firmasının kurucusuyum. 
        </SectionCard>
        <SectionCard title="Arastirma ekseni" eyebrow="Research">
          Akıllı Makineler, IoT Sistemleri, İnsansı Robotlar, Bilgisayarlar, Güncel Teknolojiler ve Deneysel Mühendislik
        </SectionCard>
        <SectionCard title="Quantum & AI" eyebrow="Highlights">
          Kuantum programlama, yapay zekâ ve ileri algoritmalar üzerine geliştirilen araştırma odaklı çalışmalar. Hesaplama, optimizasyon, veri analizi ve akıllı sistem yaklaşımları geleceğin mühendislik problemlerine çözüm üretmek için ele alınır.
        </SectionCard>
        <SectionCard title="Iletisim" eyebrow="Connect">
          <a href={siteConfig.links.email} className="text-[#8bd3dd] hover:text-white">{siteConfig.owner.email}</a>
        </SectionCard>
      </div>
    </div>
  );
}
