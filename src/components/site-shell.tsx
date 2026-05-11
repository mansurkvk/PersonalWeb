import Link from "next/link";
import { Cpu, Github, Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AuthNav } from "@/components/auth-nav";
import { SplineRobotBackdrop } from "@/components/spline-robot-stage";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/info", label: "Info" },
  { href: "/projects", label: "Projeler" },
  { href: "/blog", label: "Blog" },
  { href: "/esp", label: "ESP Dashboard" }
];

// Ortak site kabugu: sabit sahne, navbar, footer ve premium dark katmanlar burada tutulur.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <SplineRobotBackdrop />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_18%_26%,rgba(139,211,221,0.12),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(213,180,106,0.1),transparent_24%)]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,7,13,0.1)_0%,rgba(5,7,13,0.58)_100%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070d]/62 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_38px_rgba(139,211,221,0.18)]">
              <Cpu className="size-5 text-[#8bd3dd]" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.28em] text-white">MANSUR</span>
              <span className="block text-xs text-slate-400">Engineering Lab</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 shadow-[0_18px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <AuthNav />
          </div>
        </nav>
      </header>

      <section className="site-content relative z-10">{children}</section>

      <footer className="relative z-10 border-t border-white/10 bg-[#05070d]/55 px-4 py-10 text-sm text-slate-400 backdrop-blur-2xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p>© {new Date().getFullYear()} {siteConfig.owner.name} - mechatronics, robotics, physics and AI.</p>
            <a href={siteConfig.links.oldSite} className="mt-2 inline-block text-[#8bd3dd] hover:text-white">
              Legacy Portfolio
            </a>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href={siteConfig.links.github} className="hover:text-[#8bd3dd]" aria-label="GitHub"><Github className="size-5" /></a>
            <a href={siteConfig.links.linkedin} className="hover:text-[#8bd3dd]" aria-label="LinkedIn"><Linkedin className="size-5" /></a>
            <a href={siteConfig.links.instagram} className="hover:text-[#8bd3dd]" aria-label="Instagram"><Instagram className="size-5" /></a>
            <a href={siteConfig.links.youtube} className="hover:text-[#8bd3dd]" aria-label="YouTube"><Youtube className="size-5" /></a>
            <a href={siteConfig.links.email} className="hover:text-[#8bd3dd]" aria-label="E-posta"><Mail className="size-5" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
