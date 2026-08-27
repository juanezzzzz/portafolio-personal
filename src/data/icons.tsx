import {
  Folder,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  BarChart3,
  Mail,
  Terminal as TerminalIcon,
  FolderTree,
  Settings as SettingsIcon,
  AppWindow,
  Layers,
  Globe,
} from "lucide-react";
import type { AppId } from "../store/windowStore";
import type { ComponentType } from "react";

export const APP_ICON_COMPONENTS: Record<AppId, ComponentType<{ size?: number; className?: string }>> = {
  projects: Folder,
  about: User,
  resume: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Zap,
  stats: BarChart3,
  contact: Mail,
  terminal: TerminalIcon,
  explorer: FolderTree,
  settings: SettingsIcon,
  versions: Layers,
  site: Globe,
};

/** Las ventanas de proyecto usan ids dinamicos ("project:<id>") que no
 * estan precargados en APP_ICON_COMPONENTS, asi que una indexacion directa
 * devuelve undefined en runtime aunque el tipo diga lo contrario. Usar esta
 * funcion en vez de indexar el mapa a mano en cualquier lugar donde el
 * appId pueda venir de una ventana abierta (no de DESKTOP_ICON_ORDER/APPS). */
export function getAppIconComponent(appId: AppId): ComponentType<{ size?: number; className?: string }> {
  return APP_ICON_COMPONENTS[appId] ?? AppWindow;
}
