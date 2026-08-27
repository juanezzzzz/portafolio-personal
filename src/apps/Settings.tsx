import { useRef, useState, type ReactNode, type ChangeEvent } from "react";
import { Palette, AppWindow, Volume2, LayoutGrid, Move, HelpCircle } from "lucide-react";
import { useSettingsStore, WIDGET_IDS, type WidgetId } from "../store/settingsStore";
import { THEME_OPTIONS, WALLPAPER_OPTIONS, PHOTO_WALLPAPER_OPTIONS } from "../data/themes";

const WIDGET_LABELS: Record<WidgetId, string> = {
  clock: "Reloj",
  calendar: "Calendario",
  stats: "Sistema (CPU/RAM)",
  notes: "Notas rapidas",
  github: "Actividad (GitHub)",
  music: "Musica",
  weather: "Clima",
};

const CATEGORIES = [
  { id: "appearance", label: "Apariencia", icon: Palette },
  { id: "windows", label: "Ventanas", icon: AppWindow },
  { id: "sound", label: "Sonido", icon: Volume2 },
  { id: "widgets", label: "Widgets", icon: LayoutGrid },
  { id: "desktop", label: "Escritorio", icon: Move },
  { id: "help", label: "Ayuda", icon: HelpCircle },
] as const;
type CategoryId = (typeof CATEGORIES)[number]["id"];

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={on}
      className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-200 ${
        on ? "border-jos-amber bg-jos-amber/25" : "border-jos-border bg-jos-chrome-light/50"
      }`}
    >
      <div
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-jos-amber shadow-sm transition-transform duration-200 ${
          on ? "translate-x-[19px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-3 rounded-xl border border-jos-border/60 bg-jos-chrome/40 p-4">
      {title && <p className="font-mono text-[11px] uppercase tracking-wider text-jos-text-dim">{title}</p>}
      {children}
    </div>
  );
}

function Row({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="font-mono text-xs text-jos-text">{title}</p>
        <p className="text-[11px] text-jos-text-dim">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface SettingsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Settings({ soundEnabled, onToggleSound }: SettingsProps) {
  const {
    theme, setTheme,
    wallpaper, customWallpaper, setWallpaper, setCustomWallpaper, clearCustomWallpaper,
    glassEnabled, toggleGlass,
    animationSpeed, setAnimationSpeed,
    widgets, toggleWidget,
    resetIconPositions,
    setOnboardingDone,
  } = useSettingsStore();

  const [active, setActive] = useState<CategoryId>("appearance");
  const fileRef = useRef<HTMLInputElement>(null);

  const MAX_WALLPAPER_BYTES = 3 * 1024 * 1024; // 3MB

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo despues
    if (!file) return;
    if (file.size > MAX_WALLPAPER_BYTES) {
      alert("La imagen supera 3MB. Elige una mas liviana para no llenar el almacenamiento local.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCustomWallpaper(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    // @container habilita breakpoints @sm/@lg propios de ESTA ventana (no del
    // viewport): una ventana de Settings angosta (redimensionada a mano, o el
    // MIN_WIDTH de 320px) apila la nav de categorias arriba en vez de romper
    // el layout de 2 paneles contra un sidebar mas ancho que la ventana. El
    // contenedor que declara "@container" no puede reaccionar a su propia
    // query (una query siempre mira al ANCESTRO contenedor mas cercano, nunca
    // a si mismo) — por eso el toggle flex-col/@lg:flex-row vive en un div
    // hijo, no en el mismo div que trae la clase @container.
    <div className="@container h-full">
      <div className="flex h-full flex-col @lg:flex-row">
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-jos-border/60 bg-jos-bg-deep/40 p-2 @lg:w-52 @lg:flex-col @lg:overflow-visible @lg:border-b-0 @lg:border-r">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-xs transition-colors duration-150 @lg:w-full ${
                isActive
                  ? "bg-jos-amber/15 text-jos-amber"
                  : "text-jos-text-dim hover:bg-jos-chrome-light/60 hover:text-jos-text"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="whitespace-nowrap">{c.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="min-w-0 flex-1 overflow-y-auto p-5">
        <div className="mx-auto max-w-[720px] space-y-4">
          {active === "appearance" && (
            <>
              <Card title="Tema del sistema">
                <div className="grid grid-cols-3 gap-2 @lg:grid-cols-4">
                  {THEME_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors ${
                        theme === t.id
                          ? "border-jos-amber bg-jos-amber/10"
                          : "border-jos-border/70 hover:border-jos-text-dim"
                      }`}
                    >
                      <div className="flex h-6 w-full overflow-hidden rounded-md">
                        {t.swatch.map((c, i) => (
                          <div key={i} className="h-full flex-1" style={{ background: c }} />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-jos-text">{t.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              <Card title="Wallpaper">
                <p className="font-mono text-[10px] uppercase tracking-wider text-jos-text-dim">Gradientes</p>
                <div className="grid grid-cols-3 gap-2 @lg:grid-cols-4">
                  {WALLPAPER_OPTIONS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWallpaper(w.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-1.5 transition-colors ${
                        wallpaper === w.id
                          ? "border-jos-amber bg-jos-amber/10"
                          : "border-jos-border/70 hover:border-jos-text-dim"
                      }`}
                    >
                      <div className="h-10 w-full rounded-md" style={{ background: w.background }} />
                      <span className="font-mono text-[10px] text-jos-text">{w.label}</span>
                    </button>
                  ))}
                </div>

                <p className="pt-1 font-mono text-[10px] uppercase tracking-wider text-jos-text-dim">Fotos</p>
                <div className="grid grid-cols-3 gap-2 @lg:grid-cols-4">
                  {PHOTO_WALLPAPER_OPTIONS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWallpaper(w.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-1.5 transition-colors ${
                        wallpaper === w.id
                          ? "border-jos-amber bg-jos-amber/10"
                          : "border-jos-border/70 hover:border-jos-text-dim"
                      }`}
                    >
                      <div className="h-10 w-full rounded-md" style={{ background: w.background }} />
                      <span className="font-mono text-[10px] text-jos-text">{w.label}</span>
                    </button>
                  ))}
                  <div
                    className={`relative flex flex-col items-center justify-center gap-1.5 rounded-lg border p-1.5 transition-colors ${
                      wallpaper === "custom"
                        ? "border-jos-amber bg-jos-amber/10"
                        : "border-jos-border/70 hover:border-jos-text-dim"
                    }`}
                  >
                    <button onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center gap-1.5">
                      <div
                        className="flex h-10 w-full items-center justify-center rounded-md border border-dashed border-jos-border/70 bg-cover bg-center font-mono text-[9px] text-jos-text-dim"
                        style={customWallpaper ? { background: `url(${customWallpaper}) center/cover` } : undefined}
                      >
                        {!customWallpaper && "subir..."}
                      </div>
                      <span className="font-mono text-[10px] text-jos-text">Personalizado</span>
                    </button>
                    {customWallpaper && (
                      <button
                        onClick={clearCustomWallpaper}
                        aria-label="Quitar imagen personalizada"
                        title="Quitar imagen personalizada"
                        className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-jos-border bg-jos-bg text-[10px] leading-none text-jos-text-dim hover:border-jos-red hover:text-jos-red"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </div>
                {customWallpaper && (
                  <button
                    onClick={clearCustomWallpaper}
                    className="w-full rounded-lg border border-jos-border px-2 py-1.5 font-mono text-[11px] text-jos-text-dim transition-colors hover:border-jos-red hover:text-jos-red"
                  >
                    Quitar imagen personalizada
                  </button>
                )}
              </Card>
            </>
          )}

          {active === "windows" && (
            <Card>
              <Row title="Efecto Glass" description="Ventanas translucidas con blur">
                <Toggle on={glassEnabled} onClick={toggleGlass} label="Efecto Glass" />
              </Row>
              <div>
                <p className="mb-1.5 font-mono text-xs text-jos-text">Velocidad de animacion</p>
                <div className="flex gap-1.5">
                  {(["slow", "normal", "fast"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setAnimationSpeed(s)}
                      className={`flex-1 rounded-lg border px-2 py-1.5 font-mono text-[11px] capitalize transition-colors ${
                        animationSpeed === s
                          ? "border-jos-amber text-jos-amber"
                          : "border-jos-border text-jos-text-dim hover:border-jos-text-dim"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {active === "sound" && (
            <Card>
              <Row title="Sonidos del sistema" description="Click al abrir/cerrar ventanas, errores, notificaciones">
                <Toggle on={soundEnabled} onClick={onToggleSound} label="Sonido" />
              </Row>
            </Card>
          )}

          {active === "widgets" && (
            <Card title="Widgets de escritorio">
              <div className="space-y-1">
                {WIDGET_IDS.map((id) => (
                  <div key={id} className="flex items-center justify-between rounded-lg px-1 py-1.5">
                    <span className="font-mono text-xs text-jos-text">{WIDGET_LABELS[id]}</span>
                    <Toggle on={widgets[id].visible} onClick={() => toggleWidget(id)} label={WIDGET_LABELS[id]} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {active === "desktop" && (
            <Card>
              <Row
                title="Orden de iconos"
                description="Puedes arrastrar los iconos del escritorio a donde quieras. Este boton los vuelve a la fila centrada por defecto."
              >
                <button
                  onClick={resetIconPositions}
                  className="shrink-0 rounded-lg border border-jos-border px-2.5 py-1.5 font-mono text-[11px] text-jos-text-dim transition-colors hover:border-jos-amber hover:text-jos-amber"
                >
                  Restablecer
                </button>
              </Row>
            </Card>
          )}

          {active === "help" && (
            <Card>
              <Row
                title="Tour de bienvenida"
                description="Los 3 tips sobre cómo mover, redimensionar y buscar que aparecen la primera vez."
              >
                <button
                  onClick={() => setOnboardingDone(false)}
                  className="shrink-0 rounded-lg border border-jos-border px-2.5 py-1.5 font-mono text-[11px] text-jos-text-dim transition-colors hover:border-jos-amber hover:text-jos-amber"
                >
                  Ver de nuevo
                </button>
              </Row>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
