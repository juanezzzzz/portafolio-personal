import type { AppId } from "../store/windowStore";
import { APPS } from "../data/apps";

const PARAM = "open";

/** Lee `?open=<appId>` de la URL actual. Devuelve null si no hay parametro o
 * si no tiene forma de un AppId real (app fija conocida, o `project:`/`demo:`
 * con formato valido) — un valor invalido no debe romper el arranque, solo
 * se ignora y JOS bootea normal. La resolucion final de `project:`/`demo:`
 * contra un proyecto que exista de verdad queda del lado de quien llama
 * (necesita `projects.ts`, que este modulo no importa para no acoplar). */
export function getDeepLinkTarget(): AppId | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get(PARAM);
  if (!raw) return null;
  if (raw in APPS) return raw as AppId;
  if (raw.startsWith("project:") || raw.startsWith("demo:")) return raw as AppId;
  return null;
}

/** URL absoluta que, al abrirse, lleva directo a `appId` (salteando el boot
 * — ver App.tsx). Pensada para un boton "compartir" tipo copiar-al-portapapeles. */
export function buildDeepLink(appId: AppId): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set(PARAM, appId);
  return url.toString();
}
