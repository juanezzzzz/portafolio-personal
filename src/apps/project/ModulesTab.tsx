import type { Project } from "../../data/projects";

export function ModulesTab({ modules }: { modules: NonNullable<Project["modules"]> }) {
  return (
    <div className="mx-auto grid max-w-[720px] grid-cols-1 gap-2.5 p-4 sm:grid-cols-2">
      {modules.map((m) => (
        <div key={m.title} className="rounded-lg border border-jos-border bg-jos-bg-deep p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {m.icon && <span className="text-base leading-none">{m.icon}</span>}
              <h3 className="font-mono text-[12px] text-jos-text">{m.title}</h3>
            </div>
            {m.tag && (
              <span className="shrink-0 rounded-full border border-jos-border px-1.5 py-0.5 font-mono text-[9px] text-jos-cyan">
                {m.tag}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-jos-text-dim">{m.description}</p>
        </div>
      ))}
    </div>
  );
}
