import { useEffect, useRef, useState } from "react";
import { profile, experience, education, skillCategories } from "../data/profile";
import { projects } from "../data/projects";
import { SYSTEM_VERSIONS } from "../data/versions";

type Line = { text: string; tone?: "dim" | "amber" | "cyan" | "red" };

const HELP_LINES: Line[] = [
  { text: "Comandos disponibles:", tone: "dim" },
  { text: "  about        informacion general" },
  { text: "  projects     lista de proyectos" },
  { text: "  skills       stack tecnico" },
  { text: "  experience   historial laboral" },
  { text: "  education    formacion academica" },
  { text: "  github       abrir repositorio" },
  { text: "  cv           abrir/descargar el CV en PDF" },
  { text: "  version      historial de versiones del sistema" },
  { text: "  contact      informacion de contacto" },
  { text: "  date         fecha actual" },
  { text: "  time         hora actual" },
  { text: "  theme        alternar tema del sistema" },
  { text: "  music        alternar sonido del sistema" },
  { text: "  matrix       ???" },
  { text: "  shutdown     apagar JOS" },
  { text: "  clear        limpiar la terminal" },
];

interface CommandContext {
  onCrash?: () => void;
  onShutdown?: () => void;
  onToggleTheme?: () => void;
  onMatrix?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

function runCommand(raw: string, ctx: CommandContext): Line[] {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "") return [];
  if (cmd === "sudo rm -rf /") {
    ctx.onCrash?.();
    return [{ text: "deleting everything...", tone: "red" }];
  }
  if (cmd === "help") return HELP_LINES;
  if (cmd === "about")
    return [{ text: profile.name, tone: "amber" }, { text: profile.role }, ...profile.bio.map((b) => ({ text: b }))];
  if (cmd === "projects")
    return projects.flatMap((p) => [
      { text: p.name, tone: "amber" as const },
      { text: `  stack: ${p.stack}` },
      { text: `  status: ${p.status}`, tone: "dim" as const },
    ]);
  if (cmd === "skills")
    return skillCategories.flatMap((g) => [
      { text: g.category, tone: "amber" as const },
      { text: `  ${g.items.join(", ")}` },
    ]);
  if (cmd === "experience")
    return experience.flatMap((e) => [
      { text: `${e.role} — ${e.org}`, tone: "amber" as const },
      { text: `  ${e.period}`, tone: "dim" as const },
      { text: `  ${e.description}` },
      ...(e.achievements ?? []).map((a) => ({ text: `  • ${a}`, tone: "dim" as const })),
      ...(e.tech && e.tech.length > 0 ? [{ text: `  stack: ${e.tech.join(", ")}`, tone: "cyan" as const }] : []),
    ]);
  if (cmd === "education")
    return education.flatMap((e) => [
      { text: e.title, tone: "amber" as const },
      { text: `  ${e.org} — ${e.period}`, tone: "dim" as const },
    ]);
  if (cmd === "github") {
    window.open(profile.github, "_blank");
    return [{ text: `abriendo ${profile.github} ...`, tone: "cyan" }];
  }
  if (cmd === "cv") {
    window.open(profile.cvUrl, "_blank");
    return [
      { text: `abriendo ${profile.cvUrl} ...`, tone: "cyan" },
      { text: `correo: ${profile.email}` },
      { text: `ciudad: ${profile.location}` },
      { text: `estado: ${profile.status}`, tone: "amber" },
    ];
  }
  if (cmd === "contact")
    return [
      { text: `correo: ${profile.email}` },
      { text: `ciudad: ${profile.location}` },
      { text: `estado: ${profile.status}`, tone: "amber" },
    ];
  if (cmd === "version" || cmd === "changelog")
    return SYSTEM_VERSIONS.flatMap((v) => [
      {
        text: `${v.version} — ${v.codename}${v.status === "current" ? "  (actual)" : ""}`,
        tone: v.status === "current" ? ("amber" as const) : v.status === "roadmap" ? ("dim" as const) : undefined,
      },
      { text: `  ${v.period}`, tone: "dim" as const },
    ]);
  if (cmd === "date") {
    const now = new Date();
    return [
      {
        text: now.toLocaleDateString("es-CO", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        tone: "cyan",
      },
    ];
  }
  if (cmd === "time") {
    const now = new Date();
    return [
      {
        text: now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        tone: "cyan",
      },
    ];
  }
  if (cmd === "theme") {
    ctx.onToggleTheme?.();
    return [{ text: "tema del sistema actualizado.", tone: "amber" }];
  }
  if (cmd === "music") {
    ctx.onToggleSound?.();
    return [
      {
        text: ctx.soundEnabled ? "sonido del sistema: apagado." : "sonido del sistema: encendido.",
        tone: "amber",
      },
    ];
  }
  if (cmd === "matrix") {
    ctx.onMatrix?.();
    return [{ text: "wake up, Juan...", tone: "cyan" }];
  }
  if (cmd === "shutdown") {
    ctx.onShutdown?.();
    return [{ text: "apagando JOS...", tone: "red" }];
  }
  if (cmd === "sudo hire juan")
    return [
      { text: "Permission granted.", tone: "amber" },
      { text: "Contratando a Juan... 100%", tone: "cyan" },
      { text: `Contactalo: ${profile.email}` },
    ];
  if (cmd.startsWith("sudo"))
    return [{ text: "usuario no esta en el archivo sudoers. Este incidente sera reportado 😄", tone: "red" }];

  return [{ text: `comando no encontrado: ${cmd} — escribe "help"`, tone: "red" }];
}

interface TerminalProps {
  onCrash?: () => void;
  onShutdown?: () => void;
  onToggleTheme?: () => void;
  onMatrix?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export function Terminal({
  onCrash,
  onShutdown,
  onToggleTheme,
  onMatrix,
  soundEnabled,
  onToggleSound,
}: TerminalProps) {
  const [history, setHistory] = useState<Line[]>([
    { text: `JOS terminal — escribe "help" para empezar`, tone: "dim" },
  ]);
  const [input, setInput] = useState("");
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [logIdx, setLogIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [history]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    if (cmd.trim().toLowerCase() === "clear") {
      setHistory([]);
    } else {
      const result = runCommand(cmd, {
        onCrash,
        onShutdown,
        onToggleTheme,
        onMatrix,
        soundEnabled,
        onToggleSound,
      });
      setHistory((h) => [...h, { text: `> ${cmd}`, tone: "cyan" }, ...result]);
    }
    if (cmd.trim()) setCmdLog((l) => [...l, cmd]);
    setLogIdx(null);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdLog.length) return;
      const nextIdx = logIdx === null ? cmdLog.length - 1 : Math.max(0, logIdx - 1);
      setLogIdx(nextIdx);
      setInput(cmdLog[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (logIdx === null) return;
      const nextIdx = logIdx + 1;
      if (nextIdx >= cmdLog.length) {
        setLogIdx(null);
        setInput("");
      } else {
        setLogIdx(nextIdx);
        setInput(cmdLog[nextIdx]);
      }
    }
  }

  const toneClass: Record<string, string> = {
    dim: "text-jos-text-dim",
    amber: "text-jos-amber",
    cyan: "text-jos-cyan",
    red: "text-jos-red",
  };

  return (
    <div
      className="flex h-full flex-col bg-jos-bg-deep p-3 font-mono text-[12.5px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 space-y-0.5 overflow-auto">
        {history.map((line, i) => (
          <div key={i} className={toneClass[line.tone ?? ""] ?? "text-jos-text"}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={submit} className="mt-2 flex items-center gap-2 border-t border-jos-border pt-2">
        <span className="text-jos-amber">{">"}</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-jos-text outline-none"
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
