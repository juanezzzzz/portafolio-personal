import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "../lib/safeStorage";
import { asset } from "../lib/asset";
import type { AppId } from "./windowStore";

export type ThemeId = "base" | "light" | "glass" | "aurora" | "midnight" | "minimal";

export const THEME_CLASS: Record<ThemeId, string> = {
  base: "",
  light: "jos-theme-light",
  glass: "jos-theme-glass",
  aurora: "jos-theme-aurora",
  midnight: "jos-theme-midnight",
  minimal: "jos-theme-minimal",
};

export type GradientWallpaperId = "carbon" | "grid" | "puntos" | "sunset" | "aurora" | "void";

// Wallpapers fotograficos empacados con la app (no requieren subir nada):
// se sirven desde /public/wallpapers, elegidos por tono oscuro/carbon
// coherente con la paleta ambar de JOS. El lote original habia descartado
// los que traian IP de terceros; un segundo lote se agrego a pedido
// explicito y trajo 5 pares que resultaron ser duplicados visuales del
// primer lote (mismo render, otro nombre de archivo) — se dejo uno por
// par. Sobreviven 2 con marca/IP reconocible (dragonball, windows11) por
// decision consciente del dueño del proyecto; "ferrari" y el que traia el
// logo de HP se sacaron.
export type ImageWallpaperId =
  | "eclipse"
  | "anillo"
  | "cristal"
  | "resplandor"
  | "cima"
  | "guerrero"
  | "cosmos"
  | "dragonball"
  | "windows11";

export type WallpaperId = GradientWallpaperId | ImageWallpaperId | "custom";

export const WALLPAPER_CSS: Record<GradientWallpaperId, string> = {
  carbon: "radial-gradient(circle at 20% 15%, #1c2033 0%, #0a0b10 60%)",
  grid: "linear-gradient(#12141c, #12141c), repeating-linear-gradient(0deg, rgba(242,169,59,0.06) 0 1px, transparent 1px 42px), repeating-linear-gradient(90deg, rgba(242,169,59,0.06) 0 1px, transparent 1px 42px)",
  puntos: "radial-gradient(#b8792a66 1px, transparent 1.4px) 0 0 / 26px 26px, #0a0b10",
  sunset: "linear-gradient(160deg, #1a1024 0%, #3a1a2b 45%, #6b2b1f 100%)",
  aurora: "linear-gradient(150deg, #0b0912 0%, #1c1330 40%, #10222b 100%)",
  void: "#05060a",
};

export const WALLPAPER_IMAGES: Record<ImageWallpaperId, string> = {
  eclipse: asset("/wallpapers/eclipse.webp"),
  anillo: asset("/wallpapers/anillo.webp"),
  cristal: asset("/wallpapers/cristal.webp"),
  resplandor: asset("/wallpapers/resplandor.webp"),
  cima: asset("/wallpapers/cima.webp"),
  guerrero: asset("/wallpapers/guerrero.webp"),
  cosmos: asset("/wallpapers/cosmos.webp"),
  dragonball: asset("/wallpapers/dragonball.webp"),
  windows11: asset("/wallpapers/windows11.webp"),
};

export const WIDGET_IDS = ["clock", "calendar", "stats", "notes", "github", "music", "weather"] as const;
export type WidgetId = (typeof WIDGET_IDS)[number];

// Posicion de un widget flotante como PORCENTAJE del viewport (no pixeles
// crudos), por la misma razon que los iconos del escritorio: si se guardara
// en px absolutos, un widget arrastrado cerca del borde en una pantalla
// grande podia "nacer" fuera de la vista en una pantalla mas chica (o tras
// resize de la ventana), y quedar inalcanzable para siempre.
interface WidgetLayout {
  visible: boolean;
  xPct: number;
  yPct: number;
}

// Posicion de un icono de escritorio movido a mano por el usuario, guardada
// como PORCENTAJE del area de escritorio (no pixeles crudos). Esto es lo que
// evita que un icono termine fuera de pantalla si luego se abre la app en una
// ventana mas chica o en el celular: se reconstruye en px multiplicando por
// el tamano actual del contenedor, siempre dentro de rango 0-1.
export interface IconPosition {
  xPct: number;
  yPct: number;
}

interface SettingsState {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;

  wallpaper: WallpaperId;
  customWallpaper: string | null; // data URL
  setWallpaper: (w: WallpaperId) => void;
  setCustomWallpaper: (dataUrl: string) => void;
  clearCustomWallpaper: () => void;

  glassEnabled: boolean;
  toggleGlass: () => void;

  soundEnabled: boolean;
  toggleSound: () => void;

  animationSpeed: "slow" | "normal" | "fast";
  setAnimationSpeed: (s: "slow" | "normal" | "fast") => void;

  widgets: Record<WidgetId, WidgetLayout>;
  toggleWidget: (id: WidgetId) => void;
  moveWidget: (id: WidgetId, xPct: number, yPct: number) => void;

