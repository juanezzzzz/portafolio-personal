import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Desktop } from "./Desktop";
import { Wallpaper } from "./Wallpaper";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "./WindowManager";
import { WidgetLayer } from "./WidgetLayer";
import { BootScreen } from "./BootScreen";
import { LockScreen } from "./LockScreen";
import { FakeBSOD } from "./FakeBSOD";
import { MatrixMode } from "./MatrixMode";
import { Onboarding } from "./Onboarding";
import { useSettingsStore } from "../store/settingsStore";
import { useNotificationStore } from "../store/notificationStore";
import { useWindowStore } from "../store/windowStore";
import { soundManager } from "../lib/soundManager";
import { APPS } from "../data/apps";
import { projects } from "../data/projects";

type SystemState = "booting" | "running" | "locked" | "shutdown";

const IDLE_LOCK_MS = 5 * 60 * 1000; // 5 minutos, como en el brief original

interface DesktopShellProps {
  /** Destino de "?open=..." si la URL traia uno; null si no. */
  deepLinkTarget: string | null;
  /** El tema secreto del Konami vive en App, porque pinta el contenedor raiz. */
  onToggleTheme: () => void;
}

/**
 * El escritorio JOS completo: boot, lock, ventanas, taskbar y widgets.
 *
 * Vive aparte de App.tsx y se carga con lazy() a proposito. Arrastra
 * framer-motion, react-rnd y todos los componentes del sistema — entre los tres
 * son la mayor parte del peso de la app, y en movil no se usa ninguno (ver
 * MobileShell). Separarlo evita que un visitante desde el telefono descargue el
 * escritorio entero para no verlo nunca.
 */
export function DesktopShell({ deepLinkTarget, onToggleTheme }: DesktopShellProps) {
  // Un deep link salta el boot: quien recibio el enlace deberia ver el
  // contenido de inmediato, no esperar la animacion retro.
  const [systemState, setSystemState] = useState<SystemState>(
    deepLinkTarget ? "running" : "booting"
  );
  const [crashing, setCrashing] = useState(false);
  const [inMatrix, setInMatrix] = useState(false);

  const { soundEnabled, toggleSound } = useSettingsStore();
  const push = useNotificationStore((s) => s.push);
  const hasWelcomed = useRef(false);

  // auto-lock por inactividad
  useEffect(() => {
    if (systemState !== "running") return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setSystemState("locked"), IDLE_LOCK_MS);
    };
    reset();
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [systemState]);

  // bienvenida una sola vez, al primer arranque completo
  useEffect(() => {
    if (systemState === "running" && !hasWelcomed.current) {
      hasWelcomed.current = true;
      soundManager.boot();
      push({
        title: "JOS listo",
        message: "Bienvenido al sistema. Explora las apps del escritorio.",
        kind: "info",
      });
    }
  }, [systemState, push]);

  // abre la ventana del deep link una sola vez al montar
  useEffect(() => {
    if (!deepLinkTarget) return;
    const { openApp, openProjectApp, openDemoApp } = useWindowStore.getState();
    if (deepLinkTarget in APPS) {
      openApp(APPS[deepLinkTarget as keyof typeof APPS]);
      return;
    }
    const [kind, id] = deepLinkTarget.split(":");
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const target = { id: project.id, name: project.name, icon: project.icon };
    if (kind === "project") openProjectApp(target);
    else if (kind === "demo") openDemoApp(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleShutdown() {
    soundManager.shutdown();
    setSystemState("shutdown");
  }

  function handleUnlock() {
    soundManager.unlock();
    setSystemState("running");
  }

  function handleCrash() {
    soundManager.error();
    push({
      title: "Kernel panic (falso)",
      message: "Easter egg: sudo rm -rf / en terminal.",
      kind: "error",
    });
    setCrashing(true);
  }

  function handleMatrix() {
    push({ title: "Modo Matrix", message: "Wake up, Juan.", kind: "achievement" });
    setInMatrix(true);
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {systemState === "booting" && (
          <BootScreen key="boot" onDone={() => setSystemState("running")} />
        )}
        {systemState === "locked" && <LockScreen key="lock" onUnlock={handleUnlock} />}
        {systemState === "shutdown" && (
          <LockScreen key="shutdown" isShutdown onUnlock={() => setSystemState("booting")} />
        )}
      </AnimatePresence>

      {crashing && <FakeBSOD onDone={() => setCrashing(false)} />}
      {inMatrix && <MatrixMode onDone={() => setInMatrix(false)} />}

      {(systemState === "running" || systemState === "locked") && (
        <>
          <Wallpaper />
          <Desktop />
          <WidgetLayer />
          <WindowManager
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            onCrash={handleCrash}
            onShutdown={handleShutdown}
            onToggleTheme={onToggleTheme}
            onMatrix={handleMatrix}
          />
          <Taskbar onShutdown={handleShutdown} />
          {systemState === "running" && !deepLinkTarget && <Onboarding />}
        </>
      )}
    </>
  );
}
