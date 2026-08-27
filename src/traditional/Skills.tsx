import { skillCategories } from "../data/profile";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="habilidades" className="mx-auto max-w-5xl px-5 py-24">
      <SectionHeading eyebrow="Stack" title="Habilidades técnicas" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((group) => (
          <div key={group.category} className="rounded-lg border border-jos-border bg-jos-chrome/40 p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-jos-amber">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-jos-border bg-jos-chrome px-2.5 py-1 font-mono text-[11px] text-jos-text"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
