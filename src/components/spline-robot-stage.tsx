const DEFAULT_SCENE_URL = "https://my.spline.design/robotarm-3gWlK9dpeGsxtCIU6F15tmGE/";

const telemetryItems = [
  { label: "Servo Bus", value: "18 CH" },
  { label: "Signal", value: "Live" },
  { label: "Control", value: "Lab" }
];

export function SplineRobotBackdrop({ sceneUrl = DEFAULT_SCENE_URL }: { sceneUrl?: string }) {
  return (
    <div className="spline-backdrop fixed inset-0 z-0 overflow-hidden bg-[#05070d]" aria-hidden="true">
      <iframe
        title="Interactive robot arm background"
        src={sceneUrl}
        className="absolute inset-0 h-full w-full border-0 opacity-80 [filter:saturate(0.92)_contrast(1.08)]"
        loading="eager"
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_66%_42%,rgba(139,211,221,0.08),transparent_28%),linear-gradient(90deg,rgba(5,7,13,0.88)_0%,rgba(5,7,13,0.6)_34%,rgba(5,7,13,0.28)_58%,rgba(5,7,13,0.76)_100%)]" />
      <div className="pointer-events-none absolute inset-0 lab-grid opacity-35" />
      <div className="pointer-events-none absolute inset-0 robot-scanline" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#05070d] via-[#05070d]/72 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#05070d]/95 via-[#05070d]/62 to-transparent" />
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
