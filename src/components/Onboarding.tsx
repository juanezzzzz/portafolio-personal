import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";

interface Tip {
  title: string;
  body: string;
}

// Se queda deliberadamente en 3 pasos: lo suficiente para cubrir los
// descubrimientos que mas se pierden (ventanas arrastrables/redimensionables,
// el buscador global) sin que se sienta como un tutorial largo que alguien
// quiera saltar de inmediato.
const TIPS: Tip[] = [
  {
    title: "Arrastra las ventanas",
    body: "Cada app se abre en su propia ventana. Arrástrala desde la barra de título para moverla, o desde la esquina inferior derecha para redimensionarla.",
  },
  {
    title: "Doble clic para maximizar",
    body: "Doble clic en la barra de título maximiza o restaura la ventana. También puedes minimizarla y seguirá abierta en la taskbar de abajo.",
  },
  {
    title: "Busca cualquier cosa al instante",
    body: "Presiona Ctrl/Cmd + K (o el ícono de lupa en la taskbar) para buscar apps, proyectos, skills o comandos de la terminal sin salir de donde estés.",
  },
];

export function Onboarding() {
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  // Pequena espera antes de aparecer: deja que el desktop termine su propia
  // animacion de entrada y evita competir con la notificacion de bienvenida
  // que se dispara en el mismo instante.
  useEffect(() => {
    if (onboardingDone) return;
    const t = setTimeout(() => setVisible(true), 1100);
    return () => clearTimeout(t);
  }, [onboardingDone]);

  if (onboardingDone) return null;

  function finish() {
    setVisible(false);
    setOnboardingDone(true);
  }

  const tip = TIPS[step];
  const isLast = step === TIPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="jos-elevation-3 jos-overlay-glass fixed bottom-20 left-1/2 z-[9998] w-[300px] -translate-x-1/2 border border-jos-amber-dim bg-jos-chrome p-4"
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="font-mono text-[13px] text-jos-amber">{tip.title}</p>
            <button
              onClick={finish}
              aria-label="Cerrar tour"
              className="text-jos-text-dim hover:text-jos-text"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-[12.5px] leading-relaxed text-jos-text">{tip.body}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1">
              {TIPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-4 ${i === step ? "bg-jos-amber" : "bg-jos-border"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {!isLast && (
                <button
                  onClick={finish}
                  className="font-mono text-[11px] text-jos-text-dim hover:text-jos-text"
                >
                  Saltar
                </button>
              )}
              <button
                onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
                className="border border-jos-amber-dim bg-jos-amber/10 px-2.5 py-1 font-mono text-[11px] text-jos-amber hover:bg-jos-amber/20"
              >
                {isLast ? "Entendido" : "Siguiente"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
