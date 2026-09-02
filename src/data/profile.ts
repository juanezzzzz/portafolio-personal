// Edita este archivo con tus datos reales.
// Es la unica fuente de verdad que consumen About, Contact, Explorer y la Terminal.

import { asset } from "../lib/asset";

export const profile = {
  name: "Juan Esteban Valencia Arredondo",
  role: "Desarrollador Backend / Full Stack Junior · Estudiante ADSO (SENA)",
  location: "Yopal, Casanare, Colombia",
  status: "Disponible para roles junior y colaboración",
  email: "juanestebanvalencia.dev@gmail.com",
  phone: "+57 310 467 8335",
  github: "https://github.com/juanezzzzz",
  linkedin: "https://linkedin.com/in/juanestebanvalenciadev",
  instagram: "https://www.instagram.com/_juanezzzzz/",
  /** PDF real (convertido del .docx fuente), servido como asset estatico
   * desde /public/cv — no se genera en el cliente para evitar reconstruir
   * el layout con jsPDF/etc., que nunca queda identico al Word original. */
  cvUrl: asset("/cv/CV_JuanEstebanValencia.pdf"),
  /** Foto de perfil para About — recorte cuadrado, se muestra circular. */
  photoUrl: asset("/profile/juan.jpg"),
  bio: [
    "Estudiante de Análisis y Desarrollo de Software del SENA con experiencia construyendo y desplegando software utilizado por usuarios reales.",
    "Primer lugar en la Hackathon Regional Casanare (Colombia 5.0 — MinTIC, TEVEANDINA S.A.S. y Universidad Distrital) con AgroIA Casanare, un sistema de agentes de Inteligencia Artificial para comercialización agrícola, desarrollado en equipo.",
    "He construido y desplegado APIs REST y microservicios en Python (FastAPI, Django), Go y NestJS, y aplicaciones frontend en Angular, React y Next.js — de forma individual y en equipos que aplican Git Flow, sprints semanales y diseño previo en Figma.",
  ],
  /** Fortalezas / core competencies del CV, para mostrar como chips en About. */
  highlights: [
    "1.er lugar en la Hackathon Regional Casanare (Colombia 5.0) con un sistema de agentes de IA",
    "Desarrollo fullstack: de UI (Figma) a despliegue (Vercel)",
    "Diseño de APIs REST en múltiples stacks (Go, Python/FastAPI y Django, TypeScript/NestJS)",
    "Adopción rápida y autónoma de nuevas tecnologías",
    "Pensamiento analítico y resolución práctica de problemas",
    "Atención al detalle y compromiso con la calidad de código",
    "Trabajo en equipo y liderazgo certificado",
  ],
  /** Hacia dónde va, no solo qué ha hecho — le da dirección a About. */
  objectives: [
    "Consolidarme como desarrollador Backend/Full Stack, construyendo aplicaciones escalables, mantenibles y orientadas a resolver problemas reales.",
    "Profundizar en arquitectura de software, APIs, la nube y DevOps, llevando mis proyectos desde el desarrollo hasta despliegues profesionales.",
    "Participar en equipos de desarrollo reales, aprendiendo buenas prácticas de ingeniería y aportando soluciones funcionales desde el inicio.",
  ],
  /** Un subconjunto curado del stack completo (ver Skills), no la lista entera. */
  favoriteTech: ["Python", "FastAPI", "TypeScript", "PostgreSQL"],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "B1 — en formación hacia B2 (Instituto Open Mind)" },
  ],
  /** Detalle personal del README — le da un toque humano a About, no solo curricular. */
  outsideOfCode: "Fuera del código: siempre aprendiendo algo nuevo, viendo series y jugando.",
};

