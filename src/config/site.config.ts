import { blogCategories, projectCategories } from "@/constants/categories";

// Marka, tema ve metin ayarlari tek noktadan yonetilir.
export const siteConfig = {
  title: "Mansur Kavak | Engineering Lab",
  seoTitle: "Muhammed Mansur Kavak | Mechatronics, AI, Robotics, ESP32 & Physics Lab",
  description:
    "Mechatronics engineering, robotics, ESP32 telemetry, artificial intelligence, quantum programming and physics-focused research projects.",
  defaultLocale: "tr",
  locales: ["tr", "en"],
  hero: {
    eyebrow: "Mansur Kavak Engineering Lab",
    title: "Engineering intelligent machines, real-time IoT systems and physics-driven technologies.",
    subtitle:
      "Mekatronik, robotik, yapay zeka, ESP32 tabanli telemetry ve fizik odakli calismalarimi tek bir modern engineering lab ve IoT platformunda topluyorum.",
    longDescription:
      "Mechatronics engineering, robotics, ESP32-based telemetry, artificial intelligence, quantum programming and physics-focused experimental systems are combined in this engineering lab platform. This site presents projects, technical notes, real-time device data and expandable IoT dashboards in a professional structure."
  },
  owner: {
    name: "Muhammed Mansur Kavak",
    shortName: "Mansur Kavak",
    email: "mansurkvk000@gmail.com",
    positioning:
      "Mekatronik muhendisi, fizik odakli arastirmaci, robotik ve IoT sistemleri gelistiren deneysel muhendislik ureticisi."
  },
  links: {
    github: "https://github.com/mansurkvk",
    linkedin: "https://www.linkedin.com/in/muhammedmansurkavak/",
    x: "https://x.com/mansurkvk",
    instagram: "https://www.instagram.com/mansurkvk/",
    youtube: "https://www.youtube.com/@mansurkvk",
    oldSite: "https://mansurkvk.netlify.app/",
    email: "mailto:mansurkvk000@gmail.com"
  },
  blogCategories,
  projectCategories
} as const;

export type SiteConfig = typeof siteConfig;
