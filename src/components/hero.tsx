import Link from "next/link";
import { Activity, ArrowRight, Atom, Cpu, FlaskConical, Radio, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SplineRobotStage } from "@/components/spline-robot-stage";

const pillars = [
  { icon: Cpu, title: "Robotics & IoT", text: "ANKEBOT, ESP32 telemetry ve sensor tabanli deneysel sistemler." },
  { icon: Atom, title: "Physics & Quantum", text: "Fizik odakli arastirma, quantum programming ve QBrick deneyimi." },
  { icon: Activity, title: "AI Engineering", text: "Makine ogrenmesi, veri akislari ve genisletilebilir platform mimarisi." }
];

const systemStats = [
  { label: "Platform", value: "PersonalWeb Lab" },
  { label: "Telemetry", value: "ESP32 Ready" },
  { label: "Architecture", value: "MongoDB + API" }
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-8">
      <div className="absolute inset-0 -z-20 bg-[#05070d]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 lab-grid opacity-45" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_28%,rgba(139,211,221,0.22),transparent_30%),radial-gradient(circle_at_74%_18%,rgba(213,180,106,0.16),transparent_28%),linear-gradient(180deg,rgba(5,7,13,0)_0%,#05070d_92%)]" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#8bd3dd]/10 blur-3xl" aria-hidden="true" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 font-mono-lab text-xs uppercase tracking-[0.25em] text-slate-200 shadow-[0_0_40px_rgba(139,211,221,0.08)] backdrop-blur-xl">
            <FlaskConical className="size-4 text-[#d5b46a]" />
            {siteConfig.hero.eyebrow}
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            {siteConfig.hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {siteConfig.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/esp" className="group rounded-full bg-white px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_55px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:bg-[#dff8fb]">
              ESP Dashboard <ArrowRight className="ml-2 inline size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/projects" className="rounded-full border border-[#8bd3dd]/30 bg-[#8bd3dd]/10 px-6 py-3 font-semibold text-[#c9f8ff] transition hover:-translate-y-0.5 hover:bg-[#8bd3dd]/18">
              Projeleri Incele
            </Link>
            <Link href="/blog" className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
              Blog Yazilari
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {systemStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/35 hover:bg-white/[0.07]">
                <p className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-0">
          <div className="absolute -left-10 top-12 z-10 hidden rounded-2xl border border-[#8bd3dd]/20 bg-black/35 p-4 shadow-[0_0_60px_rgba(139,211,221,0.16)] backdrop-blur-xl xl:block">
            <div className="flex items-center gap-3">
              <Radio className="size-5 text-[#8bd3dd]" />
              <div>
                <p className="font-mono-lab text-[10px] uppercase tracking-[0.2em] text-slate-500">Signal</p>
                <p className="text-sm font-semibold text-white">Online telemetry channel</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-7 bottom-24 z-10 hidden rounded-2xl border border-[#d5b46a]/20 bg-black/35 p-4 shadow-[0_0_60px_rgba(213,180,106,0.12)] backdrop-blur-xl xl:block">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-[#d5b46a]" />
              <div>
                <p className="font-mono-lab text-[10px] uppercase tracking-[0.2em] text-slate-500">Control</p>
                <p className="text-sm font-semibold text-white">Lab-grade interface</p>
              </div>
            </div>
          </div>
          <SplineRobotStage />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {pillars.map((item, index) => (
          <div key={item.title} className="glass-panel motion-card rounded-[2rem] p-6" style={{ animationDelay: `${index * 110}ms` }}>
            <item.icon className="mb-5 size-6 text-[#8bd3dd]" />
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
