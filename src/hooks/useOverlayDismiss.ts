import { useEffect, useRef } from "react";

/** Comportamiento comun a los overlays temporales del sistema (Start Menu,
 * buscador, notificaciones, config rapida): al abrirse, mueve el foco de
 * teclado hacia el propio overlay (antes se quedaba en el elemento que lo
 * disparo, asi que un usuario de teclado no tenia forma de saber que ya
 * estaba "dentro"), y Escape lo cierra. Devuelve el ref para poner en el
 * contenedor del overlay (con tabIndex={-1} para que sea enfocable). */
export function useOverlayDismiss<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  // El caller casi siempre pasa un closure inline (identidad distinta en
  // cada render) — con un ref en vez de una dependencia, el listener se
  // registra una sola vez al montar en lugar de recrearse en cada render,
  // pero sigue llamando siempre a la version mas reciente de onClose.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    ref.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return ref;
}
