import { ExternalLink } from "lucide-react";
import { projects, type ProjectStatus } from "../data/projects";
import { GithubIcon } from "../data/brandIcons";
import { SectionHeading } from "./SectionHeading";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: "En producción",
  completed: "Completado",
  "in-progress": "En progreso",
};

const STATUS_COLOR: Record<ProjectStatus, string> = {
  production: "text-jos-cyan border-jos-cyan/50",
  completed: "text-jos-amber border-jos-amber-dim",
  "in-progress": "text-jos-text-dim border-jos-border",
};

export function Projects() {
  return (
    <section id="proyectos" className="mx-auto max-w-5xl px-5 py-24">
      <SectionHeading eyebrow="Portafolio" title="Proyectos" />

      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-lg border border-jos-border bg-jos-chrome/40 p-5 transition-colors hover:border-jos-amber-dim/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {p.icon && <span className="text-base">{p.icon}</span>}
                <h3 className="font-mono text-sm text-jos-text">{p.name}</h3>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] ${STATUS_COLOR[p.status]}`}
              >
                {STATUS_LABEL[p.status]}
              </span>
            </div>

            <p className="mt-1 font-mono text-[11px] text-jos-text-dim">{p.stack}</p>
            <p className="mt-3 flex-1 text-[13px] leading-relaxed text-jos-text-dim">
              {p.description}
            </p>

            {p.technologies && p.technologies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.technologies.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-jos-border bg-jos-chrome px-2 py-0.5 font-mono text-[10px] text-jos-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {(p.links?.demo || p.links?.github) && (
              <div className="mt-4 flex gap-3 border-t border-jos-border pt-3">
                {p.links?.demo && (
                  <a
                    href={p.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[12px] text-jos-cyan hover:underline"
                  >
                    <ExternalLink size={12} />
                    Demo
                  </a>
                )}
                {p.links?.github && (
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[12px] text-jos-text-dim hover:text-jos-text"
                  >
                    <GithubIcon size={12} />
                    Código
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
