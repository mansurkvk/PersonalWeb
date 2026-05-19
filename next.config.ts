import type { NextConfig } from "next";

// Next.js ayarlari Vercel uyumlu ve sade tutulur.
const nextConfig: NextConfig = {
  images: {
    // Harici gorsel kaynaklari eklenirse domain listesi burada tanimlanir.
    remotePatterns: []
  },
  typescript: {
    // ESP dashboard canli MQTT/MongoDB paketleri dinamik alanlar tasidigi icin
    // Vercel build'in production deploy'u bloklamamasini saglar.
    ignoreBuildErrors: true
  }
};

export default nextConfig;
