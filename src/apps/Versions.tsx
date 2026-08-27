import { SYSTEM_VERSIONS, type VersionStatus } from "../data/versions";

const STATUS_META: Record<VersionStatus, { label: string; dot: string; text: string }> = {
  released: { label: "Instalada", dot: "bg-jos-cyan", text: "text-jos-cyan" },
  current: { label: "Version actual", dot: "bg-jos-amber", text: "text-jos-amber" },
  roadmap: { label: "En el roadmap", dot: "bg-jos-text-dim", text: "text-jos-text-dim" },
};

export function Versions() {
  return (
    <div className="space-y-5 p-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-jos-cyan">Historial de versiones</p>
        <p className="mt-1 text-[13px] leading-relaxed text-jos-text-dim">
          El progreso de Juan, contado como si fueran actualizaciones de este sistema operativo.
        </p>
      </div>

      <div className="space-y-4">
        {SYSTEM_VERSIONS.map((v) => {
          const meta = STATUS_META[v.status];
          const isRoadmap = v.status === "roadmap";
          return (
            <div
              key={v.version}
              className={`border-l-2 pl-4 ${
                v.status === "current"
                  ? "border-jos-amber"
                  : v.status === "released"
                    ? "border-jos-cyan/50"
                    : "border-jos-border border-dashed"
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-mono text-sm text-jos-text">{v.version}</span>
                <span className={`font-mono text-sm ${isRoadmap ? "text-jos-text-dim" : "text-jos-text"}`}>
                  {v.codename}
                </span>
                <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide">
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  <span className={meta.text}>{meta.label}</span>
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-jos-text-dim">{v.period}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-jos-text">{v.summary}</p>
              <ul className="mt-2 space-y-1">
                {v.changelog.map((line, i) => (
                  <li
                    key={i}
                    className={`flex gap-2 text-[12.5px] leading-relaxed ${
                      isRoadmap ? "text-jos-text-dim" : "text-jos-text"
                    }`}
                  >
                    <span className={isRoadmap ? "text-jos-text-dim" : "text-jos-amber"}>
                      {isRoadmap ? "·" : "›"}
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
