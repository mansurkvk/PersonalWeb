import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { siteConfig } from "@/config/site";

const hudItems = [
  "ROBOTICS SYSTEMS",
  "ESP32 TELEMETRY",
  "EXPERIMENTAL PHYSICS",
  "AI ENGINEERING"
];

const heroTitleLines = ["ROBOTICS", "PHYSICS", "MATHS", "ENGINEERING"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-end px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
        <div className="hero-copy max-w-[42rem]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 font-mono-lab text-[11px] uppercase tracking-[0.28em] text-slate-200 shadow-[0_0_40px_rgba(139,211,221,0.08)] backdrop-blur-2xl">
            <FlaskConical className="size-4 text-[#d5b46a]" />
            {siteConfig.hero.eyebrow}
          </div>

          <h1 className="grid max-w-[37rem] gap-2 text-5xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-[5.65rem]">
            {heroTitleLines.map((line, index) => (
              <span
                key={line}
                className="hero-title-line inline-flex w-fit rounded-[1.15rem] border border-white/[0.06] bg-black/[0.08] px-1.5 py-0.5 backdrop-blur-[2px]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-lg text-pretty text-base leading-8 text-slate-300 sm:text-lg">
            Mekatronik, robotik ve gerçek zamanlı IoT sistemlerini; fizik odakli düşünce ve deneysel muhendislik yaklaşımıyla tek bir teknik laboratuvar platformunda topluyorum.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/projects" className="group rounded-full bg-white px-6 py-3 font-semibold text-slate-950 shadow-[0_18px_55px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:bg-[#dff8fb]">
              Projeleri Incele <ArrowRight className="ml-2 inline size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/esp" className="rounded-full border border-[#8bd3dd]/30 bg-black/25 px-6 py-3 font-semibold text-[#c9f8ff] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#8bd3dd]/14">
              ESP Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-hud mt-14 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {hudItems.map((item, index) => (
            <div key={item} className="hud-chip motion-card" style={{ animationDelay: `${index * 90}ms` }}>
              <span className="hud-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
