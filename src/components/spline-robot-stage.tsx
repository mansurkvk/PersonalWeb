const DEFAULT_SCENE_URL = "https://my.spline.design/robotarm-3gWlK9dpeGsxtCIU6F15tmGE/";

const telemetryItems = [
  { label: "Axis Load", value: "42%" },
  { label: "Servo Bus", value: "18 CH" },
  { label: "Latency", value: "24 ms" }
];

export function SplineRobotStage({ sceneUrl = DEFAULT_SCENE_URL }: { sceneUrl?: string }) {
  return (
    <div className="robot-stage relative min-h-[520px] overflow-hidden rounded-[2.6rem] border border-white/10 bg-[#05070d]/70 shadow-[0_40px_140px_rgba(0,0,0,0.55)] lg:min-h-[660px]">
      <div className="absolute inset-0 robot-stage-grid opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(139,211,221,0.2),transparent_32%),radial-gradient(circle_at_75%_22%,rgba(213,180,106,0.16),transparent_28%),linear-gradient(180deg,rgba(5,7,13,0.05),rgba(5,7,13,0.72))]" aria-hidden="true" />

      <iframe
        title="Interactive robot arm scene"
        src={sceneUrl}
        className="absolute inset-[-8%] h-[116%] w-[116%] border-0 opacity-90 [filter:saturate(0.95)_contrast(1.05)]"
        loading="lazy"
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(5,7,13,0.68)_0%,rgba(5,7,13,0.22)_32%,rgba(5,7,13,0)_58%)]" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none robot-scanline" aria-hidden="true" />

      <div className="absolute left-5 top-5 rounded-2xl border border-[#8bd3dd]/20 bg-black/35 px-4 py-3 shadow-[0_0_40px_rgba(139,211,221,0.12)] backdrop-blur-xl">
        <p className="font-mono-lab text-[10px] uppercase tracking-[0.28em] text-[#8bd3dd]">Spline Scene</p>
        <p className="mt-1 text-sm font-semibold text-white">Robot Arm Interface</p>
      </div>

      <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
        {telemetryItems.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#8bd3dd]/35 hover:bg-black/55">
            <p className="font-mono-lab text-[10px] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="absolute right-6 top-6 h-20 w-20 rounded-full border border-[#8bd3dd]/20 bg-[#8bd3dd]/10 shadow-[0_0_60px_rgba(139,211,221,0.24)]" aria-hidden="true">
        <div className="absolute inset-3 rounded-full border border-[#8bd3dd]/30" />
        <div className="absolute left-1/2 top-1/2 h-[2px] w-9 origin-left bg-[#8bd3dd]/70 robot-radar" />
      </div>
    </div>
  );
}
