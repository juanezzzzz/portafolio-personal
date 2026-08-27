import { useEffect, useState } from "react";

export interface LanguageCount {
  name: string;
  repoCount: number;
}

export interface GithubProfileStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  /** Cantidad de lenguajes distintos entre los repos propios (no forks). */
  totalLanguages: number;
  /** Top 5 por cantidad de repos, para el desglose visual. */
  topLanguages: LanguageCount[];
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: GithubProfileStats };

// Mismo patron que useGithubRepoInfo.ts: cache en memoria por sesion (no
// localStorage), silencioso ante error/rate limit — el llamador decide el
// fallback (los numeros estaticos de profile.ts).
const cache = new Map<string, GithubProfileStats>();

function parseUsername(githubUrl?: string): string | null {
  if (!githubUrl) return null;
  const match = githubUrl.match(/github\.com\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

interface RepoSummary {
  stargazers_count?: number;
  language?: string | null;
  fork?: boolean;
}

/** Estrellas, repos y lenguajes reales del perfil de GitHub (no de un solo
 * repo), via la API publica sin autenticar: GET /users/{u} + /users/{u}/repos.
 * Los forks no cuentan para estrellas/lenguajes — representan trabajo propio,
 * no una copia de otro repo. */
export function useGithubProfileStats(githubUrl?: string): State {
  const username = parseUsername(githubUrl);
  const [state, setState] = useState<State>(() =>
    username && cache.has(username) ? { status: "ready", data: cache.get(username)! } : { status: "idle" }
  );

  useEffect(() => {
    if (!username) {
      setState({ status: "idle" });
      return;
    }
    if (cache.has(username)) {
      setState({ status: "ready", data: cache.get(username)! });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    Promise.allSettled([
      fetch(`https://api.github.com/users/${username}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`).then((r) =>
        r.ok ? r.json() : null
      ),
    ]).then(([userRes, reposRes]) => {
      if (cancelled) return;

      const userData = userRes.status === "fulfilled" ? userRes.value : null;
      const repos: RepoSummary[] =
        reposRes.status === "fulfilled" && Array.isArray(reposRes.value) ? reposRes.value : [];

      if (!userData) {
        setState({ status: "error" });
        return;
      }

      const owned = repos.filter((r) => !r.fork);
      const totalStars = owned.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

      const languageTally = new Map<string, number>();
      for (const r of owned) {
        if (!r.language) continue;
        languageTally.set(r.language, (languageTally.get(r.language) ?? 0) + 1);
      }
      const topLanguages = [...languageTally.entries()]
        .map(([name, repoCount]) => ({ name, repoCount }))
        .sort((a, b) => b.repoCount - a.repoCount)
        .slice(0, 5);

      const data: GithubProfileStats = {
        publicRepos: userData.public_repos ?? owned.length,
        followers: userData.followers ?? 0,
        totalStars,
        totalLanguages: languageTally.size,
        topLanguages,
      };

      cache.set(username, data);
      setState({ status: "ready", data });
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return state;
}
