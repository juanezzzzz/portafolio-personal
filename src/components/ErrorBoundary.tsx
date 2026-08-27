import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { useWindowStore } from "../store/windowStore";

interface Props {
  winId: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// componentDidCatch solo existe en componentes de clase — no hay equivalente
// en hooks. Uno por ventana (no uno global) para que un error dentro de una
// sola app tumbe esa ventana, no el resto del "sistema operativo".
class ErrorBoundaryClass extends Component<Props & { onClose: () => void }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[JOS] La app de la ventana ${this.props.winId} crasheo:`, error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <AlertTriangle className="text-jos-red" size={28} />
        <p className="font-mono text-sm text-jos-text">Esta aplicacion dejo de responder.</p>
        <p className="max-w-xs text-xs text-jos-text-dim">
          Ocurrio un error inesperado dentro de esta ventana. El resto del sistema sigue funcionando con normalidad.
        </p>
        <button
          onClick={this.props.onClose}
          className="mt-1 rounded-lg border border-jos-border px-3 py-1.5 font-mono text-xs text-jos-text-dim hover:border-jos-red hover:text-jos-red"
        >
          Cerrar ventana
        </button>
      </div>
    );
  }
}

export function ErrorBoundary({ winId, children }: Props) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  return (
    <ErrorBoundaryClass winId={winId} onClose={() => closeWindow(winId)}>
      {children}
    </ErrorBoundaryClass>
  );
}
