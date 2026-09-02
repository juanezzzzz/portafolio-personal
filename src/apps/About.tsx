import { Download } from "lucide-react";
import { profile } from "../data/profile";
import { soundManager } from "../lib/soundManager";

export function About() {
  return (
    <div className="space-y-5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            width={413}
            height={531}
            loading="lazy"
            decoding="async"
            className="h-14 w-14 shrink-0 rounded-full border border-jos-border object-cover"
          />
          <div>
            <h2 className="font-mono text-base text-jos-amber">{profile.name}</h2>
            <p className="text-xs text-jos-text-dim">{profile.role}</p>
          </div>
        </div>
        <a
          href={profile.cvUrl}
          download
          onClick={() => soundManager.click()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-jos-amber-dim bg-jos-amber/10 px-2.5 py-1.5 font-mono text-[11px] text-jos-amber transition-[transform,box-shadow] duration-150 hover:scale-105 hover:jos-elevation-1"
        >
          <Download size={13} />
          CV (PDF)
        </a>
      </div>

      <div className="space-y-2 text-[13px] leading-relaxed text-jos-text">
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] font-mono text-jos-text-dim">
        <span className="rounded-full border border-jos-border px-2 py-1">{profile.location}</span>
        <span className="rounded-full border border-jos-amber-dim px-2 py-1 text-jos-amber">
          {profile.status}
        </span>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
          Fortalezas
        </p>
        <ul className="space-y-1.5">
          {profile.highlights.map((h, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-jos-text">
              <span className="text-jos-amber">›</span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
          Objetivos
        </p>
        <ul className="space-y-1.5">
          {profile.objectives.map((o, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-jos-text">
              <span className="text-jos-amber">{i + 1}.</span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
          Tecnologías favoritas
        </p>
        <div className="flex flex-wrap gap-1.5">
          {profile.favoriteTech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-jos-amber-dim bg-jos-amber/10 px-2 py-1 font-mono text-[11px] text-jos-amber"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
          Idiomas
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.languages.map((l) => (
            <span
              key={l.name}
              className="rounded-full border border-jos-border bg-jos-chrome/60 px-2 py-1 font-mono text-[11px] text-jos-text"
            >
              {l.name} — {l.level}
            </span>
          ))}
        </div>
      </div>

      <p className="border-t border-jos-border pt-3 text-[12px] italic text-jos-text-dim">
        {profile.outsideOfCode}
      </p>
    </div>
  );
}
