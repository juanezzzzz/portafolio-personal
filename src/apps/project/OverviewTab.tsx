import type { ReactNode } from "react";
import { ExternalLink, FileText, Images, Play, CheckCircle2, Blocks, Layers } from "lucide-react";
import { GithubIcon } from "../../data/brandIcons";
import type { Project } from "../../data/projects";
import type { useGithubRepoInfo } from "../../hooks/useGithubRepoInfo";
import { GithubBadges } from "./GithubBadges";
import type { ProjectTab } from "./FileTree";

function LinkButton({
  href,
  icon,
  label,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-jos-border px-2.5 py-1.5 font-mono text-[11px] text-jos-text hover:border-jos-amber-dim hover:text-jos-amber"
    >
      {icon}
      {label}
    </a>
  );
}

export function OverviewTab({
  project,
  githubInfo,
  screenshots,
  onJump,
  onRunDemo,
}: {
  project: Project;
  githubInfo: ReturnType<typeof useGithubRepoInfo>;
  screenshots: string[];
  onJump: (tab: ProjectTab) => void;
  onRunDemo: () => void;
}) {
  return (
    <div className="mx-auto max-w-[720px] p-4">
      {screenshots[0] && (
        <img
          src={screenshots[0]}
          alt={project.name}
          className="mb-4 w-full rounded-lg border border-jos-border object-cover"
        />
      )}
      <p className="text-[13px] leading-relaxed text-jos-text">{project.description}</p>
      {project.links?.github && <GithubBadges info={githubInfo} />}

      {project.metrics && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-jos-border bg-jos-bg-deep p-2.5 text-center">
              <div className="font-mono text-sm text-jos-amber">{m.value}</div>
              <div className="mt-0.5 font-mono text-[10px] text-jos-text-dim">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {project.technologies && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="rounded-full border border-jos-border px-1.5 py-0.5 font-mono text-[10px] text-jos-cyan"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {project.features && (
        <div className="mt-4 space-y-1.5">
          {project.features.map((f) => (
            <div key={f} className="flex items-start gap-2 text-[12px] text-jos-text">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-jos-amber" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <LinkButton href={project.links?.demo} icon={<ExternalLink size={12} />} label="Demo" />
        <LinkButton href={project.links?.github} icon={<GithubIcon size={12} />} label="GitHub" />
        {project.readme && (
          <button
            onClick={() => onJump("readme")}
            className="flex items-center gap-1.5 rounded-lg border border-jos-border px-2.5 py-1.5 font-mono text-[11px] text-jos-text hover:border-jos-amber-dim hover:text-jos-amber"
          >
            <FileText size={12} />
            README
          </button>
        )}
        {project.modules?.length ? (
          <button
            onClick={() => onJump("modules")}
            className="flex items-center gap-1.5 rounded-lg border border-jos-border px-2.5 py-1.5 font-mono text-[11px] text-jos-text hover:border-jos-amber-dim hover:text-jos-amber"
          >
            <Blocks size={12} />
            Modules
          </button>
        ) : null}
        {project.architecture && (
          <button
            onClick={() => onJump("architecture")}
            className="flex items-center gap-1.5 rounded-lg border border-jos-border px-2.5 py-1.5 font-mono text-[11px] text-jos-text hover:border-jos-amber-dim hover:text-jos-amber"
          >
            <Layers size={12} />
            Architecture
          </button>
        )}
        {screenshots.length > 0 && (
          <button
            onClick={() => onJump("gallery")}
            className="flex items-center gap-1.5 rounded-lg border border-jos-border px-2.5 py-1.5 font-mono text-[11px] text-jos-text hover:border-jos-amber-dim hover:text-jos-amber"
          >
            <Images size={12} />
            Gallery
          </button>
        )}
        <button
          onClick={onRunDemo}
          className="flex items-center gap-1.5 rounded-lg border border-jos-amber bg-jos-amber/10 px-2.5 py-1.5 font-mono text-[11px] text-jos-amber hover:bg-jos-amber/20"
        >
          <Play size={12} />
          Run Application
        </button>
      </div>
    </div>
  );
}
