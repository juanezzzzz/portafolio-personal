import { type FormEvent, type ReactNode, useState } from "react";
import { profile } from "../data/profile";
import { GithubIcon, LinkedinIcon, InstagramIcon, WhatsappIcon } from "../data/brandIcons";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { soundManager } from "../lib/soundManager";

const ROWS: Array<[string, string, ReactNode]> = [
  ["Nombre", profile.name, null],
  ["Correo", profile.email, <Mail size={13} key="mail" />],
  ["Teléfono", profile.phone, <Phone size={13} key="phone" />],
  ["Ciudad", profile.location, <MapPin size={13} key="loc" />],
  ["Estado", profile.status, null],
];

const whatsappHref = `https://wa.me/${profile.phone.replace(/\D/g, "")}`;

const SOCIAL_LINKS = [
  { label: "GitHub", href: profile.github, icon: <GithubIcon size={14} /> },
  { label: "LinkedIn", href: profile.linkedin, icon: <LinkedinIcon size={14} /> },
  { label: "Instagram", href: profile.instagram, icon: <InstagramIcon size={14} /> },
  { label: "WhatsApp", href: whatsappHref, icon: <WhatsappIcon size={14} /> },
];

/** Portafolio 100% estatico, sin backend propio: "formulario funcional" aca
 * significa armar un mailto: con lo que el visitante escribio y abrir su
 * cliente de correo ya listo para enviar — no un envio silencioso desde el
 * servidor (no hay servidor). Se avisa explicitamente debajo del boton para
 * no prometer un envio que esta app no puede hacer por si sola. */
function buildMailto(name: string, email: string, message: string) {
  const subject = `Contacto desde JOS — ${name || "Visitante"}`;
  const bodyLines = [message, "", email ? `Responder a: ${email}` : null].filter(Boolean);
  const params = new URLSearchParams({ subject, body: bodyLines.join("\n") });
  return `mailto:${profile.email}?${params.toString()}`;
}

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    soundManager.click();
    window.location.href = buildMailto(name, email, message);
    setSent(true);
  }

  return (
    <div className="space-y-5 p-5">
      <div>
        <p className="mb-3 font-mono text-[11px] text-jos-text-dim">contact.txt</p>
        <div className="space-y-3 rounded-xl border border-jos-border/60 bg-jos-bg-deep p-4 font-mono text-[13px]">
          {ROWS.map(([label, value, icon]) => (
            <div key={label} className="flex items-start gap-2">
              {icon && <span className="mt-4 text-jos-text-dim">{icon}</span>}
              <div>
                <p className="text-jos-text-dim">{label}:</p>
                <p className="text-jos-text">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] text-jos-text-dim">redes</p>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-jos-border bg-jos-chrome/60 px-2.5 py-1.5 font-mono text-[11px] text-jos-text hover:border-jos-amber-dim hover:text-jos-amber"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-jos-cyan">
          Enviar un mensaje
        </p>
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            className="w-full rounded-lg border border-jos-border bg-jos-bg-deep px-2.5 py-2 font-mono text-[13px] text-jos-text placeholder:text-jos-text-dim/70 focus:border-jos-amber-dim focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo (para responderte)"
            className="w-full rounded-lg border border-jos-border bg-jos-bg-deep px-2.5 py-2 font-mono text-[13px] text-jos-text placeholder:text-jos-text-dim/70 focus:border-jos-amber-dim focus:outline-none"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tu mensaje"
            required
            rows={4}
            className="w-full resize-none rounded-lg border border-jos-border bg-jos-bg-deep px-2.5 py-2 font-mono text-[13px] text-jos-text placeholder:text-jos-text-dim/70 focus:border-jos-amber-dim focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border border-jos-amber-dim bg-jos-amber/10 px-3 py-1.5 font-mono text-[11px] text-jos-amber transition-[transform,box-shadow] duration-150 hover:scale-105 hover:jos-elevation-1"
          >
            <Send size={13} />
            Enviar por correo
          </button>
          <p className="text-[11px] text-jos-text-dim">
            {sent
              ? "Se abrió tu cliente de correo con el mensaje listo — solo falta darle enviar."
              : "Este sitio es estático: abre tu cliente de correo con el mensaje pre-armado, no lo envía un servidor."}
          </p>
        </form>
      </div>
    </div>
  );
}
