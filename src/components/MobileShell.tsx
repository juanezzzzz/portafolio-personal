import { useEffect, useRef } from "react";
import { Monitor } from "lucide-react";
import { TraditionalPortfolio } from "../traditional/TraditionalPortfolio";

interface MobileShellProps {
  /** Seccion a la que hacer scroll al entrar (viene de un deep link). */
  scrollTo?: string | null;
  /** Cambia al escritorio JOS completo, a peticion explicita del usuario. */
  onSwitchToDesktop: () => void;
}

/**
 * Lo que ve un movil. JOS es un sistema de ventanas arrastrables pensado para
 * raton y pantalla grande: en 390px de ancho no hay forma honesta de que eso
 * funcione. En vez de encoger el escritorio hasta volverlo inutil, el movil
 * recibe el portafolio tradicional — el mismo contenido, en el formato que esa
 * pantalla si sabe mostrar.
 *
 * El escritorio sigue estando a un toque de distancia para quien lo quiera
 * probar; no se le esconde, solo deja de ser lo primero que se le impone.
 */
export function MobileShell({ scrollTo, onSwitchToDesktop }: MobileShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Un deep link tipo "?open=project:agroia" apunta a una ventana que aqui no
  // existe. En vez de ignorarlo, se traduce a la seccion equivalente de la
  // pagina para que quien recibio el enlace llegue igual al contenido.
  useEffect(() => {
    if (!scrollTo) return;
    const target = document.getElementById(scrollTo);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollTo]);

  return (
    // pb-20: deja aire al final para que el boton flotante no tape el footer
    <div ref={scrollRef} className="h-dvh w-full overflow-y-auto overflow-x-hidden pb-20">
      <TraditionalPortfolio scrollContainerRef={scrollRef} />

      <button
        type="button"
        onClick={onSwitchToDesktop}
        className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-jos-border bg-jos-chrome/90 px-4 py-2 text-xs text-jos-text-dim shadow-lg backdrop-blur transition-colors hover:text-jos-amber"
      >
        <Monitor size={14} aria-hidden="true" />
        Ver como sistema operativo
      </button>
    </div>
  );
}
