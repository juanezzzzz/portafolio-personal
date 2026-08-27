// Heatmap decorativo estilo "contribuciones de GitHub". No llama a la API real
// de GitHub (evita depender de red/rate-limits en un sitio estatico); genera
// un patron pseudo-aleatorio pero deterministico (misma semilla = mismo dibujo
// en cada carga), a modo de guino visual.
const WEEKS = 12;
const DAYS = 7;

function seededLevel(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  const frac = x - Math.floor(x);
  if (frac > 0.88) return 3;
  if (frac > 0.7) return 2;
  if (frac > 0.45) return 1;
  return 0;
}

const LEVEL_OPACITY = ["opacity-15", "opacity-40", "opacity-70", "opacity-100"];

export function GithubActivityWidget() {
  const cells = Array.from({ length: WEEKS * DAYS }, (_, i) => seededLevel(i));

  return (
    <div>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateRows: `repeat(${DAYS}, 1fr)`, gridAutoFlow: "column", gridAutoColumns: "10px" }}
      >
        {cells.map((level, i) => (
          <div key={i} className={`h-2.5 w-2.5 bg-jos-amber ${LEVEL_OPACITY[level]}`} />
        ))}
      </div>
      <p className="mt-1.5 font-mono text-[9px] text-jos-text-dim">actividad reciente (ilustrativa)</p>
    </div>
  );
}
