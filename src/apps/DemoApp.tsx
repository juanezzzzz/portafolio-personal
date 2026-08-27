import { useEffect, useRef, useState } from "react";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { projects } from "../data/projects";

const INSTALL_STEPS = [
  "Resolviendo dependencias",
  "Descargando paquete",
  "Verificando firma",
  "Instalando",
  "Listo",
];
const INSTALL_STEP_MS = 320;

// Si el iframe no dispara `load` en este tiempo, lo mas probable es que el
// sitio de destino bloquee el embed via X-Frame-Options/CSP frame-ancestors
// (no hay forma de leer eso desde JS por same-origin policy, asi que se
// infiere por timeout en vez de detectarlo directamente).
const IFRAME_LOAD_TIMEOUT_MS = 4500;

function useInstallSequence() {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (stepIndex >= INSTALL_STEPS.length - 1) {
      const t = setTimeout(() => setDone(true), INSTALL_STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), INSTALL_STEP_MS);
    return () => clearTimeout(t);
  }, [stepIndex]);

  return { label: INSTALL_STEPS[stepIndex], step: stepIndex, done };
}

export function DemoApp({ projectId }: { projectId: string }) {
  const { label, step, done } = useInstallSequence();
  const project = projects.find((p) => p.id === projectId);
  const [embedBlocked, setEmbedBlocked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!done) return;
    timeoutRef.current = setTimeout(() => {
      if (!loaded) setEmbedBlocked(true);
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (!project) {
    return (
      <div className="p-5 font-mono text-[12px] text-jos-text-dim">
        Proyecto no encontrado.
      </div>
    );
  }

  const demoUrl = project.links?.demo;

  if (!demoUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <AlertTriangle size={20} className="text-jos-amber" />
        <p className="font-mono text-[12px] text-jos-text-dim">
          Este proyecto todavia no tiene un demo publico configurado.
        </p>
      </div>
    );
  }

  if (!done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-jos-bg-deep">
        <div className="font-mono text-2xl">{project.icon ?? "📦"}</div>
        <div className="font-mono text-[12px] text-jos-text-dim">{label}…</div>
        <div className="h-1 w-52 overflow-hidden rounded-full border border-jos-border">
          <div
            className="h-full bg-jos-amber transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / INSTALL_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (embedBlocked) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertTriangle size={20} className="text-jos-amber" />
        <p className="max-w-xs font-mono text-[12px] text-jos-text-dim">
          Este sitio no permite ejecutarse dentro de una ventana embebida.
          Abrelo en una pestana nueva para verlo en vivo.
        </p>
        <a
          href={demoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-jos-amber bg-jos-amber/10 px-3 py-1.5 font-mono text-[11px] text-jos-amber hover:bg-jos-amber/20"
        >
          <ExternalLink size={12} />
          Abrir demo en pestana nueva
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-jos-bg-deep">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-jos-text-dim">
          Cargando interfaz…
        </div>
      )}
      <iframe
        src={demoUrl}
        title={`Demo — ${project.name}`}
        className="h-full w-full border-0"
        onLoad={() => setLoaded(true)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}
