const ROBOT_ARM_SCENE_URL = "https://my.spline.design/robotarm-3gWlK9dpeGsxtCIU6F15tmGE/";

export default function RobotArmCapturePage() {
  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#05070d]">
      <iframe
        title="Robot arm clean capture scene"
        src={ROBOT_ARM_SCENE_URL}
        className="absolute left-1/2 top-1/2 h-[132vh] w-[132vw] -translate-x-1/2 -translate-y-1/2 border-0"
        loading="eager"
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
    </main>
  );
}
