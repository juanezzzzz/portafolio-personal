import { create } from "zustand";
import { soundManager } from "../lib/soundManager";
import { useNotificationStore } from "./notificationStore";

export type FixedAppId =
  | "projects"
  | "about"
  | "resume"
  | "experience"
  | "education"
  | "skills"
  | "stats"
  | "contact"
  | "terminal"
  | "explorer"
  | "settings"
  | "versions"
  | "site";

// Las apps de proyecto se abren dinamicamente (una por proyecto, no estan
// precargadas en APPS) con el id `project:<projectId>` — el prefijo deja
// que WindowManager sepa que debe renderizar <ProjectApp /> sin tener que
// enumerar cada proyecto en el tipo.
export type ProjectAppId = `project:${string}`;
// Ventana de "demo en ejecucion": se abre al presionar Run Application dentro
// de una ProjectApp. Es una ventana separada (no una pestana de ProjectApp)
// para que la metafora sea "el software quedo instalado y corriendo", no
// "estoy viendo una pestana mas del visor de proyecto".
export type DemoAppId = `demo:${string}`;
export type AppId = FixedAppId | ProjectAppId | DemoAppId;

export interface AppDef {
  id: AppId;
  title: string;
  icon: string;
  defaultSize: { width: number; height: number };
}

export interface WindowInstance {
  winId: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  // guarda posicion/tamano previos a maximizar, para poder restaurar
  prevRect?: { x: number; y: number; width: number; height: number };
}

interface WindowState {
  windows: WindowInstance[];
  topZ: number;
  openApp: (app: AppDef) => void;
  openProjectApp: (project: { id: string; name: string; icon?: string }) => void;
  openDemoApp: (project: { id: string; name: string; icon?: string }) => void;
  closeWindow: (winId: string) => void;
  focusWindow: (winId: string) => void;
  minimizeWindow: (winId: string) => void;
  toggleMaximize: (winId: string) => void;
  moveWindow: (winId: string, position: { x: number; y: number }) => void;
  resizeWindow: (
    winId: string,
    size: { width: number; height: number },
    position?: { x: number; y: number }
  ) => void;
}

let winCounter = 0;

// Alto aproximado reservado para la taskbar flotante + su margen inferior,
// para que el centrado no empuje la ventana por debajo de ella.
// Exportado porque Window.tsx (rect de maximizado) y Taskbar.tsx (miniatura
// de preview) necesitan el mismo numero — antes cada uno tenia su propia
// constante hardcodeada y se desincronizaban.
export const TASKBAR_RESERVE = 76;
// Margen que deja una ventana maximizada respecto al borde de la pantalla
// (arriba/izquierda/derecha). Abajo se usa TASKBAR_RESERVE en su lugar, que
// ya incluye el alto de la taskbar + un colchon.
const MAXIMIZE_EDGE_MARGIN = 6;
const CASCADE_STEPS = 6;
const CASCADE_STEP_PX = 28;
const SCREEN_MARGIN = 16;

/** Rect real (x/y/width/height) que ocupa una ventana maximizada. Fuente
 * unica de verdad — cualquier lugar que necesite saber donde termina una
 * ventana maximizada (el render en si, o una miniatura de preview) debe
 * llamar a esto en vez de recalcular sus propios margenes. */
export function getMaximizedRect() {
  return {
    x: MAXIMIZE_EDGE_MARGIN,
    y: MAXIMIZE_EDGE_MARGIN,
    width: window.innerWidth - MAXIMIZE_EDGE_MARGIN * 2,
    height: window.innerHeight - MAXIMIZE_EDGE_MARGIN - TASKBAR_RESERVE,
  };
}

// El centrado simetrico (ventana nueva = centro exacto del viewport, cascada
// repartida alrededor de ese punto) se sentia artificial en monitores
// grandes: todo el grupo de ventanas abiertas quedaba amontonado en un
// cuadrito central rodeado de escritorio vacio, en vez de usar el espacio
// disponible. Un sistema operativo real ancla la primera ventana cerca de
// la esquina superior-izquierda (con un margen de respiro, no pegada al
// borde) y cascadea diagonalmente desde ahi — asi se hace aca. El tamano de
// la ventana ya no afecta el punto de partida, solo el clamp que evita que
// se salga de la pantalla.
const SPAWN_ORIGIN_X = 72;
const SPAWN_ORIGIN_Y = 56;

