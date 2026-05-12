"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Clock,
  Cpu,
  Database,
  Gauge,
  Radio,
  RefreshCw,
  Route,
  Server,
  Signal,
  ThermometerSun,
  Wifi,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { iotConfig } from "@/config/iot.config";

export type EspReading = {
  id?: string;
  deviceId: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  voltage?: number;
  current?: number;
  batteryPercent?: number;
  signalStrength?: number;
  distance?: number;
  motionState?: string;
  deviceStatus?: string;
  uptime?: number;
  errorCode?: string;
  firmwareVersion?: string;
  locationLabel?: string;
  source?: string;
  rawPayload?: Record<string, unknown>;
  createdAt?: string;
  isSample?: boolean;
};

export type EspDevice = {
  id?: string;
  deviceId: string;
  name: string;
  type?: string;
  location?: string;
  locationLabel?: string;
  firmwareVersion?: string;
  isActive?: boolean;
  lastSeenAt?: string;
};

type FetchState = "idle" | "syncing" | "online" | "empty" | "error";

const sampleReadings: EspReading[] = [
  {
    deviceId: "esp32-lab-01",
    temperature: 31.2,
    humidity: 48.5,
    pressure: 1012.4,
    voltage: 4.92,
    current: 0.42,
    batteryPercent: 86,
    signalStrength: -57,
    distance: 23.8,
    motionState: "idle",
    deviceStatus: "sample-online",
    uptime: 12840,
    firmwareVersion: "1.0.0",
    locationLabel: "Engineering Lab",
    source: "sample",
    rawPayload: { source: "sample-data", note: "Real ESP32 data will replace this preview." },
    createdAt: new Date().toISOString(),
    isSample: true
  },
  {
    deviceId: "esp32-lab-01",
    temperature: 29.8,
    humidity: 49.2,
    pressure: 1011.9,
    voltage: 4.88,
    current: 0.38,
    batteryPercent: 84,
    signalStrength: -61,
    distance: 25.1,
    motionState: "idle",
    deviceStatus: "sample-online",
    uptime: 12780,
    firmwareVersion: "1.0.0",
    locationLabel: "Engineering Lab",
    source: "sample",
    rawPayload: { source: "sample-data" },
    createdAt: new Date(Date.now() - 60_000).toISOString(),
    isSample: true
  },
  {
    deviceId: "esp32-lab-01",
    temperature: 28.9,
    humidity: 50.1,
    pressure: 1011.4,
    voltage: 4.81,
    current: 0.36,
    batteryPercent: 83,
    signalStrength: -64,
    distance: 27.3,
    motionState: "standby",
    deviceStatus: "sample-online",
    uptime: 12720,
    firmwareVersion: "1.0.0",
    locationLabel: "Engineering Lab",
    source: "sample",
    rawPayload: { source: "sample-data" },
    createdAt: new Date(Date.now() - 120_000).toISOString(),
    isSample: true
  }
];

function formatValue(value: unknown, suffix = "") {
  if (typeof value !== "number") return "N/A";
  return `${Number(value.toFixed(2))}${suffix}`;
}

function formatRelativeTime(value?: string) {
  if (!value) return "No packet yet";
  const diffSeconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (diffSeconds < 5) return "just now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  return `${diffHours}h ago`;
}

function getSignalQuality(signal?: number) {
  if (typeof signal !== "number") return 1;
  if (signal > -55) return 4;
  if (signal > -67) return 3;
  if (signal > -78) return 2;
  return 1;
}

function getLastSeenDate(reading?: EspReading, device?: EspDevice) {
  return reading?.createdAt ?? device?.lastSeenAt;
}

function isDeviceLive(reading?: EspReading, device?: EspDevice, isSample = false) {
  if (isSample) return true;
  const lastSeen = getLastSeenDate(reading, device);
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < Math.max(iotConfig.refreshMs * 3, 45_000);
}

