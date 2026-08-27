import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile, stats as staticStats } from "../data/profile";
import { useGithubProfileStats, type LanguageCount } from "../hooks/useGithubProfileStats";

/** Anima un numero desde su valor anterior hasta `value` — el pequeno detalle
 * que hace que un dato recien cargado se sienta "vivo" en vez de aparecer de
 * golpe. Arranca en 0 la primera vez (prevValue.current inicial). */
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value]);

  return <>{display}</>;
}

function StatCard({ label, value, index }: { label: string; value: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className="rounded-lg border border-jos-border bg-jos-chrome/60 p-4"
    >
      <p className="font-mono text-2xl text-jos-amber">
        <CountUp value={value} />
      </p>
      <p className="mt-1 text-[11px] text-jos-text-dim">{label}</p>
    </motion.div>
  );
}

function StatCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className="rounded-lg border border-jos-border bg-jos-chrome/60 p-4"
    >
      <div className="h-7 w-12 animate-pulse bg-jos-chrome-light" />
      <div className="mt-2 h-3 w-16 animate-pulse bg-jos-chrome-light" />
    </motion.div>
  );
}

/** Un solo hue (ambar) porque la identidad del lenguaje ya la lleva el
 * texto — el color aca solo codifica magnitud, no hace falta una paleta
 * categorica. */
function LanguageBars({ languages }: { languages: LanguageCount[] }) {
  const max = Math.max(...languages.map((l) => l.repoCount));
  return (
    <div className="space-y-2.5">
      {languages.map((lang, i) => (
        <div key={lang.name}>
          <div className="mb-1 flex items-baseline justify-between font-mono text-[11px]">
            <span className="text-jos-text">{lang.name}</span>
            <span className="text-jos-text-dim">
              {lang.repoCount} repo{lang.repoCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full border border-jos-border bg-jos-bg-deep">
            <motion.div
              className="h-full rounded-full bg-jos-amber"
              initial={{ width: 0 }}
              animate={{ width: `${(lang.repoCount / max) * 100}%` }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Stats() {
  const github = useGithubProfileStats(profile.github);
  const live = github.status === "ready" ? github.data : null;

  if (github.status === "idle" || github.status === "loading") {
    return (
      <div className="grid grid-cols-2 gap-3 p-5">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  // Sin conexion / rate limit de GitHub: se cae a las cifras de referencia
  // de profile.ts en vez de dejar la pantalla vacia — mismo patron de fallo
  // silencioso que useGithubRepoInfo, pero avisando que no son datos en vivo
  // (evita que un reclutador tome un numero desactualizado como real).
  const cards = live
    ? [
        { label: "Repositorios", value: live.publicRepos },
        { label: "Estrellas", value: live.totalStars },
        { label: "Lenguajes", value: live.totalLanguages },
        { label: "Años de experiencia", value: staticStats.experienceYears },
      ]
    : [
        { label: "Repositorios", value: staticStats.repositories },
        { label: "Commits", value: staticStats.commits },
        { label: "Lenguajes", value: staticStats.languages },
        { label: "Años de experiencia", value: staticStats.experienceYears },
      ];

  return (
    <div className="space-y-5 p-5">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((item, i) => (
          <StatCard key={item.label} label={item.label} value={item.value} index={i} />
        ))}
      </div>

      {live && live.topLanguages.length > 0 && (
        <div>
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
            Lenguajes principales
          </p>
          <LanguageBars languages={live.topLanguages} />
        </div>
      )}

      {!live && (
        <p className="border-t border-jos-border pt-3 text-[11px] italic text-jos-text-dim">
          No se pudo cargar github.com/{profile.github.split("/").pop()} en vivo — mostrando cifras de referencia.
        </p>
      )}
    </div>
  );
}
