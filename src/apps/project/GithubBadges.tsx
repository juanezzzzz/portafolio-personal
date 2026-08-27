import type { useGithubRepoInfo } from "../../hooks/useGithubRepoInfo";

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "hoy";
  if (days === 1) return "hace 1 día";
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} mes${months > 1 ? "es" : ""}`;
  const years = Math.floor(months / 12);
  return `hace ${years} año${years > 1 ? "s" : ""}`;
}

/** Fila de badges con info en vivo de GitHub (estrellas, forks, ultimo
 * commit, ultimo release). Mientras carga muestra un skeleton chico; si el
 * fetch falla (offline, rate limit, repo privado) no muestra nada — no es
 * informacion critica para la pestaña, mejor omitirla que romper el layout. */
export function GithubBadges({ info }: { info: ReturnType<typeof useGithubRepoInfo> }) {
  if (info.status === "idle" || info.status === "error") return null;

  if (info.status === "loading") {
    return (
      <div className="mt-3 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-5 w-16 animate-pulse rounded-full border border-jos-border bg-jos-chrome-light" />
        ))}
      </div>
    );
  }

  const { data } = info;
  const lastCommitLabel = data.lastCommitDate
    ? relativeTime(data.lastCommitDate)
    : data.pushedAt
      ? relativeTime(data.pushedAt)
      : null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-jos-text-dim">
      <span title="Estrellas">⭐ {data.stars}</span>
      {data.forks > 0 && <span title="Forks">🔀 {data.forks}</span>}
      {lastCommitLabel &&
        (data.lastCommitUrl ? (
          <a
            href={data.lastCommitUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-jos-amber"
            title={data.lastCommitMessage ?? undefined}
          >
            🕓 último commit {lastCommitLabel}
          </a>
        ) : (
          <span>🕓 último commit {lastCommitLabel}</span>
        ))}
      {data.latestRelease && <span title="Última release">🏷️ {data.latestRelease}</span>}
    </div>
  );
}
