import { skillCategories } from "../data/profile";

export function Skills() {
  return (
    <div className="space-y-5 p-5">
      {skillCategories.map((group) => (
        <div key={group.category}>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-amber">
            {group.category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-jos-border bg-jos-chrome/60 px-2 py-1 font-mono text-[11px] text-jos-text"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
