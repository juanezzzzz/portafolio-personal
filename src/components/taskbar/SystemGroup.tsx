import type { Ref } from "react";
import { Bell, SlidersHorizontal, Volume2, VolumeX, Wifi, WifiOff } from "lucide-react";

export function SystemGroup({
  online,
  soundEnabled,
  onToggleSound,
  unread,
  onToggleNotif,
  notifButtonRef,
  onToggleQuick,
  quickButtonRef,
}: {
  online: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unread: number;
  onToggleNotif: () => void;
  notifButtonRef: Ref<HTMLButtonElement>;
  onToggleQuick: () => void;
  quickButtonRef: Ref<HTMLButtonElement>;
}) {
  return (
    <div className="flex h-8 items-center gap-0.5 rounded-xl border border-jos-border/40 bg-jos-bg-deep/40 px-1">
      <span
        className="hidden h-[26px] items-center px-1.5 text-jos-text-dim sm:flex"
        aria-label={online ? "Conectado" : "Sin conexion"}
        title={online ? "Conectado" : "Sin conexion"}
      >
        {online ? <Wifi size={13} /> : <WifiOff size={13} className="text-jos-red" />}
      </span>

      <button
        onClick={onToggleSound}
        className="flex h-[26px] items-center px-1.5 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-amber"
        aria-label="Volumen"
      >
        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </button>

      <button
        ref={notifButtonRef}
        onClick={onToggleNotif}
        className="relative flex h-[26px] items-center px-1.5 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-amber"
        aria-label="Notificaciones"
      >
        <Bell size={14} />
        {unread > 0 && (
          <span className="absolute right-0.5 top-1 flex h-3.5 w-3.5 items-center justify-center bg-jos-amber text-[9px] font-bold text-jos-bg-deep">
            {unread}
          </span>
        )}
      </button>

      <button
        ref={quickButtonRef}
        onClick={onToggleQuick}
        className="flex h-[26px] items-center px-1.5 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-amber"
        aria-label="Configuracion rapida"
      >
        <SlidersHorizontal size={14} />
      </button>
    </div>
  );
}
