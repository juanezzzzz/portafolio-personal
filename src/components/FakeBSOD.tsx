import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FakeBSOD({ onDone }: { onDone: () => void }) {
  const [joking, setJoking] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setJoking(true), 1000);
    const t2 = setTimeout(onDone, 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#1a3fc4] font-mono text-white">
      <AnimatePresence mode="wait">
        {!joking ? (
          <motion.div key="bsod" exit={{ opacity: 0 }} className="max-w-md text-sm">
            <p className="text-lg">:(</p>
            <p className="mt-4">
              JOS ha encontrado un problema y necesita reiniciarse. Estamos recopilando
              informacion del error.
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="joke"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl"
          >
            Just kidding 😄
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
