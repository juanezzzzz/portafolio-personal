import { certifications, education, experience } from "../data/profile";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section id="experiencia" className="mx-auto max-w-5xl px-5 py-24">
      <SectionHeading eyebrow="Trayectoria" title="Experiencia y formación" />

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-jos-amber">
            Experiencia
          </p>
          <div className="space-y-6">
            {experience.map((e, i) => (
              <div key={i} className="border-l-2 border-jos-amber-dim pl-4">
                <p className="font-mono text-sm text-jos-text">{e.role}</p>
                <p className="text-xs text-jos-amber">{e.org}</p>
                <p className="mt-0.5 font-mono text-[11px] text-jos-text-dim">{e.period}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-jos-text-dim">
                  {e.description}
                </p>

                {e.achievements && e.achievements.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {e.achievements.map((a, j) => (
                      <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-jos-text-dim">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-jos-cyan" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {e.tech && e.tech.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-jos-border bg-jos-chrome/60 px-2.5 py-1 font-mono text-[11px] text-jos-text"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
            Educación
          </p>
          <div className="space-y-6">
            {education.map((e, i) => (
              <div key={i} className="border-l-2 border-jos-cyan/50 pl-4">
                <p className="font-mono text-sm text-jos-text">{e.title}</p>
                <p className="text-xs text-jos-cyan">{e.org}</p>
                <p className="mt-0.5 font-mono text-[11px] text-jos-text-dim">{e.period}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-jos-text-dim">
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-jos-amber">
          Certificaciones
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <div key={i} className="rounded-lg border border-jos-border bg-jos-chrome/40 p-3.5">
              <p className="text-[13px] leading-snug text-jos-text">{c.title}</p>
              <p className="mt-1.5 text-[11px] text-jos-text-dim">{c.org}</p>
              <p className="mt-1 font-mono text-[10.5px] text-jos-amber">
                {c.period} · {c.hours}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
