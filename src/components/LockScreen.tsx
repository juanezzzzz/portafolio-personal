import { motion } from "framer-motion";
import { useClock } from "../hooks/useClock";

interface LockScreenProps {
  onUnlock: () => void;
  isShutdown?: boolean;
}

export function LockScreen({ onUnlock, isShutdown }: LockScreenProps) {
  const { time, date } = useClock();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onUnlock}
      className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center bg-jos-bg-deep font-mono text-jos-text"
    >
      <p className="text-sm text-jos-text-dim">JOS</p>
      <p className="mt-4 text-6xl tabular-nums text-jos-amber">{time}</p>
      <p className="mt-1 text-sm text-jos-text-dim">{date}</p>
      <p className="mt-16 animate-pulse text-xs text-jos-text-dim">
        {isShutdown ? "Click to power on" : "Click to unlock"}
      </p>
    </motion.div>
  );
}
