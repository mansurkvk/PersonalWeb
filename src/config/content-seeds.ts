export type BlogSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  status: "draft" | "published";
  featured: boolean;
};

export type ProjectSeed = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  images: string[];
  technologies: string[];
  category: string;
  status: "idea" | "prototype" | "active" | "archived";
  links: {
    github?: string;
    demo?: string;
    article?: string;
    oldSite?: string;
  };
  featured: boolean;
};

export const blogPostSeeds: BlogSeed[] = [
  {
    title: "PersonalWeb Neden Sadece Portfolio Degil?",
    slug: "personalweb-neden-sadece-portfolio-degil",
    excerpt: "PersonalWeb'in klasik portfolio yaklasimindan engineering lab ve IoT telemetry platformuna nasil evrildigini anlatan stratejik baslangic yazisi.",
    content: `Bir portfolio sitesi genellikle kisinin kim oldugunu, hangi projelerde calistigini ve nasil iletisime gecilecegini anlatir. PersonalWeb ise bu temel ihtiyaci korurken daha uzun vadeli bir engineering ecosystem hedefler.

## Ana fikir

PersonalWeb'in amaci sadece guzel gorunen bir ana sayfa yapmak degil; robotics, ESP32 telemetry, AI, physics, technical writing ve admin kontrollu icerik yonetimini tek merkezde birlestiren buyuyebilir bir altyapi kurmaktir.

Bu nedenle proje iki farkli seviyede tasarlanir. Ziyaretcinin gordugu ana site sade, temiz ve hizli anlasilir kalir. Teknik derinlik ise /esp, /admin, API, telemetry, MongoDB ve broker katmanlarinda buyur.

## Sonuc

PersonalWeb; portfolio, blog, project showcase, ESP32 cloud interface ve engineering lab arayuzunu ayni temel uzerinde buyutmeyi hedefleyen uzun vadeli bir platformdur.`,
    coverImage: "",
    tags: ["PersonalWeb", "Engineering Lab", "Architecture"],
    category: "Engineering Lab",
    status: "published",
    featured: true
  },
  {
    title: "Modular Monolith ile Engineering Platform Kurmak",
    slug: "modular-monolith-ile-engineering-platform-kurmak",
    excerpt: "PersonalWeb icin neden microservice yerine modular monolith yaklasiminin daha dogru bir baslangic oldugunu aciklar.",
    content: `PersonalWeb icin en dogru baslangic mimarisi modular monolith yaklasimidir. Bu, tek repo ve tek uygulama icinde gelisirken kodu domainlere ayirarak gelecekte buyumeye hazir kalmak anlamina gelir.

## Klasor prensibi

- app: sadece route ve layout
- services: business logic
- repositories: MongoDB islemleri
- server: broker, auth ve telemetry altyapisi
- features: domain bazli UI
- components: tekrar kullanilabilir UI

## API akisi

API route -> service -> repository -> MongoDB. Bu akis basit, okunabilir ve web yaziliminda yeni olan biri icin takip edilebilir olmalidir.`,
    coverImage: "",
    tags: ["Next.js", "Architecture", "MongoDB"],
    category: "Architecture",
    status: "published",
    featured: true
  },
  {
    title: "ESP32 Telemetry Sistemi Icin Ilk Mimari",
    slug: "esp32-telemetry-sistemi-icin-ilk-mimari",
    excerpt: "ESP32 cihazlarindan gelen sensor verisini API, service, repository ve dashboard akisina baglayan ilk mimari not.",
    content: `ESP32 telemetry sisteminin ilk hedefi, cihazdan gelen veriyi guvenilir sekilde almak, dogrulamak, MongoDB'ye yazmak ve dashboard uzerinden okunabilir hale getirmektir.

## MVP mimarisi

ESP32 cihaz HTTP POST ile /api/iot/ingest endpointine veri gonderir. API route sadece request/response siniridir. Asil kararlar telemetry.service.ts icinde verilir. MongoDB islemleri telemetry.repository.ts tarafinda kalir.

## Broker yaklasimi

Ilk asamada broker sistemi kurmak sart degildir. Fakat kodda broker mantigini soyut dusunmek, gelecekte MQTT, Redis veya WebSocket gibi altyapilara gecisi kolaylastirir.`,
    coverImage: "",
    tags: ["ESP32", "Telemetry", "MongoDB", "IoT"],
    category: "IoT",
    status: "published",
    featured: true
  },
  {
    title: "Admin Panel ve Auth Sisteminde Ilk Guvenlik Prensipleri",
    slug: "admin-panel-ve-auth-sisteminde-ilk-guvenlik-prensipleri",
    excerpt: "PersonalWeb'in admin login, user role ve session mimarisinde baslangicta takip etmesi gereken guvenlik prensipleri.",
    content: `PersonalWeb gibi kisisel ama buyuyebilir bir platformda auth sistemi basit baslamali, fakat guvenlik prensipleri dogru kurulmalidir.

## Ilk karar

Baslangicta herkesin kayit olabildigi bir sistem gerekli degildir. Ilk surumde admin odakli login daha guvenlidir. Register endpointi kontrollu tutulabilir veya kapatilabilir.

## Temel prensipler

- Sifreler asla duz metin tutulmaz.
- JWT secret repository'ye yazilmaz.
- Session cookie HttpOnly olmalidir.
- Admin route'lari role kontrolu yapmalidir.
- Audit log ileride admin islemleri icin eklenmelidir.`,
    coverImage: "",
    tags: ["Auth", "MongoDB", "Admin"],
    category: "Auth",
    status: "published",
    featured: true
  },
  {
    title: "Notion'u PersonalWeb Icerik Kaynagi Olarak Kullanmak",
    slug: "notionu-personalweb-icerik-kaynagi-olarak-kullanmak",
    excerpt: "Notion'un blog ve project icerikleri icin editorial source-of-truth olarak nasil konumlandirilabilecegini anlatir.",
    content: `Notion, PersonalWeb icin blog ve project iceriklerinin editorial source-of-truth alani olabilir. Bu yaklasim, kod yazmadan icerik duzenlemeyi kolaylastirir.

## Ne Notion'da tutulmali?

- Blog yazilari
- Proje aciklamalari
- Roadmap notlari
- Teknik dokumantasyon taslaklari

## Ne Notion'da tutulmamali?

- Kullanici sifreleri
- JWT secret
- ESP32 device key
- Operasyonel telemetry readings
- Hassas admin loglari`,
    coverImage: "",
    tags: ["Notion", "CMS", "PersonalWeb"],
    category: "Notion CMS",
    status: "published",
    featured: false
  },
  {
    title: "Engineering Lab UI: Sadelik ve Teknik Derinlik Dengesi",
    slug: "engineering-lab-ui-sadelik-ve-teknik-derinlik-dengesi",
    excerpt: "Ana sitede sade portfolio hissini korurken teknik alanlarda lab dashboard derinligi olusturma yaklasimi.",
    content: `PersonalWeb'in UI hedefi iki farkli ihtiyaci ayni anda tasimaktir: ana sitede sade portfolio hissi, teknik bolumlerde ise engineering lab derinligi.

## Ana site

Ana sayfa, projects, blog ve info sayfalari temiz, okunabilir ve profesyonel kalmalidir. Bu alanlar ziyaretcinin hizli anlamasini saglar.

## Teknik alanlar

/esp ve /admin gibi alanlar daha teknik olabilir. Dashboard kartlari, telemetry metrikleri, cihaz durumlari ve broker monitoring gibi ogeler burada buyur.`,
    coverImage: "",
    tags: ["UI", "Engineering Lab", "Dashboard"],
    category: "Engineering Lab",
    status: "published",
    featured: false
  }
];

