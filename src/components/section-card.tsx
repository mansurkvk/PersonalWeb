import { clsx } from "clsx";

// Tekrar kullanilabilir premium kart bileseni.
export function SectionCard({
  title,
  eyebrow,
  children,
  className
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("glass-panel lab-border rounded-[2rem] p-6", className)}>
      {eyebrow ? <p className="mb-3 font-mono-lab text-xs font-semibold uppercase tracking-[0.32em] text-[#8bd3dd]">{eyebrow}</p> : null}
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-4 text-slate-300">{children}</div>
    </section>
  );
}
