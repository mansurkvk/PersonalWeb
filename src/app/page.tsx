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
    text: "Çevresini algılayan, hareket kabiliyeti kazanan ve sürekli veri üreten robotik yapılar. Servo kontrolü, güç yönetimi, gömülü yazılım ve mekanik tasarım bütüncül bir mühendislik yaklaşımıyla geliştirilir."
  },
  {
    title: "Telemetry Infrastructure",
    text: "Saha cihazlarından gelen verileri toplayan, işleyen ve izlenebilir hale getiren altyapı. Sensör akışı, veri aktarımı, kayıt yönetimi ve gerçek zamanlı takip tek bir mühendislik sistemi olarak ele alınır."
  },
  {
    title: "Experimental Engineering",
    text: "Fikirleri test düzeneklerine dönüştüren, ölçüm ve gözlemle doğrulayan deneysel mühendislik yaklaşımı. Prototipleme, analiz, veri toplama ve tasarım iyileştirme tek bir geliştirme süreci olarak ele alınır."
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
    deviceStatus: "active",
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
              An Engineering Platform
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">
            Robotik, IoT, fizik ve deneysel mühendislik alanlarında üretim odaklı çalışan çok disiplinli mühendisim. Fikirleri prototipe, veriyi sisteme ve teknik bilgiyi uygulanabilir projelere dönüştürüyorum.
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
            {isSample ? "MongoDB cihaz verisi yerine yerel veriler gösterilmektedir." : "Bu alan MongoDB üzerindeki son telemetry kaydından veri almaktadır."}
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
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">From Device Data to Engineering Interface Turning Raw Signals Into Engineered Insight</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            API’ler, veri sunucuları, aygıtlar ve kullanıcı arayüzü arasında güvenilir bir köprü kuran altyapı. Ham cihaz verisi, düzenli veri akışına ve anlamlı mühendislik ekranlarına dönüştürülür
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
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Built to Evolve</h2>
          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            Bir mühendislik sistemi yalnızca çalışmak için değil, değişen ihtiyaçlara uyum sağlamak, yeni verilerle güçlenmek ve her geliştirme döngüsünde daha akıllı hale gelmek için tasarlanmalıdır. Bugünün prototipi, doğru mimariyle yarının ölçeklenebilir teknolojisine dönüşür.
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
