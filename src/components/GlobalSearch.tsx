import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, TerminalSquare } from "lucide-react";
import { useWindowStore } from "../store/windowStore";
import { APPS } from "../data/apps";
import { APP_ICON_COMPONENTS } from "../data/icons";
import { projects } from "../data/projects";
import { skillCategories } from "../data/profile";
import { useOverlayDismiss } from "../hooks/useOverlayDismiss";

interface GlobalSearchProps {
  onClose: () => void;
}

const TERMINAL_COMMANDS = [
  "help", "about", "projects", "skills", "experience", "education",
  "github", "cv", "contact", "version", "date", "time", "theme", "music", "matrix", "shutdown", "clear",
];

type ResultKind = "app" | "project" | "skill" | "command";

interface Result {
  kind: ResultKind;
  label: string;
  sub: string;
  action: () => void;
}

export function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useOverlayDismiss<HTMLInputElement>(onClose);
  const openApp = useWindowStore((s) => s.openApp);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();

    const appResults: Result[] = Object.values(APPS).map((app) => ({
      kind: "app",
      label: app.title,
      sub: "aplicacion",
      action: () => openApp(app),
    }));

    const projectResults: Result[] = projects.map((p) => ({
      kind: "project",
      label: p.name,
      sub: p.stack,
      action: () => openApp(APPS.projects),
    }));

    const skillResults: Result[] = skillCategories.flatMap((g) =>
      g.items.map((item) => ({
        kind: "skill" as const,
        label: item,
        sub: g.category,
        action: () => openApp(APPS.skills),
      }))
    );

    const commandResults: Result[] = TERMINAL_COMMANDS.map((c) => ({
      kind: "command",
      label: c,
      sub: "comando de terminal",
      action: () => openApp(APPS.terminal),
    }));

    const all = [...appResults, ...projectResults, ...skillResults, ...commandResults];
    if (!q) return all.slice(0, 8);
    return all.filter((r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)).slice(0, 12);
  }, [query, openApp]);

  function runResult(r: Result) {
    r.action();
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-[9997] bg-black/50" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-label="Buscar"
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.12 }}
        className="jos-elevation-3 jos-overlay-glass fixed left-1/2 top-24 z-[9999] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border"
      >
        <div className="flex items-center gap-2 border-b border-jos-border px-3 py-2.5">
          <Search size={15} className="text-jos-text-dim" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar apps, proyectos, skills, comandos..."
            className="w-full bg-transparent font-mono text-sm text-jos-text outline-none placeholder:text-jos-text-dim"
          />
          <kbd className="rounded-md border border-jos-border px-1.5 py-0.5 font-mono text-[10px] text-jos-text-dim">
            Esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-4 text-center font-mono text-[11px] text-jos-text-dim">sin resultados</p>
          ) : (
            results.map((r, i) => {
              const Icon = r.kind === "app" ? APP_ICON_COMPONENTS[Object.values(APPS).find((a) => a.title === r.label)!.id] : TerminalSquare;
              return (
                <button
                  key={`${r.kind}-${r.label}-${i}`}
                  onClick={() => runResult(r)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-jos-chrome-light"
                >
                  <Icon size={14} className="shrink-0 text-jos-amber" />
                  <span className="font-mono text-xs text-jos-text">{r.label}</span>
                  <span className="ml-auto truncate text-[10px] text-jos-text-dim">{r.sub}</span>
                </button>
              );
            })
          )}
        </div>
      </motion.div>
    </>
  );
}
