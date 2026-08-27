import type { Project } from "../../data/projects";
import { MiniMarkdown } from "./MiniMarkdown";

export function ReadmeTab({ project }: { project: Project }) {
  return (
    <div className="mx-auto max-w-[720px] p-4">
      {project.readme ? (
        <MiniMarkdown source={project.readme} />
      ) : (
        <p className="font-mono text-[12px] text-jos-text-dim">
          Este proyecto todavía no tiene README cargado.
        </p>
      )}
    </div>
  );
}
