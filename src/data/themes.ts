import type { ThemeId, GradientWallpaperId, ImageWallpaperId } from "../store/settingsStore";
import { WALLPAPER_CSS, WALLPAPER_IMAGES } from "../store/settingsStore";

export const THEME_OPTIONS: { id: ThemeId; label: string; swatch: [string, string, string] }[] = [
  { id: "base", label: "Ambar (base)", swatch: ["#0a0b10", "#12141c", "#f2a93b"] },
  { id: "light", label: "Claro", swatch: ["#dde2eb", "#eceff4", "#b8792a"] },
  { id: "glass", label: "Glass", swatch: ["#0a0d16", "#1e2436", "#7dd3fc"] },
  { id: "aurora", label: "Aurora", swatch: ["#0b0912", "#211c30", "#e879f9"] },
  { id: "midnight", label: "Midnight", swatch: ["#060a17", "#141c38", "#60a5fa"] },
  { id: "minimal", label: "Minimal", swatch: ["#0a0a0a", "#1e1e1e", "#e5e5e5"] },
];

export const WALLPAPER_OPTIONS: { id: GradientWallpaperId; label: string; background: string }[] = [
  { id: "carbon", label: "Carbon", background: WALLPAPER_CSS.carbon },
  { id: "grid", label: "Grid", background: WALLPAPER_CSS.grid },
  { id: "puntos", label: "Puntos", background: WALLPAPER_CSS.puntos },
  { id: "sunset", label: "Sunset", background: WALLPAPER_CSS.sunset },
  { id: "aurora", label: "Aurora", background: WALLPAPER_CSS.aurora },
  { id: "void", label: "Void", background: WALLPAPER_CSS.void },
];

// Presets fotograficos empacados con la app — apareceran seleccionables
// desde Settings sin que el usuario tenga que subir nada.
export const PHOTO_WALLPAPER_OPTIONS: { id: ImageWallpaperId; label: string; background: string }[] = [
  { id: "eclipse", label: "Eclipse", background: `url(${WALLPAPER_IMAGES.eclipse}) center/cover` },
  { id: "anillo", label: "Anillo", background: `url(${WALLPAPER_IMAGES.anillo}) center/cover` },
  { id: "cristal", label: "Cristal", background: `url(${WALLPAPER_IMAGES.cristal}) center/cover` },
  { id: "resplandor", label: "Resplandor", background: `url(${WALLPAPER_IMAGES.resplandor}) center/cover` },
  { id: "cima", label: "Cima", background: `url(${WALLPAPER_IMAGES.cima}) center/cover` },
  { id: "guerrero", label: "Guerrero", background: `url(${WALLPAPER_IMAGES.guerrero}) center/cover` },
  { id: "cosmos", label: "Cosmos", background: `url(${WALLPAPER_IMAGES.cosmos}) center/cover` },
  { id: "dragonball", label: "Dragon Ball Super", background: `url(${WALLPAPER_IMAGES.dragonball}) center/cover` },
  { id: "windows11", label: "Windows 11", background: `url(${WALLPAPER_IMAGES.windows11}) center/cover` },
];
