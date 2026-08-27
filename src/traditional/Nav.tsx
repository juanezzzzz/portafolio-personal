import { useEffect, useState, type RefObject } from "react";
import { Download, Menu, X } from "lucide-react";
import { profile } from "../data/profile";

const SECTIONS = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "experiencia", label: "Experiencia" },
  { id: "proyectos", label: "Proyectos" },
  { id: "habilidades", label: "Habilidades" },
  { id: "contacto", label: "Contacto" },
];

interface NavProps {
  /** Esta app vive embebida dentro de una ventana de JOS (ver BrowserApp.tsx):
   * lo que realmente scrollea es el div interno de la ventana, no el
   * `window`/`document` del navegador real (el body de JOS tiene
   * `overflow: hidden`). Sin este ref, `window.scrollY` nunca cambiaria y el
   * IntersectionObserver mediria contra el viewport completo en vez del
   * area visible de la ventana. */
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

export function Nav({ scrollContainerRef }: NavProps) {
  const [active, setActive] = useState("inicio");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    function onScroll() {
      setScrolled(container!.scrollTop > 8);
    }
    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { root: scrollContainerRef.current, rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [scrollContainerRef]);

  function goTo(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header
      className={`sticky inset-x-0 top-0 z-20 transition-[background-color,box-shadow] duration-300 ${
        scrolled ? "bg-jos-bg-deep/90 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <button
          onClick={() => goTo("inicio")}
          className="font-mono text-sm font-semibold tracking-tight text-jos-amber"
        >
          JEV<span className="text-jos-text-dim">.dev</span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => goTo(s.id)}
                className={`rounded px-3 py-2 font-mono text-[13px] transition-colors ${
                  active === s.id
                    ? "text-jos-amber"
                    : "text-jos-text-dim hover:text-jos-text"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <a
          href={profile.cvUrl}
          download
          className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-jos-amber-dim bg-jos-amber/10 px-3 py-1.5 font-mono text-[12px] text-jos-amber transition-transform hover:scale-105 md:flex"
        >
          <Download size={13} />
          CV
        </a>

        <button
          className="text-jos-text md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-jos-border bg-jos-bg-deep px-5 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => goTo(s.id)}
                  className={`block w-full rounded px-2 py-2.5 text-left font-mono text-sm ${
                    active === s.id ? "text-jos-amber" : "text-jos-text-dim"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
            <li>
              <a
                href={profile.cvUrl}
                download
                className="mt-1 flex items-center gap-1.5 rounded-lg border border-jos-amber-dim bg-jos-amber/10 px-3 py-2 font-mono text-[12px] text-jos-amber"
              >
                <Download size={13} />
                Descargar CV
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
