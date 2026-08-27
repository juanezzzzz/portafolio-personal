import { useEffect, useReducer, useRef } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Square, X, Copy } from "lucide-react";
import { useWindowStore, getMaximizedRect, type WindowInstance } from "../store/windowStore";
import { useSettingsStore } from "../store/settingsStore";
import { useIsMobile } from "../hooks/useIsMobile";
import type { ReactNode } from "react";

interface WindowProps {
  win: WindowInstance;
  children: ReactNode;
  /** Posicion de la ventana dentro del array del store — se usa solo como
   * aproximacion de a que grupo de la taskbar "pertenece" al minimizar,
   * para que el genie apunte mas o menos al icono correcto sin tener que
   * medir el DOM de la taskbar en tiempo real. */
  index: number;
  /** Las apps de contenido (About, Projects, Skills, etc.) son listas de
   * lectura de una sola columna: a tamano por defecto se ven bien, pero
   * maximizadas en un monitor ancho quedan como una franja de texto
   * estirada de borde a borde. Por defecto el contenido se centra con un
   * ancho maximo legible. Las apps que ya manejan su propio layout de
   * ancho completo (terminal, explorer, settings, visor/demo de proyecto)
   * pasan fullBleed para quedarse con el ancho real de la ventana. */
  fullBleed?: boolean;
}

const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;

// Fase de ventanas — abrir/cerrar con una curva "expo-out" (la misma familia
// que usan Linear/Vercel para transiciones de UI: arranca rapido y frena de
// forma muy suave al final, se percibe mas cuidada que un easeOut generico)
// vs minimizar (mas lento, tipo "genie" de macOS pero simplificado a
// escala+traslado, sin morphing real de la forma — un hibrido: toma el
// gesto de Mac, la temporalidad de Win).
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EXPO_IN: [number, number, number, number] = [0.7, 0, 0.84, 0];
const OPEN_DURATION = { slow: 0.38, normal: 0.24, fast: 0.14 };
const GENIE_DURATION = { slow: 0.52, normal: 0.34, fast: 0.18 };

// Aproximacion de donde vive el grupo de "ventanas abiertas" en la taskbar
// flotante (despues del grupo Inicio+Buscar). No es una medicion real del
// DOM — es deliberadamente aproximado, el ojo no necesita el pixel exacto
// para leer "se fue hacia la barra".
const TASKBAR_GROUP_START_X = 108;
const TASKBAR_ITEM_WIDTH = 116;

