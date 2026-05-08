"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const HOME_SCENE_URL = "https://my.spline.design/robotarm-3gWlK9dpeGsxtCIU6F15tmGE/";
const INNER_PAGE_SCENE_URL = "https://my.spline.design/nexbotrobotcharacterconceptforpersonaluse-JEmMR5OoScIYCgJyODnnOX6H/";

const telemetryItems = [
  { label: "Servo Bus", value: "18 CH" },
  { label: "Signal", value: "Live" },
  { label: "Control", value: "Lab" }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SplineRobotBackdrop() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [wheelRotation, setWheelRotation] = useState(0);

  const sceneUrl = isHomePage ? HOME_SCENE_URL : INNER_PAGE_SCENE_URL;
  const title = isHomePage ? "Controlled robot arm background" : "Controlled Nexbot robot background";

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const normalizedDelta = clamp(event.deltaY, -90, 90);
      setWheelRotation((previous) => clamp(previous + normalizedDelta * 0.035, -14, 14));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const sceneTransform = useMemo(() => {
    const settledRotation = Math.abs(wheelRotation) < 0.01 ? 0 : wheelRotation;
    return `rotate(${settledRotation}deg) scale(1)`;
  }, [wheelRotation]);

  return (
    <div className="spline-backdrop fixed inset-0 z-0 overflow-hidden bg-[#05070d]">
      <div
        className={isHomePage ? "spline-scene spline-scene-home" : "spline-scene spline-scene-inner"}
        style={{ transform: sceneTransform }}
      >
        <iframe
          title={title}
          src={sceneUrl}
          className="spline-frame pointer-events-none absolute border-0 opacity-95 [filter:saturate(1)_contrast(1.08)]"
          loading="eager"
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_44%,rgba(139,211,221,0.05),transparent_30%),linear-gradient(90deg,rgba(5,7,13,0.84)_0%,rgba(5,7,13,0.5)_32%,rgba(5,7,13,0.12)_60%,rgba(5,7,13,0.62)_100%)]" />
      <div className="pointer-events-none absolute inset-0 lab-grid opacity-26" />
      <div className="pointer-events-none absolute inset-0 robot-scanline" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#05070d] via-[#05070d]/72 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#05070d]/95 via-[#05070d]/54 to-transparent" />
    </div>
  );
}

export function SplineRobotStatusPanel() {
  return (
    <div className="hidden gap-3 lg:grid lg:grid-cols-3">
      {telemetryItems.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/35 hover:bg-black/50">
          <p className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
          <p className="mt-1 text-base font-semibold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
