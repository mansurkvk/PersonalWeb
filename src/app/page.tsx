import Link from "next/link";
import { Activity, Cpu, Database, GitBranch, Radio, Server } from "lucide-react";
import { Hero } from "@/components/hero";
import { SectionCard } from "@/components/section-card";
import { siteConfig } from "@/config/site";
import { listBlogPosts } from "@/repositories/blog.repository";
import { listProjects } from "@/repositories/projects.repository";
import { listLatestReadings } from "@/repositories/telemetry.repository";

export const dynamic = "force-dynamic";

const architectureSteps = [
  { icon: Radio, title: "Device Layer", text: "ESP32, robot platformlari ve sensorlerden gelen ham veriler guvenli ingest akisi ile sisteme alinir." },
  { icon: Server, title: "API & Service Layer", text: "Next.js API route, validation, service katmani ve okunabilir is mantigi ile temiz bir backend akisi kurulur." },
  { icon: Database, title: "Data Layer", text: "MongoDB uzerinde telemetry readings, devices, projects, blog posts ve gelecekteki broker kayitlari tutulur." },
  { icon: Activity, title: "Interface Layer", text: "Dashboard, lab panelleri ve teknik sayfalar veriyi okunabilir bir muhendislik arayuzune donusturur." }
];

function sampleReading() {
  return {
    deviceId: "esp32-lab-01",
    temperature: 31.2,
    humidity: 48,
    voltage: 4.92,
    current: 0.42,
    batteryPercent: 86,
    signalStrength: -57,
    deviceStatus: "sample-online",
    motionState: "idle",
    createdAt: new Date(),
    sample: true
  };
}

