import { useEffect, useState } from "react";
import { useSettingsStore } from "../store/settingsStore";
import { FloatingWidget } from "./widgets/FloatingWidget";
import { ClockWidget } from "./widgets/ClockWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { StatsWidget } from "./widgets/StatsWidget";
import { NotesWidget } from "./widgets/NotesWidget";
import { GithubActivityWidget } from "./widgets/GithubActivityWidget";
import { MusicWidget } from "./widgets/MusicWidget";
import { WeatherWidget } from "./widgets/WeatherWidget";

export function WidgetLayer() {
  const widgets = useSettingsStore((s) => s.widgets);

  // Tamano del viewport, para resolver xPct/yPct a px reales y para los
  // dragConstraints de cada widget. Se usa window.innerWidth/Height (no un
  // ResizeObserver sobre un contenedor) porque los widgets flotan sobre
  // toda la pantalla, no solo sobre el area del escritorio.
  const [containerSize, setContainerSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function onResize() {
      setContainerSize({ w: window.innerWidth, h: window.innerHeight });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {widgets.clock.visible && (
        <FloatingWidget
          id="clock"
          title="Reloj"
          xPct={widgets.clock.xPct}
          yPct={widgets.clock.yPct}
          containerSize={containerSize}
          width={180}
        >
          <ClockWidget />
        </FloatingWidget>
      )}
      {widgets.calendar.visible && (
        <FloatingWidget
          id="calendar"
          title="Calendario"
          xPct={widgets.calendar.xPct}
          yPct={widgets.calendar.yPct}
          containerSize={containerSize}
          width={190}
        >
          <CalendarWidget />
        </FloatingWidget>
      )}
      {widgets.stats.visible && (
        <FloatingWidget
          id="stats"
          title="Sistema"
          xPct={widgets.stats.xPct}
          yPct={widgets.stats.yPct}
          containerSize={containerSize}
          width={170}
        >
          <StatsWidget />
        </FloatingWidget>
      )}
      {widgets.notes.visible && (
        <FloatingWidget
          id="notes"
          title="Notas"
          xPct={widgets.notes.xPct}
          yPct={widgets.notes.yPct}
          containerSize={containerSize}
          width={190}
        >
          <NotesWidget />
        </FloatingWidget>
      )}
      {widgets.github.visible && (
        <FloatingWidget
          id="github"
          title="Actividad"
          xPct={widgets.github.xPct}
          yPct={widgets.github.yPct}
          containerSize={containerSize}
          width={170}
        >
          <GithubActivityWidget />
        </FloatingWidget>
      )}
      {widgets.music.visible && (
        <FloatingWidget
          id="music"
          title="Musica"
          xPct={widgets.music.xPct}
          yPct={widgets.music.yPct}
          containerSize={containerSize}
          width={200}
        >
          <MusicWidget />
        </FloatingWidget>
      )}
      {widgets.weather.visible && (
        <FloatingWidget
          id="weather"
          title="Clima"
          xPct={widgets.weather.xPct}
          yPct={widgets.weather.yPct}
          containerSize={containerSize}
          width={190}
        >
          <WeatherWidget />
        </FloatingWidget>
      )}
    </div>
  );
}
