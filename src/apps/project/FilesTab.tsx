import { Folder, FileText } from "lucide-react";
import type { Project } from "../../data/projects";
import { FileTreeRow, SIMULATED_FILES, type ProjectTab } from "./FileTree";

export function FilesTab({
  project,
  hasScreenshots,
  onJump,
}: {
  project: Project;
  hasScreenshots: boolean;
  onJump: (tab: ProjectTab) => void;
}) {
  if (project.fileTree) {
    return (
      <div className="py-2">
        {project.fileTree.map((node) => (
          <FileTreeRow key={node.name} node={node} depth={0} onJump={onJump} />
        ))}
      </div>
    );
  }

  return (
    <div className="py-2">
      {SIMULATED_FILES(project).map((f) => {
        const jumpTo: ProjectTab | null =
          f.name === "README.md" && project.readme
            ? "readme"
            : f.name === "screenshots/" && hasScreenshots
              ? "gallery"
              : null;
        return (
          <button
            key={f.name}
            onClick={() => jumpTo && onJump(jumpTo)}
            disabled={!jumpTo}
            className={`flex w-full items-center gap-1.5 px-3 py-1 text-left font-mono text-[12px] text-jos-text ${
              jumpTo ? "hover:bg-jos-chrome-light" : "cursor-default"
            }`}
          >
            {f.isDir ? (
              <Folder size={13} className="text-jos-amber" />
            ) : (
              <FileText size={13} className="text-jos-cyan" />
            )}
            <span className={f.present ? "" : "text-jos-text-dim line-through"}>{f.name}</span>
          </button>
        );
      })}
    </div>
  );
}
