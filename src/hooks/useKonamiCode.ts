import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonamiCode(onTrigger: () => void) {
  const posRef = useRef(0);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const expected = KONAMI[posRef.current];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        posRef.current += 1;
        if (posRef.current === KONAMI.length) {
          posRef.current = 0;
          onTrigger();
        }
      } else {
        posRef.current = key === KONAMI[0] ? 1 : 0;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onTrigger]);
}
