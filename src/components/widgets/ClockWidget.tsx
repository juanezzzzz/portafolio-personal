import { useClock } from "../../hooks/useClock";

export function ClockWidget() {
  const { now } = useClock();
  const time = now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
  const seconds = now.toLocaleTimeString("es-CO", { second: "2-digit" }).padStart(2, "0");
  const date = now.toLocaleDateString("es-CO", { weekday: "long", day: "2-digit", month: "long" });

  return (
    <div className="text-center">
      <div className="font-mono text-3xl tabular-nums text-jos-amber">
        {time}
        <span className="text-base text-jos-text-dim">:{seconds}</span>
      </div>
      <div className="mt-1 font-mono text-[11px] capitalize text-jos-text-dim">{date}</div>
    </div>
  );
}
