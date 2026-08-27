import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { LayoutGrid, Search } from "lucide-react";
import { useWindowStore } from "../store/windowStore";
import { useClock } from "../hooks/useClock";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSettingsStore, THEME_CLASS } from "../store/settingsStore";
import { useNotificationStore } from "../store/notificationStore";
import { StartMenu } from "./StartMenu";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationCenter } from "./NotificationCenter";
import { TaskbarPreview, type PreviewAnchor } from "./taskbar/TaskbarPreview";
import { OpenWindowsGroup } from "./taskbar/OpenWindowsGroup";
import { QuickLinksGroup } from "./taskbar/QuickLinksGroup";
import { SystemGroup } from "./taskbar/SystemGroup";
import { QuickSettingsPopover } from "./taskbar/QuickSettingsPopover";
import { APPS } from "../data/apps";

interface TaskbarProps {
  onShutdown: () => void;
}

export function Taskbar({ onShutdown }: TaskbarProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [previewWinId, setPreviewWinId] = useState<string | null>(null);
  const [previewAnchor, setPreviewAnchor] = useState<PreviewAnchor | null>(null);

  // Refs a los botones que disparan cada overlay: al cerrar, se les devuelve
  // el foco (ver useOverlayDismiss) para que un usuario de teclado no pierda
  // el lugar en la pagina.
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const notifButtonRef = useRef<HTMLButtonElement>(null);
  const quickButtonRef = useRef<HTMLButtonElement>(null);

  const { windows, openApp, topZ } = useWindowStore();
  const { time, date } = useClock();
  const isMobile = useIsMobile();
  const { soundEnabled, toggleSound, theme, setTheme } = useSettingsStore();
  const notifications = useNotificationStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function closeStart() {
    setStartOpen(false);
    startButtonRef.current?.focus();
  }
  function closeSearch() {
    setSearchOpen(false);
    searchButtonRef.current?.focus();
  }
  function closeNotif() {
    setNotifOpen(false);
    notifButtonRef.current?.focus();
  }
  function closeQuick() {
    setQuickOpen(false);
    quickButtonRef.current?.focus();
  }

  return (
    <>
      <AnimatePresence>
        {startOpen && (
          <StartMenu
            onClose={closeStart}
            onShutdown={() => {
              setStartOpen(false);
              onShutdown();
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>{searchOpen && <GlobalSearch onClose={closeSearch} />}</AnimatePresence>
      <AnimatePresence>{notifOpen && <NotificationCenter onClose={closeNotif} />}</AnimatePresence>
      <AnimatePresence>
        {quickOpen && (
          <QuickSettingsPopover
            theme={theme}
            setTheme={setTheme}
            soundEnabled={soundEnabled}
            toggleSound={toggleSound}
            onOpenSettings={() => {
              closeQuick();
              openApp(APPS.settings);
            }}
            onClose={closeQuick}
          />
        )}
      </AnimatePresence>

      <div className="jos-elevation-2 absolute inset-x-3 bottom-3 z-[9998] flex h-11 items-center gap-2 rounded-2xl border border-jos-border bg-jos-chrome/95 px-2 font-mono text-xs backdrop-blur-xl">
        {/* Grupo: inicio + buscar */}
        <div className="flex h-8 items-center gap-1 rounded-xl border border-jos-border/40 bg-jos-bg-deep/40 px-1">
          <button
            ref={startButtonRef}
            onClick={() => setStartOpen((v) => !v)}
            className={`flex h-[26px] items-center gap-1.5 px-2 transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 ${
              startOpen ? "jos-elevation-1 text-jos-amber" : "text-jos-text"
            }`}
          >
            <LayoutGrid size={14} />
            JOS
          </button>

          <button
            ref={searchButtonRef}
            onClick={() => setSearchOpen(true)}
            className="flex h-[26px] items-center gap-1.5 px-2 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-text"
            aria-label="Buscar"
          >
            <Search size={14} />
          </button>
        </div>

        <OpenWindowsGroup
          windows={windows}
          topZ={topZ}
          isMobile={isMobile}
          onShowPreview={(winId, anchor) => {
            setPreviewWinId(winId);
            setPreviewAnchor(anchor);
          }}
          onHidePreview={() => setPreviewWinId(null)}
        />

        <QuickLinksGroup />

        <SystemGroup
          online={online}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          unread={unread}
          onToggleNotif={() => {
            setNotifOpen((v) => !v);
            if (!notifOpen) markAllRead();
          }}
          notifButtonRef={notifButtonRef}
          onToggleQuick={() => setQuickOpen((v) => !v)}
          quickButtonRef={quickButtonRef}
        />

        {/* Grupo: reloj — en mobile se omite la fecha, el ancho ya esta
            peleado entre el grupo de ventanas y el resto de botones tactiles. */}
        <div className="flex h-8 items-center rounded-xl border border-jos-border/40 bg-jos-bg-deep/40 px-2.5 text-right leading-tight text-jos-text-dim">
          <div>
            <div className="text-jos-text">{time}</div>
            {!isMobile && <div className="text-[10px]">{date}</div>}
          </div>
        </div>
      </div>

      {/* Preview de ventana minimizada/abierta: portal a document.body para
          escapar del overflow-x-auto del grupo "ventanas abiertas" (ver nota
          en TaskbarPreview). */}
      {createPortal(
        <AnimatePresence>
          {previewWinId &&
            previewAnchor &&
            (() => {
              const win = windows.find((w) => w.winId === previewWinId);
              return win ? (
                <TaskbarPreview key={win.winId} win={win} anchor={previewAnchor} themeClass={THEME_CLASS[theme]} />
              ) : null;
            })()}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
