import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle } from "lucide-react";
import { useWeather } from "../../hooks/useWeather";

// Codigos WMO (weather_code de Open-Meteo) agrupados por familia visual.
// https://open-meteo.com/en/docs -> "WMO Weather interpretation codes"
function iconFor(code: number, isDay: boolean) {
  if (code === 0) return isDay ? Sun : Moon; // despejado
  if (code <= 2) return Cloud; // parcialmente nublado
  if (code === 3) return Cloud; // nublado
  if (code === 45 || code === 48) return CloudFog; // niebla
  if (code >= 51 && code <= 57) return CloudDrizzle; // llovizna
  if (code >= 61 && code <= 67) return CloudRain; // lluvia
  if (code >= 71 && code <= 77) return CloudSnow; // nieve
  if (code >= 80 && code <= 82) return CloudRain; // chubascos
  if (code >= 85 && code <= 86) return CloudSnow; // chubascos de nieve
  if (code >= 95) return CloudLightning; // tormenta
  return Cloud;
}

function labelFor(code: number) {
  if (code === 0) return "Despejado";
  if (code <= 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code === 45 || code === 48) return "Niebla";
  if (code >= 51 && code <= 57) return "Llovizna";
  if (code >= 61 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "Nieve";
  if (code >= 80 && code <= 82) return "Chubascos";
  if (code >= 85 && code <= 86) return "Chubascos de nieve";
  if (code >= 95) return "Tormenta";
  return "—";
}

export function WeatherWidget() {
  const state = useWeather();

  if (state.status === "idle" || state.status === "loading") {
    return <div className="font-mono text-[10px] text-jos-text-dim">Ubicando…</div>;
  }

  // Fallo silencioso (sin permiso de geolocalizacion + red caida, offline,
  // etc.): igual que GithubActivityWidget/useGithubRepoInfo, no rompe el
  // resto de la UI, solo no hay nada util que mostrar.
  if (state.status === "error") {
    return <div className="font-mono text-[10px] text-jos-text-dim">Clima no disponible</div>;
  }

  const { tempC, code, isDay, locationLabel } = state.data;
  const Icon = iconFor(code, isDay);

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-8 w-8 shrink-0 text-jos-amber" strokeWidth={1.5} />
      <div className="min-w-0">
        <div className="font-mono text-2xl tabular-nums text-jos-text">{tempC}°C</div>
        <div className="truncate font-mono text-[10px] text-jos-text-dim">{labelFor(code)}</div>
        <div className="truncate font-mono text-[9px] text-jos-text-dim/70">{locationLabel}</div>
      </div>
    </div>
  );
}
