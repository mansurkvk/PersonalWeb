"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Activity, AlertTriangle, Clock, Cpu, Database, Gauge, Radio, RefreshCw, Route, Server, Signal, ThermometerSun, Wifi, Zap } from "lucide-react";
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
  rawText?: string;
  topic?: string;
  packetType?: string;
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
type MetricItem = { icon: LucideIcon; label: string; value: string; hint?: string; progress?: number };

const sampleReadings: EspReading[] = [
  {
    deviceId: "esp32-node-1",
    temperature: 31.2,
    humidity: 48.5,
    voltage: 4.92,
    current: 0.42,
    signalStrength: -57,
    motionState: "sensor-node",
    deviceStatus: "sample-online",
    firmwareVersion: "mqtt-bridge",
    locationLabel: "Engineering Lab",
    source: "sample",
    rawPayload: { source: "sample-data", lm35TempC: 31.2, dhtHumidity: 48.5, inaBusV: 4.92, inaCurrentmA: 420, wifiRssi: -57, freeHeap: 205392, edgeValid: true },
    createdAt: new Date().toISOString(),
    isSample: true
  }
];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function parseLooseEspText(value: unknown): Record<string, unknown> {
  if (typeof value !== "string") return {};
  const out: Record<string, unknown> = {};
  const stringFields = ["deviceId", "nodeType", "status", "source"];
  const boolFields = ["dhtOk", "lm35Ok", "ina219Ok", "gyroOk", "potOk", "buttonOk", "buttonPressed", "edgeValid"];
  const numberFields = [
    "seq", "localTimestampUs", "dhtTempC", "dhtHumidity", "lm35TempC", "inaBusV", "inaCurrentmA", "wifiRssi", "freeHeap", "sensorErrorMask",
    "gyroAddress", "gyroDpsX", "gyroDpsY", "gyroDpsZ", "potRaw", "potmV", "targetPayloadSize", "actualPayloadSize", "payloadSize"
  ];

  for (const field of stringFields) {
    const match = value.match(new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`));
    if (match) out[field] = match[1];
  }

  for (const field of boolFields) {
    const match = value.match(new RegExp(`"${field}"\\s*:\\s*(true|false)`, "i"));
    if (match) out[field] = match[1].toLowerCase() === "true";
  }

  for (const field of numberFields) {
    const match = value.match(new RegExp(`"${field}"\\s*:\\s*(-?\\d+(?:\\.\\d+)?|nan|null)`, "i"));
    if (!match) continue;
    const raw = match[1].toLowerCase();
    out[field] = raw === "nan" || raw === "null" ? null : Number(match[1]);
  }

  return out;
}

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function boolLabel(value: unknown) {
  if (typeof value !== "boolean") return "N/A";
  return value ? "true" : "false";
}

function formatValue(value: unknown, suffix = "", digits = 2) {
  const next = num(value);
  if (typeof next !== "number") return "N/A";
  return `${Number(next.toFixed(digits))}${suffix}`;
}

function formatRelativeTime(value?: string) {
  if (!value) return "No packet yet";
  const diffSeconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (diffSeconds < 5) return "just now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  return `${Math.round(diffMinutes / 60)}h ago`;
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

function packetData(reading?: EspReading) {
  const raw = asRecord(reading?.rawPayload);
  const rawInner = asRecord(raw.raw);
  const loose = parseLooseEspText(reading?.rawText ?? raw.rawText ?? raw.rawPayload ?? raw.raw);
  return { ...raw, ...rawInner, ...asRecord(raw.data), ...asRecord(raw.normalized), ...reading, ...loose };
}

function isTelemetryPacket(reading?: EspReading) {
  const data = packetData(reading);
  const topic = String(data.topic ?? "");
  return topic.includes("/telemetry") || data.packetType === "telemetry" || data.nodeType === "sensor-node" || data.nodeType === "motion-node";
}

function pickLatestTelemetry(items: EspReading[], deviceId?: string) {
  const scoped = items.filter((item) => (deviceId ? item.deviceId === deviceId : true));
  return scoped.find(isTelemetryPacket) ?? scoped[0] ?? items.find(isTelemetryPacket) ?? items[0];
}

function currentA(data: Record<string, unknown>, reading?: EspReading) {
  const ma = num(data.inaCurrentmA) ?? num(data.currentmA);
  return num(data.currentA) ?? (typeof ma === "number" ? ma / 1000 : reading?.current);
}

function isMotionNode(deviceId: string, data: Record<string, unknown>) {
  return deviceId.includes("node-2") || data.nodeType === "motion-node" || "potRaw" in data || "gyroOk" in data;
}

function buildPrimaryMetrics(reading?: EspReading): MetricItem[] {
  const data = packetData(reading);
  const motion = isMotionNode(reading?.deviceId ?? "", data);

  if (motion) {
    return [
      { icon: Gauge, label: "Pot Raw", value: formatValue(data.potRaw, "", 0), hint: `${formatValue(data.potmV, " mV", 0)} / potOk ${boolLabel(data.potOk)}`, progress: typeof num(data.potRaw) === "number" ? (num(data.potRaw)! / 4095) * 100 : undefined },
      { icon: Activity, label: "Button", value: boolLabel(data.buttonPressed), hint: `buttonOk ${boolLabel(data.buttonOk)}` },
      { icon: Radio, label: "Gyro X", value: formatValue(data.gyroDpsX, " dps"), hint: `gyroOk ${boolLabel(data.gyroOk)} / addr ${String(data.gyroAddress ?? "N/A")}` },
      { icon: Signal, label: "WiFi Signal", value: formatValue(data.wifiRssi ?? reading?.signalStrength, " dBm", 0), hint: `freeHeap ${formatValue(data.freeHeap, " B", 0)}` }
    ];
  }

  const voltage = num(data.inaBusV) ?? reading?.voltage;
  const current = currentA(data, reading);
  return [
    { icon: ThermometerSun, label: "Temperature", value: formatValue(data.lm35TempC ?? data.dhtTempC ?? reading?.temperature, " °C"), hint: `DHT ${boolLabel(data.dhtOk)} / LM35 ${boolLabel(data.lm35Ok)}` },
    { icon: Gauge, label: "Humidity", value: formatValue(data.dhtHumidity ?? reading?.humidity, "%"), hint: "DHT11 environment" },
    { icon: Zap, label: "Voltage", value: formatValue(voltage, "V"), hint: `INA219 ${boolLabel(data.ina219Ok)}`, progress: typeof voltage === "number" ? (voltage / 5.2) * 100 : undefined },
    { icon: Activity, label: "Current", value: formatValue(current, "A"), hint: "INA219 current", progress: typeof current === "number" ? Math.min(100, current * 100) : undefined }
  ];
}

function buildSecondaryCards(reading?: EspReading) {
  const data = packetData(reading);
  const motion = isMotionNode(reading?.deviceId ?? "", data);
  if (motion) {
    return [
      { icon: Radio, title: "Gyro Y", value: formatValue(data.gyroDpsY, " dps"), subtitle: "motion" },
      { icon: Route, title: "Gyro Z", value: formatValue(data.gyroDpsZ, " dps"), subtitle: "motion" },
      { icon: Cpu, title: "Edge Valid", value: boolLabel(data.edgeValid), subtitle: "validation" },
      { icon: AlertTriangle, title: "Error Mask", value: String(data.sensorErrorMask ?? "N/A"), subtitle: "fault bits" }
    ];
  }

  return [
    { icon: ThermometerSun, title: "DHT Temp", value: formatValue(data.dhtTempC, " °C"), subtitle: "dht11" },
    { icon: Gauge, title: "LM35 Temp", value: formatValue(data.lm35TempC, " °C"), subtitle: "analog" },
    { icon: Cpu, title: "Edge Valid", value: boolLabel(data.edgeValid), subtitle: "validation" },
    { icon: AlertTriangle, title: "Error Mask", value: String(data.sensorErrorMask ?? "N/A"), subtitle: "fault bits" }
  ];
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
  const latest = pickLatestTelemetry(readings, selectedDevice);
  const latestData = packetData(latest);
  const selectedDeviceMeta = devices.find((device) => device.deviceId === selectedDevice) ?? devices.find((device) => device.deviceId === latest?.deviceId);
  const chartItems = filtered.filter(isTelemetryPacket).slice(0, 16).reverse();
  const live = isDeviceLive(latest, selectedDeviceMeta, isSample);
  const signal = num(latestData.wifiRssi) ?? latest?.signalStrength;
  const signalBars = getSignalQuality(signal);
  const lastSeen = getLastSeenDate(latest, selectedDeviceMeta);
  const packetCount = filtered.length;
  const primaryMetrics = buildPrimaryMetrics(latest);
  const secondaryCards = buildSecondaryCards(latest);

  return (
    <div className="relative min-h-[calc(100vh-84px)] overflow-hidden bg-[#05070d] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 lab-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#8bd3dd]/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="glass-panel lab-border h-fit rounded-[2.2rem] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
          <div className="flex items-center justify-between gap-3">
            <div><p className="font-mono-lab text-xs uppercase tracking-[0.32em] text-[#8bd3dd]">Device Fleet</p><p className="mt-2 text-xs text-slate-500">ESP32 node registry</p></div><Cpu className="size-5 text-[#d5b46a]" />
          </div>

          <div className="mt-5 grid gap-3">
            {deviceIds.map((deviceId) => {
              const device = devices.find((item) => item.deviceId === deviceId);
              const reading = pickLatestTelemetry(readings, deviceId);
              const data = packetData(reading);
              const deviceLive = isDeviceLive(reading, device, Boolean(reading?.isSample));
              return <button key={deviceId} onClick={() => { setSelectedDevice(deviceId); setPulseKey((key) => key + 1); }} className={`group relative overflow-hidden rounded-[1.35rem] border px-4 py-3 text-left transition duration-300 hover:-translate-y-0.5 ${selectedDevice === deviceId ? "border-[#8bd3dd]/45 bg-[#8bd3dd]/12 shadow-[0_0_34px_rgba(139,211,221,0.12)]" : "border-white/10 bg-white/[0.035] hover:border-[#8bd3dd]/25 hover:bg-white/[0.07]"}`}><span className="flex items-center justify-between gap-2"><span className="block text-sm font-semibold text-white">{deviceId}</span><StatusDot live={deviceLive} /></span><span className="mt-1 block text-xs text-slate-500">{String(data.nodeType ?? device?.type ?? "ESP32")} / {device?.locationLabel ?? reading?.locationLabel ?? "lab"}</span></button>;
            })}
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.2em] text-slate-500">MongoDB</span><span className={`text-xs font-semibold ${fetchState === "error" ? "text-[#f2a47d]" : "text-[#9bd0b8]"}`}>{fetchState === "syncing" ? "syncing" : fetchState === "error" ? "retrying" : "connected"}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full bg-gradient-to-r from-[#8bd3dd] to-[#d5b46a] transition-all duration-700 ${fetchState === "error" ? "w-1/3" : fetchState === "empty" ? "w-1/2" : "w-full"}`} /></div></div>
          {isSample ? <div className="mt-5 rounded-[1.4rem] border border-[#d5b46a]/20 bg-[#d5b46a]/10 p-4 text-xs leading-5 text-[#f1d78a]">Sample cockpit aktif. Gercek ESP32 verisi geldiginde dashboard otomatik olarak MongoDB canli moduna gecer.</div> : null}
        </aside>

        <main className="space-y-5">
          <section className="glass-panel lab-border relative overflow-hidden rounded-[2.6rem] p-6 sm:p-8"><div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono-lab text-xs uppercase tracking-[0.2em] text-slate-300 sm:block">{isSample ? "sample cockpit" : "live mongodb"}</div><p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">ESP32 Telemetry</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">Real-time engineering cockpit</h1><p className="mt-4 max-w-2xl text-slate-400">Sensor, power, signal, motion ve raw payload verilerini kendi Node-1 / Node-2 paket yapina gore izleyen teknik ESP32 dashboard.</p><div className="mt-8 grid gap-3 md:grid-cols-4"><HeroStat label="Device" value={latest?.deviceId ?? "No device"} icon={Cpu} /><HeroStat label="Packets" value={String(packetCount)} icon={Activity} /><HeroStat label="Refresh" value={`${iotConfig.refreshMs / 1000}s`} icon={RefreshCw} /><HeroStat label="Last seen" value={formatRelativeTime(lastSeen)} icon={Clock} /></div></section>
          <TelemetryFlow live={live} fetchState={fetchState} isSample={isSample} />

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]"><section className="glass-panel lab-border rounded-[2.4rem] p-6" key={`overview-${pulseKey}`}><div className="flex items-start justify-between gap-4"><div><p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">Device Overview</p><h2 className="mt-3 text-3xl font-semibold text-white">{latest?.deviceId ?? "No device"}</h2><p className="mt-2 text-sm text-slate-400">{String(latestData.nodeType ?? latest?.locationLabel ?? selectedDeviceMeta?.locationLabel ?? selectedDeviceMeta?.location ?? "Engineering Lab")}</p></div><div className="flex flex-col items-end gap-2"><span className={`rounded-full px-3 py-1 text-sm ${live ? "bg-[#9bd0b8]/15 text-[#bff1d6]" : "bg-[#f2a47d]/15 text-[#ffd0bb]"}`}>{live ? "Live" : "Offline"}</span><span className="text-xs text-slate-500">{latest?.deviceStatus ?? "standby"}</span></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{primaryMetrics.map((metric) => <Metric key={metric.label} {...metric} custom={metric.label.includes("Signal") ? <SignalBars active={signalBars} /> : undefined} />)}</div><div className="mt-6 grid gap-3 sm:grid-cols-3"><MiniStatus label="WiFi RSSI" value={formatValue(signal, " dBm", 0)} /><MiniStatus label="Free Heap" value={formatValue(latestData.freeHeap, " B", 0)} /><MiniStatus label="Source" value={latest?.source ?? (isSample ? "sample" : "mqtt-bridge")} /></div></section><section className="grid gap-5 sm:grid-cols-2">{secondaryCards.map((card) => <DashboardCard key={card.title} {...card} />)}</section></div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><section className="glass-panel lab-border rounded-[2rem] p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">Telemetry History</p><h3 className="mt-2 text-2xl font-semibold text-white">Temperature / signal trend</h3></div><span className="w-fit rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">{chartItems.length} samples</span></div><div className="mt-8 flex h-56 items-end gap-2 rounded-[1.6rem] border border-white/10 bg-black/20 p-4">{chartItems.map((item, index) => { const data = packetData(item); const value = num(data.lm35TempC) ?? num(data.dhtTempC) ?? item.temperature ?? Math.abs(num(data.wifiRssi) ?? item.signalStrength ?? 0); const height = Math.min(100, Math.max(12, (value / 80) * 100)); return <div key={`${item.id ?? item.createdAt}-${index}`} className="group flex flex-1 flex-col items-center gap-2"><div className="relative w-full overflow-hidden rounded-t-2xl bg-white/[0.05]" style={{ height: `${height}%` }}><div className="absolute inset-0 bg-gradient-to-t from-[#8bd3dd] via-[#9bd0b8] to-[#d5b46a] opacity-85 transition group-hover:opacity-100" /></div><span className="font-mono-lab text-[10px] text-slate-500">{formatValue(value, "", 1)}</span></div>; })}</div></section><section className="glass-panel lab-border rounded-[2rem] p-6"><div className="flex items-center justify-between gap-3"><div><p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#8bd3dd]">Raw Payload</p><h3 className="mt-2 text-2xl font-semibold text-white">Packet inspector</h3></div>{fetchState === "error" ? <AlertTriangle className="size-5 text-[#f2a47d]" /> : <Database className="size-5 text-[#d5b46a]" />}</div><pre className="mt-5 max-h-72 overflow-auto rounded-[1.4rem] border border-white/10 bg-black/40 p-4 text-xs leading-5 text-slate-300">{JSON.stringify(latest?.rawPayload ?? latest ?? {}, null, 2)}</pre></section></div>
        </main>
      </div>
    </div>
  );
}

