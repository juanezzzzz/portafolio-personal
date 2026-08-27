import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Lock, RotateCw } from "lucide-react";
import { TraditionalPortfolio } from "../traditional/TraditionalPortfolio";

const FAKE_URL = "juanesteban.dev";

/** El "portafolio dentro del portafolio": la version tradicional scrolleable
 * (src/traditional/) vive aca adentro como si fuera una pestaña de navegador
 * embebida en el sistema — un guiño metaverso, no una migracion real de
 * pestañas/historial. La barra de direcciones es decorativa; el unico boton
 * con efecto real es "recargar", que remonta <TraditionalPortfolio> (vuelve
 * al tope, reinicia sus animaciones) para vender la sensacion de que de
 * verdad se recargo una pagina. */
export function BrowserApp() {
  const [reloadKey, setReloadKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full flex-col bg-jos-bg-deep">
      <div className="flex shrink-0 items-center gap-2 border-b border-jos-border bg-jos-chrome/60 px-3 py-2">
        <div className="flex items-center gap-2 text-jos-text-dim/50">
          <ChevronLeft size={14} />
          <ChevronRight size={14} />
          <button
            onClick={() => {
              scrollRef.current?.scrollTo({ top: 0 });
              setReloadKey((k) => k + 1);
            }}
            aria-label="Recargar"
            className="text-jos-text-dim transition-colors hover:text-jos-text"
          >
            <RotateCw size={13} />
          </button>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-jos-border bg-jos-bg-deep px-2.5 py-1.5 font-mono text-[11px] text-jos-text-dim">
          <Lock size={11} className="shrink-0 text-jos-cyan" />
          <span className="truncate">{FAKE_URL}</span>
        </div>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <TraditionalPortfolio key={reloadKey} scrollContainerRef={scrollRef} />
      </div>
    </div>
  );
}