export default async function HomePage() {
  const [readings, projects, posts] = await Promise.all([
    listLatestReadings(1).catch(() => []),
    listProjects({ featured: true, limit: 4 }).catch(() => []),
    listBlogPosts({ status: "published", limit: 3 }).catch(() => [])
  ]);
  const latest = readings[0] ?? sampleReading();
  const isSample = readings.length === 0;

  return (
    <>
      <Hero />

      <section className="page-section mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <SectionCard title="Live telemetry preview" eyebrow={isSample ? "Sample Data" : "Live Data"}>
          <p className="mb-6 text-sm leading-7 text-slate-400">
            Gercek zamanli cihaz verileri, telemetry akislari ve sistem durumu bu alanda gorsellestirilir. Amac yalnizca veri gostermek degil; veriyi okunabilir, izlenebilir ve muhendislik odakli bir arayuz icinde sunmaktir.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Device" value={latest.deviceId} />
            <Metric label="Status" value={latest.deviceStatus ?? "unknown"} />
            <Metric label="Temperature" value={`${latest.temperature ?? "N/A"} C`} />
            <Metric label="Battery" value={`${latest.batteryPercent ?? "N/A"}%`} />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {isSample ? "Gercek ESP32 verisi gelene kadar bu alan sample data ile sistem hissini korur." : "Bu alan MongoDB uzerindeki son telemetry kaydindan beslenir."}
          </p>
          <Link href="/esp" className="mt-6 inline-flex rounded-full border border-[#8bd3dd]/30 bg-[#8bd3dd]/10 px-5 py-3 text-sm font-semibold text-[#c9f8ff] transition hover:bg-[#8bd3dd]/18 hover:text-white">
            Dashboard'a Git
          </Link>
        </SectionCard>

        <SectionCard title="Engineering control surface" eyebrow="IoT Control">
          <div className="engineering-surface rounded-[1.6rem] border border-white/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">Connection</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{latest.deviceStatus ?? "standby"}</p>
              </div>
              <Cpu className="size-10 text-[#8bd3dd]" />
            </div>
            <div className="mt-7 grid grid-cols-3 gap-3 text-center text-sm">
              <Metric label="Volt" value={`${latest.voltage ?? "N/A"}V`} compact />
              <Metric label="Amp" value={`${latest.current ?? "N/A"}A`} compact />
              <Metric label="RSSI" value={`${latest.signalStrength ?? "N/A"}`} compact />
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            Bu kontrol yuzeyi ileride broker izleme, cihaz yetkilendirme, alarm durumlari ve robot sistem sagligi gibi panellere genisleyebilecek sekilde dusunuldu.
          </p>
        </SectionCard>
      </section>

      <section className="page-section mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="font-mono-lab text-xs uppercase tracking-[0.28em] text-[#8bd3dd]">System Architecture</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">A personal engineering lab built as a real platform.</h2>
          <p className="mt-4 leading-8 text-slate-300">
            Bu site yalnizca bir portfolyo degil; robotik projeler, teknik notlar, telemetry akislari, admin arayuzleri ve gelecekteki IoT broker sistemleri icin genisletilebilir bir muhendislik altyapisidir.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {architectureSteps.map((step, index) => (
            <div key={step.title} className="glass-panel motion-card rounded-[2rem] p-6" style={{ animationDelay: `${index * 90}ms` }}>
              <step.icon className="size-6 text-[#d5b46a]" />
              <h2 className="mt-5 text-xl font-semibold text-white">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionCard title="Selected projects" eyebrow="Engineering Work">
          <p className="mb-5 text-sm leading-7 text-slate-400">
            Robotik, telemetry, gomulu sistemler ve deneysel muhendislik alanlarinda gelistirdigim calismalar. Her proje yalnizca bir cikti degil; teknik yaklasimimi ve gelistirme felsefemi de yansitir.
          </p>
          <div className="grid gap-3">
            {(projects.length ? projects : []).map((project) => (
              <Link key={String(project._id)} href={`/projects/${project.slug}`} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300 transition hover:border-[#8bd3dd]/30 hover:bg-white/[0.07]">
                <span className="block font-semibold text-white">{project.title}</span>
                <span className="mt-1 block">{project.summary}</span>
              </Link>
            ))}
            {projects.length === 0 ? <p className="text-sm text-slate-400">Seed sonrasi one cikan projeler burada gorunecek.</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="Technical notes" eyebrow="Research & Writing">
          <p className="mb-5 text-sm leading-7 text-slate-400">
            Muhendislik surecleri, deneysel fikirler, sistem mimarileri, teknik gozlemler ve ogrenilen dersler bu bolumde duzenli bir teknik arsive donusur.
          </p>
          <div className="grid gap-3">
            {posts.map((post) => (
              <Link key={String(post._id)} href={`/blog/${post.slug}`} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300 transition hover:border-[#8bd3dd]/30 hover:bg-white/[0.07]">
                <span className="block font-semibold text-white">{post.title}</span>
                <span className="mt-1 block">{post.excerpt}</span>
              </Link>
            ))}
            {posts.length === 0 ? <p className="text-sm text-slate-400">Yayinlanmis blog yazisi eklenince burada teknik notlar listelenecek.</p> : null}
          </div>
        </SectionCard>
      </section>

      <section className="page-section mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="glass-panel lab-border rounded-[2.4rem] p-8 sm:p-10">
          <GitBranch className="size-7 text-[#8bd3dd]" />
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">A personal engineering lab — built to evolve.</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            Bu platform uzun vadede robotik arastirma alani, ESP32 cloud interface, telemetry altyapisi, teknik yayin merkezi ve deneysel muhendislik ekosistemi olarak genisleyecek sekilde tasarlandi.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/info" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#dff8fb]">
              Yapiyi Kesfet
            </Link>
            <a href={siteConfig.links.oldSite} className="rounded-full border border-white/10 bg-black/30 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
              Legacy Portfolio
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value, compact }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "rounded-2xl border border-white/10 bg-black/30 p-4"}>
      <p className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className={compact ? "mt-1 text-base font-semibold text-white" : "mt-2 text-xl font-semibold text-white"}>{value}</p>
    </div>
  );
}
