import {
  useSettingsStore,
  WALLPAPER_CSS,
  WALLPAPER_IMAGES,
  type GradientWallpaperId,
} from "../store/settingsStore";

export function Wallpaper() {
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const customWallpaper = useSettingsStore((s) => s.customWallpaper);

  let background: string;
  if (wallpaper === "custom" && customWallpaper) {
    background = `url(${customWallpaper}) center/cover no-repeat`;
  } else if (wallpaper in WALLPAPER_IMAGES) {
    background = `url(${WALLPAPER_IMAGES[wallpaper as keyof typeof WALLPAPER_IMAGES]}) center/cover no-repeat`;
  } else {
    background = WALLPAPER_CSS[wallpaper as GradientWallpaperId] ?? WALLPAPER_CSS.carbon;
  }

  return <div className="jos-scanlines pointer-events-none absolute inset-0" style={{ background }} />;
}
