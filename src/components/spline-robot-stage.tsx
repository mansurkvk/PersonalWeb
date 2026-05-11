"use client";

const telemetryItems = [
  { label: "Servo Bus", value: "18 CH" },
  { label: "Signal", value: "Live" },
  { label: "Control", value: "Lab" }
];

export function SplineRobotBackdrop() {
  return (
    <div className="lab-loop-backdrop pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-[#05070d]">
      <div className="lab-loop-stage" aria-hidden="true">
        <div className="lab-machine-core" />
        <div className="lab-machine-arm lab-machine-arm-a" />
        <div className="lab-machine-arm lab-machine-arm-b" />
        <div className="lab-machine-joint lab-machine-joint-a" />
        <div className="lab-machine-joint lab-machine-joint-b" />
        <div className="lab-machine-base" />
        <div className="lab-scribble lab-scribble-a" />
        <div className="lab-scribble lab-scribble-b" />
        <div className="lab-scribble lab-scribble-c" />
        <div className="lab-scribble lab-scribble-d" />
        <div className="lab-hud-line lab-hud-line-a" />
        <div className="lab-hud-line lab-hud-line-b" />
        <div className="lab-hud-label lab-hud-label-a">TELEMETRY LOOP</div>
        <div className="lab-hud-label lab-hud-label-b">ENGINEERING LAB</div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_44%,rgba(139,211,221,0.06),transparent_30%),linear-gradient(90deg,rgba(5,7,13,0.86)_0%,rgba(5,7,13,0.52)_32%,rgba(5,7,13,0.2)_60%,rgba(5,7,13,0.68)_100%)]" />
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
