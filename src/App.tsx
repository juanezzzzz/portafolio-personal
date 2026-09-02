import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { useKonamiCode } from "./hooks/useKonamiCode";
import { useIsMobile } from "./hooks/useIsMobile";
import { safeStorage } from "./lib/safeStorage";
import { useSettingsStore, THEME_CLASS } from "./store/settingsStore";
import { useNotificationStore } from "./store/notificationStore";
import { getDeepLinkTarget } from "./lib/deepLink";

// Las dos caras de JOS van en lazy(): cada visitante descarga solo la suya.
// El escritorio arrastra framer-motion + react-rnd + todos los componentes del
// sistema; el movil, el portafolio tradicional. Antes ambos viajaban en el
// bundle de arranque y todo el mundo pagaba por los dos.
const DesktopShell = lazy(() =>
  import("./components/DesktopShell").then((m) => ({ default: m.DesktopShell }))
);
const MobileShell = lazy(() =>
  import("./components/MobileShell").then((m) => ({ default: m.MobileShell }))
);

/** Recuerda que el usuario pidio explicitamente el escritorio desde un movil,
 * para no devolverlo a la version de pagina en cada recarga. */
const FORCE_DESKTOP_KEY = "jos-force-desktop";

/** Traduce el destino de un deep link a la seccion equivalente del portafolio
 * tradicional, que es lo que se sirve en movil. Las apps que no tienen
 * seccion propia caen a la mas cercana en contenido. */
const DEEP_LINK_SECTION: Record<string, string> = {
  projects: "proyectos",
  project: "proyectos",
  demo: "proyectos",
  about: "sobre-mi",
  resume: "sobre-mi",
  experience: "experiencia",
  education: "experiencia",
  skills: "habilidades",
  stats: "habilidades",
  contact: "contacto",
};

function sectionForDeepLink(target: string | null): string | null {
  if (!target) return null;
  return DEEP_LINK_SECTION[target.split(":")[0]] ?? null;
}

export default function App() {
  // La URL no cambia sola durante la sesion, asi que se lee una vez al montar.
  const deepLinkTarget = useRef(getDeepLinkTarget()).current;

  const [specialTheme, setSpecialTheme] = useState(false);
  const theme = useSettingsStore((s) => s.theme);
  const push = useNotificationStore((s) => s.push);

  // En movil se sirve el portafolio tradicional en vez del escritorio: un
  // sistema de ventanas arrastrables no funciona en 390px de ancho. El usuario
  // puede pedir el escritorio igualmente, y esa decision se recuerda.
  const isMobile = useIsMobile();
  const [forceDesktop, setForceDesktop] = useState(
    () => safeStorage.getItem(FORCE_DESKTOP_KEY) === "1"
  );
  const showMobile = isMobile && !forceDesktop;

  useKonamiCode(
    useCallback(() => {
      setSpecialTheme((v) => {
        const next = !v;
        if (next)
          push({
            title: "Tema secreto desbloqueado",
            message: "Konami code activado.",
            kind: "achievement",
          });
        return next;
      });
    }, [push])
  );

  return (
    <div
      className={`relative h-dvh w-screen overflow-hidden bg-jos-bg-deep ${
        specialTheme ? "jos-theme-special" : THEME_CLASS[theme]
      }`}
    >
      <Suspense fallback={<div className="h-dvh w-full bg-jos-bg-deep" />}>
        {showMobile ? (
          <MobileShell
            scrollTo={sectionForDeepLink(deepLinkTarget)}
            onSwitchToDesktop={() => {
              safeStorage.setItem(FORCE_DESKTOP_KEY, "1");
              setForceDesktop(true);
            }}
          />
        ) : (
          <DesktopShell
            deepLinkTarget={deepLinkTarget}
            onToggleTheme={() => setSpecialTheme((v) => !v)}
          />
        )}
      </Suspense>
    </div>
  );
}
