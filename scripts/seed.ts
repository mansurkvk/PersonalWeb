import { getDb } from "../src/lib/db/mongodb";
import { ensureDatabaseIndexes } from "../src/lib/db/indexes";
import { toObjectId } from "../src/lib/db/object-id";
import { hashPassword } from "../src/lib/auth/password";
import { slugify } from "../src/lib/slug";
import type { BlogPostDocument, ProjectDocument, TelemetryDeviceDocument, UserDocument } from "../src/types/database";

// Ilk admin kullanicisini, indexleri ve ornek icerikleri olusturur.
async function main() {
  await ensureDatabaseIndexes();
  const db = await getDb();

  const email = process.env.SEED_ADMIN_EMAIL ?? "mansurkvk000@gmail.com";
  const username = process.env.SEED_ADMIN_USERNAME ?? "mansurkvk";
  const displayName = process.env.SEED_ADMIN_DISPLAY_NAME ?? "Muhammed Mansur Kavak";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    throw new Error("SEED_ADMIN_PASSWORD tanimli olmali. Sifre koda gomulmez.");
  }

  const now = new Date();
  const passwordHash = await hashPassword(password);
  const users = db.collection<UserDocument>("users");

  await users.updateOne(
    { email: email.toLowerCase() },
    {
      $setOnInsert: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        displayName,
        role: "admin",
        passwordHash,
        isActive: true,
        socialLinks: {
          github: "https://github.com/mansurkvk",
          linkedin: "https://www.linkedin.com/in/muhammedmansurkavak/",
          x: "https://x.com/mansurkvk",
          instagram: "https://www.instagram.com/mansurkvk/",
          youtube: "https://www.youtube.com/@mansurkvk"
        },
        createdAt: now,
        updatedAt: now
      }
    },
    { upsert: true }
  );

  const admin = await users.findOne({ email: email.toLowerCase() });
  if (!admin?._id) throw new Error("Admin kullanici olusturulamadi.");

  const posts = db.collection<BlogPostDocument>("blogPosts");
  await posts.updateOne(
    { slug: "engineering-lab-baslangic-notu" },
    {
      $setOnInsert: {
        title: "Engineering Lab Baslangic Notu",
        slug: "engineering-lab-baslangic-notu",
        excerpt: "PersonalWeb platformunun blog, proje, admin ve telemetry altyapisini tanitan ilk teknik not.",
        content:
          "Bu yazi seed komutu ile olusturuldu. Admin panelinden yeni blog yazilari eklenebilir, taslak veya yayinlanmis olarak yonetilebilir.",
        coverImage: "",
        tags: ["Personal Lab", "Software Architecture", "ESP32"],
        category: "Personal Lab",
        status: "published",
        authorId: toObjectId(admin._id),
        viewCount: 0,
        featured: true,
        createdAt: now,
        updatedAt: now,
        publishedAt: now
      }
    },
    { upsert: true }
  );

  const projectSeeds: Array<Omit<ProjectDocument, "_id" | "createdAt" | "updatedAt">> = [
    {
      title: "ANKEBOT / Hexapod Robot",
      slug: slugify("ANKEBOT Hexapod Robot"),
      summary: "Robotik, servo kontrol, sensor okuma ve telemetry akisini birlestiren hexapod robot projesi.",
      description: "ANKEBOT; robotik mekanik, gomulu kontrol, ESP32 telemetry ve deneysel hareket algoritmalari icin ana vitrin projesidir.",
      coverImage: "",
      images: [],
      technologies: ["ESP32", "Robotics", "Telemetry", "Servo Control"],
      category: "Robotics",
      status: "prototype",
      links: { oldSite: "https://mansurkvk.netlify.app/" },
      featured: true
    },
    {
      title: "Quantum Genesis / QBrick",
      slug: slugify("Quantum Genesis QBrick"),
      summary: "Quantum programming yarismasi ve QBrick deneyimi icin proje kaydi.",
      description: "Quantum Genesis; kuantum programlama, algoritmik dusunme ve fizik odakli yazilim deneyimlerini temsil eder.",
      coverImage: "",
      images: [],
      technologies: ["Quantum", "QBrick", "Python", "Physics"],
      category: "Quantum Programming",
      status: "active",
      links: {},
      featured: true
    },
    {
      title: "ESP32 Telemetry Platform",
      slug: slugify("ESP32 Telemetry Platform"),
      summary: "Sensor verisini API, MongoDB outbox ve dashboard arayuzune tasiyan IoT altyapisi.",
      description: "ESP32 cihazlarindan gelen telemetry payloadlari dogrulanir, MongoDB uzerinde saklanir ve dashboard icin okunabilir hale getirilir.",
      coverImage: "",
      images: [],
      technologies: ["ESP32", "MongoDB", "Next.js", "IoT"],
      category: "IoT & Embedded Systems",
      status: "active",
      links: {},
      featured: true
    },
    {
      title: "Machine Learning / Titanic ML",
      slug: slugify("Machine Learning Titanic ML"),
      summary: "Titanic veri seti uzerinden machine learning deneyimi ve modelleme pratigi.",
      description: "Titanic ML calismasi; veri temizleme, feature engineering, model secimi ve sonuc yorumlama adimlarini temsil eden bir yapay zeka denemesidir.",
      coverImage: "",
      images: [],
      technologies: ["Python", "Machine Learning", "Data Science"],
      category: "Artificial Intelligence",
      status: "prototype",
      links: {},
      featured: true
    },
    {
      title: "PersonalWeb Engineering Platform",
      slug: slugify("PersonalWeb Engineering Platform"),
      summary: "Portfolio, blog, admin paneli, auth ve IoT dashboard iceren full-stack web platformu.",
      description: "PersonalWeb; kisisel marka, teknik icerik, proje vitrini ve ESP32 telemetry deneyimini tek Next.js uygulamasinda birlestirir.",
      coverImage: "",
      images: [],
      technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind"],
      category: "Web Platform",
      status: "active",
      links: { github: "https://github.com/mansurkvk" },
      featured: true
    },
    {
      title: "Energy & Experimental Physics Placeholder",
      slug: slugify("Energy Experimental Physics Placeholder"),
      summary: "Enerji sistemleri ve deneysel fizik odakli gelecek calismalar icin ayrilmis proje alani.",
      description: "Bu placeholder, enerji ve deneysel fizik projelerinin ileride ayrintili olarak dokumante edilmesi icin ayrildi.",
      coverImage: "",
      images: [],
      technologies: ["Physics", "Simulation", "Energy"],
      category: "Energy Systems",
      status: "idea",
      links: {},
      featured: false
    }
  ];

  const projects = db.collection<ProjectDocument>("projects");
  for (const project of projectSeeds) {
    await projects.updateOne(
      { slug: project.slug },
      { $setOnInsert: { ...project, createdAt: now, updatedAt: now } },
      { upsert: true }
    );
  }

  const devices = db.collection<TelemetryDeviceDocument>("telemetryDevices");
  await devices.updateOne(
    { deviceId: "esp32-lab-01" },
    {
      $setOnInsert: {
        deviceId: "esp32-lab-01",
        name: "ESP32 Lab Device",
        description: "Seed ile olusturulan ornek ESP32 telemetry cihazi.",
        type: "esp32",
        location: "Engineering Lab",
        locationLabel: "Engineering Lab",
        firmwareVersion: "1.0.0",
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    },
    { upsert: true }
  );

  console.log("Seed tamamlandi", { email, username, displayName });
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
