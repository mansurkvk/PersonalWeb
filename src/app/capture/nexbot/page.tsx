const NEXBOT_SCENE_URL = "https://my.spline.design/nexbotrobotcharacterconceptforpersonaluse-JEmMR5OoScIYCgJyODnnOX6H/";

export default function NexbotCapturePage() {
  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#05070d]">
      <iframe
        title="Nexbot clean capture scene"
        src={NEXBOT_SCENE_URL}
        className="absolute left-1/2 top-1/2 h-[142vh] w-[142vw] -translate-x-1/2 -translate-y-1/2 border-0"
        loading="eager"
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
    </main>
  );
}
