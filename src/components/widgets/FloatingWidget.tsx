import { motion, useMotionValue } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useSettingsStore, type WidgetId } from "../../store/settingsStore";

interface FloatingWidgetProps {
  id: WidgetId;
  title: string;
  /** posicion guardada, como porcentaje (0-1) del viewport */
  xPct: number;
  yPct: number;
  /** tamano actual del viewport, para resolver el porcentaje a px */
  containerSize: { w: number; h: number };
  width?: number;
  children: ReactNode;
}

// Alto de la barra de titulo (el "handle" arrastrable). Se usa para el
// limite inferior del drag: no importa cuanto contenido tenga el widget
// debajo, mientras el handle siga visible el usuario siempre puede volver
// a agarrarlo y traerlo de regreso a pantalla.
const HANDLE_H = 24;
const MARGIN = 4;

export function FloatingWidget({
  id,
  title,
  xPct,
  yPct,
  containerSize,
  width = 200,
  children,
}: FloatingWidgetProps) {
  const moveWidget = useSettingsStore((s) => s.moveWidget);
  const toggleWidget = useSettingsStore((s) => s.toggleWidget);

  // Bug fix: antes se mezclaba `drag` de Framer Motion (que aplica su propio
  // transform interno vía motion values) con `left`/`top` controlados por
  // estado externo. El transform del drag nunca se reseteaba al soltar, asi
  // que se sumaba al nuevo left/top calculado — el widget terminaba mas lejos
  // de donde se soltaba, y cada arrastre siguiente componia el error.
  // Ahora x/y SON los motion values que controlan la posicion (via
  // style={{ x, y }}, no left/top): drag y estado externo escriben sobre la
  // misma fuente de verdad, sin transform residual que sumar.
  //
  // Bug fix 2: la posicion se guarda como PORCENTAJE del viewport (xPct/yPct)
  // en vez de px absolutos, y el drag tiene limites (dragConstraints) atados
  // al tamano actual de pantalla. Antes un widget arrastrado cerca de un
  // borde en una pantalla grande podia "nacer" fuera de la vista en una
  // pantalla mas chica (o al redimensionar la ventana), y quedar
  // inalcanzable para siempre — ocultarlo y volver a mostrarlo tampoco lo
  // recuperaba, porque toggleWidget solo cambia `visible`, no la posicion.
  const resolved = { x: xPct * containerSize.w, y: yPct * containerSize.h };
  const x = useMotionValue(resolved.x);
  const y = useMotionValue(resolved.y);

  useEffect(() => {
    x.set(resolved.x);
    y.set(resolved.y);
    // sólo re-sincronizar cuando cambia el destino real, no en cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved.x, resolved.y]);

  const dragConstraints = {
    left: MARGIN,
    top: MARGIN,
    right: Math.max(MARGIN, containerSize.w - width - MARGIN),
    bottom: Math.max(MARGIN, containerSize.h - HANDLE_H - MARGIN),
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={dragConstraints}
      style={{ position: "absolute", x, y, width }}
      onDragEnd={() => {
        if (containerSize.w === 0 || containerSize.h === 0) return;
        moveWidget(id, x.get() / containerSize.w, y.get() / containerSize.h);
      }}
      className="jos-elevation-2 jos-icon-surface pointer-events-auto select-none overflow-hidden rounded-lg border border-jos-border text-jos-text backdrop-blur-sm"
    >
      <div className="jos-window-handle flex h-6 cursor-grab items-center justify-between border-b border-jos-border px-2 active:cursor-grabbing">
        <span className="truncate font-mono text-[10px] uppercase tracking-wider text-jos-text-dim">
          {title}
        </span>
        <button
          aria-label={`Ocultar widget ${title}`}
          onClick={() => toggleWidget(id)}
          className="text-jos-text-dim hover:text-jos-red"
        >
          ×
        </button>
      </div>
      <div className="p-2.5">{children}</div>
    </motion.div>
  );
}
