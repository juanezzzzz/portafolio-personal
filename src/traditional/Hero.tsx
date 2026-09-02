import { ArrowDown, Download } from "lucide-react";
import { profile } from "../data/profile";
import { GithubIcon, LinkedinIcon } from "../data/brandIcons";

export function Hero() {
  return (
    <section
      id="inicio"
      className="flex min-h-full flex-col items-center justify-center px-5 py-16 text-center"
    >
      {/* Primera imagen visible en movil (LCP): se pide con prioridad en vez
          de diferirse. width/height evitan el salto de layout al cargar. */}
      <img
        src={profile.photoUrl}
        alt={profile.name}
        width={413}
        height={531}
        fetchPriority="high"
        decoding="async"
        className="h-28 w-28 rounded-full border-2 border-jos-amber-dim object-cover shadow-[0_0_0_6px_rgba(242,169,59,0.08)]"
      />

      <p className="mt-6 font-mono text-[13px] uppercase tracking-[0.2em] text-jos-cyan">
        {profile.status}
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-jos-text sm:text-4xl md:text-5xl">
        {profile.name}
      </h1>

      <p className="mx-auto mt-3 max-w-xl font-mono text-sm text-jos-text-dim sm:text-base">
        {profile.role}
      </p>

      <p className="mt-1 text-xs text-jos-text-dim">{profile.location}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={profile.cvUrl}
          download
          className="flex items-center gap-2 rounded-lg border border-jos-amber-dim bg-jos-amber/10 px-4 py-2.5 font-mono text-sm text-jos-amber transition-transform hover:scale-105"
        >
          <Download size={15} />
          Descargar CV
        </a>
        <a
          href="#contacto"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="rounded-lg border border-jos-border px-4 py-2.5 font-mono text-sm text-jos-text transition-colors hover:border-jos-cyan hover:text-jos-cyan"
        >
          Hablemos
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg border border-jos-border px-4 py-2.5 text-jos-text-dim transition-colors hover:text-jos-text"
          aria-label="GitHub"
        >
          <GithubIcon size={16} />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg border border-jos-border px-4 py-2.5 text-jos-text-dim transition-colors hover:text-jos-text"
          aria-label="LinkedIn"
        >
          <LinkedinIcon size={16} />
        </a>
      </div>

      <button
        onClick={() => document.getElementById("sobre-mi")?.scrollIntoView({ behavior: "smooth" })}
        className="mt-16 animate-bounce text-jos-text-dim transition-colors hover:text-jos-amber"
        aria-label="Bajar a la siguiente sección"
      >
        <ArrowDown size={20} />
      </button>
    </section>
  );
}
