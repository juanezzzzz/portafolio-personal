import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useWindowStore } from "../store/windowStore";
import { useSettingsStore } from "../store/settingsStore";
import { useIsMobile } from "../hooks/useIsMobile";
import { APPS, DESKTOP_ICON_ORDER } from "../data/apps";
import { APP_ICON_COMPONENTS } from "../data/icons";

const ICON_CELL_W = 76;
const ICON_CELL_H = 74;
const GAP_X = 24;
const GAP_Y = 16;
const PADDING = 24;
const STEP_X = ICON_CELL_W + GAP_X;
const STEP_Y = ICON_CELL_H + GAP_Y;

/** Layout por defecto: anclado a la esquina superior-izquierda del area del
 * escritorio (como cualquier OS real), llenando filas de izquierda a
 * derecha y envolviendo hacia abajo cuando no caben mas columnas. Antes cada
 * fila se centraba horizontalmente y el bloque completo se centraba
 * verticalmente, lo que en un monitor grande dejaba los iconos flotando
 * como una isla en medio de escritorio vacio en vez de partir de una
 * esquina. Se recalcula en cada resize, asi que nunca depende de un tamano
 * de pantalla fijo — solo cuantas columnas entran. */
function computeDefaultLayout(containerW: number, count: number) {
  const usableW = Math.max(containerW - PADDING * 2, ICON_CELL_W);
  const perRow = Math.max(1, Math.floor((usableW + GAP_X) / (ICON_CELL_W + GAP_X)));

  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    positions.push(cellToPos(col, row));
  }
  return positions;
}

// --- Cuadricula real para el drag: antes el snap redondeaba a bloques de 8px,
// lo que en la practica no alineaba nada (dos iconos podian quedar a 8px de
// distancia, o "flotando" fuera de la fila/columna del resto). Ahora se
// ancla a las mismas celdas ICON_CELL_W/H + GAP que usa el layout automatico,
// asi que al soltar un icono siempre cae exactamente en fila/columna.
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function maxCol(containerW: number) {
  return Math.max(0, Math.floor((containerW - PADDING * 2 - ICON_CELL_W) / STEP_X));
}

function maxRow(containerH: number) {
  return Math.max(0, Math.floor((containerH - PADDING * 2 - ICON_CELL_H) / STEP_Y));
}

function cellOf(x: number, y: number) {
  return { col: Math.round((x - PADDING) / STEP_X), row: Math.round((y - PADDING) / STEP_Y) };
}

function cellToPos(col: number, row: number) {
  return { x: PADDING + col * STEP_X, y: PADDING + row * STEP_Y };
}

/** Si la celda deseada ya esta ocupada por otro icono, busca la celda libre
 * mas cercana en anillos concentricos crecientes, para que nunca queden dos
 * iconos exactamente encimados tras un drag. */
function findFreeCell(
  col: number,
  row: number,
  occupied: Set<string>,
  colLimit: number,
  rowLimit: number
) {
  const c0 = clamp(col, 0, colLimit);
  const r0 = clamp(row, 0, rowLimit);
  if (!occupied.has(`${c0}:${r0}`)) return { col: c0, row: r0 };

  const maxRadius = colLimit + rowLimit + 2;
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const c = clamp(col + dx, 0, colLimit);
        const r = clamp(row + dy, 0, rowLimit);
        const key = `${c}:${r}`;
        if (!occupied.has(key)) return { col: c, row: r };
      }
    }
  }
  return { col: c0, row: r0 };
}