export function Window({ win, children, index, fullBleed = false }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, moveWindow, resizeWindow } =
    useWindowStore();
  const topZ = useWindowStore((s) => s.topZ);
  const animationSpeed = useSettingsStore((s) => s.animationSpeed);
  const glass = useSettingsStore((s) => s.glassEnabled);
  const isMobile = useIsMobile();
  const isFocused = win.zIndex === topZ;
  const containerRef = useRef<HTMLDivElement>(null);

  // Al abrirse una ventana nueva, el foco de teclado se movia hacia adentro
  // (icono del escritorio, item del Start Menu, resultado del buscador...) y
  // se quedaba ahi — un usuario de teclado no tenia forma de saber que ya
  // habia una ventana nueva "encima". Se enfoca una sola vez al montar (cada
  // ventana es una instancia nueva de este componente, con su propio winId).
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // getMaximizedRect() lee window.innerWidth/innerHeight en el momento del
  // render, pero nada mas fuerza un re-render de esta ventana cuando el
  // viewport cambia de tamano estando maximizada (ej. la barra de
  // direcciones de un navegador movil se oculta/muestra, cambio de
  // monitor/zoom). Sin este listener el rect queda "viejo" mientras la
  // taskbar (puro CSS) si sigue al viewport real, lo que se percibia como
  // que la ventana "choca"/deja un hueco contra la taskbar.
  const [, forceRect] = useReducer((c: number) => c + 1, 0);
  useEffect(() => {
    if (!win.isMaximized) return;
    window.addEventListener("resize", forceRect);
    return () => window.removeEventListener("resize", forceRect);
  }, [win.isMaximized]);

  function onWindowKeyDown(e: React.KeyboardEvent) {
    // Local al contenedor de esta ventana (no un listener global): si el
    // usuario tiene el foco dentro de la ventana y presiona Escape, la
    // minimiza — igual que Alt+F4/Cmd+W cierran/ocultan una app real. Se
    // detiene la propagacion para no interferir con el Escape de un overlay
    // (buscador, notificaciones...) que pueda estar abierto al mismo tiempo.
    if (e.key === "Escape") {
      e.stopPropagation();
      minimizeWindow(win.winId);
    }
  }

  // En mobile no tiene sentido el paradigma de ventanas libres arrastrables
  // (react-rnd depende de espacio de sobra para mover/redimensionar). Cada
  // app pasa a ocupar toda la pantalla, tipo "app switcher": solo se
  // renderiza la ventana activa (mayor zIndex, no minimizada) — el resto
  // sigue viva en el store (windowStore no cambia entre mobile/desktop) pero
  // no monta su DOM hasta volver a tener el foco, asi que no hay ventanas
  // superpuestas ocupando toda la pantalla a la vez.
  if (isMobile) {
    if (win.isMinimized || win.zIndex !== topZ) return null;
    return (
      <div
        ref={containerRef}
        role="dialog"
        aria-label={win.title}
        tabIndex={-1}
        onKeyDown={onWindowKeyDown}
        className="fixed inset-0 z-[9990] flex flex-col bg-jos-bg outline-none"
        data-win-id={win.winId}
      >
        <div className="jos-titlebar flex h-11 shrink-0 items-center justify-between border-b border-jos-border px-2">
          <button
            aria-label="Volver al escritorio"
            onClick={() => minimizeWindow(win.winId)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-jos-text-dim active:bg-jos-chrome-light"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="truncate px-2 font-mono text-xs tracking-wide text-jos-text-dim">
            {win.title}
          </span>
          <button
            aria-label="Cerrar"
            onClick={() => closeWindow(win.winId)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-jos-text-dim active:bg-jos-red active:text-jos-bg-deep"
          >
            <X size={16} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-jos-bg text-sm text-jos-text">
          {fullBleed ? children : <div className="p-3">{children}</div>}
        </div>
      </div>
    );
  }

  const rect = win.isMaximized
    ? getMaximizedRect()
    : { x: win.position.x, y: win.position.y, width: win.size.width, height: win.size.height };

  // Punto aproximado del icono en la taskbar flotante (bottom-3 + h-11):
  // el genie viaja desde el centro de la ventana hasta ese punto.
  const targetX = TASKBAR_GROUP_START_X + index * TASKBAR_ITEM_WIDTH;
  const targetY = window.innerHeight - 34;
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const genieX = targetX - centerX;
  const genieY = targetY - centerY;

  return (
    <Rnd
      size={{ width: rect.width, height: rect.height }}
      position={{ x: rect.x, y: rect.y }}
      minWidth={MIN_WIDTH}
      minHeight={MIN_HEIGHT}
      bounds="parent"
      disableDragging={win.isMaximized || win.isMinimized}
      enableResizing={!win.isMaximized && !win.isMinimized}
      dragHandleClassName="jos-window-handle"
      style={{ zIndex: win.zIndex, pointerEvents: win.isMinimized ? "none" : "auto" }}
      onDragStop={(_e, d) => moveWindow(win.winId, { x: d.x, y: d.y })}
      onResizeStop={(_e, _dir, ref, _delta, position) =>
        resizeWindow(
          win.winId,
          { width: ref.offsetWidth, height: ref.offsetHeight },
          position
        )
      }
      onMouseDown={() => !win.isMinimized && focusWindow(win.winId)}
    >
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-label={win.title}
        tabIndex={-1}
        onKeyDown={onWindowKeyDown}
        data-win-id={win.winId}
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={
          win.isMinimized
            ? {
                opacity: 0,
                scale: 0.12,
                x: genieX,
                y: genieY,
                transition: { duration: GENIE_DURATION[animationSpeed], ease: [0.5, 0, 0.75, 0.25] },
              }
            : {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                transition:
                  // al restaurar desde la taskbar, un pequeno "overshoot" tipo
                  // resorte — el toque personal, ni el fade seco de Windows
                  // ni el genie completo de Mac. Damping mas alto que antes:
                  // el rebote sutil se sigue sintiendo pero no "salta".
                  { type: "spring", stiffness: 300, damping: 32 },
              }
        }
        exit={{
          opacity: 0,
          scale: 0.92,
          transition: { duration: OPEN_DURATION[animationSpeed] * 0.85, ease: EXPO_IN },
        }}
        transition={{ duration: OPEN_DURATION[animationSpeed], ease: EXPO_OUT }}
        aria-hidden={win.isMinimized}
        className={`flex h-full w-full flex-col overflow-hidden border outline-none transition-[filter,box-shadow] duration-200 ${
          win.isMaximized ? "" : "rounded-xl"
        } ${isFocused ? "jos-elevation-3" : "jos-elevation-2"} ${
          // Ventanas sin foco se atenuan un poco (menos brillo/saturacion),
          // asi la ventana activa "pop-ea" por contraste en vez de que todas
          // se vean con el mismo peso visual — la profundidad que pedia el
          // spec (seccion 4.3) sin sacrificar legibilidad del contenido de
          // fondo, que sigue siendo texto real, no un blur pesado.
          isFocused || win.isMinimized ? "" : "brightness-90 saturate-75"
        } ${
          glass
            ? "border-jos-border/50 bg-jos-bg/60 backdrop-blur-xl"
            : isFocused
              ? "border-jos-border bg-jos-bg"
              : "border-jos-border/70 bg-jos-bg"
        }`}
      >
        {/* Barra de titulo */}
        <div
          className={`jos-window-handle flex h-9 shrink-0 cursor-grab select-none items-center justify-between border-b px-2.5 active:cursor-grabbing ${
            glass
              ? "jos-titlebar-glass border-jos-border/40 backdrop-blur-xl"
              : "jos-titlebar border-jos-border"
          }`}
          onDoubleClick={() => toggleMaximize(win.winId)}
        >
          <span className="truncate pl-1 font-mono text-xs tracking-wide text-jos-text-dim">
            {win.title}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              aria-label="Minimizar"
              onClick={() => minimizeWindow(win.winId)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-jos-text-dim transition-colors duration-150 hover:bg-jos-chrome-light hover:text-jos-text"
            >
              <Minus size={13} />
            </button>
            <button
              aria-label={win.isMaximized ? "Restaurar" : "Maximizar"}
              onClick={() => toggleMaximize(win.winId)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-jos-text-dim transition-colors duration-150 hover:bg-jos-chrome-light hover:text-jos-text"
            >
              {win.isMaximized ? <Copy size={11} /> : <Square size={11} />}
            </button>
            <button
              aria-label="Cerrar"
              onClick={() => closeWindow(win.winId)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-jos-text-dim transition-colors duration-150 hover:bg-jos-red hover:text-jos-bg-deep"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div
          className={`min-h-0 flex-1 overflow-auto text-sm text-jos-text ${
            glass ? "bg-jos-bg/85 backdrop-blur-md" : "bg-jos-bg"
          }`}
        >
          {fullBleed ? (
            children
          ) : (
            // Contenido alineado arriba (como cualquier app real) con un
            // ancho maximo legible centrado horizontalmente — antes tambien
            // se centraba verticalmente (my-auto), lo que en una ventana
            // maximizada en un monitor grande dejaba contenido corto (About,
            // Contact) flotando como una tarjeta chica en medio de un hueco
            // vacio en vez de comportarse como una pantalla real.
            <div className="flex min-h-full justify-center">
              <div className="w-full max-w-[760px]">{children}</div>
            </div>
          )}
        </div>
      </motion.div>
    </Rnd>
  );
}
