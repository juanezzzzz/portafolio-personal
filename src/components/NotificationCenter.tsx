import { motion } from "framer-motion";
import { Trash2, Trophy, Info, AlertTriangle } from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";
import { useOverlayDismiss } from "../hooks/useOverlayDismiss";

interface NotificationCenterProps {
  onClose: () => void;
}

const ICONS = { info: Info, achievement: Trophy, error: AlertTriangle };

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { notifications, clear } = useNotificationStore();
  const dismissRef = useOverlayDismiss<HTMLDivElement>(onClose);

  return (
    <>
      <div className="fixed inset-0 z-[9997]" onClick={onClose} />
      <motion.div
        ref={dismissRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Notificaciones"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.12 }}
        className="jos-elevation-3 jos-overlay-glass fixed bottom-16 right-3 z-[9999] flex max-h-[70vh] w-80 flex-col rounded-xl border outline-none"
      >
        <div className="flex items-center justify-between border-b border-jos-border px-3 py-2">
          <span className="font-mono text-xs text-jos-text">Notificaciones</span>
          <button
            onClick={clear}
            className="flex items-center gap-1 text-[11px] text-jos-text-dim hover:text-jos-red"
            aria-label="Limpiar notificaciones"
          >
            <Trash2 size={12} /> limpiar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-center font-mono text-[11px] text-jos-text-dim">
              sin notificaciones todavia
            </p>
          ) : (
            notifications.map((n) => {
              const Icon = ICONS[n.kind];
              return (
                <div key={n.id} className="flex gap-2 border-b border-jos-border/60 px-3 py-2.5">
                  <Icon
                    size={14}
                    className={`mt-0.5 shrink-0 ${
                      n.kind === "achievement"
                        ? "text-jos-amber"
                        : n.kind === "error"
                          ? "text-jos-red"
                          : "text-jos-cyan"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-jos-text">{n.title}</p>
                    <p className="text-[11px] text-jos-text-dim">{n.message}</p>
                    <p className="mt-0.5 text-[10px] text-jos-text-dim/70">
                      {new Date(n.time).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </>
  );
}