export const experience = [
  {
    role: "Monitor SST (Seguridad y Salud en el Trabajo)",
    org: "SENA CAFEC · Yopal, Casanare",
    period: "Junio 2026 — actualidad",
    description:
      "Apoyo técnico (soporte TI) a la unidad de Seguridad y Salud en el Trabajo de SENA CAFEC Casanare, y desarrollo de herramientas interactivas de capacitación. Rol que exigió y certificó habilidades de liderazgo y trabajo en equipo.",
    achievements: [
      "Brindé soporte TI a la unidad de SST: conectividad, WiFi, impresoras y herramientas TIC, con atención directa a usuarios y personal del área.",
      "Diseñé, construí y presenté 'Zona Segura', una plataforma web de capacitación gamificada de 3 módulos (juego de SST de 4 rondas, entrenador de ejercicios vocales con detección de voz y respiración guiada) usada por aprendices del SENA.",
      "Realicé presentaciones y demostraciones en vivo de la herramienta ante personal y aprendices, promoviendo el aprendizaje participativo en temas de SST.",
      "Certifiqué habilidades de liderazgo y trabajo en equipo como parte de las funciones del rol.",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Web Audio API", "GSAP"],
  },
];

export const education = [
  {
    title: "Tecnólogo en Análisis y Desarrollo de Software",
    org: "SENA · Colombia",
    period: "2024 — actualidad",
    description:
      "Estudiante activo (ficha 3237831) — cursa análisis de software, diseño de bases de datos relacionales, desarrollo web y fundamentos de ingeniería de software.",
  },
  {
    title: "Técnico en Agroindustria Alimentaria",
    org: "I.E. Juan José Rondón · Paz de Ariporo, Casanare",
    period: "2024",
    description: "Graduado con diploma de Bachiller Técnico (5 de diciembre de 2024).",
  },
  {
    title: "Inglés — Nivel A2–B1",
    org: "Instituto Open Mind · Paz de Ariporo (virtual)",
    period: "2023 — actualidad",
    description: "Formación continua enfocada en comunicación técnica y profesional en inglés.",
  },
];

export const certifications = [
  {
    title: "Implementación de Servicios de Computación en la Nube",
    org: "SENA · Formación complementaria virtual",
    period: "Jul–Ago 2026",
    hours: "Certificado",
  },
  {
    title: "Marketing Digital a través de Redes Sociales",
    org: "MinTIC & Universidad Distrital Francisco José de Caldas",
    period: "May 2026",
    hours: "48 horas",
  },
  {
    title: "Acelerador de Carrera con Power BI + IA",
    org: "Daxus Latam",
    period: "Abr 2026",
    hours: "8 horas",
  },
  {
    title: "Automatización de Chatbots con Inteligencia Artificial",
    org: "SENA & Asociación Empresarial Multisectorial · Cali",
    period: "Nov 2025",
    hours: "3 horas",
  },
  {
    title: "Custodia Documental — Adecuación y Construcción de Áreas",
    org: "Archivo General de la Nación Jorge Palacios Preciado",
    period: "May–Jun 2025",
    hours: "40 horas",
  },
  {
    title: "Economía Campesina — Mejora de Minicadenas Rurales",
    org: "SENA & Cooperativa Multiactiva Alianza para el Agro · Rionegro",
    period: "Abr 2025",
    hours: "3 horas",
  },
  {
    title: 'Habilidades para la Vida — "Construyendo mi Camino"',
    org: "Prosperidad Social — Familias en Acción",
    period: "Nov 2022",
    hours: "24 horas / 8 semanas",
  },
];

export const skillCategories = [
  {
    category: "Lenguajes",
    items: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "HTML5", "CSS3"],
  },
  {
    category: "Backend & APIs",
    items: [
      "FastAPI",
      "NestJS",
      "Django REST Framework",
      "Go (Gorilla Mux, Beego)",
      "Node.js",
      "APIs REST",
      "Webhooks",
      "Arquitectura de microservicios",
      "JWT",
      "Pydantic",
    ],
  },
  {
    category: "IA aplicada",
    items: [
      "Agentes de IA",
      "Modelos de lenguaje (LLM) vía API",
      "Groq Whisper (transcripción de voz)",
      "Edge TTS (síntesis de voz)",
      "Telegram Bot API",
    ],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Angular", "Tailwind CSS"],
  },
  {
    category: "Bases de datos",
    items: ["PostgreSQL", "MongoDB", "Supabase"],
  },
  {
    category: "DevOps & Herramientas",
    items: [
      "Docker",
      "Render",
      "Vercel",
      "Git / GitHub (Git Flow)",
      "Pruebas automatizadas",
      "npm",
      "Postman",
      "Swagger",
    ],
  },
  {
    category: "Diseño & Datos",
    items: ["Figma", "Power BI", "Adobe Photoshop", "Excel avanzado"],
  },
];

export const stats = {
  repositories: 18,
  commits: 1450,
  languages: 12,
  experienceYears: 2,
};