function nextSpawnOffset(size: { width: number; height: number }) {
  const step = (winCounter % CASCADE_STEPS) * CASCADE_STEP_PX;

  const usableW = window.innerWidth;
  const usableH = window.innerHeight - TASKBAR_RESERVE;

  const maxX = Math.max(SCREEN_MARGIN, usableW - size.width - SCREEN_MARGIN);
  const maxY = Math.max(SCREEN_MARGIN, usableH - size.height - SCREEN_MARGIN);

  return {
    x: clampNum(SPAWN_ORIGIN_X + step, SCREEN_MARGIN, maxX),
    y: clampNum(SPAWN_ORIGIN_Y + step, SCREEN_MARGIN, maxY),
  };
}

function clampNum(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  topZ: 10,

  openApp: (app) => {
    const existing = get().windows.find((w) => w.appId === app.id);
    if (existing) {
      soundManager.click();
      if (existing.isMinimized) soundManager.restore();
      set((state) => ({
        topZ: state.topZ + 1,
        windows: state.windows.map((w) =>
          w.winId === existing.winId
            ? { ...w, isMinimized: false, zIndex: state.topZ + 1 }
            : w
        ),
      }));
      return;
    }

    soundManager.open();
    useNotificationStore.getState().push({
      title: `Explorado: ${app.title}`,
      message: `Abriste la app ${app.title} por primera vez.`,
      kind: "achievement",
    });
    winCounter += 1;
    const spawn = nextSpawnOffset(app.defaultSize);
    const newWin: WindowInstance = {
      winId: `${app.id}-${winCounter}`,
      appId: app.id,
      title: app.title,
      isMinimized: false,
      isMaximized: false,
      zIndex: get().topZ + 1,
      position: spawn,
      size: app.defaultSize,
    };

    set((state) => ({
      topZ: state.topZ + 1,
      windows: [...state.windows, newWin],
    }));
  },

  openProjectApp: (project) => {
    const appDef: AppDef = {
      id: `project:${project.id}`,
      title: project.name,
      icon: project.icon ?? "app",
      defaultSize: { width: 720, height: 520 },
    };
    get().openApp(appDef);
  },

  openDemoApp: (project) => {
    const appDef: AppDef = {
      id: `demo:${project.id}`,
      title: `${project.name} — en ejecucion`,
      icon: project.icon ?? "app",
      defaultSize: { width: 960, height: 640 },
    };
    get().openApp(appDef);
  },

  closeWindow: (winId) => {
    soundManager.close();
    set((state) => ({
      windows: state.windows.filter((w) => w.winId !== winId),
    }));
  },

  focusWindow: (winId) =>
    set((state) => ({
      topZ: state.topZ + 1,
      windows: state.windows.map((w) =>
        w.winId === winId ? { ...w, zIndex: state.topZ + 1 } : w
      ),
    })),

  minimizeWindow: (winId) => {
    const w = get().windows.find((w) => w.winId === winId);
    if (w) soundManager[w.isMinimized ? "restore" : "minimize"]();
    set((state) => ({
      windows: state.windows.map((w) =>
        w.winId === winId ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    }));
  },

  toggleMaximize: (winId) => {
    const w = get().windows.find((w) => w.winId === winId);
    if (w) soundManager[w.isMaximized ? "restore" : "maximize"]();
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.winId !== winId) return w;
        if (w.isMaximized) {
          const restored = w.prevRect ?? {
            x: w.position.x,
            y: w.position.y,
            width: w.size.width,
            height: w.size.height,
          };
          return {
            ...w,
            isMaximized: false,
            position: { x: restored.x, y: restored.y },
            size: { width: restored.width, height: restored.height },
            prevRect: undefined,
          };
        }
        return {
          ...w,
          isMaximized: true,
          prevRect: {
            x: w.position.x,
            y: w.position.y,
            width: w.size.width,
            height: w.size.height,
          },
        };
      }),
    }));
  },

  moveWindow: (winId, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.winId === winId ? { ...w, position } : w
      ),
    })),

  resizeWindow: (winId, size, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.winId === winId
          ? { ...w, size, position: position ?? w.position }
          : w
      ),
    })),
}));
