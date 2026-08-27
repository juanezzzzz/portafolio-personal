const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

export function CalendarWidget() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1);
  // lunes=0 ... domingo=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = now.toLocaleDateString("es-CO", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="mb-1.5 text-center font-mono text-[11px] capitalize text-jos-amber">{monthLabel}</div>
      <div className="grid grid-cols-7 gap-y-1 text-center font-mono text-[9px] text-jos-text-dim">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={
              day === today
                ? "mx-auto flex h-4 w-4 items-center justify-center rounded-full bg-jos-amber text-jos-bg-deep"
                : "text-jos-text"
            }
          >
            {day ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
