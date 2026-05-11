"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HOME_SCENE_URL = "https://my.spline.design/robotarm-3gWlK9dpeGsxtCIU6F15tmGE/";
const INNER_PAGE_SCENE_URL = "https://my.spline.design/nexbotrobotcharacterconceptforpersonaluse-JEmMR5OoScIYCgJyODnnOX6H/";

const HOME_VIDEO_SOURCES = {
  webm: "/videos/robot-arm-loop.webm",
  mp4: "/videos/robot-arm-loop.mp4"
};

const INNER_VIDEO_SOURCES = {
  webm: "/videos/nexbot-loop.webm",
  mp4: "/videos/nexbot-loop.mp4"
};

const telemetryItems = [
  { label: "Servo Bus", value: "18 CH" },
  { label: "Signal", value: "Live" },
  { label: "Control", value: "Lab" }
];

async function hasVideoSource(src: string) {
  try {
    const response = await fetch(src, { method: "HEAD", cache: "force-cache" });
    return response.ok;
  } catch {
    return false;
  }
}

export function SplineRobotBackdrop() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [useVideoLoop, setUseVideoLoop] = useState(false);
  const sceneUrl = isHomePage ? HOME_SCENE_URL : INNER_PAGE_SCENE_URL;
  const videoSources = isHomePage ? HOME_VIDEO_SOURCES : INNER_VIDEO_SOURCES;
  const title = isHomePage ? "Robot arm loop background" : "Nexbot robot loop background";

  useEffect(() => {
    let isMounted = true;

    hasVideoSource(videoSources.webm).then((hasWebm) => {
      if (isMounted) setUseVideoLoop(hasWebm);
    });

    return () => {
      isMounted = false;
    };
  }, [videoSources.webm]);

  return (
    <div className="spline-backdrop pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-[#05070d]">
      {useVideoLoop ? (
        <video
          key={videoSources.webm}
          className={isHomePage ? "robot-loop-video robot-loop-video-home" : "robot-loop-video robot-loop-video-inner"}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={title}
        >
          <source src={videoSources.webm} type="video/webm" />
          <source src={videoSources.mp4} type="video/mp4" />
        </video>
      ) : (
        <div className={isHomePage ? "spline-scene spline-scene-home" : "spline-scene spline-scene-inner"}>
          <iframe
            title={title}
            src={sceneUrl}
            className="spline-frame absolute border-0 opacity-95 [filter:saturate(1)_contrast(1.08)]"
            loading="eager"
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_44%,rgba(139,211,221,0.05),transparent_30%),linear-gradient(90deg,rgba(5,7,13,0.84)_0%,rgba(5,7,13,0.5)_32%,rgba(5,7,13,0.12)_60%,rgba(5,7,13,0.62)_100%)]" />
      <div className="absolute inset-0 lab-grid opacity-26" />
      <div className="absolute inset-0 robot-scanline" />
      <div className="absolute inset-0 lab-video-noise" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#05070d] via-[#05070d]/72 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#05070d]/95 via-[#05070d]/54 to-transparent" />
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
