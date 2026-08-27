import { motion } from "framer-motion";
import { SlidersHorizontal, Volume2, VolumeX } from "lucide-react";
import { THEME_OPTIONS } from "../../data/themes";
import type { ThemeId } from "../../store/settingsStore";
import { useOverlayDismiss } from "../../hooks/useOverlayDismiss";

export function QuickSettingsPopover({
  theme,
  setTheme,
  soundEnabled,
  toggleSound,
  onOpenSettings,
  onClose,
}: {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  onOpenSettings: () => void;
  onClose: () => void;
}) {
  const dismissRef = useOverlayDismiss<HTMLDivElement>(onClose);

  return (
    <>
      <div className="fixed inset-0 z-[9997]" onClick={onClose} />
      <motion.div
        ref={dismissRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Configuracion rapida"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.12 }}
        className="jos-elevation-3 jos-overlay-glass fixed bottom-16 right-3 z-[9999] w-64 rounded-xl border p-3 outline-none"
      >
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-jos-text-dim">
          Configuracion rapida
        </p>
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`rounded-lg border p-1 ${theme === t.id ? "border-jos-amber" : "border-jos-border"}`}
              aria-label={t.label}
            >
              <div className="flex h-4 w-full overflow-hidden rounded-md">
                {t.swatch.map((c, i) => (
                  <div key={i} className="h-full flex-1" style={{ background: c }} />
                ))}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={toggleSound}
          className="mb-1.5 flex w-full items-center justify-between rounded-lg border border-jos-border px-2 py-1.5 font-mono text-[11px] text-jos-text"
        >
          Sonido
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>
        <button
          onClick={onOpenSettings}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-jos-border px-2 py-1.5 font-mono text-[11px] text-jos-text-dim hover:text-jos-amber"
        >
          <SlidersHorizontal size={12} /> Abrir Settings
        </button>
      </motion.div>
    </>
  );
}
