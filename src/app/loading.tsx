export default function Loading() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-4xl place-items-center px-4 py-16">
      <div className="glass-panel rounded-[2rem] p-8 text-center">
        <p className="font-mono-lab text-xs uppercase tracking-[0.3em] text-[#8bd3dd]">Loading</p>
        <p className="mt-3 text-lg text-slate-300">Lab verileri hazirlaniyor...</p>
      </div>
    </div>
  );
}
