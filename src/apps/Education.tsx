import { education, certifications } from "../data/profile";

export function Education() {
  return (
    <div className="space-y-6 p-5">
      <div className="space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
          Formación académica
        </p>
        {education.map((e, i) => (
          <div key={i} className="border-l-2 border-jos-cyan/50 pl-4">
            <p className="font-mono text-sm text-jos-text">{e.title}</p>
            <p className="text-xs text-jos-cyan">{e.org}</p>
            <p className="mt-0.5 font-mono text-[11px] text-jos-text-dim">{e.period}</p>
            {e.description && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-jos-text">{e.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-wide text-jos-amber">
          Certificaciones y cursos
        </p>
        {certifications.map((c, i) => (
          <div key={i} className="border-l-2 border-jos-amber-dim pl-4">
            <p className="font-mono text-[13px] text-jos-text">{c.title}</p>
            <p className="text-[11px] text-jos-amber">{c.org}</p>
            <p className="mt-0.5 font-mono text-[11px] text-jos-text-dim">
              {c.period} · {c.hours}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