  // undefined/ausente = usa el layout automatico (fila centrada). Solo entra
  // aca cuando el usuario efectivamente arrastro el icono.
  iconPositions: Partial<Record<AppId, IconPosition>>;
  moveIcon: (id: AppId, xPct: number, yPct: number) => void;
  resetIconPositions: () => void;

  // Tour de bienvenida (coachmarks) la primera vez que se abre el escritorio.
  // "true" una vez que el usuario lo completa o lo salta; desde Settings se
  // puede volver a poner en false para repasarlo.
  onboardingDone: boolean;
  setOnboardingDone: (done: boolean) => void;
}

// clock/stats en yPct 0.12 (no 0.045): con 12 iconos en el escritorio la fila
// superior ocupa mas ancho por defecto, y a 0.045 esos dos widgets quedaban
// pegados a la misma franja horizontal que los iconos en pantallas de ancho
// medio. Bajarlos un poco los despega de esa fila sin alejarlos demasiado
// de la esquina superior derecha donde viven.
const DEFAULT_WIDGET_LAYOUT: Record<WidgetId, WidgetLayout> = {
  clock: { visible: true, xPct: 0.625, yPct: 0.12 },
  calendar: { visible: false, xPct: 0.625, yPct: 0.245 },
  stats: { visible: true, xPct: 0.79, yPct: 0.12 },
  notes: { visible: false, xPct: 0.625, yPct: 0.47 },
  github: { visible: false, xPct: 0.79, yPct: 0.245 },
  music: { visible: false, xPct: 0.79, yPct: 0.47 },
  weather: { visible: false, xPct: 0.625, yPct: 0.695 },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "base",
      setTheme: (theme) => set({ theme }),

      wallpaper: "carbon",
      customWallpaper: null,
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setCustomWallpaper: (dataUrl) => set({ customWallpaper: dataUrl, wallpaper: "custom" }),
      clearCustomWallpaper: () => set({ customWallpaper: null, wallpaper: "carbon" }),

      glassEnabled: false,
      toggleGlass: () => set((s) => ({ glassEnabled: !s.glassEnabled })),

      soundEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      animationSpeed: "normal",
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),

      widgets: DEFAULT_WIDGET_LAYOUT,
      toggleWidget: (id) =>
        set((s) => ({
          widgets: { ...s.widgets, [id]: { ...s.widgets[id], visible: !s.widgets[id].visible } },
        })),
      moveWidget: (id, xPct, yPct) =>
        set((s) => ({
          widgets: {
            ...s.widgets,
            [id]: { ...s.widgets[id], xPct: Math.min(1, Math.max(0, xPct)), yPct: Math.min(1, Math.max(0, yPct)) },
          },
        })),

      iconPositions: {},
      moveIcon: (id, xPct, yPct) =>
        set((s) => ({
          iconPositions: {
            ...s.iconPositions,
            [id]: { xPct: Math.min(1, Math.max(0, xPct)), yPct: Math.min(1, Math.max(0, yPct)) },
          },
        })),
      resetIconPositions: () => set({ iconPositions: {} }),

      onboardingDone: false,
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
    }),
    {
      name: "jos-settings",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        // guarda contra estado corrupto: wallpaper "custom" sin data URL guardada.
        if (state && state.wallpaper === "custom" && !state.customWallpaper) {
          state.wallpaper = "carbon";
        }
        // guarda contra un wallpaper que existia en una version anterior del
        // catalogo y fue retirado despues (ej. duplicados que se sacaron, o
        // "ferrari"/"bruma"/"paisaje" que se quitaron a pedido) — si alguien
        // ya lo tenia seleccionado y guardado, sin esto quedaria apuntando a
        // un id que ya no existe en WALLPAPER_CSS ni en WALLPAPER_IMAGES.
        if (
          state &&
          state.wallpaper !== "custom" &&
          !(state.wallpaper in WALLPAPER_CSS) &&
          !(state.wallpaper in WALLPAPER_IMAGES)
        ) {
          state.wallpaper = "carbon";
        }
        // migracion: versiones previas guardaban la posicion del widget en
        // px absolutos ({x,y}). Si encontramos ese formato viejo (o falta
        // algun campo), se resetea ese widget a su posicion por defecto en
        // porcentaje en vez de dejar un shape mixto que rompa el render.
        if (state) {
          for (const id of WIDGET_IDS) {
            const w = state.widgets?.[id] as Partial<WidgetLayout> | undefined;
            if (!w || typeof w.xPct !== "number" || typeof w.yPct !== "number") {
              state.widgets = {
                ...state.widgets,
                [id]: { ...DEFAULT_WIDGET_LAYOUT[id], visible: w?.visible ?? DEFAULT_WIDGET_LAYOUT[id].visible },
              };
            }
          }
        }
      },
    }
  )
);
