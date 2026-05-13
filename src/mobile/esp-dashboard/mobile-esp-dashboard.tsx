"use client";

import {
  Activity,
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
import type { EspDevice, EspReading, FetchState } from "@/features/esp-dashboard/esp-dashboard-client";

type MobileEspDashboardProps = {
  deviceIds: string[];
  devices: EspDevice[];
  readings: EspReading[];
  selectedDevice: string;
  onSelectDevice: (deviceId: string) => void;
  latest?: EspReading;
  selectedDeviceMeta?: EspDevice;
  chartItems: EspReading[];
  live: boolean;
  isSample: boolean;
  fetchState: FetchState;
  packetCount: number;
  signalBars: number;
  lastSeen?: string;
  refreshSeconds: number;
  pulseKey: number;
};

function formatValue(value: unknown, suffix = "") {
  if (typeof value !== "number") return "N/A";
  return `${Number(value.toFixed(2))}${suffix}`;
}

function formatRelativeTime(value?: string) {
  if (!value) return "No packet";
  const diffSeconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (diffSeconds < 5) return "now";
  if (diffSeconds < 60) return `${diffSeconds}s`;
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m`;
  return `${Math.round(diffMinutes / 60)}h`;
}

function isDeviceLive(reading?: EspReading, device?: EspDevice, isSample = false) {
  if (isSample) return true;
  const lastSeen = reading?.createdAt ?? device?.lastSeenAt;
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 45_000;
}

export function MobileEspDashboard({
  deviceIds,
  devices,
  readings,
  selectedDevice,
  onSelectDevice,
  latest,
  selectedDeviceMeta,
  chartItems,
  live,
  isSample,
  fetchState,
  packetCount,
  signalBars,
  lastSeen,
  refreshSeconds,
  pulseKey
}: MobileEspDashboardProps) {
  return (
    <div className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#05070d] px-3 pb-24 pt-5 text-slate-100">
      <div className="pointer-events-none absolute inset-0 lab-grid opacity-16" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8bd3dd]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#d5b46a]/10 blur-3xl" />

      <div className="relative space-y-4">
        <section className="glass-panel lab-border rounded-[2rem] p-5" key={`mobile-hero-${pulseKey}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono-lab text-[10px] uppercase tracking-[0.32em] text-[#8bd3dd]">ESP32 Mobile Cockpit</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em] text-white">Telemetry control</h1>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ${live ? "bg-[#9bd0b8]/15 text-[#bff1d6]" : "bg-[#f2a47d]/15 text-[#ffd0bb]"}`}>
              {live ? "Live" : "Offline"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <MobileHeroChip icon={Cpu} label="Device" value={latest?.deviceId ?? selectedDevice} />
            <MobileHeroChip icon={Activity} label="Packets" value={String(packetCount)} />
            <MobileHeroChip icon={RefreshCw} label="Refresh" value={`${refreshSeconds}s`} />
            <MobileHeroChip icon={Clock} label="Seen" value={formatRelativeTime(lastSeen)} />
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/25 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">Data mode</span>
              <span className="text-xs font-semibold text-[#9bd0b8]">
                {isSample ? "sample cockpit" : fetchState === "syncing" ? "syncing" : fetchState === "error" ? "retrying" : "live mongodb"}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div className={`h-full rounded-full bg-gradient-to-r from-[#8bd3dd] to-[#d5b46a] transition-all duration-700 ${fetchState === "error" ? "w-1/3" : isSample ? "w-1/2" : "w-full"}`} />
            </div>
          </div>
        </section>

        <section className="-mx-3 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            {deviceIds.map((deviceId) => {
              const device = devices.find((item) => item.deviceId === deviceId);
              const reading = readings.find((item) => item.deviceId === deviceId);
              const deviceLive = isDeviceLive(reading, device, Boolean(reading?.isSample));
              return (
                <button
                  key={deviceId}
                  onClick={() => onSelectDevice(deviceId)}
                  className={`min-w-44 rounded-[1.35rem] border px-4 py-3 text-left transition active:scale-[0.98] ${selectedDevice === deviceId ? "border-[#8bd3dd]/45 bg-[#8bd3dd]/12" : "border-white/10 bg-white/[0.04]"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-white">{deviceId}</span>
                    <span className={`size-2 rounded-full ${deviceLive ? "bg-[#8bd3dd] shadow-[0_0_18px_rgba(139,211,221,0.8)]" : "bg-slate-600"}`} />
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{device?.locationLabel ?? reading?.locationLabel ?? "Engineering Lab"}</span>
                </button>
              );
            })}
          </div>
        </section>

        <MobileFlow fetchState={fetchState} live={live} isSample={isSample} />

        <section className="grid grid-cols-2 gap-3">
          <MobileMetric icon={ThermometerSun} label="Temp" value={formatValue(latest?.temperature, "°C")} emphasis />
          <MobileMetric icon={Gauge} label="Humidity" value={formatValue(latest?.humidity, "%")} emphasis />
          <MobileMetric icon={BatteryCharging} label="Battery" value={formatValue(latest?.batteryPercent, "%")} progress={latest?.batteryPercent} />
          <MobileMetric icon={Zap} label="Voltage" value={formatValue(latest?.voltage, "V")} progress={typeof latest?.voltage === "number" ? (latest.voltage / 5.2) * 100 : undefined} />
          <MobileMetric icon={Activity} label="Current" value={formatValue(latest?.current, "A")} progress={typeof latest?.current === "number" ? Math.min(100, latest.current * 100) : undefined} />
          <MobileMetric icon={Signal} label="Signal" value={formatValue(latest?.signalStrength, "dBm")} custom={<MobileSignalBars active={signalBars} />} />
          <MobileMetric icon={Radio} label="Pressure" value={formatValue(latest?.pressure, "hPa")} />
          <MobileMetric icon={Route} label="Distance" value={formatValue(latest?.distance, "cm")} />
        </section>

        <section className="glass-panel lab-border rounded-[1.8rem] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono-lab text-[10px] uppercase tracking-[0.26em] text-[#8bd3dd]">Trend</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Temperature</h2>
            </div>
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-400">{chartItems.length} pts</span>
          </div>
          <div className="mt-5 flex h-40 items-end gap-1.5 rounded-[1.3rem] border border-white/10 bg-black/25 p-3">
            {chartItems.map((item, index) => {
              const height = Math.min(100, Math.max(14, ((item.temperature ?? 0) / 60) * 100));
              return (
                <div key={`${item.id ?? item.createdAt}-${index}`} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-[#8bd3dd] to-[#d5b46a] opacity-90" style={{ height: `${height}%` }} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <MobileStatus label="Motion" value={latest?.motionState ?? "unknown"} />
          <MobileStatus label="FW" value={latest?.firmwareVersion ?? selectedDeviceMeta?.firmwareVersion ?? "-"} />
          <MobileStatus label="Source" value={latest?.source ?? (isSample ? "sample" : "http")} />
        </section>

        <details className="glass-panel rounded-[1.8rem] p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left">
            <span>
              <span className="font-mono-lab block text-[10px] uppercase tracking-[0.26em] text-[#8bd3dd]">Packet</span>
              <span className="mt-1 block text-xl font-semibold text-white">Raw payload</span>
            </span>
            <Database className="size-5 text-[#d5b46a]" />
          </summary>
          <pre className="mt-4 max-h-64 overflow-auto rounded-[1.2rem] border border-white/10 bg-black/40 p-3 text-[11px] leading-5 text-slate-300">
            {JSON.stringify(latest?.rawPayload ?? latest ?? {}, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

function MobileHeroChip({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-3">
      <Icon className="size-4 text-[#d5b46a]" />
      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function MobileFlow({ fetchState, live, isSample }: { fetchState: FetchState; live: boolean; isSample: boolean }) {
  const steps = [
    { label: "ESP", icon: Cpu, active: live || isSample },
    { label: "API", icon: Server, active: fetchState !== "error" },
    { label: "DB", icon: Database, active: fetchState === "online" || isSample },
    { label: "UI", icon: Wifi, active: true }
  ];

  return (
    <section className="grid grid-cols-4 gap-2">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="rounded-[1.1rem] border border-white/10 bg-black/25 p-3 text-center">
            <Icon className={`mx-auto size-4 ${step.active ? "text-[#8bd3dd]" : "text-slate-600"}`} />
            <p className="mt-2 font-mono-lab text-[9px] uppercase tracking-[0.16em] text-slate-500">{step.label}</p>
          </div>
        );
      })}
    </section>
  );
}

function MobileMetric({
  icon: Icon,
  label,
  value,
  progress,
  custom,
  emphasis
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  progress?: number;
  custom?: React.ReactNode;
  emphasis?: boolean;
}) {
  const width = typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : undefined;
  return (
    <div className={`glass-panel lab-border rounded-[1.45rem] p-4 ${emphasis ? "min-h-36" : "min-h-32"}`}>
      <div className="flex items-center justify-between gap-2">
        <Icon className="size-5 text-[#8bd3dd]" />
        {custom}
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className={`${emphasis ? "text-3xl" : "text-2xl"} mt-1 font-semibold tracking-tight text-white`}>{value}</p>
      {typeof width === "number" ? (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#8bd3dd] to-[#d5b46a] transition-all duration-700" style={{ width: `${width}%` }} />
        </div>
      ) : null}
    </div>
  );
}

function MobileSignalBars({ active }: { active: number }) {
  return (
    <div className="flex h-5 items-end gap-1">
      {[1, 2, 3, 4].map((bar) => (
        <span key={bar} className={`w-1 rounded-full ${bar <= active ? "bg-[#8bd3dd]" : "bg-white/15"}`} style={{ height: `${bar * 4 + 3}px` }} />
      ))}
    </div>
  );
}

function MobileStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-black/25 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-xs font-semibold text-white">{value}</p>
    </div>
  );
}
