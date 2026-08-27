import { Download, ExternalLink } from "lucide-react";
import { profile } from "../data/profile";
import { soundManager } from "../lib/soundManager";

/** Visor de PDF real (no un shortcut al boton de About): usa <object> en vez
 * de <iframe> porque soporta un fallback nativo via children — si el
 * navegador no sabe renderizar application/pdf inline (algunos moviles),
 * cae directo al aviso con el link de apertura externa, sin JS extra para
 * detectar la capacidad. */
export function Resume() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-jos-border bg-jos-chrome/40 px-3 py-2">
        <p className="truncate font-mono text-[11px] text-jos-text-dim">CV_JuanEstebanValencia.pdf</p>
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundManager.click()}
            className="flex items-center gap-1.5 rounded-lg border border-jos-border px-2 py-1 font-mono text-[11px] text-jos-text-dim transition-colors duration-150 hover:border-jos-amber-dim hover:text-jos-amber"
          >
            <ExternalLink size={12} />
            Abrir en pestaña
          </a>
          <a
            href={profile.cvUrl}
            download
            onClick={() => soundManager.click()}
            className="flex items-center gap-1.5 rounded-lg border border-jos-amber-dim bg-jos-amber/10 px-2 py-1 font-mono text-[11px] text-jos-amber transition-[transform,box-shadow] duration-150 hover:scale-105 hover:jos-elevation-1"
          >
            <Download size={12} />
            Descargar
          </a>
        </div>
      </div>
      <object data={profile.cvUrl} type="application/pdf" className="min-h-0 w-full flex-1 bg-jos-bg-deep">
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-jos-text-dim">Tu navegador no puede mostrar el PDF aquí.</p>
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-jos-amber-dim bg-jos-amber/10 px-3 py-1.5 font-mono text-[11px] text-jos-amber"
          >
            Abrir CV en una pestaña nueva
          </a>
        </div>
      </object>
    </div>
  );
}
