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
  { icon: Radio, title: "Device", text: "ESP32, robot platformlari ve sensor katmani." },
  { icon: Server, title: "API", text: "Validation, service akisi ve temiz backend mantigi." },
  { icon: Database, title: "Data", text: "MongoDB uzerinde telemetry, proje ve icerik kayitlari." },
  { icon: Activity, title: "Interface", text: "Dashboard, lab panelleri ve teknik yayin arayuzleri." }
];

const focusBlocks = [
  {
    title: "Robotics Systems",
    text: "Hareket eden, algilayan ve veri ureten robotik sistemler. Servo mimarisi, guc dagitimi, gomulu kontrol ve mekanik tasarim tek bir muhendislik butunu olarak ele alinir."
  },
  {
    title: "Telemetry Infrastructure",
    text: "ESP32 tabanli cihazlardan gelen veriler okunabilir dashboardlara, kayit sistemlerine ve gelecekte broker tabanli gercek zamanli altyapilara donusur."
  },
  {
    title: "Experimental Engineering",
    text: "Fiziksel sezgi, teorik dusunce ve prototipleme bir arada kullanilir. Amac yalnizca gorsel bir portfolyo degil, gelisen bir teknik laboratuvar kurmaktir."
  }
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

      <section className="page-section mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="font-mono-lab text-xs uppercase tracking-[0.28em] text-[#8bd3dd]">What this is</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
              Not just a portfolio. A growing engineering platform.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">
            PersonalWeb; robotik projeler, telemetry akislari, deneysel fikirler, teknik notlar ve IoT arayuzlerini ayni teknik kimlik altinda toplayan uzun vadeli bir muhendislik laboratuvaridir.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {focusBlocks.map((item, index) => (
            <div key={item.title} className="glass-panel motion-card rounded-[2.2rem] p-7" style={{ animationDelay: `${index * 100}ms` }}>
              <p className="font-mono-lab text-[10px] uppercase tracking-[0.24em] text-slate-500">0{index + 1}</p>
              <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <SectionCard title="Live telemetry" eyebrow={isSample ? "Sample Data" : "Live Data"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Device" value={latest.deviceId} />
            <Metric label="Status" value={latest.deviceStatus ?? "unknown"} />
            <Metric label="Temperature" value={`${latest.temperature ?? "N/A"} C`} />
            <Metric label="Battery" value={`${latest.batteryPercent ?? "N/A"}%`} />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {isSample ? "Gercek cihaz verisi gelene kadar sample telemetry gosterilir." : "Bu alan MongoDB uzerindeki son telemetry kaydindan beslenir."}
          </p>
          <Link href="/esp" className="mt-6 inline-flex rounded-full border border-[#8bd3dd]/30 bg-[#8bd3dd]/10 px-5 py-3 text-sm font-semibold text-[#c9f8ff] transition hover:bg-[#8bd3dd]/18 hover:text-white">
            Dashboarda Git
          </Link>
        </SectionCard>

        <SectionCard title="Control surface" eyebrow="IoT Control">
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
        </SectionCard>
      </section>

      <section className="page-section mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-lab text-xs uppercase tracking-[0.28em] text-[#8bd3dd]">Architecture</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">From device data to engineering interface.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            Sistem yalnizca gorunum degil; API, veri katmani, dashboard ve gelecekteki broker yapisi icin genisleyebilir bir temel sunar.
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

      <section className="page-section mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionCard title="Selected projects" eyebrow="Engineering Work">
          <div className="grid gap-3">
            {(projects.length ? projects : []).map((project) => (
              <Link key={String(project._id)} href={`/projects/${project.slug}`} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300 transition hover:border-[#8bd3dd]/30 hover:bg-white/[0.07]">
                <span className="block font-semibold text-white">{project.title}</span>
                <span className="mt-1 block">{project.summary}</span>
              </Link>
            ))}
            {projects.length === 0 ? <p className="text-sm text-slate-400">One cikan projeler burada listelenecek.</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="Technical notes" eyebrow="Research & Writing">
          <div className="grid gap-3">
            {posts.map((post) => (
              <Link key={String(post._id)} href={`/blog/${post.slug}`} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300 transition hover:border-[#8bd3dd]/30 hover:bg-white/[0.07]">
                <span className="block font-semibold text-white">{post.title}</span>
                <span className="mt-1 block">{post.excerpt}</span>
              </Link>
            ))}
            {posts.length === 0 ? <p className="text-sm text-slate-400">Teknik notlar yayinlandikca burada gorunecek.</p> : null}
          </div>
        </SectionCard>
      </section>

      <section className="page-section mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="glass-panel lab-border rounded-[2.6rem] p-8 sm:p-12">
          <GitBranch className="size-7 text-[#8bd3dd]" />
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Built to evolve.</h2>
          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            Bu platform uzun vadede robotik arastirma alani, ESP32 cloud interface, telemetry altyapisi ve teknik yayin merkezi olarak genisleyecek sekilde tasarlandi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
