export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