export function EspDashboardClient({ initialReadings, devices }: { initialReadings: EspReading[]; devices: EspDevice[] }) {
  const [readings, setReadings] = useState<EspReading[]>(initialReadings.length ? initialReadings : sampleReadings);
  const [isSample, setIsSample] = useState(initialReadings.length === 0);
  const [selectedDevice, setSelectedDevice] = useState(initialReadings[0]?.deviceId ?? devices[0]?.deviceId ?? iotConfig.defaultDeviceId);
  const [fetchState, setFetchState] = useState<FetchState>(initialReadings.length ? "online" : "empty");
  const [lastPacketKey, setLastPacketKey] = useState(initialReadings[0]?.id ?? initialReadings[0]?.createdAt ?? sampleReadings[0].createdAt ?? "sample");
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadLatest() {
      try {
        setFetchState("syncing");
        const query = selectedDevice ? `?limit=40&deviceId=${encodeURIComponent(selectedDevice)}` : "?limit=40";
        const res = await fetch(`/api/iot/latest${query}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Telemetry fetch failed");

        const data = (await res.json()) as { readings?: EspReading[] };
        const nextReadings = data.readings ?? [];
        if (cancelled) return;

        if (nextReadings.length > 0) {
          const nextPacketKey = nextReadings[0]?.id ?? nextReadings[0]?.createdAt ?? `${Date.now()}`;
          setReadings(nextReadings);
          setIsSample(false);
          setFetchState("online");
          if (nextPacketKey !== lastPacketKey) {
            setLastPacketKey(nextPacketKey);
            setPulseKey((key) => key + 1);
          }
        } else {
          setFetchState(isSample ? "empty" : "online");
        }
      } catch {
        if (!cancelled) setFetchState("error");
      }
    }

    loadLatest();
    const timer = window.setInterval(loadLatest, iotConfig.refreshMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [selectedDevice, lastPacketKey, isSample]);

  const deviceIds = useMemo(
    () => [...new Set([...devices.map((device) => device.deviceId), ...readings.map((reading) => reading.deviceId)])],
    [devices, readings]
  );

  const filtered = readings.filter((item) => (selectedDevice ? item.deviceId === selectedDevice : true));
  const latest = filtered[0] ?? readings[0];
  const selectedDeviceMeta = devices.find((device) => device.deviceId === selectedDevice) ?? devices.find((device) => device.deviceId === latest?.deviceId);
  const chartItems = filtered.slice(0, 16).reverse();
  const live = isDeviceLive(latest, selectedDeviceMeta, isSample);
  const signalBars = getSignalQuality(latest?.signalStrength);
  const lastSeen = getLastSeenDate(latest, selectedDeviceMeta);
  const packetCount = filtered.length;

  return (
    <div className="relative min-h-[calc(100vh-84px)] overflow-hidden bg-[#05070d] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 lab-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#8bd3dd]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-[#d5b46a]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="glass-panel lab-border h-fit rounded-[2.2rem] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono-lab text-xs uppercase tracking-[0.32em] text-[#8bd3dd]">Device Fleet</p>
              <p className="mt-2 text-xs text-slate-500">ESP32 node registry</p>
            </div>
            <Cpu className="size-5 text-[#d5b46a]" />
          </div>

          <div className="mt-5 grid gap-3">
            {deviceIds.map((deviceId) => {
              const device = devices.find((item) => item.deviceId === deviceId);
              const reading = readings.find((item) => item.deviceId === deviceId);
              const deviceLive = isDeviceLive(reading, device, Boolean(reading?.isSample));
              return (
                <button
                  key={deviceId}
                  onClick={() => {
                    setSelectedDevice(deviceId);
                    setPulseKey((key) => key + 1);
                  }}
                  className={`group relative overflow-hidden rounded-[1.35rem] border px-4 py-3 text-left transition duration-300 hover:-translate-y-0.5 ${selectedDevice === deviceId ? "border-[#8bd3dd]/45 bg-[#8bd3dd]/12 shadow-[0_0_34px_rgba(139,211,221,0.12)]" : "border-white/10 bg-white/[0.035] hover:border-[#8bd3dd]/25 hover:bg-white/[0.07]"}`}
                >
                  <span className="pointer-events-none absolute inset-x-[-30%] top-0 h-px translate-x-[-100%] bg-gradient-to-r from-transparent via-[#8bd3dd] to-transparent transition duration-700 group-hover:translate-x-[100%]" />
                  <span className="flex items-center justify-between gap-2">
                    <span className="block text-sm font-semibold text-white">{deviceId}</span>
                    <StatusDot live={deviceLive} />
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">{device?.type ?? "esp32"} / {device?.locationLabel ?? reading?.locationLabel ?? "lab"}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">MongoDB</span>
              <span className={`text-xs font-semibold ${fetchState === "error" ? "text-[#f2a47d]" : "text-[#9bd0b8]"}`}>
                {fetchState === "syncing" ? "syncing" : fetchState === "error" ? "retrying" : "connected"}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className={`h-full rounded-full bg-gradient-to-r from-[#8bd3dd] to-[#d5b46a] transition-all duration-700 ${fetchState === "error" ? "w-1/3" : fetchState === "empty" ? "w-1/2" : "w-full"}`} />
            </div>
          </div>

          {isSample ? (
            <div className="mt-5 rounded-[1.4rem] border border-[#d5b46a]/20 bg-[#d5b46a]/10 p-4 text-xs leading-5 text-[#f1d78a]">
              Sample cockpit aktif. Gercek ESP32 verisi geldiginde dashboard otomatik olarak MongoDB canli moduna gecer.
            </div>
          ) : null}
        </aside>

        <main className="space-y-5">
          <section className="glass-panel lab-border relative overflow-hidden rounded-[2.6rem] p-6 sm:p-8">
            <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono-lab text-xs uppercase tracking-[0.2em] text-slate-300 sm:block">
              {isSample ? "sample cockpit" : "live mongodb"}
            </div>
            <div className="max-w-3xl">
              <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">ESP32 Telemetry</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
                Real-time engineering cockpit
              </h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                Sensor, power, signal, motion ve raw payload verilerini tek ekranda izleyen minimal ama teknik ESP32 dashboard.
              </p>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-4">
              <HeroStat label="Device" value={latest?.deviceId ?? "No device"} icon={Cpu} />
              <HeroStat label="Packets" value={String(packetCount)} icon={Activity} />
              <HeroStat label="Refresh" value={`${iotConfig.refreshMs / 1000}s`} icon={RefreshCw} />
              <HeroStat label="Last seen" value={formatRelativeTime(lastSeen)} icon={Clock} />
            </div>
          </section>

          <TelemetryFlow live={live} fetchState={fetchState} isSample={isSample} />

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="glass-panel lab-border rounded-[2.4rem] p-6" key={`overview-${pulseKey}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">Device Overview</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">{latest?.deviceId ?? "No device"}</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {latest?.locationLabel ?? selectedDeviceMeta?.locationLabel ?? selectedDeviceMeta?.location ?? "Location not set"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm ${live ? "bg-[#9bd0b8]/15 text-[#bff1d6]" : "bg-[#f2a47d]/15 text-[#ffd0bb]"}`}>
                    {live ? "Live" : "Offline"}
                  </span>
                  <span className="text-xs text-slate-500">{latest?.deviceStatus ?? "standby"}</span>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Metric icon={BatteryCharging} label="Battery" value={formatValue(latest?.batteryPercent, "%")} progress={latest?.batteryPercent} />
                <Metric icon={Zap} label="Voltage" value={formatValue(latest?.voltage, "V")} progress={typeof latest?.voltage === "number" ? (latest.voltage / 5.2) * 100 : undefined} />
                <Metric icon={Activity} label="Current" value={formatValue(latest?.current, "A")} progress={typeof latest?.current === "number" ? Math.min(100, latest.current * 100) : undefined} />
                <Metric icon={Signal} label="Signal" value={formatValue(latest?.signalStrength, "dBm")} custom={<SignalBars active={signalBars} />} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MiniStatus label="Motion" value={latest?.motionState ?? "unknown"} />
                <MiniStatus label="Firmware" value={latest?.firmwareVersion ?? selectedDeviceMeta?.firmwareVersion ?? "unknown"} />
                <MiniStatus label="Source" value={latest?.source ?? (isSample ? "sample" : "http")} />
              </div>
            </section>

            <section className="grid gap-5 sm:grid-cols-2">
              <DashboardCard icon={ThermometerSun} title="Temperature" value={formatValue(latest?.temperature, " °C")} subtitle="thermal channel" />
              <DashboardCard icon={Gauge} title="Humidity" value={formatValue(latest?.humidity, "%")} subtitle="environment" />
              <DashboardCard icon={Radio} title="Pressure" value={formatValue(latest?.pressure, " hPa")} subtitle="barometric" />
              <DashboardCard icon={Route} title="Distance" value={formatValue(latest?.distance, " cm")} subtitle="range sensor" />
            </section>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="glass-panel lab-border rounded-[2rem] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">Telemetry History</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Temperature trend</h3>
                </div>
                <span className="w-fit rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">{chartItems.length} samples</span>
              </div>
              <div className="mt-8 flex h-56 items-end gap-2 rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
                {chartItems.map((item, index) => {
                  const height = Math.min(100, Math.max(12, ((item.temperature ?? 0) / 60) * 100));
                  return (
                    <div key={`${item.id ?? item.createdAt}-${index}`} className="group flex flex-1 flex-col items-center gap-2">
                      <div className="relative w-full overflow-hidden rounded-t-2xl bg-white/[0.05]" style={{ height: `${height}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#8bd3dd] via-[#9bd0b8] to-[#d5b46a] opacity-85 transition group-hover:opacity-100" />
                        <div className="absolute inset-x-0 top-0 h-px bg-white/60" />
                      </div>
                      <span className="font-mono-lab text-[10px] text-slate-500">{item.temperature ?? "-"}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="glass-panel lab-border rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">Raw Payload</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Packet inspector</h3>
                </div>
                {fetchState === "error" ? <AlertTriangle className="size-5 text-[#f2a47d]" /> : <Database className="size-5 text-[#d5b46a]" />}
              </div>
              <pre className="mt-5 max-h-72 overflow-auto rounded-[1.4rem] border border-white/10 bg-black/40 p-4 text-xs leading-5 text-slate-300">
                {JSON.stringify(latest?.rawPayload ?? latest ?? {}, null, 2)}
              </pre>
              <p className="mt-4 text-xs text-slate-500">
                Click device cards to switch context. New packets trigger a subtle cockpit pulse.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusDot({ live }: { live: boolean }) {
  return (
    <span className="relative flex size-3 items-center justify-center">
      {live ? <span className="absolute inline-flex size-3 animate-ping rounded-full bg-[#8bd3dd] opacity-50" /> : null}
      <span className={`relative inline-flex size-2 rounded-full ${live ? "bg-[#8bd3dd]" : "bg-slate-600"}`} />
    </span>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/30 hover:bg-white/[0.07]">
      <Icon className="size-5 text-[#d5b46a]" />
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function TelemetryFlow({ live, fetchState, isSample }: { live: boolean; fetchState: FetchState; isSample: boolean }) {
  const steps = [
    { label: "ESP32", icon: Cpu, active: live || isSample },
    { label: "HTTP API", icon: Server, active: fetchState !== "error" },
    { label: "MongoDB", icon: Database, active: fetchState === "online" || isSample },
    { label: "Dashboard", icon: Wifi, active: true }
  ];

  return (
    <section className="glass-panel rounded-[2rem] p-4">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
              {index < steps.length - 1 ? <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-[#8bd3dd] to-transparent md:block" /> : null}
              <div className="flex items-center justify-between gap-3">
                <Icon className={`size-5 ${step.active ? "text-[#8bd3dd]" : "text-slate-600"}`} />
                <StatusDot live={step.active} />
              </div>
              <p className="mt-4 font-mono-lab text-xs uppercase tracking-[0.2em] text-slate-400">{step.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value, progress, custom }: { icon: LucideIcon; label: string; value: string; progress?: number; custom?: ReactNode }) {
  const width = typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : undefined;
  return (
    <div className="group rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/25 hover:bg-white/[0.075]">
      <div className="flex items-center justify-between gap-3">
        <Icon className="size-5 text-[#8bd3dd]" />
        {custom}
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
      {typeof width === "number" ? (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#8bd3dd] to-[#d5b46a] transition-all duration-700" style={{ width: `${width}%` }} />
        </div>
      ) : null}
    </div>
  );
}

function SignalBars({ active }: { active: number }) {
  return (
    <div className="flex h-5 items-end gap-1">
      {[1, 2, 3, 4].map((bar) => (
        <span key={bar} className={`w-1.5 rounded-full ${bar <= active ? "bg-[#8bd3dd]" : "bg-white/15"}`} style={{ height: `${bar * 4 + 4}px` }} />
      ))}
    </div>
  );
}

function DashboardCard({ icon: Icon, title, value, subtitle }: { icon: LucideIcon; title: string; value: string; subtitle: string }) {
  return (
    <div className="glass-panel lab-border group relative overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1">
      <span className="pointer-events-none absolute inset-x-[-40%] top-0 h-px translate-x-[-100%] bg-gradient-to-r from-transparent via-[#d5b46a] to-transparent transition duration-700 group-hover:translate-x-[100%]" />
      <div className="flex items-start justify-between gap-4">
        <Icon className="size-6 text-[#d5b46a]" />
        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{subtitle}</span>
      </div>
      <p className="mt-5 text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function MiniStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-[#8bd3dd]/20 hover:bg-black/30">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