function DesktopIcon({
  appId,
  defaultPos,
  containerSize,
  resolvedAll,
  selected,
}: {
  appId: (typeof DESKTOP_ICON_ORDER)[number];
  defaultPos: { x: number; y: number };
  containerSize: { w: number; h: number };
  /** posicion resuelta actual (px) de TODOS los iconos, para detectar colisiones al soltar */
  resolvedAll: Record<string, { x: number; y: number }>;
  /** true mientras el icono esta dentro del recuadro de seleccion por lazo */
  selected: boolean;
}) {
  const openApp = useWindowStore((s) => s.openApp);
  const saved = useSettingsStore((s) => s.iconPositions[appId]);
  const moveIcon = useSettingsStore((s) => s.moveIcon);
  const isMobile = useIsMobile();

  const app = APPS[appId];
  const Icon = APP_ICON_COMPONENTS[appId];

  // Si el usuario ya movio este icono, su posicion manda (reconstruida desde
  // el porcentaje guardado contra el tamano actual del contenedor); si no,
  // usa el punto del layout automatico.
  const resolved =
    saved && containerSize.w > 0
      ? { x: saved.xPct * containerSize.w, y: saved.yPct * containerSize.h }
      : defaultPos;

  const x = useMotionValue(resolved.x);
  const y = useMotionValue(resolved.y);

  useEffect(() => {
    x.set(resolved.x);
    y.set(resolved.y);
    // sólo re-sincronizar cuando cambia el destino real, no en cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved.x, resolved.y]);

  return (
    <motion.button
      drag={!isMobile}
      dragMomentum={false}
      dragConstraints={{ left: 4, top: 4, right: Math.max(4, containerSize.w - ICON_CELL_W - 4), bottom: Math.max(4, containerSize.h - ICON_CELL_H - 4) }}
      onDragEnd={() => {
        if (containerSize.w === 0 || containerSize.h === 0) return;

        const colLimit = maxCol(containerSize.w);
        const rowLimit = maxRow(containerSize.h);
        const desired = cellOf(x.get(), y.get());

        // celdas ocupadas por el resto de iconos (no por este, que es el que se movio)
        const occupied = new Set<string>();
        for (const [id, pos] of Object.entries(resolvedAll)) {
          if (id === appId) continue;
          const cell = cellOf(pos.x, pos.y);
          occupied.add(`${clamp(cell.col, 0, colLimit)}:${clamp(cell.row, 0, rowLimit)}`);
        }

        const { col, row } = findFreeCell(desired.col, desired.row, occupied, colLimit, rowLimit);
        const snapped = cellToPos(col, row);
        x.set(snapped.x);
        y.set(snapped.y);
        moveIcon(appId, snapped.x / containerSize.w, snapped.y / containerSize.h);
      }}
      style={{ position: "absolute", x, y, width: ICON_CELL_W }}
      // En mobile no hay doble-tap confiable ni drag de reordenar (compite
      // con el scroll): un tap simple abre la app directamente.
      onClick={() => isMobile && openApp(app)}
      onDoubleClick={() => !isMobile && openApp(app)}
      onKeyDown={(e) => {
        if (e.key === "Enter") openApp(app);
      }}
      className={`group flex flex-col items-center gap-1.5 rounded px-1 py-2 text-center outline-none transition-colors duration-100 focus-visible:bg-white/10 ${
        selected ? "bg-sky-400/15 outline outline-1 outline-sky-400/70" : ""
      }`}
    >
      <div
        className={`jos-elevation-1 jos-icon-surface flex h-10 w-10 items-center justify-center rounded-lg border text-jos-amber transition-[box-shadow,border-color,transform] duration-150 group-hover:scale-105 group-hover:jos-elevation-2 group-hover:border-jos-amber-dim ${
          selected ? "border-sky-400" : "border-jos-border"
        }`}
      >
        <Icon size={20} />
      </div>
      <span className="font-mono text-[11px] leading-tight text-jos-text drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {app.title}
      </span>
    </motion.button>
  );
}

interface MarqueeRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Rectangulo de dos puntos arbitrarios (inicio y punto actual del mouse),
 * normalizado a {x,y,w,h} con x/y siempre la esquina superior-izquierda. */
function rectFromPoints(x0: number, y0: number, x1: number, y1: number): MarqueeRect {
  return {
    x: Math.min(x0, x1),
    y: Math.min(y0, y1),
    w: Math.abs(x1 - x0),
    h: Math.abs(y1 - y0),
  };
}

function rectsIntersect(a: MarqueeRect, b: MarqueeRect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function Desktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const iconPositions = useSettingsStore((s) => s.iconPositions);

  // --- Seleccion por lazo (click izquierdo o derecho + arrastrar sobre el
  // escritorio vacio): dibuja un recuadro azul translucido, como en
  // Windows/GNOME/macOS, y marca como "seleccionados" los iconos que el
  // recuadro toca. No dispara ninguna accion por si sola (abrir, borrar,
  // etc.) — es el gesto visual + el estado de seleccion, listo para que una
  // futura accion (mover en bloque, menu contextual "abrir seleccionados"...)
  // lo use.
  const [marqueeRect, setMarqueeRect] = useState<MarqueeRect | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const marqueeStart = useRef({ x: 0, y: 0 });
  const resolvedAllRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const defaultLayout = computeDefaultLayout(containerSize.w, DESKTOP_ICON_ORDER.length);

  // Posicion actual (px) de cada icono, ya sea la guardada por el usuario o la
  // del layout automatico. Se recalcula en cada render para que el anti-colision
  // del drag siempre vea el estado real, sin depender de medir el DOM.
  const resolvedAll: Record<string, { x: number; y: number }> = {};
  DESKTOP_ICON_ORDER.forEach((appId, i) => {
    const saved = iconPositions[appId];
    resolvedAll[appId] =
      saved && containerSize.w > 0
        ? { x: saved.xPct * containerSize.w, y: saved.yPct * containerSize.h }
        : defaultLayout[i];
  });
  resolvedAllRef.current = resolvedAll;

  function startMarquee(e: React.MouseEvent<HTMLDivElement>) {
    // click izquierdo (0) o derecho (2), y solo si se hace directamente
    // sobre el fondo del escritorio (no sobre un icono, que es un elemento
    // hijo distinto). Un click simple sin arrastre termina con un recuadro
    // de ancho/alto 0 que no toca ningun icono, asi que el efecto neto es
    // "deseleccionar todo" — el mismo comportamiento estandar de antes.
    if ((e.button !== 0 && e.button !== 2) || e.target !== e.currentTarget || !containerRef.current) return;
    e.preventDefault();
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    marqueeStart.current = { x, y };
    setMarqueeRect({ x, y, w: 0, h: 0 });
    setSelectedIds(new Set());
  }

  useEffect(() => {
    if (!marqueeRect) return;

    function onMove(e: MouseEvent) {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const curX = clamp(e.clientX - bounds.left, 0, bounds.width);
      const curY = clamp(e.clientY - bounds.top, 0, bounds.height);
      const rect = rectFromPoints(marqueeStart.current.x, marqueeStart.current.y, curX, curY);
      setMarqueeRect(rect);

      const next = new Set<string>();
      for (const [id, pos] of Object.entries(resolvedAllRef.current)) {
        const iconRect: MarqueeRect = { x: pos.x, y: pos.y, w: ICON_CELL_W, h: ICON_CELL_H };
        if (rectsIntersect(rect, iconRect)) next.add(id);
      }
      setSelectedIds(next);
    }

    function onUp() {
      setMarqueeRect(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marqueeRect !== null]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedIds(new Set());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" style={{ height: "calc(100vh - 60px)" }}>
      <div
        ref={containerRef}
        className="pointer-events-auto relative h-full w-full"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={startMarquee}
      >
        {containerSize.w > 0 &&
          DESKTOP_ICON_ORDER.map((appId, i) => (
            <DesktopIcon
              key={appId}
              appId={appId}
              defaultPos={defaultLayout[i]}
              containerSize={containerSize}
              resolvedAll={resolvedAll}
              selected={selectedIds.has(appId)}
            />
          ))}

        {marqueeRect && (
          <div
            className="pointer-events-none absolute z-40 border border-sky-400 bg-sky-400/20"
            style={{
              left: marqueeRect.x,
              top: marqueeRect.y,
              width: marqueeRect.w,
              height: marqueeRect.h,
            }}
          />
        )}
      </div>
    </div>
  );
}
