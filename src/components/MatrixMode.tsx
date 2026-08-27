import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARS = "アイウエオカキクケコサシスセソタチツテト01".split("");
const DURATION_MS = 6000;

export function MatrixMode({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 15;
    let columns = 0;
    let drops: number[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      columns = Math.floor(canvas!.width / fontSize);
      drops = new Array(columns).fill(1);
    }
    resize();
    window.addEventListener("resize", resize);

    let frame: ReturnType<typeof setInterval>;
    frame = setInterval(() => {
      ctx.fillStyle = "rgba(10, 11, 16, 0.15)";
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = y < fontSize * 2 ? "#e8e6e1" : "#5eead4";
        ctx.fillText(char, x, y);

        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 40);

    const timeout = setTimeout(onDone, DURATION_MS);

    return () => {
      clearInterval(frame);
      clearTimeout(timeout);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key="matrix"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10001] cursor-pointer bg-jos-bg-deep"
        onClick={onDone}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[11px] text-jos-text-dim">
          click o espera para volver a JOS
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
