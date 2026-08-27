export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-jos-cyan">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-jos-text sm:text-3xl">{title}</h2>
      <div className="mt-4 h-px w-16 bg-jos-amber-dim" />
    </div>
  );
}
