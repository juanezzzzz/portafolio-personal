import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText, AppWindow } from "lucide-react";
import { projects, isFullProject } from "../data/projects";
import { useWindowStore } from "../store/windowStore";

interface Node {
  name: string;
  children?: Node[];
  isFile?: boolean;
  isApp?: boolean;
  projectId?: string;
}

const TREE: Node[] = [
  {
    name: "Projects",
    children: projects.map((p) =>
      isFullProject(p)
        ? { name: `${p.name}.app`, isFile: true, isApp: true, projectId: p.id }
        : { name: p.name, isFile: true }
    ),
  },
  { name: "Certificates", children: [] },
  { name: "Resume.pdf", isFile: true },
  { name: "Skills.json", isFile: true },
  { name: "Contact.txt", isFile: true },
];

function TreeNode({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const openProjectApp = useWindowStore((s) => s.openProjectApp);
  const hasChildren = !!node.children;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setOpen((v) => !v);
        }}
        onDoubleClick={() => {
          if (node.isApp && node.projectId) {
            const p = projects.find((pr) => pr.id === node.projectId);
            if (p) openProjectApp(p);
          }
        }}
        style={{ paddingLeft: 8 + depth * 16 }}
        className="flex w-full items-center gap-1.5 py-1 text-left text-[13px] text-jos-text hover:bg-jos-chrome-light"
      >
        {hasChildren ? (
          open ? (
            <ChevronDown size={13} className="text-jos-text-dim" />
          ) : (
            <ChevronRight size={13} className="text-jos-text-dim" />
          )
        ) : (
          <span className="w-[13px]" />
        )}
        {node.isApp ? (
          <AppWindow size={14} className="text-jos-amber" />
        ) : node.isFile ? (
          <FileText size={14} className="text-jos-cyan" />
        ) : (
          <Folder size={14} className="text-jos-amber" />
        )}
        {node.name}
      </button>
      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Explorer() {
  return (
    <div className="py-2">
      {TREE.map((node) => (
        <TreeNode key={node.name} node={node} />
      ))}
    </div>
  );
}
