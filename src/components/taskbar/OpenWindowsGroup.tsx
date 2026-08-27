import { useEffect, useRef } from "react";
import { useWindowStore, type WindowInstance } from "../../store/windowStore";
import { getAppIconComponent } from "../../data/icons";
import type { PreviewAnchor } from "./TaskbarPreview";

const HOVER_DELAY_MS = 350;

export function OpenWindowsGroup({
  windows,
  topZ,
  isMobile,
  onShowPreview,
  onHidePreview,
}: {
  windows: WindowInstance[];
  topZ: number;
  isMobile: boolean;
  onShowPreview: (winId: string, anchor: PreviewAnchor) => void;
  onHidePreview: () => void;
}) {
  const { focusWindow, minimizeWindow } = useWindowStore();
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  function scheduleShowPreview(winId: string) {
    // El preview clona el DOM de la ventana y depende de :hover — en touch no
    // hay hover real, y en pantallas chicas ademas cada ventana ya ocupa
    // toda la pantalla (ver Window.tsx), asi que la miniatura no aporta nada.
    if (isMobile) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      const el = buttonRefs.current[winId];
      if (el) {
        const rect = el.getBoundingClientRect();
        onShowPreview(winId, { centerX: rect.left + rect.width / 2, top: rect.top });
      }
    }, HOVER_DELAY_MS);
  }

  function cancelPreview() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    onHidePreview();
  }

  return (
    <div className="flex h-8 flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-jos-border/40 bg-jos-bg-deep/40 px-1">
      {windows.map((w) => {
        const Icon = getAppIconComponent(w.appId);
        // Ventana "activa" = la que tiene el foco real (topZ), no solo la
        // que no esta minimizada. Con varias ventanas abiertas, solo una
        // es la activa en un momento dado.
        const isActive = !w.isMinimized && w.zIndex === topZ;
        return (
          <div
            key={w.winId}
            ref={(el) => {
              buttonRefs.current[w.winId] = el;
            }}
            className="relative flex h-8 shrink-0 items-center"
            onMouseEnter={() => scheduleShowPreview(w.winId)}
            onMouseLeave={cancelPreview}
          >
            <button
              onClick={() => {
                cancelPreview();
                if (w.isMinimized) {
                  // estaba minimizada: restaurar y darle el foco
                  minimizeWindow(w.winId);
                  focusWindow(w.winId);
                } else if (isActive) {
                  // ya era la ventana activa: un segundo click la minimiza
                  // (comportamiento estandar de taskbar tipo Windows)
                  minimizeWindow(w.winId);
                } else {
                  // esta abierta pero sin foco: solo traerla al frente
                  focusWindow(w.winId);
                }
              }}
              className={`relative flex h-[26px] shrink-0 items-center gap-1.5 px-2.5 text-jos-text transition-[transform,box-shadow,opacity] duration-150 hover:scale-105 hover:jos-elevation-1 ${
                w.isMinimized ? "opacity-50" : "bg-jos-chrome-light"
              }`}
            >
              <Icon size={13} />
              <span className="max-w-24 truncate">{w.title}</span>
              {/* indicador de ventana activa: linea inferior, no punto (diferenciarse de macOS) */}
              {isActive && (
                <span className="absolute bottom-0.5 left-1/2 h-[2px] w-4 -translate-x-1/2 bg-jos-amber" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
