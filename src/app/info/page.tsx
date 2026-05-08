import { SectionCard } from "@/components/section-card";
import { siteConfig } from "@/config/site";

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Info</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Muhendislik, fizik ve deneysel sistemler icin kisisel lab.</h1>
        <p className="mt-5 leading-8 text-slate-300">{siteConfig.owner.positioning}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <SectionCard title="Ben kimim?" eyebrow="Profile">
          Mekatronik, robotik, ESP32, yapay zeka, quantum programming ve fizik odakli projeleri bir araya getiren teknik bir uretim alani insa ediyorum.
        </SectionCard>
        <SectionCard title="Arastirma ekseni" eyebrow="Research">
          Ana odak; intelligent machines, sensor telemetry, fizik temelli modelleme, gomulu sistemler ve genisletilebilir full-stack platform mimarisi.
        </SectionCard>
        <SectionCard title="Quantum & AI" eyebrow="Highlights">
          QBrick / Quantum Genesis deneyimi, machine learning calismalari ve teknik notlar ilerleyen asamalarda blog ve proje vitrini icinde detaylanacak.
        </SectionCard>
        <SectionCard title="Iletisim" eyebrow="Connect">
          <a href={siteConfig.links.email} className="text-[#8bd3dd] hover:text-white">{siteConfig.owner.email}</a>
        </SectionCard>
      </div>
    </div>
  );
}
