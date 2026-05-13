"use client";

import { useEffect, useMemo, useState } from "react";
import { iotConfig } from "@/config/iot.config";
import { EspDashboardClient } from "@/features/esp-dashboard/esp-dashboard-client";
import { MobileEspDashboard } from "@/mobile/esp-dashboard/mobile-esp-dashboard";
import type { EspDevice, EspReading } from "@/features/esp-dashboard/esp-dashboard-client";

type FetchState = "idle" | "syncing" | "online" | "empty" | "error";

const mobileSampleReadings: EspReading[] = [
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

function useIsMobileDashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1279px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
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

export function EspDashboardResponsiveClient({ initialReadings, devices }: { initialReadings: EspReading[]; devices: EspDevice[] }) {
  const isMobile = useIsMobileDashboard();
  const [readings, setReadings] = useState<EspReading[]>(initialReadings.length ? initialReadings : mobileSampleReadings);
  const [isSample, setIsSample] = useState(initialReadings.length === 0);
  const [selectedDevice, setSelectedDevice] = useState(initialReadings[0]?.deviceId ?? devices[0]?.deviceId ?? iotConfig.defaultDeviceId);
  const [fetchState, setFetchState] = useState<FetchState>(initialReadings.length ? "online" : "empty");
  const [lastPacketKey, setLastPacketKey] = useState(initialReadings[0]?.id ?? initialReadings[0]?.createdAt ?? mobileSampleReadings[0].createdAt ?? "sample");
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
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
  }, [isMobile, selectedDevice, lastPacketKey, isSample]);

  const deviceIds = useMemo(
    () => [...new Set([...devices.map((device) => device.deviceId), ...readings.map((reading) => reading.deviceId)])],
    [devices, readings]
  );

  if (!isMobile) {
    return <EspDashboardClient initialReadings={initialReadings} devices={devices} />;
  }

  const filtered = readings.filter((item) => (selectedDevice ? item.deviceId === selectedDevice : true));
  const latest = filtered[0] ?? readings[0];
  const selectedDeviceMeta = devices.find((device) => device.deviceId === selectedDevice) ?? devices.find((device) => device.deviceId === latest?.deviceId);
  const chartItems = filtered.slice(0, 16).reverse();
  const live = isDeviceLive(latest, selectedDeviceMeta, isSample);
  const signalBars = getSignalQuality(latest?.signalStrength);
  const lastSeen = getLastSeenDate(latest, selectedDeviceMeta);

  return (
    <MobileEspDashboard
      deviceIds={deviceIds}
      devices={devices}
      readings={readings}
      selectedDevice={selectedDevice}
      onSelectDevice={(deviceId) => {
        setSelectedDevice(deviceId);
        setPulseKey((key) => key + 1);
      }}
      latest={latest}
      selectedDeviceMeta={selectedDeviceMeta}
      chartItems={chartItems}
      live={live}
      isSample={isSample}
      fetchState={fetchState}
      packetCount={filtered.length}
      signalBars={signalBars}
      lastSeen={lastSeen}
      refreshSeconds={iotConfig.refreshMs / 1000}
      pulseKey={pulseKey}
    />
  );
}
