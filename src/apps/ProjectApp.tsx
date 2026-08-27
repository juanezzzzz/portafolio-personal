import { useEffect, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { projects } from "../data/projects";
import { useWindowStore } from "../store/windowStore";
import { useGithubRepoInfo } from "../hooks/useGithubRepoInfo";
import { buildDeepLink } from "../lib/deepLink";
import { asset } from "../lib/asset";
import type { ProjectTab } from "./project/FileTree";
import { OverviewTab } from "./project/OverviewTab";
import { ReadmeTab } from "./project/ReadmeTab";
import { ModulesTab } from "./project/ModulesTab";
import { ArchitectureTab } from "./project/ArchitectureTab";
import { GalleryTab } from "./project/GalleryTab";
import { FilesTab } from "./project/FilesTab";

const LOADING_STEPS = ["Launching", "Loading assets", "Initializing", "Done"];
const LOADING_STEP_MS = 260;

function useLoadingSequence() {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (stepIndex >= LOADING_STEPS.length - 1) {
      const t = setTimeout(() => setDone(true), LOADING_STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), LOADING_STEP_MS);
    return () => clearTimeout(t);
  }, [stepIndex]);

  return { label: LOADING_STEPS[stepIndex], done };
}

export function ProjectApp({ projectId }: { projectId: string }) {
  const { label, done } = useLoadingSequence();
  const [tab, setTab] = useState<ProjectTab>("overview");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const openDemoApp = useWindowStore((s) => s.openDemoApp);

  function handleShare() {
    navigator.clipboard.writeText(buildDeepLink(`project:${projectId}`));
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1800);
  }

  const project = projects.find((p) => p.id === projectId);
  const githubInfo = useGithubRepoInfo(project?.links?.github);

  if (!project) {
    return (
      <div className="p-5 font-mono text-[12px] text-jos-text-dim">
        Proyecto no encontrado.
      </div>
    );
  }

  if (!done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-jos-bg-deep">
        <div className="font-mono text-2xl">{project.icon ?? "📦"}</div>
        <div className="font-mono text-[12px] text-jos-text-dim">{label}…</div>
        <div className="h-1 w-40 overflow-hidden rounded-full border border-jos-border">
          <div className="h-full w-1/3 animate-pulse bg-jos-amber" />
        </div>
      </div>
    );
  }

  const screenshots = (project.screenshots ?? []).map(asset);
  const TABS: { id: ProjectTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "readme", label: "README" },
    ...(project.modules?.length ? [{ id: "modules" as const, label: "Modules" }] : []),
    ...(project.architecture ? [{ id: "architecture" as const, label: "Architecture" }] : []),
    { id: "gallery", label: "Gallery" },
    { id: "files", label: "Files" },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-jos-border p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-jos-border bg-jos-bg-deep text-lg">
          {project.icon ?? "📦"}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-mono text-sm text-jos-text">{project.name}</h2>
          <p className="truncate font-mono text-[11px] text-jos-text-dim">{project.stack}</p>
        </div>
        <button
          onClick={handleShare}
          aria-label="Copiar link directo a este proyecto"
          title="Copiar link directo a este proyecto"
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
            linkCopied
              ? "border-jos-cyan/60 text-jos-cyan"
              : "border-jos-border text-jos-text-dim hover:border-jos-amber-dim hover:text-jos-amber"
          }`}
        >
          {linkCopied ? <Check size={12} /> : <Link2 size={12} />}
          {linkCopied ? "Copiado" : "Compartir"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-jos-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 font-mono text-[11px] ${
              tab === t.id
                ? "border-b border-jos-amber text-jos-amber"
                : "text-jos-text-dim hover:text-jos-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "overview" && (
          <OverviewTab
            project={project}
            githubInfo={githubInfo}
            screenshots={screenshots}
            onJump={setTab}
            onRunDemo={() => openDemoApp({ id: project.id, name: project.name, icon: project.icon })}
          />
        )}
        {tab === "readme" && <ReadmeTab project={project} />}
        {tab === "modules" && project.modules && <ModulesTab modules={project.modules} />}
        {tab === "architecture" && project.architecture && (
          <ArchitectureTab architecture={project.architecture} />
        )}
        {tab === "gallery" && (
          <GalleryTab
            projectName={project.name}
            screenshots={screenshots}
            index={galleryIndex}
            setIndex={setGalleryIndex}
          />
        )}
        {tab === "files" && (
          <FilesTab project={project} hasScreenshots={screenshots.length > 0} onJump={setTab} />
        )}
      </div>
    </div>
  );
}
