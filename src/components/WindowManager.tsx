import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "../store/windowStore";
import { Window } from "./Window";
import { ErrorBoundary } from "./ErrorBoundary";

// Cada app pasa a ser su propio chunk: antes las 14 apps del sistema se
// cargaban todas en el bundle inicial aunque el visitante solo abriera una.
// El Suspense envuelve solo el CONTENIDO (ver mas abajo) — el chrome de la
// ventana (Window.tsx) se monta de inmediato, asi el marco no parpadea.
const About = lazy(() => import("../apps/About").then((m) => ({ default: m.About })));
const Resume = lazy(() => import("../apps/Resume").then((m) => ({ default: m.Resume })));
const Projects = lazy(() => import("../apps/Projects").then((m) => ({ default: m.Projects })));
const Experience = lazy(() => import("../apps/Experience").then((m) => ({ default: m.Experience })));
const Education = lazy(() => import("../apps/Education").then((m) => ({ default: m.Education })));
const Skills = lazy(() => import("../apps/Skills").then((m) => ({ default: m.Skills })));
const Stats = lazy(() => import("../apps/Stats").then((m) => ({ default: m.Stats })));
const Contact = lazy(() => import("../apps/Contact").then((m) => ({ default: m.Contact })));
const Terminal = lazy(() => import("../apps/Terminal").then((m) => ({ default: m.Terminal })));
const Explorer = lazy(() => import("../apps/Explorer").then((m) => ({ default: m.Explorer })));
const Settings = lazy(() => import("../apps/Settings").then((m) => ({ default: m.Settings })));
const ProjectApp = lazy(() => import("../apps/ProjectApp").then((m) => ({ default: m.ProjectApp })));
const DemoApp = lazy(() => import("../apps/DemoApp").then((m) => ({ default: m.DemoApp })));
const Versions = lazy(() => import("../apps/Versions").then((m) => ({ default: m.Versions })));
const BrowserApp = lazy(() => import("../apps/BrowserApp").then((m) => ({ default: m.BrowserApp })));

function AppLoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="font-mono text-xs text-jos-text-dim">
        cargando_modulo<span className="animate-pulse">_</span>
      </p>
    </div>
  );
}

interface WindowManagerProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCrash: () => void;
  onShutdown: () => void;
  onToggleTheme: () => void;
  onMatrix: () => void;
}

export function WindowManager({
  soundEnabled,
  onToggleSound,
  onCrash,
  onShutdown,
  onToggleTheme,
  onMatrix,
}: WindowManagerProps) {
  const windows = useWindowStore((s) => s.windows);

  return (
    <AnimatePresence>
      {windows.map((win, index) => {
        // Terminal, Explorer y las ventanas de proyecto/demo ya gestionan su
        // propio layout de ancho completo (consola, arbol de carpetas,
        // visor con capturas/iframe). Settings tambien: pasa a un layout de
        // panel de categorias (izquierda) + detalle (derecha), como una app
        // de sistema real — necesita el ancho completo de la ventana para
        // que la lista de categorias y el panel de detalle convivan, en vez
        // del ancho maximo centrado de una sola columna que usan About/Skills.
        const fullBleed =
          win.appId === "terminal" ||
          win.appId === "explorer" ||
          win.appId === "resume" ||
          win.appId === "settings" ||
          win.appId === "site" ||
          win.appId.startsWith("project:") ||
          win.appId.startsWith("demo:");

        return (
          <Window key={win.winId} win={win} index={index} fullBleed={fullBleed}>
            <ErrorBoundary winId={win.winId}>
              <Suspense fallback={<AppLoadingFallback />}>
                {win.appId === "about" && <About />}
                {win.appId === "resume" && <Resume />}
                {win.appId === "projects" && <Projects />}
                {win.appId === "experience" && <Experience />}
                {win.appId === "education" && <Education />}
                {win.appId === "skills" && <Skills />}
                {win.appId === "stats" && <Stats />}
                {win.appId === "contact" && <Contact />}
                {win.appId === "terminal" && (
                  <Terminal
                    onCrash={onCrash}
                    onShutdown={onShutdown}
                    onToggleTheme={onToggleTheme}
                    onMatrix={onMatrix}
                    soundEnabled={soundEnabled}
                    onToggleSound={onToggleSound}
                  />
                )}
                {win.appId === "explorer" && <Explorer />}
                {win.appId === "settings" && (
                  <Settings soundEnabled={soundEnabled} onToggleSound={onToggleSound} />
                )}
                {win.appId === "versions" && <Versions />}
                {win.appId === "site" && <BrowserApp />}
                {win.appId.startsWith("project:") && (
                  <ProjectApp projectId={win.appId.slice("project:".length)} />
                )}
                {win.appId.startsWith("demo:") && (
                  <DemoApp projectId={win.appId.slice("demo:".length)} />
                )}
              </Suspense>
            </ErrorBoundary>
          </Window>
        );
      })}
    </AnimatePresence>
  );
}
