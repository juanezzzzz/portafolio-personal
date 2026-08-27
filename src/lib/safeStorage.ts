import type { StateStorage } from "zustand/middleware";

// Wrapper sobre localStorage que nunca lanza. Si el navegador esta en modo
// privado, bloquea el storage, o el valor guardado excede la cuota (posible
// con wallpapers custom guardados como data URL), el store que lo usa
// simplemente no persiste entre sesiones en vez de romper la app.
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Cuota excedida o storage no disponible: seguimos solo en memoria.
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* noop */
    }
  },
};
