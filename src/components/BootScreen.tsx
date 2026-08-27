import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onDone: () => void;
}

export function BootScreen({ onDone }: BootScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.round(6 + Math.random() * 10));
        if (next >= 100) {
          clearInterval(id);
          setTimeout(onDone, 350);
        }
        return next;
      });
    }, 140);
    return () => clearInterval(id);
  }, [onDone]);

  const filled = Math.round(progress / 5);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-jos-bg-deep font-mono text-jos-text"
    >
      <motion.h1
        initial={{ opacity: 0, letterSpacing: "0.4em" }}
        animate={{ opacity: 1, letterSpacing: "0.15em" }}
        transition={{ duration: 0.8 }}
        className="text-4xl text-jos-amber"
      >
        JOS
      </motion.h1>
      <p className="mt-2 text-xs text-jos-text-dim">Juan Operating System</p>
      <p className="mt-8 text-xs text-jos-text-dim">Loading Portfolio...</p>
      <div className="mt-2 font-mono text-sm text-jos-amber">
        {"█".repeat(filled)}
        <span className="text-jos-border">{"░".repeat(20 - filled)}</span>
        <span className="ml-2 text-jos-text-dim">{progress}%</span>
      </div>
    </motion.div>
  );
}
