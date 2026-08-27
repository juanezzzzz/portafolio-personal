import type { Project } from "../../data/projects";

export function ArchitectureTab({ architecture }: { architecture: NonNullable<Project["architecture"]> }) {
  return (
    <div className="mx-auto max-w-[720px] p-4">
      <p className="text-[12px] leading-relaxed text-jos-text-dim">{architecture.summary}</p>
      <div className="mt-4 space-y-2">
        {architecture.layers.map((l) => (
          <div key={l.layer} className="flex gap-3 border-l-2 border-jos-amber-dim/60 py-1 pl-3">
            <span className="w-24 shrink-0 font-mono text-[11px] text-jos-amber">{l.layer}</span>
            <span className="text-[12px] leading-relaxed text-jos-text-dim">{l.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
