import Link from "next/link";
import { Activity, ArrowRight, Atom, Cpu, FlaskConical } from "lucide-react";
import { siteConfig } from "@/config/site";

const pillars = [
  { icon: Cpu, title: "Robotics & IoT", text: "ANKEBOT, ESP32 telemetry ve sensor tabanli deneysel sistemler." },
  { icon: Atom, title: "Physics & Quantum", text: "Fizik odakli arastirma, quantum programming ve QBrick deneyimi." },
  { icon: Activity, title: "AI Engineering", text: "Makine ogrenmesi, veri akislari ve genisletilebilir platform mimarisi." }
];

// Ana sayfa hero bolumu public/images/hero.png gorselini kontrollu overlay ile kullanir.
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 saturate-[0.85]"
        style={{ backgroundImage: "url('/images/hero.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080f]/55 via-[#06080f]/84 to-[#06080f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_36%,rgba(139,211,221,0.18),transparent_34%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 font-mono-lab text-xs uppercase tracking-[0.25em] text-slate-200">
            <FlaskConical className="size-4 text-[#d5b46a]" />
            {siteConfig.hero.eyebrow}
          </div>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            {siteConfig.hero.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {siteConfig.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/esp" className="group rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-[#dff8fb]">
              ESP Dashboard <ArrowRight className="ml-2 inline size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/projects" className="rounded-full border border-[#8bd3dd]/30 bg-[#8bd3dd]/10 px-6 py-3 font-semibold text-[#c9f8ff] transition hover:bg-[#8bd3dd]/18">
              Projeleri Incele
            </Link>
            <Link href="/blog" className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Blog Yazilari
            </Link>
            <a href={siteConfig.links.oldSite} className="rounded-full border border-white/10 bg-transparent px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
              Eski Site
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title} className="glass-panel rounded-[2rem] p-6">
              <item.icon className="mb-5 size-6 text-[#8bd3dd]" />
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
