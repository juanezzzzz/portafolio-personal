import { useState } from "react";
import { Folder, FileText } from "lucide-react";
import type { Project, FileTreeNode } from "../../data/projects";

export type ProjectTab = "overview" | "readme" | "modules" | "architecture" | "gallery" | "files";

export const SIMULATED_FILES = (p: Project) => [
  { name: "README.md", present: !!p.readme },
  { name: "screenshots/", present: !!p.screenshots?.length, isDir: true },
  { name: "assets/", isDir: true, present: true },
  { name: "LICENSE", present: true },
];

/** Fila de un arbol de archivos real. Las carpetas se expanden/colapsan; los
 * archivos que la app sabe abrir en otra pestaña (README.md → readme,
 * assets/screenshots → gallery) son clickeables como en la lista simulada. */
export function FileTreeRow({
  node,
  depth,
  onJump,
}: {
  node: FileTreeNode;
  depth: number;
  onJump: (tab: ProjectTab) => void;
}) {
  const [open, setOpen] = useState(depth === 0);
  const isDir = node.type === "dir";
  const jumpTo: ProjectTab | null =
    node.name === "README.md" ? "readme" : /^(screenshots|assets)$/.test(node.name) ? "gallery" : null;

  return (
    <div>
      <button
        onClick={() => (isDir ? setOpen((v) => !v) : jumpTo && onJump(jumpTo))}
        disabled={!isDir && !jumpTo}
        style={{ paddingLeft: 12 + depth * 16 }}
        className={`flex w-full items-center gap-1.5 py-1 pr-3 text-left font-mono text-[12px] text-jos-text ${
          isDir || jumpTo ? "hover:bg-jos-chrome-light" : "cursor-default"
        }`}
      >
        {isDir ? (
          <Folder size={13} className="shrink-0 text-jos-amber" />
        ) : (
          <FileText size={13} className="shrink-0 text-jos-cyan" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isDir && open && node.children?.map((child) => (
        <FileTreeRow key={child.name} node={child} depth={depth + 1} onJump={onJump} />
      ))}
    </div>
  );
}
