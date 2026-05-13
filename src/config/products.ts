export type ProductCategory = "robotics" | "iot";
export type ProductStatus = "concept" | "prototype" | "planned" | "available";

export type ProductShowcaseItem = {
  slug: string;
  title: string;
  shortTitle: string;
  category: ProductCategory;
  status: ProductStatus;
  summary: string;
  description: string;
  image: string;
  accent: "cyan" | "gold" | "green";
  capabilities: string[];
  packageContents: string[];
  useCases: string[];
  ctaLabel: string;
};

export const products: ProductShowcaseItem[] = [
  {
    slug: "hexapod-robot",
    title: "Hexapod Robot",
    shortTitle: "Hexapod",
    category: "robotics",
    status: "prototype",
    summary: "Cok ayakli robotik arastirma ve egitim platformu.",
    description:
      "Servo tabanli yuruyus algoritmalari, ESP32 kontrol altyapisi ve web telemetry dashboard destegiyle gelistirilebilir laboratuvar robotu.",
    image: "/images/products/hexapod.svg",
    accent: "cyan",
    capabilities: ["Servo tabanli yuruyus sistemi", "ESP32 kontrol altyapisi", "Telemetry dashboard destegi", "Moduler govde tasarimi"],
    packageContents: ["Hexapod mekanik govde", "Kontrol karti", "Servo surucu altyapisi", "Temel yazilim paketi", "Web telemetry baglantisi"],
    useCases: ["Robotik egitimi", "Gait algoritmasi denemeleri", "ESP32 telemetry prototipleri"],
    ctaLabel: "Bu urunle ilgileniyorum"
  },
  {
    slug: "quadruped-dog-robot",
    title: "Kopek Robot",
    shortTitle: "Quadruped",
    category: "robotics",
    status: "concept",
    summary: "Denge, yuruyus algoritmalari ve saha gozlemi icin dort ayakli robot platformu.",
    description:
      "Quadruped gait kontrolu, sensor entegrasyonu ve uzaktan izleme senaryolari icin moduler gelistirme platformu.",
    image: "/images/products/quadruped.svg",
    accent: "gold",
    capabilities: ["Quadruped gait kontrolu", "Kamera/sensor entegrasyonu", "Uzaktan izleme", "Otonom gorev senaryolari"],
    packageContents: ["Dort ayakli mekanik platform", "Kontrol mimarisi", "Sensor baglanti altyapisi", "Telemetry hazirligi"],
    useCases: ["Denge arastirmasi", "Saha gozlemi", "Egitim ve demo platformu"],
    ctaLabel: "Bu urunle ilgileniyorum"
  },
  {
    slug: "engineering-drone",
    title: "Drone",
    shortTitle: "Drone",
    category: "robotics",
    status: "planned",
    summary: "Goruntuleme, cevre gozlemi ve telemetry akisi icin gelistirilebilir drone sistemi.",
    description:
      "Ucus telemetry takibi, sensor/kamera modulleri ve web tabanli takip paneli ile gorev profillerine uyarlanabilen hava platformu.",
    image: "/images/products/drone.svg",
    accent: "cyan",
    capabilities: ["Ucus telemetry takibi", "Sensor ve kamera modulleri", "Web tabanli takip paneli", "Prototip gorev profilleri"],
    packageContents: ["Drone govde konsepti", "Ucus telemetry altyapisi", "Sensor/kamera modulu hazirligi", "Web takip paneli"],
    useCases: ["Cevre gozlemi", "Laboratuvar telemetry testleri", "Prototip ucus gorevleri"],
    ctaLabel: "Bu urunle ilgileniyorum"
  },
  {
    slug: "smart-conveyor",
    title: "Konveyor Bant",
    shortTitle: "Konveyor",
    category: "robotics",
    status: "prototype",
    summary: "Kucuk uretim hatlari ve egitim laboratuvarlari icin akilli konveyor sistem.",
    description:
      "Hiz kontrolu, nesne algilama ve IoT dashboard baglantisi ile uretim verisini gorunur hale getiren egitim/otomasyon sistemi.",
    image: "/images/products/conveyor.svg",
    accent: "green",
    capabilities: ["Hiz kontrolu", "Nesne algilama", "Sayac ve uretim verisi", "IoT dashboard baglantisi"],
    packageContents: ["Konveyor mekanik govde", "Motor kontrol altyapisi", "Sensor baglantilari", "Basit uretim dashboardu"],
    useCases: ["Egitim laboratuvari", "Mini uretim hattı", "IoT veri toplama"],
    ctaLabel: "Bu urunle ilgileniyorum"
  },
  {
    slug: "pallet-transport-robot",
    title: "Palet Tasima Robotu",
    shortTitle: "Palet Robot",
    category: "robotics",
    status: "concept",
    summary: "Depo ve uretim alanlari icin otonom veya yari otonom tasima robotu konsepti.",
    description:
      "Yuk tasima platformu, rota izleme, engel algilama ve gorev kaydi ile depo/uretim ici lojistik icin tasarlanmis konsept.",
    image: "/images/products/pallet-robot.svg",
    accent: "gold",
    capabilities: ["Yuk tasima platformu", "Rota izleme", "Engel algilama", "Telemetry ve gorev kaydi"],
    packageContents: ["Tasima platformu konsepti", "Surus kontrol altyapisi", "Engel sensor hazirligi", "Gorev kayit sistemi"],
    useCases: ["Depo ici tasima", "Uretim alani lojistigi", "AGV prototipleri"],
    ctaLabel: "Bu urunle ilgileniyorum"
  },
  {
    slug: "six-dof-robot-arm",
    title: "KUKA Benzeri 6 DOF Robot",
    shortTitle: "6 DOF Arm",
    category: "robotics",
    status: "planned",
    summary: "Egitim, pick-and-place ve deneysel otomasyon icin 6 eksenli robot kol.",
    description:
      "Inverse kinematics altyapisi, uc efektor destegi ve otomasyon senaryolari icin gelistirilebilir 6 eksenli robot kol platformu.",
    image: "/images/products/robot-arm-6dof.svg",
    accent: "cyan",
    capabilities: ["6 DOF hareket mimarisi", "Inverse kinematics altyapisi", "Uc efektor destegi", "Otomasyon senaryolari"],
    packageContents: ["6 eksenli robot kol mekanigi", "Kontrol karti altyapisi", "Temel kinematik yazilimi", "Uc efektor baglanti hazirligi"],
    useCases: ["Pick-and-place", "Robot kol egitimi", "Deneysel otomasyon"],
    ctaLabel: "Bu urunle ilgileniyorum"
  },
  {
    slug: "iot-basic",
    title: "IoT Basic",
    shortTitle: "Basic",
    category: "iot",
    status: "available",
    summary: "Temel cihaz izleme ve veri kayit paketi.",
    description: "Tek cihaz ve temel sensor verisini MongoDB uzerinden kaydedip sade dashboard ile izlemek icin baslangic paketi.",
    image: "/images/products/iot-basic.svg",
    accent: "cyan",
    capabilities: ["Temel sensor okuma", "Cihaz veri kaydi", "Sade dashboard", "Kurulum destegi"],
    packageContents: ["1 cihaz baglantisi", "Temel sensor takibi", "MongoDB veri kaydi", "Basit dashboard", "E-posta destekli kurulum"],
    useCases: ["Tek cihaz takibi", "Ders/odev prototipi", "Baslangic telemetry paneli"],
    ctaLabel: "Paket hakkinda sor"
  },
  {
    slug: "iot-pro",
    title: "IoT Pro",
    shortTitle: "Pro",
    category: "iot",
    status: "available",
    summary: "Coklu sensor ve gelismis dashboard iceren profesyonel IoT paketi.",
    description: "Coklu cihaz, alarm/esik degerleri, admin panel yonetimi ve API entegrasyonu ile profesyonel telemetry paketi.",
    image: "/images/products/iot-pro.svg",
    accent: "gold",
    capabilities: ["Coklu cihaz destegi", "Alarm ve esik takibi", "Gelismis grafikler", "API entegrasyonu"],
    packageContents: ["Coklu cihaz destegi", "Alarm ve esik degerleri", "Gelismis grafikler", "Admin panel yonetimi", "API entegrasyonu"],
    useCases: ["Laboratuvar izleme", "Kucuk isletme telemetry", "ESP32 cihaz filosu"],
    ctaLabel: "Paket hakkinda sor"
  },
  {
    slug: "iot-ultra",
    title: "IoT Ultra",
    shortTitle: "Ultra",
    category: "iot",
    status: "planned",
    summary: "Kurumsal/ileri seviye telemetry, broker ve ozel dashboard mimarisi.",
    description: "MQTT/broker mimarisi, fleet yonetimi, gercek zamanli dashboard ve ozel analiz ekranlari icin ileri seviye paket.",
    image: "/images/products/iot-ultra.svg",
    accent: "green",
    capabilities: ["MQTT broker mimarisi", "Fleet yonetimi", "Gercek zamanli dashboard", "Gelismis raporlama"],
    packageContents: ["MQTT / broker mimarisi", "Coklu cihaz/fleet yonetimi", "Gercek zamanli dashboard", "Ozel analiz ekranlari", "Gelismis raporlama"],
    useCases: ["Kurumsal telemetry", "Ozel dashboard mimarisi", "Broker tabanli IoT altyapisi"],
    ctaLabel: "Paket hakkinda sor"
  }
];

export const roboticsProducts = products.filter((product) => product.category === "robotics");
export const iotProducts = products.filter((product) => product.category === "iot");

export function findProductBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return products.find((product) => product.slug === slug) ?? null;
}
