import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/devices", label: "Devices" },
  { href: "/admin/telemetry", label: "Telemetry" },
  { href: "/admin/broker", label: "Broker" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/settings", label: "Settings" }
];

// Admin panelini public siteden gorsel olarak ayirir.
export function AdminShell({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="h-fit rounded-[2rem] border border-white/10 bg-black/25 p-4">
        <p className="px-3 font-mono-lab text-xs uppercase tracking-[0.3em] text-[#8bd3dd]">Admin</p>
        <nav className="mt-4 grid gap-1">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.07] hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section>
        <div className="mb-8">
          <p className="font-mono-lab text-xs uppercase tracking-[0.35em] text-[#8bd3dd]">Control Plane</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-slate-300">{description}</p> : null}
        </div>
        {children}
      </section>
    </div>
  );
}
