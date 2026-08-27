import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getMaximizedRect, type WindowInstance } from "../../store/windowStore";
import { getAppIconComponent } from "../../data/icons";

const PREVIEW_WIDTH = 208;
const PREVIEW_MAX_CONTENT_HEIGHT = 130;
const PREVIEW_GAP = 8;
const EDGE_MARGIN = 8;
// Alto real de la barra de titulo en Window.tsx (clase h-9). Se resta del
// alto de la ventana porque el clon NO incluye esa barra (usamos nuestro
// propio header de "pestana" en su lugar, ver mas abajo).
const TITLEBAR_H = 36;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Tamano "real" de la ventana en pantalla, igual al que calcula Window.tsx,
 * para que la miniatura respete la proporcion real (maximizada o no). */
function windowRealSize(win: WindowInstance) {
  if (win.isMaximized) {
    const r = getMaximizedRect();
    return { width: r.width, height: r.height };
  }
  return { width: win.size.width, height: win.size.height };
}

export interface PreviewAnchor {
  /** centro horizontal del boton en la taskbar, en coordenadas de viewport */
  centerX: number;
  /** borde superior del boton en la taskbar, en coordenadas de viewport */
  top: number;
}

/**
 * Vista previa en miniatura de una ventana abierta, al pasar el mouse sobre
 * su boton en la taskbar. No es una foto estatica: clona el nodo DOM real de
 * la ventana (mismo texto, mismo estado visual) cada vez que se abre el
 * hover, y lo re-escala con CSS. Como es un clon del DOM (no un remount de
 * React), no duplica listeners ni efectos secundarios de la app original.
 *
 * Se renderiza vía portal a document.body con `position: fixed`, en vez de
 * quedar anclada (relative/absolute) dentro del grupo "ventanas abiertas" de
 * la taskbar: ese contenedor tiene overflow-x-auto, y por como CSS resuelve
 * overflow cuando un solo eje no es "visible", el navegador termina forzando
 * overflow-y a "auto" tambien — cualquier hijo que se salga hacia arriba
 * (como esta preview, posicionada encima del boton) quedaba recortado por
 * ese scroll invisible, y lo unico que se alcanzaba a ver era el efecto de
 * hover normal del boton. Con position:fixed + portal, la preview escapa
 * por completo de ese contenedor y de su recorte.
 */
export function TaskbarPreview({
  win,
  anchor,
  themeClass,
}: {
  win: WindowInstance;
  anchor: PreviewAnchor;
  /** Clase de tema activa (jos-theme-light, jos-theme-aurora, etc.) — se
   * aplica a este componente porque vive fuera del div raiz de App.tsx (se
   * renderiza via portal a document.body), y las variables de color/sombra
   * de cada tema estan scoped a esa clase, no a :root. Sin esto la preview
   * siempre se veia con el tema base sin importar cual estuviera activo. */
  themeClass: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const Icon = getAppIconComponent(win.appId);

  useEffect(() => {
    const host = hostRef.current;
    const original = document.querySelector<HTMLElement>(`[data-win-id="${win.winId}"]`);
    // Solo el CONTENIDO de la ventana (el segundo hijo del motion.div, ver
    // Window.tsx), sin su barra de titulo — esta preview ya tiene su propio
    // header tipo "pestana" con icono+titulo, así que clonar tambien la barra
    // de titulo real duplicaba el titulo y mostraba botones de
    // minimizar/maximizar/cerrar fantasma dentro de la miniatura.
    const content = original?.lastElementChild as HTMLElement | null;
    if (!host || !content) return;

    const clone = content.cloneNode(true) as HTMLElement;
    clone.style.pointerEvents = "none";

    // Oculta scrollbars dentro del clon: a esta escala se ven desproporcionadas
    // y no sirven de nada en una miniatura no interactiva.
    clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const computed = getComputedStyle(el);
      if (computed.overflowY === "auto" || computed.overflowY === "scroll") el.style.overflowY = "hidden";
      if (computed.overflowX === "auto" || computed.overflowX === "scroll") el.style.overflowX = "hidden";
    });

    host.replaceChildren(clone);
    return () => {
      host.replaceChildren();
    };
  }, [win.winId, win.isMinimized]);

  const { width, height } = windowRealSize(win);
  const contentWidth = width;
  const contentHeight = Math.max(1, height - TITLEBAR_H);
  const scale = PREVIEW_WIDTH / contentWidth;
  const previewContentHeight = Math.min(contentHeight * scale, PREVIEW_MAX_CONTENT_HEIGHT);

  // Centrado sobre el boton, pero sin salirse de los bordes del viewport.
  const left = clamp(anchor.centerX, PREVIEW_WIDTH / 2 + EDGE_MARGIN, window.innerWidth - PREVIEW_WIDTH / 2 - EDGE_MARGIN);
  const cardBottom = window.innerHeight - anchor.top + PREVIEW_GAP;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.96 }}
        transition={{ duration: 0.12 }}
        className={`jos-elevation-3 pointer-events-none fixed z-[9999] overflow-hidden rounded-lg border border-jos-border bg-jos-chrome ${themeClass}`}
        style={{
          width: PREVIEW_WIDTH,
          left,
          bottom: cardBottom,
          transform: "translateX(-50%)",
        }}
      >
        {/* Header tipo "pestana": icono + titulo, igual que la vista previa de
            ventanas de Windows/Chrome — no un clon, es el mismo icono/titulo
            que ya usamos en el resto del sistema, asi que siempre esta legible
            sin importar la escala de la ventana real. */}
        <div className="flex items-center gap-1.5 border-b border-jos-border px-2 py-1.5">
          <Icon size={12} className="shrink-0 text-jos-amber" />
          <span className="truncate font-mono text-[10px] text-jos-text">{win.title}</span>
        </div>
        <div style={{ height: previewContentHeight }} className="overflow-hidden bg-jos-bg">
          <div
            ref={hostRef}
            style={{
              width: contentWidth,
              height: contentHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </motion.div>

      {/* Caret que apunta al icono real en la taskbar: se ancla a
          anchor.centerX (no al `left` de la tarjeta, que puede quedar
          recortado cerca de los bordes de pantalla), asi siempre senala el
          boton exacto sobre el que esta el mouse, incluso si la tarjeta se
          desplazo para no salirse de la pantalla. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className={`pointer-events-none fixed z-[9999] h-2.5 w-2.5 border-b border-r border-jos-border bg-jos-chrome ${themeClass}`}
        style={{
          left: anchor.centerX,
          bottom: cardBottom - 5,
          transform: "translateX(-50%) rotate(45deg)",
        }}
      />
    </>
  );
}
