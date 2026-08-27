import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useWindowStore } from "../store/windowStore";
import { APPS, DESKTOP_ICON_ORDER } from "../data/apps";
import { APP_ICON_COMPONENTS } from "../data/icons";
import { profile } from "../data/profile";
import { useOverlayDismiss } from "../hooks/useOverlayDismiss";

interface StartMenuProps {
  onClose: () => void;
  onShutdown: () => void;
}

export function StartMenu({ onClose, onShutdown }: StartMenuProps) {
  const openApp = useWindowStore((s) => s.openApp);
  const dismissRef = useOverlayDismiss<HTMLDivElement>(onClose);

  return (
    <>
      <div className="fixed inset-0 z-[9997]" onClick={onClose} />
      <motion.div
        ref={dismissRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Menu de inicio"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.12 }}
        className="jos-elevation-3 jos-overlay-glass fixed bottom-16 left-3 z-[9999] w-64 overflow-hidden rounded-xl border outline-none"
      >
        <div className="border-b border-jos-border px-3 py-2.5">
          <p className="font-mono text-xs text-jos-amber">{profile.name}</p>
          <p className="text-[11px] text-jos-text-dim">{profile.role}</p>
        </div>
        <div className="max-h-80 overflow-auto py-1">
          {DESKTOP_ICON_ORDER.map((appId) => {
            const app = APPS[appId];
            const Icon = APP_ICON_COMPONENTS[appId];
            return (
              <button
                key={appId}
                onClick={() => {
                  openApp(app);
                  onClose();
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-xs text-jos-text hover:bg-jos-chrome-light"
              >
                <Icon size={15} />
                {app.title}
              </button>
            );
          })}
        </div>
        <div className="border-t border-jos-border">
          <button
            onClick={onShutdown}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs text-jos-red hover:bg-jos-chrome-light"
          >
            <Power size={15} />
            Shutdown
          </button>
        </div>
      </motion.div>
    </>
  );
}
