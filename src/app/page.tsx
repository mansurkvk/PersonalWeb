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
  { icon: Radio, title: "ESP32 / Robot", text: "Device key ile HTTP ingest, ileride MQTT broker." },
  { icon: Server, title: "Next.js API", text: "Serverless route, validation, service katmani." },
  { icon: Database, title: "MongoDB", text: "Telemetry readings, devices, broker outbox." },
  { icon: Activity, title: "Dashboard", text: "Periyodik refresh, history ve raw payload preview." }
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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <SectionCard title="Live telemetry preview" eyebrow={isSample ? "Sample Data" : "Live Data"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Device" value={latest.deviceId} />
            <Metric label="Status" value={latest.deviceStatus ?? "unknown"} />
            <Metric label="Temperature" value={`${latest.temperature ?? "N/A"} C`} />
            <Metric label="Battery" value={`${latest.batteryPercent ?? "N/A"}%`} />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {isSample ? "Gercek ESP32 verisi gelene kadar bu alan sample data gosterir." : "Bu alan MongoDB uzerindeki son telemetry kaydindan beslenir."}
          </p>
          <Link href="/esp" className="mt-5 inline-block text-[#8bd3dd] hover:text-white">Dashboard sayfasina git</Link>
        </SectionCard>

        <SectionCard title="Device status preview" eyebrow="IoT Control">
          <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Connection</p>
                <p className="mt-1 text-2xl font-semibold text-white">{latest.deviceStatus ?? "standby"}</p>
              </div>
              <Cpu className="size-10 text-[#8bd3dd]" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
              <Metric label="Volt" value={`${latest.voltage ?? "N/A"}V`} compact />
              <Metric label="Amp" value={`${latest.current ?? "N/A"}A`} compact />
              <Metric label="RSSI" value={`${latest.signalStrength ?? "N/A"}`} compact />
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {architectureSteps.map((step) => (
            <div key={step.title} className="glass-panel rounded-[2rem] p-6">
              <step.icon className="size-6 text-[#d5b46a]" />
              <h2 className="mt-5 text-xl font-semibold text-white">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionCard title="Featured projects" eyebrow="Engineering Work">
          <div className="grid gap-3">
            {(projects.length ? projects : []).map((project) => (
              <Link key={String(project._id)} href={`/projects/${project.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-300 hover:bg-white/[0.07]">
                <span className="block font-semibold text-white">{project.title}</span>
                <span className="mt-1 block">{project.summary}</span>
              </Link>
            ))}
            {projects.length === 0 ? <p className="text-sm text-slate-400">Seed sonrasi one cikan projeler burada gorunecek.</p> : null}
          </div>
        </SectionCard>

        <SectionCard title="Recent blog posts" eyebrow="Technical Notes">
          <div className="grid gap-3">
            {posts.map((post) => (
              <Link key={String(post._id)} href={`/blog/${post.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-300 hover:bg-white/[0.07]">
                <span className="block font-semibold text-white">{post.title}</span>
                <span className="mt-1 block">{post.excerpt}</span>
              </Link>
            ))}
            {posts.length === 0 ? <p className="text-sm text-slate-400">Yayinlanmis blog yazisi eklenince burada listelenecek.</p> : null}
          </div>
        </SectionCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass-panel lab-border rounded-[2.4rem] p-8">
          <GitBranch className="size-7 text-[#8bd3dd]" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">Personal website + IoT dashboard + engineering lab platform.</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">{siteConfig.hero.longDescription}</p>
          <a href={siteConfig.links.oldSite} className="mt-6 inline-block rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10">
            Legacy Portfolio
          </a>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value, compact }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "rounded-2xl border border-white/10 bg-white/[0.035] p-4"}>
      <p className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className={compact ? "mt-1 text-base font-semibold text-white" : "mt-2 text-xl font-semibold text-white"}>{value}</p>
    </div>
  );
}
