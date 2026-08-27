import { profile } from "../data/profile";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto max-w-5xl px-5 py-24">
      <SectionHeading eyebrow="Sobre mí" title="Quién soy y hacia dónde voy" />

      <div className="grid gap-10 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          {profile.bio.map((p, i) => (
            <p key={i} className="leading-relaxed text-jos-text-dim">
              {p}
            </p>
          ))}
          <p className="border-l-2 border-jos-amber-dim pl-4 text-sm italic text-jos-text-dim">
            {profile.outsideOfCode}
          </p>
        </div>

        <div className="space-y-6 md:col-span-2">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
              Objetivos
            </p>
            <ul className="space-y-2">
              {profile.objectives.map((o, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-jos-text">
                  <span className="shrink-0 text-jos-amber">{i + 1}.</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
              Tecnologías favoritas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.favoriteTech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-jos-amber-dim bg-jos-amber/10 px-2.5 py-1 font-mono text-[11px] text-jos-amber"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
              Idiomas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.languages.map((l) => (
                <span
                  key={l.name}
                  className="rounded-full border border-jos-border bg-jos-chrome/60 px-2.5 py-1 font-mono text-[11px] text-jos-text"
                >
                  {l.name} — {l.level}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
          Fortalezas
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.highlights.map((h, i) => (
            <div
              key={i}
              className="flex gap-2.5 rounded-lg border border-jos-border bg-jos-chrome/40 p-3 text-sm text-jos-text"
            >
              <span className="shrink-0 text-jos-amber">›</span>
              {h}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
