import { ChevronRight } from "lucide-react";
import { projects, isFullProject, type ProjectStatus } from "../data/projects";
import { useWindowStore } from "../store/windowStore";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: "Production",
  completed: "Completed",
  "in-progress": "In progress",
};

const STATUS_COLOR: Record<ProjectStatus, string> = {
  production: "text-jos-cyan border-jos-cyan/50",
  completed: "text-jos-amber border-jos-amber-dim",
  "in-progress": "text-jos-text-dim border-jos-border",
};

export function Projects() {
  const openProjectApp = useWindowStore((s) => s.openProjectApp);

  return (
    <div className="divide-y divide-jos-border">
      {projects.map((p) => {
        const openable = isFullProject(p);
        return (
          <button
            key={p.id}
            onClick={() => openable && openProjectApp(p)}
            disabled={!openable}
            className={`w-full p-4 text-left ${openable ? "hover:bg-jos-chrome-light" : "cursor-default"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {p.icon && <span className="text-sm">{p.icon}</span>}
                <h3 className="font-mono text-sm text-jos-text">{p.name}</h3>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`border px-1.5 py-0.5 font-mono text-[10px] ${STATUS_COLOR[p.status]}`}
                >
                  {STATUS_LABEL[p.status]}
                </span>
                {openable && <ChevronRight size={13} className="text-jos-text-dim" />}
              </div>
            </div>
            <p className="mt-1 font-mono text-[11px] text-jos-text-dim">{p.stack}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-jos-text">{p.description}</p>
          </button>
        );
      })}
    </div>
  );
}
