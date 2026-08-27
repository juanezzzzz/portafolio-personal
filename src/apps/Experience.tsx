import { experience } from "../data/profile";

export function Experience() {
  return (
    <div className="space-y-4 p-5">
      {experience.map((e, i) => (
        <div key={i} className="border-l-2 border-jos-amber-dim pl-4">
          <p className="font-mono text-sm text-jos-text">{e.role}</p>
          <p className="text-xs text-jos-amber">{e.org}</p>
          <p className="mt-0.5 font-mono text-[11px] text-jos-text-dim">{e.period}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-jos-text">{e.description}</p>

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
                  className="rounded-full border border-jos-border bg-jos-chrome/60 px-2 py-1 font-mono text-[11px] text-jos-text"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
