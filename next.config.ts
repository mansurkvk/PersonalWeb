import type { NextConfig } from "next";

// Next.js ayarlari Vercel uyumlu ve sade tutulur.
const nextConfig: NextConfig = {
  images: {
    // Harici gorsel kaynaklari eklenirse domain listesi burada tanimlanir.
    remotePatterns: []
  }
};

export default nextConfig;
