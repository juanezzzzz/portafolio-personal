// Edita este archivo con tus datos reales.
// Es la unica fuente de verdad que consumen About, Contact, Explorer y la Terminal.

import { asset } from "../lib/asset";

export const profile = {
  name: "Juan Esteban Valencia Arredondo",
  role: "Fullstack Developer en formación · Estudiante ADSO (SENA)",
  location: "Yopal, Casanare, Colombia",
  status: "Disponible para roles junior y colaboración",
  email: "juanestebanvalencia.dev@gmail.com",
  phone: "+57 310 467 8335",
  github: "https://github.com/juanezzzzz",
  linkedin: "https://linkedin.com/in/juanestebanvalenciaa1111",
  instagram: "https://www.instagram.com/_juanezzzzz/",
  /** PDF real (convertido del .docx fuente), servido como asset estatico
   * desde /public/cv — no se genera en el cliente para evitar reconstruir
   * el layout con jsPDF/etc., que nunca queda identico al Word original. */
  cvUrl: asset("/cv/CV_JuanEstebanValencia.pdf"),
  /** Foto de perfil para About — recorte cuadrado, se muestra circular. */
  photoUrl: asset("/profile/juan.jpg"),
  bio: [
    "Desarrollador Fullstack en formación con experiencia construyendo APIs REST en Go, Django (Python) y NestJS (TypeScript), además de interfaces con React y Next.js.",
    "Manejo PostgreSQL y MongoDB, arquitectura de microservicios, autenticación JWT y control de versiones con Git Flow. Autodidacta, orientado al detalle y comprometido con el código limpio y las soluciones escalables.",
    "Estudiante de desarrollo de software construyendo proyectos reales para pasar de la teoría a la práctica — interesado en desarrollo web, código limpio y resolver problemas de punta a punta.",
  ],
  /** Fortalezas / core competencies del CV, para mostrar como chips en About. */
  highlights: [
    "Desarrollo fullstack: de UI (Figma) a despliegue (Vercel)",
    "Diseño de APIs REST en múltiples stacks (Go, Python/Django, TypeScript/NestJS)",
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
  favoriteTech: ["Go", "TypeScript", "React", "PostgreSQL"],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "A2–B1 (Instituto Open Mind, en curso)" },
  ],
  /** Detalle personal del README — le da un toque humano a About, no solo curricular. */
  outsideOfCode: "Fuera del código: siempre aprendiendo algo nuevo, viendo series y jugando.",
};

export const experience = [
  {
    role: "Monitor de aprendices — Área SST",
    org: "SENA",
    period: "2025 — actualidad",
    description:
      "Apoyo a la fase de Seguridad y Salud en el Trabajo, desarrollo de herramientas interactivas de capacitación (Zona Segura). Rol que exigió y certificó habilidades de liderazgo y trabajo en equipo.",
    achievements: [
      "Diseñé y desarrollé 'Zona Segura', un juego educativo de 4 rondas para capacitar en SST: clasificación de riesgos en una cinta transportadora, memorama de conceptos, ruleta de preguntas y selección de EPP por área de trabajo.",
      "Implementé animaciones y transiciones con GSAP para que el juego funcionara como pieza interactiva en un stand de feria científica (Ciudad Científica — CAFEC).",
      "Certifiqué habilidades de liderazgo y trabajo en equipo como parte de las funciones del rol.",
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
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
      "NestJS",
      "Django REST Framework",
      "Go (Gorilla Mux)",
      "Node.js",
      "Arquitectura de microservicios",
      "JWT",
    ],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Bases de datos",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "DevOps & Herramientas",
    items: ["Git / GitHub (Git Flow)", "Vercel", "npm", "Postman"],
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
