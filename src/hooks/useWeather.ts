import { useEffect, useState } from "react";

export interface WeatherInfo {
  tempC: number;
  code: number; // WMO weather code
  isDay: boolean;
  locationLabel: string;
}

type State = { status: "idle" } | { status: "loading" } | { status: "error" } | { status: "ready"; data: WeatherInfo };

// Yopal, Casanare — ciudad de Juan. Fallback si el navegador no da permiso de
// geolocalizacion o si falla (comun en desktop/CI). No requiere API key.
const FALLBACK = { lat: 5.3378, lon: -72.3959, label: "Yopal, Casanare" };

// Cache en memoria a nivel de modulo, igual que useGithubRepoInfo: evita
// volver a pedir el clima si el widget se desmonta/remonta en la misma
// sesion (el usuario oculta y vuelve a mostrar el widget desde Settings).
let cache: WeatherInfo | null = null;

async function reverseGeocodeLabel(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=es&count=1`
    );
    if (!res.ok) return FALLBACK.label;
    const data = await res.json();
    const place = data?.results?.[0];
    if (!place) return FALLBACK.label;
    return [place.name, place.admin1].filter(Boolean).join(", ");
  } catch {
    return FALLBACK.label;
  }
}

async function fetchWeatherFor(lat: number, lon: number, label: string): Promise<WeatherInfo | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const current = data?.current;
    if (!current || typeof current.temperature_2m !== "number") return null;
    return {
      tempC: Math.round(current.temperature_2m),
      code: current.weather_code ?? 0,
      isDay: current.is_day === 1,
      locationLabel: label,
    };
  } catch {
    return null;
  }
}

function getBrowserLocation(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 5000, maximumAge: 10 * 60 * 1000 }
    );
  });
}

/** Trae el clima actual via Open-Meteo (sin API key). Intenta geolocalizar al
 * visitante primero; si el navegador niega el permiso o falla, cae a Yopal,
 * Casanare (la ciudad de Juan) como ubicacion por defecto. Silencioso ante
 * errores (offline, bloqueo de geolocalizacion, red caida): el widget
 * simplemente no se muestra en vez de romper el resto de la UI. */
export function useWeather(): State {
  const [state, setState] = useState<State>(() => (cache ? { status: "ready", data: cache } : { status: "idle" }));

  useEffect(() => {
    if (cache) {
      setState({ status: "ready", data: cache });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      const pos = await getBrowserLocation();
      const lat = pos?.coords.latitude ?? FALLBACK.lat;
      const lon = pos?.coords.longitude ?? FALLBACK.lon;

      const label = pos ? await reverseGeocodeLabel(lat, lon) : FALLBACK.label;
      if (cancelled) return;

      const weather = await fetchWeatherFor(lat, lon, label);
      if (cancelled) return;

      if (!weather) {
        setState({ status: "error" });
        return;
      }

      cache = weather;
      setState({ status: "ready", data: weather });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
