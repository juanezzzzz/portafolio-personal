import { useEffect, useRef, useState } from "react";

// Uso de CPU/memoria simulado (no hay backend real que medir en un portafolio
// estatico) — se documenta explicitamente como simulado, igual que lo describe
// JOS_PROYECTO.md seccion 9.
function randomWalk(prev: number, min: number, max: number) {
  const next = prev + (Math.random() - 0.5) * 14;
  return Math.min(max, Math.max(min, next));
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] text-jos-text-dim">
        <span>{label}</span>
        <span className="text-jos-text">{value.toFixed(0)}%</span>
      </div>
      <div className="mt-0.5 h-1.5 w-full bg-jos-bg-deep">
        <div className="h-full bg-jos-amber transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function StatsWidget() {
  const [cpu, setCpu] = useState(28);
  const [ram, setRam] = useState(44);
  const bootTime = useRef(Date.now());
  const [uptime, setUptime] = useState("00:00:00");

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((v) => randomWalk(v, 8, 92));
      setRam((v) => randomWalk(v, 20, 85));
      const diff = Math.floor((Date.now() - bootTime.current) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2">
      <Bar label="CPU" value={cpu} />
      <Bar label="MEM" value={ram} />
      <div className="flex justify-between font-mono text-[10px] text-jos-text-dim">
        <span>UPTIME</span>
        <span className="tabular-nums text-jos-text">{uptime}</span>
      </div>
    </div>
  );
}
