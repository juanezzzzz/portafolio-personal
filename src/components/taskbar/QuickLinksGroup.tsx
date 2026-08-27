import { FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../../data/brandIcons";
import { profile } from "../../data/profile";
import { useWindowStore } from "../../store/windowStore";
import { APPS } from "../../data/apps";

export function QuickLinksGroup() {
  const openApp = useWindowStore((s) => s.openApp);

  return (
    <div className="hidden h-8 items-center gap-0.5 rounded-xl border border-jos-border/40 bg-jos-bg-deep/40 px-1 sm:flex">
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        className="flex h-[26px] items-center px-2 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-amber"
        aria-label="GitHub"
      >
        <GithubIcon size={15} />
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noreferrer"
        className="flex h-[26px] items-center px-2 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-amber"
        aria-label="LinkedIn"
      >
        <LinkedinIcon size={15} />
      </a>
      <a
        href={profile.instagram}
        target="_blank"
        rel="noreferrer"
        className="flex h-[26px] items-center px-2 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-amber"
        aria-label="Instagram"
      >
        <InstagramIcon size={15} />
      </a>
      <button
        onClick={() => openApp(APPS.resume)}
        className="flex h-[26px] items-center px-2 text-jos-text-dim transition-[transform,box-shadow,color] duration-150 hover:scale-105 hover:jos-elevation-1 hover:text-jos-amber"
        aria-label="CV"
      >
        <FileText size={15} />
      </button>
    </div>
  );
}
