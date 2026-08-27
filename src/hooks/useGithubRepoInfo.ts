import { useEffect, useState } from "react";

export interface GithubRepoInfo {
  stars: number;
  forks: number;
  openIssues: number;
  license: string | null;
  lastCommitSha: string | null;
  lastCommitMessage: string | null;
  lastCommitDate: string | null;
  lastCommitUrl: string | null;
  /** Fecha del ultimo push, como fallback si el commit puntual no cargo. */
  pushedAt: string | null;
  latestRelease: string | null;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: GithubRepoInfo };

// Cache en memoria a nivel de modulo (no localStorage): sobrevive mientras
// dure la pestaña, se pierde al recargar. Evita volver a pedir lo mismo si
// el usuario cierra y reabre la misma ProjectApp en la misma sesion, sin
// gastar cuota de rate limit de mas.
const cache = new Map<string, GithubRepoInfo>();

function parseOwnerRepo(githubUrl: string): { owner: string; repo: string } | null {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+?)\/?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

/** Trae estrellas, forks, ultimo commit y ultimo release de un repo publico
 * de GitHub via la API sin autenticar. Silencioso ante errores: si algo
 * falla (rate limit, offline, repo privado, sin releases) esa parte queda
 * en null en vez de romper el resto de la UI — el llamador decide que
 * mostrar u omitir. */
export function useGithubRepoInfo(githubUrl?: string): State {
  const initialParsed = githubUrl ? parseOwnerRepo(githubUrl) : null;
  const initialCacheKey = initialParsed ? `${initialParsed.owner}/${initialParsed.repo}` : null;
  const [state, setState] = useState<State>(() =>
    initialCacheKey && cache.has(initialCacheKey)
      ? { status: "ready", data: cache.get(initialCacheKey)! }
      : { status: "idle" }
  );

  // Ojo: `parseOwnerRepo` devuelve un objeto nuevo en cada render, asi que no
  // puede vivir en el array de dependencias (nunca es referencialmente igual
  // al anterior aunque tenga los mismos valores) — eso causaba un loop
  // infinito de renders (el efecto disparaba setState, que re-renderizaba,
  // que volvia a crear `parsed`, que volvia a disparar el efecto). Se
  // recalcula adentro del efecto y se depende solo de `githubUrl` (string,
  // se compara por valor).
  useEffect(() => {
    const parsed = githubUrl ? parseOwnerRepo(githubUrl) : null;
    const cacheKey = parsed ? `${parsed.owner}/${parsed.repo}` : null;
    if (!parsed || !cacheKey) {
      setState({ status: "idle" });
      return;
    }
    if (cache.has(cacheKey)) {
      setState({ status: "ready", data: cache.get(cacheKey)! });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    const { owner, repo } = parsed;
    const base = `https://api.github.com/repos/${owner}/${repo}`;

    Promise.allSettled([
      fetch(base).then((r) => (r.ok ? r.json() : null)),
      fetch(`${base}/commits?per_page=1`).then((r) => (r.ok ? r.json() : null)),
      // El repo puede no tener releases -> 404 esperado, se maneja aparte.
      fetch(`${base}/releases/latest`).then((r) => (r.ok ? r.json() : null)),
    ]).then(([repoRes, commitsRes, releaseRes]) => {
      if (cancelled) return;

      const repoData = repoRes.status === "fulfilled" ? repoRes.value : null;
      const commitData =
        commitsRes.status === "fulfilled" && Array.isArray(commitsRes.value) ? commitsRes.value[0] : null;
      const releaseData = releaseRes.status === "fulfilled" ? releaseRes.value : null;

      // Si ni siquiera el endpoint principal del repo respondio, no hay
      // nada util que mostrar (offline, rate limit, repo privado/borrado).
      if (!repoData) {
        setState({ status: "error" });
        return;
      }

      const info: GithubRepoInfo = {
        stars: repoData.stargazers_count ?? 0,
        forks: repoData.forks_count ?? 0,
        openIssues: repoData.open_issues_count ?? 0,
        license: repoData.license?.spdx_id ?? repoData.license?.name ?? null,
        lastCommitSha: commitData?.sha ? commitData.sha.slice(0, 7) : null,
        lastCommitMessage: commitData?.commit?.message?.split("\n")[0] ?? null,
        lastCommitDate: commitData?.commit?.author?.date ?? null,
        lastCommitUrl: commitData?.html_url ?? null,
        pushedAt: repoData.pushed_at ?? null,
        latestRelease: releaseData?.tag_name ?? null,
      };

      cache.set(cacheKey, info);
      setState({ status: "ready", data: info });
    });

    return () => {
      cancelled = true;
    };
  }, [githubUrl]);

  return state;
}
