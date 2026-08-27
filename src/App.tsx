import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Desktop } from "./components/Desktop";
import { Wallpaper } from "./components/Wallpaper";
import { Taskbar } from "./components/Taskbar";
import { WindowManager } from "./components/WindowManager";
import { WidgetLayer } from "./components/WidgetLayer";
import { BootScreen } from "./components/BootScreen";
import { LockScreen } from "./components/LockScreen";
import { FakeBSOD } from "./components/FakeBSOD";
import { MatrixMode } from "./components/MatrixMode";
import { Onboarding } from "./components/Onboarding";
import { useKonamiCode } from "./hooks/useKonamiCode";
import { useSettingsStore, THEME_CLASS } from "./store/settingsStore";
import { useNotificationStore } from "./store/notificationStore";
import { useWindowStore } from "./store/windowStore";
import { soundManager } from "./lib/soundManager";
import { getDeepLinkTarget } from "./lib/deepLink";
import { APPS } from "./data/apps";
import { projects } from "./data/projects";

type SystemState = "booting" | "running" | "locked" | "shutdown";

const IDLE_LOCK_MS = 5 * 60 * 1000; // 5 minutos, como en el brief original

export default function App() {
  // Si alguien entra por un link tipo "?open=project:yopvial" (boton
  // compartir de ProjectApp), se saltea el boot y va directo al escritorio
  // con esa ventana ya abierta — priorizar que quien recibio el link vea el
  // contenido de inmediato en vez de hacerlo esperar la animacion retro.
  // Se lee una sola vez al montar: la URL no cambia sola durante la sesion.
  const deepLinkTarget = useRef(getDeepLinkTarget()).current;
  const [systemState, setSystemState] = useState<SystemState>(deepLinkTarget ? "running" : "booting");
  const [crashing, setCrashing] = useState(false);
  const [inMatrix, setInMatrix] = useState(false);
  const [specialTheme, setSpecialTheme] = useState(false);

  const { theme, soundEnabled, toggleSound } = useSettingsStore();
  const push = useNotificationStore((s) => s.push);
  const hasWelcomed = useRef(false);

  useKonamiCode(
    useCallback(() => {
      setSpecialTheme((v) => {
        const next = !v;
        if (next) push({ title: "Tema secreto desbloqueado", message: "Konami code activado.", kind: "achievement" });
        return next;
      });
    }, [push])
  );

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
      push({ title: "JOS listo", message: "Bienvenido al sistema. Explora las apps del escritorio.", kind: "info" });
    }
  }, [systemState, push]);

  // abre la ventana del deep link (ver arriba) una sola vez al montar
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
    push({ title: "Kernel panic (falso)", message: "Easter egg: sudo rm -rf / en terminal.", kind: "error" });
    setCrashing(true);
  }

  function handleMatrix() {
    push({ title: "Modo Matrix", message: "Wake up, Juan.", kind: "achievement" });
    setInMatrix(true);
  }

  return (
    <div
      className={`relative h-dvh w-screen overflow-hidden bg-jos-bg-deep ${
        specialTheme ? "jos-theme-special" : THEME_CLASS[theme]
      }`}
    >
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
            onToggleTheme={() => setSpecialTheme((v) => !v)}
            onMatrix={handleMatrix}
          />
          <Taskbar onShutdown={handleShutdown} />
          {systemState === "running" && !deepLinkTarget && <Onboarding />}
        </>
      )}
    </div>
  );
}
