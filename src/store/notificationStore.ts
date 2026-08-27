import { create } from "zustand";

export type NotificationKind = "info" | "achievement" | "error";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  time: number; // Date.now()
  read: boolean;
}

interface NotificationState {
  notifications: SystemNotification[];
  push: (n: Omit<SystemNotification, "id" | "time" | "read">) => void;
  markAllRead: () => void;
  clear: () => void;
}

// evita empujar el mismo logro dos veces en la misma sesion (ej. abrir la
// misma app varias veces no debe llenar el centro de notificaciones)
const seenAchievementTitles = new Set<string>();

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  push: (n) =>
    set((state) => {
      if (n.kind === "achievement") {
        if (seenAchievementTitles.has(n.title)) return state;
        seenAchievementTitles.add(n.title);
      }
      const entry: SystemNotification = {
        ...n,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        time: Date.now(),
        read: false,
      };
      // mantiene un historial acotado
      const notifications = [entry, ...state.notifications].slice(0, 30);
      return { notifications };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  clear: () => set({ notifications: [] }),
}));
