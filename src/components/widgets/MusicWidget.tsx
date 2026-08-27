import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music2 } from "lucide-react";
import { soundManager } from "../../lib/soundManager";
import { useSettingsStore } from "../../store/settingsStore";

// "Reproductor" decorativo: no hay archivos de audio reales conectados (ver
// JOS_PROYECTO.md seccion 9), asi que en vez de un <audio> mudo, este widget
// genera un loop corto de arpegio via Web Audio (mismo soundManager de los
// efectos del sistema) para que el boton Play realmente suene.
const ARPEGGIO = [261.6, 329.6, 392.0, 523.3, 392.0, 329.6];

export function MusicWidget() {
  const [playing, setPlaying] = useState(false);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const stepRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing && soundEnabled) {
      intervalRef.current = setInterval(() => {
        soundManager.blip(ARPEGGIO[stepRef.current % ARPEGGIO.length]);
        stepRef.current += 1;
      }, 220);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, soundEnabled]);

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => setPlaying((v) => !v)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-jos-border text-jos-amber hover:border-jos-amber"
        aria-label={playing ? "Pausar" : "Reproducir"}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 truncate font-mono text-[11px] text-jos-text">
          <Music2 size={11} className="shrink-0 text-jos-text-dim" />
          jos.system.loop
        </div>
        <div className="mt-1 flex h-3 items-end gap-[2px]">
          {ARPEGGIO.map((_, i) => (
            <span
              key={i}
              className={`w-[3px] bg-jos-amber transition-all ${
                playing ? "animate-pulse" : "opacity-30"
              }`}
              style={{ height: `${4 + (i % 3) * 3}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
