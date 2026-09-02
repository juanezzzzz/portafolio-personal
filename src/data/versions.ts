export type VersionStatus = "released" | "current" | "roadmap";

export interface SystemVersion {
  version: string;
  codename: string;
  period: string;
  status: VersionStatus;
  summary: string;
  changelog: string[];
}

// Historial de versiones de JOS, narrado como si fueran actualizaciones de
// un sistema operativo — pero cada entrada de "released"/"current" mapea a
// hechos reales ya documentados en profile.ts/education/certifications (no
// se inventa nada nuevo aca, solo se re-narra en formato "changelog"). Las
// entradas "roadmap" son metas a futuro, marcadas explicitamente como tal.
export const SYSTEM_VERSIONS: SystemVersion[] = [
  {
    version: "v1.0",
    codename: "Estudiante ADSO",
    period: "2023 — 2024",
    status: "released",
    summary: "Arranque de la formación técnica: primeros pasos en programación y cierre del bachillerato técnico.",
    changelog: [
      "Inicio del curso de inglés (Instituto Open Mind, nivel A2–B1)",
      "Ingreso a la Tecnología en Análisis y Desarrollo de Software — SENA (ficha 3237831)",
      "Graduación como Bachiller Técnico en Agroindustria Alimentaria (dic. 2024)",
    ],
  },
  {
    version: "v2.0",
    codename: "Monitor SENA",
    period: "2025 — actualidad",
    status: "current",
    summary:
      "Versión actualmente en ejecución. De estudiante a monitor: primeros proyectos end-to-end propios y responsabilidad real dentro del área de SST.",
    changelog: [
      "Rol de Monitor SST (Seguridad y Salud en el Trabajo) — SENA CAFEC Casanare",
      "Diseño, construcción y presentación de \"Zona Segura\" (plataforma de capacitación gamificada)",
      "5 proyectos end-to-end desplegados de forma independiente: APIs en Go, Django y NestJS + frontends en React",
      "Construcción de este mismo sistema — JOS, portafolio interactivo estilo escritorio",
      "Certificación: Automatización de Chatbots con IA — SENA (nov. 2025)",
      "Certificación: Acelerador de Carrera con Power BI + IA — Daxus Latam (abr. 2026)",
      "Certificación: Marketing Digital a través de Redes Sociales — MinTIC (may. 2026)",
      "Certificación: Implementación de Servicios de Computación en la Nube — SENA (ago. 2026)",
      "Representante regional (Orinoquía) en la ceremonia nacional de clausura de Social Tech (2026)",
      "🥇 Primer lugar en la Hackathon Regional Casanare (Colombia 5.0) con AgroIA Casanare — equipo Control-Z (ago. 2026)",
    ],
  },
  {
    version: "v3.0",
    codename: "Primer empleo",
    period: "Próximamente",
    status: "roadmap",
    summary: "Salto del portafolio personal a un equipo de desarrollo real.",
    changelog: [
      "Primer rol junior/trainee como desarrollador fullstack",
      "Primer proyecto en producción con usuarios reales fuera del entorno académico",
      "Primer código propio en un repositorio de equipo (revisiones, CI, convenciones compartidas)",
    ],
  },
  {
    version: "v4.0",
    codename: "Nuevas certificaciones",
    period: "Próximamente",
    status: "roadmap",
    summary: "Profundizar el stack técnico más allá de lo cubierto en el tecnólogo.",
    changelog: [
      "Certificación en una nube específica (AWS/Azure/GCP) sobre la base ya cursada en el SENA",
      "Cierre del nivel de inglés a B2/C1",
      "Especialización en un framework o área elegida según el rumbo del primer empleo",
    ],
  },
  {
    version: "v5.0",
    codename: "Metas futuras",
    period: "Próximamente",
    status: "roadmap",
    summary: "Horizonte largo — a dónde apunta todo lo anterior.",
    changelog: [
      "Título como Tecnólogo en Análisis y Desarrollo de Software (SENA)",
      "Consolidación como desarrollador fullstack con experiencia en producción",
      "Contribuciones propias a proyectos open source",
    ],
  },
];
