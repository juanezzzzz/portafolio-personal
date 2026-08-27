import type { AppDef, AppId } from "../store/windowStore";

export const APPS: Record<AppId, AppDef> = {
  projects: {
    id: "projects",
    title: "Projects",
    icon: "folder",
    defaultSize: { width: 640, height: 460 },
  },
  about: {
    id: "about",
    title: "About",
    icon: "user",
    defaultSize: { width: 520, height: 420 },
  },
  resume: {
    id: "resume",
    title: "Resume",
    icon: "file-text",
    defaultSize: { width: 640, height: 560 },
  },
  experience: {
    id: "experience",
    title: "Experience",
    icon: "briefcase",
    defaultSize: { width: 560, height: 440 },
  },
  education: {
    id: "education",
    title: "Education",
    icon: "cap",
    defaultSize: { width: 520, height: 400 },
  },
  skills: {
    id: "skills",
    title: "Skills",
    icon: "bolt",
    defaultSize: { width: 560, height: 440 },
  },
  stats: {
    id: "stats",
    title: "Stats",
    icon: "chart",
    defaultSize: { width: 600, height: 420 },
  },
  contact: {
    id: "contact",
    title: "Contact",
    icon: "mail",
    defaultSize: { width: 480, height: 640 },
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    defaultSize: { width: 640, height: 420 },
  },
  explorer: {
    id: "explorer",
    title: "Explorer",
    icon: "folder-tree",
    defaultSize: { width: 640, height: 460 },
  },
  settings: {
    id: "settings",
    title: "Settings",
    icon: "gear",
    defaultSize: { width: 480, height: 380 },
  },
  versions: {
    id: "versions",
    title: "Versions",
    icon: "layers",
    defaultSize: { width: 560, height: 480 },
  },
  site: {
    id: "site",
    title: "Portfolio Web",
    icon: "globe",
    defaultSize: { width: 760, height: 600 },
  },
};

export const DESKTOP_ICON_ORDER: AppId[] = [
  "projects",
  "about",
  "resume",
  "experience",
  "education",
  "skills",
  "stats",
  "contact",
  "terminal",
  "explorer",
  "site",
  "settings",
  "versions",
];

export const TASKBAR_QUICK_LAUNCH: AppId[] = ["explorer", "terminal"];
