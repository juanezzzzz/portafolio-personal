import { Mail, MessageCircle } from "lucide-react";
import { profile } from "../data/profile";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../data/brandIcons";
import { SectionHeading } from "./SectionHeading";

// wa.me necesita solo dígitos (con código de país, sin +, espacios ni guiones)
const whatsappNumber = profile.phone.replace(/\D/g, "");

const LINKS = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <Mail size={18} />,
  },
  {
    label: "WhatsApp",
    value: profile.phone,
    href: `https://wa.me/${whatsappNumber}`,
    icon: <MessageCircle size={18} />,
  },
  {
    label: "GitHub",
    value: profile.github.replace("https://", ""),
    href: profile.github,
    icon: <GithubIcon size={17} />,
  },
  {
    label: "LinkedIn",
    value: profile.linkedin.replace("https://", ""),
    href: profile.linkedin,
    icon: <LinkedinIcon size={17} />,
  },
  {
    label: "Instagram",
    value: profile.instagram.replace("https://", ""),
    href: profile.instagram,
    icon: <InstagramIcon size={17} />,
  },
];

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-5xl px-5 py-24">
      <SectionHeading eyebrow="Contacto" title="Hablemos" />

      <p className="max-w-xl leading-relaxed text-jos-text-dim">
        {profile.status}. Si tienes una oportunidad, un proyecto o simplemente quieres saludar,
        cualquiera de estos canales me llega directo.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel={l.href.startsWith("http") ? "noreferrer" : undefined}
            className="flex items-center gap-3 rounded-lg border border-jos-border bg-jos-chrome/40 p-4 transition-colors hover:border-jos-amber-dim/60 hover:bg-jos-chrome/70"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-jos-border text-jos-amber">
              {l.icon}
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[11px] uppercase tracking-wide text-jos-text-dim">
                {l.label}
              </span>
              <span className="block truncate text-sm text-jos-text">{l.value}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
