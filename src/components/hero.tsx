import Link from "next/link";
import { Activity, ArrowRight, Atom, Cpu, FlaskConical } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SplineRobotStatusPanel } from "@/components/spline-robot-stage";

const pillars = [
  { icon: Cpu, title: "Robotics Systems", text: "Hexapod platformlari, servo mimarileri, hareket kontrolu ve gomulu robotik sistemler." },
  { icon: Activity, title: "Telemetry Infrastructure", text: "ESP32 veri akisi, canli izleme, MongoDB kayitlari ve dashboard odakli IoT altyapisi." },
  { icon: Atom, title: "Physics-driven Engineering", text: "Fiziksel dusunce, deneysel sistemler ve teorik yaklasimi muhendislikle birlestiren calismalar." }
];

const systemStats = [
  { label: "Focus", value: "Robotics Systems" },
  { label: "Infrastructure", value: "Telemetry + IoT" },
  { label: "Research", value: "Physics-driven" }
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-center px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="max-w-4xl hero-copy">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 font-mono-lab text-xs uppercase tracking-[0.25em] text-slate-200 shadow-[0_0_40px_rgba(139,211,221,0.08)] backdrop-blur-2xl">
            <FlaskConical className="size-4 text-[#d5b46a]" />
            {siteConfig.hero.eyebrow}
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-[5.35rem]">
            Experimental robotics, telemetry and physics-driven engineering.
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-slate-300 sm:text-lg">
            Robotik sistemler, ESP32 tabanli telemetry altyapilari, yapay zeka uygulamalari ve fizik odakli deneysel muhendislik calismalarimi modern ve olceklenebilir bir dijital laboratuvar yapisinda sunuyorum.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/projects" className="group rounded-full bg-white px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_55px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:bg-[#dff8fb]">
              Projeleri Incele <ArrowRight className="ml-2 inline size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/esp" className="rounded-full border border-[#8bd3dd]/30 bg-[#8bd3dd]/10 px-6 py-3 font-semibold text-[#c9f8ff] transition hover:-translate-y-0.5 hover:bg-[#8bd3dd]/18">
              ESP Dashboard
            </Link>
            <Link href="/blog" className="rounded-full border border-white/10 bg-black/30 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10">
              Teknik Yazilar
            </Link>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {systemStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/35 hover:bg-black/45">
                <p className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-3xl hero-interactive-panel">
          <SplineRobotStatusPanel />
        </div>
      </div>

      <div className="page-section mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
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
