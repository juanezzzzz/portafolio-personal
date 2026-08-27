import { useSettingsStore } from "../store/settingsStore";

// Sonidos del sistema generados con Web Audio API (osciladores), sin depender
// de archivos .mp3/.wav externos. Encaja con la estetica "terminal" del
// sistema: blips cortos en vez de samples grabados.
//
// El chequeo de soundEnabled vive ADENTRO de este modulo (no en cada punto de
// llamada): asi ningun caller puede olvidarse de envolver la llamada con un
// "if (soundEnabled)" y quedar sonando cuando el usuario lo desactivo.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    // Politicas de autoplay del navegador u otro bloqueo: fallamos en silencio.
    return null;
  }
}

interface Tone {
  freq: number;
  start: number; // segundos desde ahora
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function playTones(tones: Tone[]) {
  if (!useSettingsStore.getState().soundEnabled) return;

  try {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    for (const t of tones) {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = t.type ?? "square";
      osc.frequency.value = t.freq;

      const peak = t.gain ?? 0.05;
      const startAt = now + t.start;
      const endAt = startAt + t.duration;

      gainNode.gain.setValueAtTime(0, startAt);
      gainNode.gain.linearRampToValueAtTime(peak, startAt + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(startAt);
      osc.stop(endAt + 0.02);
    }
  } catch {
    // Cualquier fallo de Web Audio no debe romper la interaccion del usuario.
  }
}

export const soundManager = {
  open: () => playTones([{ freq: 520, start: 0, duration: 0.07 }, { freq: 780, start: 0.05, duration: 0.09 }]),
  close: () => playTones([{ freq: 620, start: 0, duration: 0.07 }, { freq: 340, start: 0.05, duration: 0.09 }]),
  click: () => playTones([{ freq: 900, start: 0, duration: 0.03, gain: 0.03 }]),
  minimize: () => playTones([{ freq: 500, start: 0, duration: 0.05 }, { freq: 300, start: 0.04, duration: 0.06 }]),
  restore: () => playTones([{ freq: 300, start: 0, duration: 0.05 }, { freq: 500, start: 0.04, duration: 0.06 }]),
  maximize: () => playTones([{ freq: 440, start: 0, duration: 0.04 }, { freq: 660, start: 0.03, duration: 0.07 }]),
  error: () =>
    playTones([
      { freq: 180, start: 0, duration: 0.14, type: "sawtooth", gain: 0.06 },
      { freq: 140, start: 0.12, duration: 0.18, type: "sawtooth", gain: 0.06 },
    ]),
  notify: () =>
    playTones([
      { freq: 1046, start: 0, duration: 0.08, gain: 0.04 },
      { freq: 1318, start: 0.09, duration: 0.1, gain: 0.04 },
    ]),
  boot: () =>
    playTones([
      { freq: 220, start: 0, duration: 0.12 },
      { freq: 330, start: 0.1, duration: 0.12 },
      { freq: 440, start: 0.2, duration: 0.18 },
    ]),
  shutdown: () =>
    playTones([
      { freq: 440, start: 0, duration: 0.12 },
      { freq: 330, start: 0.1, duration: 0.12 },
      { freq: 220, start: 0.2, duration: 0.2 },
    ]),
  unlock: () => playTones([{ freq: 660, start: 0, duration: 0.06 }, { freq: 990, start: 0.05, duration: 0.08 }]),
  /** arpegio corto y en loop opcional, usado por el widget de musica */
  blip: (freq: number) => playTones([{ freq, start: 0, duration: 0.12, gain: 0.035 }]),
};

export type SoundManager = typeof soundManager;