export const projectSeeds: ProjectSeed[] = [
  {
    title: "PersonalWeb Engineering Platform",
    slug: "personalweb-engineering-platform",
    summary: "Portfolio, technical blog, admin panel, auth, MongoDB ve ESP32 telemetry dashboard iceren full-stack engineering platformu.",
    description: `PersonalWeb Engineering Platform, modern bir portfolio sitesinden daha buyuk hedefe sahip olan modular full-stack engineering ekosistemidir. Sistem; teknik kimlik, proje vitrini, blog, admin paneli ve ESP32 telemetry dashboard'unu tek Next.js uygulamasinda birlestirir.`,
    coverImage: "",
    images: [],
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "MongoDB", "Vercel"],
    category: "Web Platform",
    status: "active",
    links: { github: "https://github.com/mansurkvk/PersonalWeb", demo: "https://mansurkvk.vercel.app/", oldSite: "https://mansurkvk.netlify.app/" },
    featured: true
  },
  {
    title: "ESP32 Telemetry Platform",
    slug: "esp32-telemetry-platform",
    summary: "ESP32 cihazlarindan gelen sensor verisini API, MongoDB ve dashboard uzerinden izlenebilir hale getiren IoT veri hatti.",
    description: `ESP32 Telemetry Platform, sensor verisini engineering lab arayuzune tasimak icin tasarlanan IoT veri hattidir. Ilk asamada cihazlar HTTP POST ile veri gonderir; ileride MQTT broker, iot-gateway ve websocket dashboard mimarisine genisletilebilir.`,
    coverImage: "",
    images: [],
    technologies: ["ESP32", "IoT", "MongoDB", "Telemetry", "HTTP Ingest"],
    category: "IoT & Embedded Systems",
    status: "active",
    links: {},
    featured: true
  },
  {
    title: "ANKEBOT Hexapod Robot",
    slug: "ankebot-hexapod-robot",
    summary: "Robotik, servo kontrol, sensor entegrasyonu ve telemetry akislarini birlestiren deneysel hexapod robot platformu.",
    description: `ANKEBOT, robotics, mechatronics, servo control, sensor integration ve telemetry akislarini bir araya getiren deneysel hexapod robot projesidir.`,
    coverImage: "",
    images: [],
    technologies: ["Robotics", "ESP32", "Servo Control", "Telemetry", "Mechatronics"],
    category: "Robotics",
    status: "prototype",
    links: { oldSite: "https://mansurkvk.netlify.app/" },
    featured: true
  },
  {
    title: "Quantum Genesis / QBrick",
    slug: "quantum-genesis-qbrick",
    summary: "Quantum programming, algoritmik dusunme ve fizik tabanli yazilim deneyimlerini temsil eden teknik proje alani.",
    description: `Quantum Genesis / QBrick, quantum programming, algorithmic thinking ve physics tabanli yazilim deneyimlerini temsil eden teknik proje alanidir.`,
    coverImage: "",
    images: [],
    technologies: ["Quantum Programming", "QBrick", "Python", "Physics"],
    category: "Quantum Programming",
    status: "active",
    links: {},
    featured: true
  },
  {
    title: "Machine Learning Titanic ML",
    slug: "machine-learning-titanic-ml",
    summary: "Titanic veri seti uzerinden veri temizleme, feature engineering ve modelleme pratigi iceren AI calismasi.",
    description: `Titanic ML, veri temizleme, feature engineering, model secimi ve sonuc yorumlama adimlarini temsil eden makine ogrenmesi calismasidir.`,
    coverImage: "",
    images: [],
    technologies: ["Python", "Machine Learning", "Data Science", "Feature Engineering"],
    category: "Artificial Intelligence",
    status: "prototype",
    links: {},
    featured: true
  },
  {
    title: "Experimental Physics & Energy Systems",
    slug: "experimental-physics-energy-systems",
    summary: "Enerji, fiziksel deney duzenekleri, simulasyon ve sensor tabanli olcum sistemleri icin ayrilmis uzun vadeli lab alani.",
    description: `Experimental Physics & Energy Systems, enerji, fiziksel deney duzenekleri, simulasyon ve sensor tabanli olcum sistemleri icin ayrilmis uzun vadeli lab alanidir.`,
    coverImage: "",
    images: [],
    technologies: ["Physics", "Simulation", "Energy Systems", "Telemetry"],
    category: "Energy Systems",
    status: "idea",
    links: {},
    featured: false
  }
];
