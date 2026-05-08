"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BatteryCharging, Gauge, Radio, Route, Signal, ThermometerSun, Zap } from "lucide-react";
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
    voltage: 4.88,
    current: 0.38,
    batteryPercent: 84,
    signalStrength: -61,
    distance: 25.1,
    motionState: "idle",
    deviceStatus: "sample-online",
    createdAt: new Date(Date.now() - 60_000).toISOString(),
    isSample: true
  }
];

function formatValue(value: unknown, suffix = "") {
  if (typeof value !== "number") return "N/A";
  return `${Number(value.toFixed(2))}${suffix}`;
}

export function EspDashboardClient({ initialReadings, devices }: { initialReadings: EspReading[]; devices: EspDevice[] }) {
  const [readings, setReadings] = useState(initialReadings.length ? initialReadings : sampleReadings);
  const [isSample, setIsSample] = useState(initialReadings.length === 0);
  const [selectedDevice, setSelectedDevice] = useState(initialReadings[0]?.deviceId ?? devices[0]?.deviceId ?? iotConfig.defaultDeviceId);

  useEffect(() => {
    const timer = window.setInterval(async () => {
      const query = selectedDevice ? `?limit=40&deviceId=${encodeURIComponent(selectedDevice)}` : "?limit=40";
      const res = await fetch(`/api/iot/latest${query}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const nextReadings = data.readings ?? [];
        if (nextReadings.length > 0) {
          setReadings(nextReadings);
          setIsSample(false);
        }
      }
    }, iotConfig.refreshMs);

    return () => window.clearInterval(timer);
  }, [selectedDevice]);

  const deviceIds = useMemo(
    () => [...new Set([...devices.map((device) => device.deviceId), ...readings.map((reading) => reading.deviceId)])],
    [devices, readings]
  );
  const filtered = readings.filter((item) => (selectedDevice ? item.deviceId === selectedDevice : true));
  const latest = filtered[0] ?? readings[0];
  const selectedDeviceMeta = devices.find((device) => device.deviceId === latest?.deviceId);
  const chartItems = filtered.slice(0, 14).reverse();

  return (
    <div className="min-h-[calc(100vh-84px)] bg-[#080b10] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2.2rem] border border-white/10 bg-[#101720] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
          <p className="font-mono-lab text-xs uppercase tracking-[0.32em] text-[#9bd0b8]">Device Fleet</p>
          <div className="mt-5 grid gap-3">
            {deviceIds.map((deviceId) => (
              <button
                key={deviceId}
                onClick={() => setSelectedDevice(deviceId)}
                className={`rounded-[1.3rem] border px-4 py-3 text-left transition ${selectedDevice === deviceId ? "border-[#9bd0b8]/45 bg-[#9bd0b8]/12" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.07]"}`}
              >
                <span className="block text-sm font-semibold text-white">{deviceId}</span>
                <span className="mt-1 block text-xs text-slate-500">{devices.find((device) => device.deviceId === deviceId)?.type ?? "esp32"}</span>
              </button>
            ))}
          </div>
          {isSample ? (
            <div className="mt-5 rounded-[1.4rem] border border-[#d5b46a]/20 bg-[#d5b46a]/10 p-4 text-xs leading-5 text-[#f1d78a]">
              Sample data aktif. Gercek ESP32 verisi geldiginde bu alan otomatik canli veriye gecer.
            </div>
          ) : null}
        </aside>

        <main>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#9bd0b8]">ESP32 Telemetry</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Real-time engineering dashboard</h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                ESP32, robot ve sensor sistemleri icin device status, power metrics, signal, motion ve raw payload izleme arayuzu.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 font-mono-lab text-xs uppercase tracking-[0.2em] text-slate-300">
              {isSample ? "sample data" : "live mongodb"}
            </span>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[2.4rem] border border-white/10 bg-[#111820] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#9bd0b8]">Device Overview</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">{latest?.deviceId ?? "No device"}</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {latest?.locationLabel ?? selectedDeviceMeta?.locationLabel ?? selectedDeviceMeta?.location ?? "Location not set"}
                  </p>
                </div>
                <span className="rounded-full bg-[#9bd0b8]/15 px-3 py-1 text-sm text-[#bff1d6]">
                  {latest?.deviceStatus ?? "standby"}
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Metric icon={BatteryCharging} label="Battery" value={formatValue(latest?.batteryPercent, "%")} />
                <Metric icon={Zap} label="Voltage" value={formatValue(latest?.voltage, "V")} />
                <Metric icon={Activity} label="Current" value={formatValue(latest?.current, "A")} />
                <Metric icon={Signal} label="Signal" value={formatValue(latest?.signalStrength, "dBm")} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MiniStatus label="Motion" value={latest?.motionState ?? "unknown"} />
                <MiniStatus label="Firmware" value={latest?.firmwareVersion ?? selectedDeviceMeta?.firmwareVersion ?? "unknown"} />
                <MiniStatus label="Last Seen" value={latest?.createdAt ? new Date(latest.createdAt).toLocaleTimeString("tr-TR") : "N/A"} />
              </div>
            </section>

            <section className="grid gap-5 sm:grid-cols-2">
              <DashboardCard icon={ThermometerSun} title="Temperature" value={formatValue(latest?.temperature, " C")} />
              <DashboardCard icon={Gauge} title="Humidity" value={formatValue(latest?.humidity, "%")} />
              <DashboardCard icon={Radio} title="Pressure" value={formatValue(latest?.pressure, " hPa")} />
              <DashboardCard icon={Route} title="Distance" value={formatValue(latest?.distance, " cm")} />
            </section>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[2rem] border border-white/10 bg-[#111820] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#9bd0b8]">Telemetry History</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Temperature trend</h3>
                </div>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">{iotConfig.refreshMs / 1000}s refresh</span>
              </div>
              <div className="mt-8 flex h-56 items-end gap-2">
                {chartItems.map((item, index) => {
                  const height = Math.min(100, Math.max(10, ((item.temperature ?? 0) / 60) * 100));
                  return (
                    <div key={`${item.id ?? item.createdAt}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-2xl bg-gradient-to-t from-[#9bd0b8] to-[#d5b46a]" style={{ height: `${height}%` }} />
                      <span className="font-mono-lab text-[10px] text-slate-500">{item.temperature ?? "-"}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#111820] p-6">
              <p className="font-mono-lab text-xs uppercase tracking-[0.25em] text-[#9bd0b8]">Raw Payload Preview</p>
              <pre className="mt-5 max-h-72 overflow-auto rounded-[1.4rem] bg-black/30 p-4 text-xs leading-5 text-slate-300">
                {JSON.stringify(latest?.rawPayload ?? latest ?? {}, null, 2)}
              </pre>
              <p className="mt-4 text-xs text-slate-500">Source: {latest?.source ?? (isSample ? "sample" : "http")}</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] bg-white/[0.055] p-4">
      <Icon className="size-5 text-[#9bd0b8]" />
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function DashboardCard({ icon: Icon, title, value }: { icon: LucideIcon; title: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111820] p-6">
      <Icon className="size-6 text-[#d5b46a]" />
      <p className="mt-5 text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function MiniStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