function StatusDot({ live }: { live: boolean }) {
  return <span className="relative flex size-3 items-center justify-center">{live ? <span className="absolute inline-flex size-3 animate-ping rounded-full bg-[#8bd3dd] opacity-50" /> : null}<span className={`relative inline-flex size-2 rounded-full ${live ? "bg-[#8bd3dd]" : "bg-slate-600"}`} /></span>;
}

function HeroStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/30 hover:bg-white/[0.07]"><Icon className="size-5 text-[#d5b46a]" /><p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-1 truncate text-sm font-semibold text-white">{value}</p></div>;
}

function TelemetryFlow({ live, fetchState, isSample }: { live: boolean; fetchState: FetchState; isSample: boolean }) {
  const steps = [{ label: "ESP32", icon: Cpu, active: live || isSample }, { label: "MQTT Bridge", icon: Server, active: fetchState !== "error" }, { label: "MongoDB", icon: Database, active: fetchState === "online" || isSample }, { label: "Dashboard", icon: Wifi, active: true }];
  return <section className="glass-panel rounded-[2rem] p-4"><div className="grid gap-3 md:grid-cols-4">{steps.map((step) => { const Icon = step.icon; return <div key={step.label} className="relative rounded-[1.4rem] border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><Icon className={`size-5 ${step.active ? "text-[#8bd3dd]" : "text-slate-600"}`} /><StatusDot live={step.active} /></div><p className="mt-4 font-mono-lab text-xs uppercase tracking-[0.2em] text-slate-400">{step.label}</p></div>; })}</div></section>;
}

function Metric({ icon: Icon, label, value, hint, progress, custom }: MetricItem & { custom?: ReactNode }) {
  const width = typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : undefined;
  return <div className="group rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/25 hover:bg-white/[0.075]"><div className="flex items-center justify-between gap-3"><Icon className="size-5 text-[#8bd3dd]" />{custom}</div><p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-white">{value}</p>{hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}{typeof width === "number" ? <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-[#8bd3dd] to-[#d5b46a] transition-all duration-700" style={{ width: `${width}%` }} /></div> : null}</div>;
}

function SignalBars({ active }: { active: number }) {
  return <div className="flex h-5 items-end gap-1">{[1, 2, 3, 4].map((bar) => <span key={bar} className={`w-1.5 rounded-full ${bar <= active ? "bg-[#8bd3dd]" : "bg-white/15"}`} style={{ height: `${bar * 4 + 4}px` }} />)}</div>;
}

function DashboardCard({ icon: Icon, title, value, subtitle }: { icon: LucideIcon; title: string; value: string; subtitle: string }) {
  return <div className="glass-panel lab-border group relative overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1"><div className="flex items-start justify-between gap-4"><Icon className="size-6 text-[#d5b46a]" /><span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">{subtitle}</span></div><p className="mt-5 text-sm text-slate-400">{title}</p><p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p></div>;
}

function MiniStatus({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-[#8bd3dd]/20 hover:bg-black/30"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 truncate text-sm font-semibold text-white">{value}</p></div>;
}
