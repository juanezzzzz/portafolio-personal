// Edita con tus proyectos reales. "status" alimenta el color del badge en Projects y Explorer.
//
// Cada proyecto puede ser tan simple como antes (name/stack/status/description) o
// "completo": con readme, screenshots, technologies, features y links — en ese caso
// aparece en el Explorer/Projects como una app instalable (ver ProjectApp.tsx) en vez
// de solo texto.

export type ProjectStatus = "production" | "completed" | "in-progress";

export interface ProjectLinks {
  demo?: string;
  github?: string;
  readme?: string;
}

/** Nodo de un arbol de archivos real (opcional). Cuando un proyecto lo trae,
 * la pestaña "Files" de ProjectApp lo renderiza en vez de la lista generica
 * SIMULATED_FILES. */
export interface FileTreeNode {
  name: string;
  type: "file" | "dir";
  children?: FileTreeNode[];
}

/** Un modulo/feature individual de un proyecto rico — ej. cada uno de los 8
 * juegos de YopVial. Opcional: solo los proyectos "insignia" lo traen. */
export interface ProjectModule {
  icon?: string;
  title: string;
  description: string;
  tag?: string;
}

export interface ArchitectureLayer {
  layer: string;
  detail: string;
}

export interface ProjectArchitecture {
  summary: string;
  layers: ArchitectureLayer[];
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  name: string;
  stack: string;
  status: ProjectStatus;
  description: string;
  link?: string;
  /** Emoji o icono corto para el header de la app (opcional). */
  icon?: string;
  /** Lista de tecnologías individuales, para badges (además del texto libre "stack"). */
  technologies?: string[];
  /** Features destacadas, se muestran como checklist. */
  features?: string[];
  /** URLs de capturas — la primera se usa como imagen principal. */
  screenshots?: string[];
  links?: ProjectLinks;
  /** Contenido del README (markdown crudo), para la pestaña README dentro de la app. */
  readme?: string;
  /** Arbol de archivos real del repo (opcional). Sin esto, la pestaña Files
   * usa SIMULATED_FILES (lista generica) como fallback. */
  fileTree?: FileTreeNode[];
  /** Modulos/features individuales con su propia tarjeta (ej. los 8 juegos de
   * YopVial). Solo proyectos "insignia" lo traen — habilita la pestaña Modules. */
  modules?: ProjectModule[];
  /** Resumen de arquitectura por capas. Solo proyectos "insignia" — habilita
   * la pestaña Architecture. */
  architecture?: ProjectArchitecture;
  /** Metricas cortas tipo "8 juegos" / "Supabase" para la tira de stats del
   * Overview. Opcional, no depende de las otras piezas ricas. */
  metrics?: ProjectMetric[];
}

const YOPVIAL_README = `# YopVial — Seguridad Vial

Guía educativa e interactiva de seguridad y movilidad vial, basada en el Código Nacional de Tránsito de Colombia (Ley 769 de 2002). Incluye contenido didáctico organizado por temas, un módulo de reportes ciudadanos (PQR) con base de datos real y una sección de 8 juegos interactivos para aprender jugando.

> Mascota: Yop, una capibara con casco y chaleco de seguridad. Por un camino seguro.

## Qué incluye

### Landing (index.html)
Hero, hub "Guía completa" con una tarjeta por tema (insignia de señal vial real según categoría), números de emergencia siempre visibles, acceso rápido a Reportes y Juegos.

### Guía por temas (guia/)
- Normas clave de tránsito.
- Señales (reglamentarias, preventivas e informativas) con imágenes reales, por pestañas.
- Límites de velocidad por tipo de zona.
- Documentos obligatorios para circular.
- Clasificación de infracciones con acordeón: descripción y ley de cada una.
- Consejos por tipo de actor vial (conductores, motociclistas, peatones, ciclistas).
- Qué hacer en caso de accidente, paso a paso.
- Puntos de mayor riesgo.

### Reportes ciudadanos — PQR (PQR/)
Módulo de participación ciudadana para reportar huecos, semáforos dañados, señalización, accidentes, etc. Formulario con tipo, ubicación, gravedad, descripción y foto opcional. Los reportes se guardan en Supabase (base de datos compartida) y las fotos en Supabase Storage. Vista de lista con filtros, buscador y detalle.

### Juegos interactivos (juegos/)
- Ahorcado vial — adivina palabras de seguridad vial letra por letra a partir de una pista.
- Adivina la señal — opción múltiple con 10 segundos por señal; guarda tu mejor racha.
- Cruza la calle — arcade en canvas (estilo Frogger), niveles progresivos, 3 vidas, récord guardado.
- Ruta segura — endless runner en moto: esquiva huecos y autos, recoge casco y SOAT.
- Reflejos del semáforo — mide tu tiempo de reacción.
- Parquea bien — física de manejo simple, maniobra y estaciona antes de que se acabe el tiempo.
- Ruta nocturna — conducción nocturna con iluminación real (Phaser 3), lluvia animada y deslumbramiento.
- Quiz vial — 24 preguntas contrarreloj, con explicación tras cada respuesta.

Todos los juegos guardan su mejor marca en localStorage y comparten tema/silencio con el resto del sitio.

## Tecnologías
- HTML + CSS + JavaScript puro (sin frameworks ni build) para el landing, la guía, el PQR y 7 de los 8 juegos.
- Phaser 3 (vía CDN) para "Ruta nocturna", con sistema de iluminación 2D y partículas.
- Supabase (PostgreSQL + Storage) para los reportes ciudadanos.
- GitHub Pages para el despliegue.

## Estructura
\`\`\`
seguridad-vial/
├── index.html
├── css/styles.css
├── js/app.js
├── guia/            # un tema por página
├── assets/          # imágenes: logo, señales, documentos, capturas
├── PQR/             # módulo de reportes ciudadanos (Supabase)
├── juegos/          # hub + 8 juegos
├── scripts/smoke-test.js
├── supabase/setup.sql
├── sitemap.xml
└── robots.txt
\`\`\`

## Créditos
Proyecto educativo de seguridad vial. Contenido basado en la Ley 769 de 2002 (Código Nacional de Tránsito de Colombia). Con fines educativos.
`;

const ZONA_SEGURA_README = `# Zona Segura

Plataforma web de minijuegos para el bienestar y la Seguridad y Salud en el Trabajo (SST). Contiene tres módulos activos, unidos en un recorrido único de capacitación:

- Zona Segura SENA: 4 rondas interactivas sobre SST (cinta transportadora, memorama, ruleta, viste al trabajador con EPP).
- Vocal Hero: ejercicios vocales con detección de voz en tiempo real para cuidar las cuerdas vocales.
- Respiración Guiada: sesiones de box breathing 4-4-6-2 con visualización animada para reducir el estrés.

> Inspirado en el proyecto SENA CAFEC Casanare. Sistema de diseño híbrido: paleta institucional SENA (verde, amarillo de peligro) con la limpieza de los módulos de bienestar.

## El recorrido

Desde la Fase 4, la plataforma dejó de ser un menú de juegos independientes: es un recorrido único donde cada etapa se marca completa antes de continuar a la siguiente, y solo la pantalla de resultados finales ofrece salir o reiniciar.

\`\`\`
introducción → EPP → elegir → (Vocal Hero | Respiración Guiada) → Zona Segura SENA → resultados
\`\`\`

## Zona Segura SENA

Juego educativo del SENA CAFEC Casanare con 4 rondas: clasificar situaciones en los 3 ejes de la SST (cinta transportadora), emparejar conceptos (memorama), responder con penitencia (ruleta) y seleccionar los Elementos de Protección Personal correctos (viste al trabajador). Termina con el carnet del aprendiz.

## Vocal Hero

10 ejercicios vocales (vocales, resonancia, respiración, vibración, articulación) con detección de voz real vía Web Audio API: calibra el ruido ambiente, mide el volumen RMS contra un umbral adaptativo, y usa histéresis (60ms de voz sostenida activa, 1500ms de silencio pausa) para que la barra de progreso avance solo cuando de verdad hay voz.

## Respiración Guiada

Sesión de box breathing 4-4-6-2 (inhala, sostén, exhala, descansa) con un círculo animado que crece y se encoge según la fase — 5 ciclos, unos 80 segundos en total.

## Puntaje global único

Desde la Fase 3, ya no existen puntajes individuales por módulo: todo se acumula en un único puntaje global (0-1000) normalizado por módulo y guardado en localStorage, con un badge que muestra el resultado — y que se bloquea (no es un enlace de salida) mientras el recorrido sigue activo, para no dejar abandonar la capacitación a mitad de camino.

## Tecnologías
- HTML + CSS + JavaScript vanilla, sin build, para todos los módulos propios.
- Web Audio API para la detección de voz en tiempo real de Vocal Hero.
- GSAP (vendorizado, autocontenido) solo dentro del módulo SENA.
- localStorage para el progreso del recorrido, el puntaje global y el mini-historial del módulo SENA.

## Accesibilidad y diseño
Contraste AA, aria-label, aria-live, foco visible, soporte para prefers-reduced-motion, responsive mobile-first. Sin analytics, cookies ni servicios externos.

## Estructura
\`\`\`
zona-segura/
├── index.html            # Menú unificado
├── styles/                # Sistema de diseño hibrido (tokens SENA)
├── scripts/
│   ├── global-progress.js # Progreso único del recorrido
│   ├── vocal-hero/
│   └── respiracion-guiada/
└── games/
    ├── vocal-hero.html
    ├── respiracion-guiada.html
    └── zona-segura-sena/   # Proyecto SENA completo, autocontenido
\`\`\`

## Créditos
Proyecto educativo de bienestar y SST, inspirado en el programa SENA CAFEC Casanare. Uso libre con fines educativos.
`;

const BOUTIQUE_README = `# 🌸 Dulce Encanto — Storefront

Tienda online de moda femenina construida con React + Vite. Catálogo conectado a Supabase (con respaldo local si no hay conexión), carrito y favoritos persistentes, y checkout sin pago en línea que entrega el pedido armado por WhatsApp.

## Características

- **Catálogo** con filtro por categoría, precio máximo, orden (destacados / precio / novedades) y buscador con resultados en vivo.
- **Ficha de producto** con selección de talla y cantidad, tallas agotadas individualmente (sin agotar el producto completo), lightbox de imagen y productos relacionados.
- **Favoritos (wishlist)** persistidos en \`localStorage\`, con contador en el header y página dedicada.
- **Carrito** persistido en \`localStorage\`, que se autolimpia si un producto deja de existir en el catálogo remoto.
- **Checkout sin pago en línea**: arma un mensaje de WhatsApp con los datos del pedido y, si Supabase está configurado, además registra la orden para estadísticas — sin que un fallo ahí bloquee el envío del pedido.
- **SEO dinámico por página** (title, meta description, Open Graph, Twitter Card) vía el hook \`useSEO\`.
- **Analytics GA4 opcional**: view_item, add_to_cart, begin_checkout, generate_lead — no hace nada hasta que se configure un Measurement ID.
- **Tema claro / oscuro** con preferencia guardada.
- **Code-splitting por ruta** y \`prefers-reduced-motion\` respetado automáticamente en todas las animaciones (Framer Motion).
- **Fallback de catálogo**: si Supabase no está configurado o falla la consulta, la tienda sigue funcionando con datos curados locales.

## Stack técnico

- React 19 + Vite 8
- React Router 7 (rutas con \`lazy()\` para code-splitting)
- Tailwind CSS v4
- Framer Motion para las animaciones
- Supabase (\`@supabase/supabase-js\`) para catálogo y registro de pedidos
- oxlint para linting

## Configuración

La configuración vive en constantes dentro del código fuente, sin archivo \`.env\`. Tablas esperadas en Supabase: \`categories\`, \`products\`, \`orders\`, \`order_items\`.

## Rutas

| Ruta | Página |
|---|---|
| \`/\` | Home |
| \`/catalogo\` | Catálogo (con \`?q=\` para búsqueda) |
| \`/catalogo/:cat\` | Catálogo filtrado por categoría |
| \`/producto/:id\` | Ficha de producto |
| \`/carrito\` | Carrito |
| \`/checkout\` | Finalizar pedido |
| \`/favoritos\` | Wishlist |
| \`*\` | 404 |

## Estructura del proyecto

\\\`\\\`\\\`
src/
├── components/     # Header, Footer, Layout, ProductCard, Lightbox, Reveal…
├── context/        # ThemeContext, CatalogContext, CartContext, WishlistContext
├── data/           # Catálogo de respaldo e imágenes curadas por nombre
├── lib/            # supabaseClient, catalog, analytics, seo, whatsapp, format
└── pages/          # Home, Catalog, Product, Cart, Checkout, Favoritos, NotFound
\\\`\\\`\\\`

## Créditos

Proyecto de e-commerce sin pasarela de pago, orientado a negocios que cierran la venta por WhatsApp. Uso libre con fines de portafolio.
`;

export const projects: Project[] = [
  {
    id: "zona-segura",
    name: "Zona Segura",
    stack: "Vanilla JS / HTML / CSS + Web Audio API",
    status: "production",
    description:
      "Plataforma de minijuegos de bienestar y SST para el SENA: recorrido único de 3 módulos (EPP/SENA, Vocal Hero con deteccion de voz real, Respiracion Guiada) con puntaje global persistente.",
    icon: "🎓",
    technologies: ["HTML", "CSS", "JavaScript (vanilla, sin build)", "Web Audio API", "GSAP", "localStorage"],
    features: [
      "Zona Segura SENA: 4 rondas (cinta transportadora, memorama, ruleta, viste al trabajador con EPP)",
      "Vocal Hero: 10 ejercicios vocales con detección de voz real (calibración + umbral adaptativo + histéresis)",
      "Respiración Guiada: box breathing 4-4-6-2 con visualización animada, 5 ciclos",
      "Recorrido único con progreso obligatorio: no se puede salir a mitad de la capacitación",
      "Puntaje global unico (0-1000) normalizado entre modulos, con badge de estado",
      "Accesibilidad AA, soporte prefers-reduced-motion, responsive mobile-first",
    ],
    screenshots: [
      "/projects/zona-segura/menu.png",
      "/projects/zona-segura/sena.png",
      "/projects/zona-segura/vocal-hero.png",
      "/projects/zona-segura/respiracion.png",
      "/projects/zona-segura/epp.png",
    ],
    links: {
      demo: "https://juanezzzzz.github.io/zona-segura-sst/",
      github: "https://github.com/juanezzzzz/zona-segura-sst",
    },
    readme: ZONA_SEGURA_README,
    fileTree: [
      { name: "index.html", type: "file" },
      {
        name: "styles",
        type: "dir",
        children: [
          { name: "global.css", type: "file" },
          { name: "global-progress.css", type: "file" },
          { name: "vocal-hero.css", type: "file" },
          { name: "respiracion-guiada.css", type: "file" },
        ],
      },
      {
        name: "scripts",
        type: "dir",
        children: [
          { name: "global-progress.js", type: "file" },
          { name: "player-identity.js", type: "file" },
          {
            name: "vocal-hero",
            type: "dir",
            children: [
              { name: "exercises.js", type: "file" },
              { name: "game.js", type: "file" },
              { name: "audio.js", type: "file" },
              { name: "main.js", type: "file" },
            ],
          },
          {
            name: "respiracion-guiada",
            type: "dir",
            children: [
              { name: "patterns.js", type: "file" },
              { name: "game.js", type: "file" },
              { name: "main.js", type: "file" },
            ],
          },
        ],
      },
      {
        name: "games",
        type: "dir",
        children: [
          { name: "introduccion.html", type: "file" },
          { name: "elegir.html", type: "file" },
          { name: "epp.html", type: "file" },
          { name: "epp.js", type: "file" },
          { name: "vocal-hero.html", type: "file" },
          { name: "respiracion-guiada.html", type: "file" },
          { name: "resultados.html", type: "file" },
          { name: "global-score.js", type: "file" },
          {
            name: "zona-segura-sena",
            type: "dir",
            children: [
              { name: "index.html", type: "file" },
              { name: "css", type: "dir", children: [{ name: "styles.css", type: "file" }] },
              {
                name: "js",
                type: "dir",
                children: [
                  { name: "main.js", type: "file" },
                  { name: "sound.js", type: "file" },
                  {
                    name: "vendor",
                    type: "dir",
                    children: [
                      { name: "gsap.min.js", type: "file" },
                      { name: "MotionPathPlugin.min.js", type: "file" },
                    ],
                  },
                ],
              },
              {
                name: "assets",
                type: "dir",
                children: [
                  { name: "images", type: "dir" },
                  { name: "sounds", type: "dir" },
                ],
              },
            ],
          },
        ],
      },
      { name: "assets", type: "dir", children: [{ name: "images", type: "dir" }] },
      { name: "docs", type: "dir", children: [{ name: "screenshots", type: "dir" }] },
      { name: "README.md", type: "file" },
    ],
  },
  {
    id: "yopvial",
    name: "YopVial — Seguridad Vial",
    stack: "Vanilla JS / HTML / CSS + Phaser 3 + Supabase",
    status: "production",
    description:
      "Guía interactiva de seguridad vial basada en el Código Nacional de Tránsito de Colombia: contenido por temas, reportes ciudadanos (PQR) con Supabase y 8 juegos educativos.",
    icon: "🦫",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript (vanilla, sin build)",
      "Phaser 3",
      "Supabase (PostgreSQL + Storage + RLS)",
      "GitHub Pages",
    ],
    features: [
      "Guía por temas: normas, señales, límites, documentos, infracciones, consejos, accidentes, zonas de riesgo",
      "Módulo de reportes ciudadanos (PQR) con Supabase: RLS, vista pública que oculta el contacto, fotos en Storage",
      "8 juegos interactivos, todos standalone: 7 en canvas 2D + 1 en Phaser 3 (iluminación real, ruta nocturna con lluvia)",
      "Modo claro/oscuro compartido en todo el sitio",
      "Récords y progreso por juego guardados en localStorage",
      "Smoke test propio (sin dependencias) que corre antes de cada commit",
    ],
    screenshots: [
      "/projects/yopvial/landing.png",
      "/projects/yopvial/pqr.png",
      "/projects/yopvial/juegos.png",
      "/projects/yopvial/adivina.png",
      "/projects/yopvial/ahorcado.png",
    ],
    links: {
      demo: "https://juanezzzzz.github.io/seguridad-vial/",
      github: "https://github.com/juanezzzzz/seguridad-vial",
    },
    readme: YOPVIAL_README,
    metrics: [
      { label: "Juegos", value: "8" },
      { label: "Temas de guía", value: "8" },
      { label: "Motor extra", value: "Phaser 3" },
      { label: "Backend", value: "Supabase" },
    ],
    modules: [
      {
        icon: "🔤",
        title: "Ahorcado vial",
        description: "Adivina palabras de seguridad vial letra por letra a partir de una pista.",
        tag: "Canvas 2D",
      },
      {
        icon: "🚦",
        title: "Adivina la señal",
        description: "Opción múltiple con 10 segundos por señal; guarda tu mejor racha.",
        tag: "Canvas 2D",
      },
      {
        icon: "🐸",
        title: "Cruza la calle",
        description: "Arcade estilo Frogger en canvas: niveles progresivos, 3 vidas, récord guardado.",
        tag: "Canvas 2D",
      },
      {
        icon: "🏍️",
        title: "Ruta segura",
        description: "Endless runner en moto: esquiva huecos y autos, recoge casco y SOAT.",
        tag: "Canvas 2D",
      },
      {
        icon: "⏱️",
        title: "Reflejos del semáforo",
        description: "Mide tu tiempo de reacción cuando el semáforo cambia a verde.",
        tag: "Canvas 2D",
      },
      {
        icon: "🅿️",
        title: "Parquea bien",
        description: "Física de manejo simple: maniobra y estaciona antes de que se acabe el tiempo.",
        tag: "Canvas 2D",
      },
      {
        icon: "🌙",
        title: "Ruta nocturna",
        description: "Conducción nocturna con iluminación real, lluvia animada y deslumbramiento.",
        tag: "Phaser 3",
      },
      {
        icon: "❓",
        title: "Quiz vial",
        description: "24 preguntas contrarreloj, con explicación después de cada respuesta.",
        tag: "Canvas 2D",
      },
    ],
    architecture: {
      summary:
        "Sitio 100% estático (sin build ni framework) para el landing, la guía y 7 de los 8 juegos — servido tal cual desde GitHub Pages. El único punto con datos reales es el módulo PQR, que habla directo con Supabase desde el navegador, protegido con Row Level Security en vez de un backend propio.",
      layers: [
        { layer: "Frontend", detail: "HTML + CSS + JavaScript vanilla, sin build ni bundler." },
        { layer: "Motor de juego", detail: "Phaser 3 vía CDN, usado solo en 'Ruta nocturna' (iluminación 2D + partículas)." },
        { layer: "Datos", detail: "Supabase (PostgreSQL + Storage) para el módulo PQR, con RLS: la vista pública oculta el contacto del reportante." },
        { layer: "Hosting", detail: "GitHub Pages — despliegue estático directo desde el repo." },
        { layer: "Calidad", detail: "Smoke test propio, sin dependencias externas, corre antes de cada commit." },
      ],
    },
    fileTree: [
      { name: "index.html", type: "file" },
      { name: "css", type: "dir", children: [{ name: "styles.css", type: "file" }] },
      {
        name: "js",
        type: "dir",
        children: [
          { name: "app.js", type: "file" },
          { name: "editor-zonas.js", type: "file" },
        ],
      },
      {
        name: "guia",
        type: "dir",
        children: [
          { name: "normas.html", type: "file" },
          { name: "senales.html", type: "file" },
          { name: "velocidad.html", type: "file" },
          { name: "documentos.html", type: "file" },
          { name: "infracciones.html", type: "file" },
          { name: "consejos.html", type: "file" },
          { name: "accidentes.html", type: "file" },
          { name: "zonas.html", type: "file" },
        ],
      },
      {
        name: "PQR",
        type: "dir",
        children: [
          { name: "reportes.html", type: "file" },
          { name: "pqr.css", type: "file" },
          { name: "pqr.js", type: "file" },
          { name: "config.js", type: "file" },
        ],
      },
      {
        name: "juegos",
        type: "dir",
        children: [
          { name: "juegos.html", type: "file" },
          { name: "juegos.css", type: "file" },
          { name: "juegos.js", type: "file" },
          { name: "ahorcado.html", type: "file" },
          { name: "ahorcado.js", type: "file" },
          { name: "adivina-senal.html", type: "file" },
          { name: "adivina-senal.js", type: "file" },
          { name: "cruza-calle.html", type: "file" },
          { name: "cruza-calle.js", type: "file" },
          { name: "ruta-segura.html", type: "file" },
          { name: "ruta-segura.js", type: "file" },
          { name: "reflejos-semaforo.html", type: "file" },
          { name: "reflejos-semaforo.js", type: "file" },
          { name: "parquea-bien.html", type: "file" },
          { name: "parquea-bien.js", type: "file" },
          { name: "ruta-nocturna.html", type: "file" },
          { name: "ruta-nocturna.js", type: "file" },
          { name: "quiz-vial.html", type: "file" },
          { name: "quiz-vial.js", type: "file" },
        ],
      },
      {
        name: "assets",
        type: "dir",
        children: [
          { name: "logo.png", type: "file" },
          { name: "logo1.png", type: "file" },
          { name: "screenshots", type: "dir" },
          { name: "senales", type: "dir" },
          { name: "normas", type: "dir" },
          { name: "documentos", type: "dir" },
          { name: "emergencias", type: "dir" },
          { name: "consejos", type: "dir" },
          { name: "guia", type: "dir" },
          { name: "peligros", type: "dir" },
          { name: "ruta-nocturna", type: "dir" },
        ],
      },
      { name: "scripts", type: "dir", children: [{ name: "smoke-test.js", type: "file" }] },
      { name: "supabase", type: "dir", children: [{ name: "setup.sql", type: "file" }] },
      { name: "sitemap.xml", type: "file" },
      { name: "robots.txt", type: "file" },
      { name: ".gitignore", type: "file" },
    ],
  },
  {
    id: "boutique",
    name: "Dulce Encanto — Storefront",
    stack: "React 19 / Vite / Tailwind v4 + Supabase",
    status: "production",
    description:
      "Tienda online de moda femenina: catálogo conectado a Supabase con respaldo local, carrito y favoritos persistentes, y checkout sin pasarela de pago que arma el pedido por WhatsApp.",
    icon: "🌸",
    technologies: [
      "React 19",
      "Vite 8",
      "React Router 7",
      "Tailwind CSS v4",
      "Framer Motion",
      "Supabase (PostgreSQL)",
    ],
    features: [
      "Catálogo con filtro por categoría, precio máximo, orden y buscador con resultados en vivo",
      "Ficha de producto: talla y cantidad, tallas agotadas individualmente, lightbox y relacionados",
      "Favoritos y carrito persistidos en localStorage; el carrito se autolimpia si un producto ya no existe",
      "Checkout sin pago en línea: arma el pedido por WhatsApp y lo registra en Supabase si está configurado",
      "SEO dinámico por página (title, meta description, Open Graph, Twitter Card)",
      "Analytics GA4 opcional, tema claro/oscuro y code-splitting por ruta con prefers-reduced-motion respetado",
      "Fallback de catálogo local si Supabase no está configurado o falla la consulta",
    ],
    screenshots: [
      "/projects/boutique/home.jpg",
      "/projects/boutique/catalogo.jpg",
      "/projects/boutique/producto.jpg",
      "/projects/boutique/carrito.jpg",
      "/projects/boutique/checkout.jpg",
      "/projects/boutique/favoritos.jpg",
      "/projects/boutique/home-dark.jpg",
    ],
    // TODO: falta demo y github reales — el usuario los va a confirmar.
    // Sin esto, "Run Application" y los botones de link quedan ocultos
    // automaticamente (ProjectApp ya maneja bien los links ausentes), asi
    // que no rompe nada dejarlo vacio mientras tanto.
    links: {},
    readme: BOUTIQUE_README,
    fileTree: [
      { name: "index.html", type: "file" },
      { name: "vite.config.js", type: "file" },
      { name: "package.json", type: "file" },
      {
        name: "src",
        type: "dir",
        children: [
          { name: "App.jsx", type: "file" },
          { name: "main.jsx", type: "file" },
          { name: "index.css", type: "file" },
          {
            name: "components",
            type: "dir",
            children: [
              { name: "Badge.jsx", type: "file" },
              { name: "BotanicalLine.jsx", type: "file" },
              { name: "CategoryCard.jsx", type: "file" },
              { name: "Footer.jsx", type: "file" },
              { name: "Header.jsx", type: "file" },
              { name: "Layout.jsx", type: "file" },
              { name: "Lightbox.jsx", type: "file" },
              { name: "PlaceholderImage.jsx", type: "file" },
              { name: "ProductCard.jsx", type: "file" },
              { name: "Reveal.jsx", type: "file" },
              { name: "Seal.jsx", type: "file" },
              { name: "SectionHeading.jsx", type: "file" },
              { name: "WhatsAppFloat.jsx", type: "file" },
            ],
          },
          {
            name: "context",
            type: "dir",
            children: [
              { name: "CartContext.jsx", type: "file" },
              { name: "CatalogContext.jsx", type: "file" },
              { name: "ThemeContext.jsx", type: "file" },
              { name: "WishlistContext.jsx", type: "file" },
            ],
          },
          {
            name: "data",
            type: "dir",
            children: [
              { name: "fallback.js", type: "file" },
              { name: "imagery.js", type: "file" },
            ],
          },
          {
            name: "lib",
            type: "dir",
            children: [
              { name: "analytics.js", type: "file" },
              { name: "catalog.js", type: "file" },
              { name: "format.js", type: "file" },
              { name: "seo.js", type: "file" },
              { name: "supabaseClient.js", type: "file" },
              { name: "whatsapp.js", type: "file" },
            ],
          },
          {
            name: "pages",
            type: "dir",
            children: [
              { name: "Home.jsx", type: "file" },
              { name: "Catalog.jsx", type: "file" },
              { name: "Product.jsx", type: "file" },
              { name: "Cart.jsx", type: "file" },
              { name: "Checkout.jsx", type: "file" },
              { name: "Favoritos.jsx", type: "file" },
              { name: "NotFound.jsx", type: "file" },
            ],
          },
        ],
      },
      {
        name: "public",
        type: "dir",
        children: [
          { name: "robots.txt", type: "file" },
          { name: "sitemap.xml", type: "file" },
        ],
      },
      { name: "docs", type: "dir", children: [{ name: "screenshots", type: "dir" }] },
    ],
  },
  {
    id: "jobsy",
    name: "Jobsy — Plataforma de Microservicios",
    stack: "Go (Gorilla Mux) / PostgreSQL",
    status: "completed",
    description:
      "Plataforma de microservicios en Go: APIs REST independientes para un módulo de e-commerce (Tienda) y uno de membresías (Suscripciones), con Gorilla Mux, arquitectura por capas y CRUD completo.",
    icon: "🧩",
    technologies: ["Go", "Gorilla Mux", "PostgreSQL", "Arquitectura por capas", "REST"],
    features: [
      "Dos APIs REST independientes bajo una misma plataforma: Tienda (e-commerce) y Suscripciones (membresías)",
      "CRUD completo en ambos módulos, con arquitectura por capas (handlers/servicios/repositorios)",
      "Gorilla Mux como router HTTP",
    ],
    links: {
      github: "https://github.com/juanezzzzz/Tienda_CRUD",
    },
    readme: `# Jobsy — Plataforma de Microservicios

Backend de microservicios en Go para la plataforma Jobsy: dos APIs REST independientes, una de e-commerce (Tienda) y otra de membresías (Suscripciones), construidas con Gorilla Mux y arquitectura por capas.

## Repositorios
- Tienda: [github.com/juanezzzzz/Tienda_CRUD](https://github.com/juanezzzzz/Tienda_CRUD)
- Suscripciones: [github.com/juanezzzzz/Suscripciones_CRUD](https://github.com/juanezzzzz/Suscripciones_CRUD)

## Qué incluye
- CRUD completo en ambos módulos.
- Arquitectura por capas para separar rutas, lógica de negocio y acceso a datos.
- Gorilla Mux como router HTTP.
- PostgreSQL como base de datos.

## Tecnologías
- Go
- Gorilla Mux
- PostgreSQL
`,
    fileTree: [
      { name: "README.md", type: "file" },
      { name: "go.mod", type: "file" },
      { name: "go.sum", type: "file" },
      { name: "main.go", type: "file" },
      {
        name: "config",
        type: "dir",
        children: [{ name: "db.go", type: "file" }],
      },
      {
        name: "controllers",
        type: "dir",
        children: [
          { name: "carrito_items_controller.go", type: "file" },
          { name: "carritos_controller.go", type: "file" },
          { name: "categorias_tienda_controller.go", type: "file" },
          { name: "cupones_controller.go", type: "file" },
          { name: "facturacion_controller.go", type: "file" },
          { name: "helpers.go", type: "file" },
          { name: "metodo_pago_controller.go", type: "file" },
          { name: "metodos_pago_guardados_controller.go", type: "file" },
          { name: "pagos_controller.go", type: "file" },
          { name: "pedido_items_controller.go", type: "file" },
          { name: "productos_controller.go", type: "file" },
          { name: "saldo_jobsy_controller.go", type: "file" },
          { name: "tipo_transaccion_controller.go", type: "file" },
          { name: "transacciones_controller.go", type: "file" },
        ],
      },
      {
        name: "models",
        type: "dir",
        children: [
          { name: "carrito_items.go", type: "file" },
          { name: "carritos.go", type: "file" },
          { name: "categorias_tienda.go", type: "file" },
          { name: "cupones.go", type: "file" },
          { name: "facturacion.go", type: "file" },
          { name: "metodo_pago.go", type: "file" },
          { name: "metodos_pago_guardados.go", type: "file" },
          { name: "pagos.go", type: "file" },
          { name: "pedido_items.go", type: "file" },
          { name: "productos.go", type: "file" },
          { name: "saldo_jobsy.go", type: "file" },
          { name: "tipo_transaccion.go", type: "file" },
          { name: "transacciones.go", type: "file" },
        ],
      },
      {
        name: "routes",
        type: "dir",
        children: [
          { name: "carrito_items_routes.go", type: "file" },
          { name: "carritos_routes.go", type: "file" },
          { name: "categorias_tienda_routes.go", type: "file" },
          { name: "cupones_routes.go", type: "file" },
          { name: "facturacion_routes.go", type: "file" },
          { name: "metodo_pago_routes.go", type: "file" },
          { name: "metodos_pago_guardados_routes.go", type: "file" },
          { name: "pagos_routes.go", type: "file" },
          { name: "pedido_items_routes.go", type: "file" },
          { name: "productos_routes.go", type: "file" },
          { name: "saldo_jobsy_routes.go", type: "file" },
          { name: "tipo_transaccion_routes.go", type: "file" },
          { name: "transacciones_routes.go", type: "file" },
        ],
      },
    ],
  },
  {
    id: "rrhh-api",
    name: "API Gestión de Recursos Humanos",
    stack: "Django REST Framework / PostgreSQL",
    status: "completed",
    description:
      "API REST de 17 recursos para gestión de RRHH: autenticación JWT, permisos por rol, auditoría automática, exportación CSV/Excel, filtros avanzados y documentación Swagger.",
    icon: "🗂️",
    technologies: ["Python", "Django REST Framework", "PostgreSQL", "JWT", "Swagger"],
    features: [
      "17 recursos REST cubriendo la gestión completa de RRHH",
      "Autenticación JWT y permisos por rol",
      "Auditoría automática de cambios (logging)",
      "Exportación de datos a CSV/Excel",
      "Filtros avanzados sobre los endpoints",
      "Documentación interactiva con Swagger",
    ],
    links: {
      github: "https://github.com/juanezzzzz/Gestion_Recursos_Humanos_API_DJango",
    },
    readme: `# API Gestión de Recursos Humanos

API REST construida con Django REST Framework para la gestión integral de recursos humanos: empleados, roles, auditoría y reportes.

## Qué incluye
- 17 recursos REST que cubren la gestión completa de RRHH.
- Autenticación JWT y permisos por rol.
- Auditoría automática: registro de cambios sobre los recursos.
- Exportación de datos a CSV y Excel.
- Filtros avanzados sobre los endpoints de consulta.
- Documentación interactiva con Swagger.

## Tecnologías
- Python
- Django REST Framework
- PostgreSQL
- JWT
- Swagger / OpenAPI
`,
  },
  {
    id: "red-social-api",
    name: "API Red Social",
    stack: "NestJS (TypeScript) / MongoDB",
    status: "completed",
    description:
      "API modular de red social: usuarios, publicaciones, comentarios, reacciones y seguidores, con validación por DTOs, cifrado bcrypt y documentación Swagger.",
    icon: "💬",
    technologies: ["TypeScript", "NestJS", "MongoDB", "DTO validation", "bcrypt", "Swagger"],
    features: [
      "Módulos independientes: usuarios, publicaciones, comentarios, reacciones y seguidores",
      "Validación de datos de entrada con DTOs",
      "Contraseñas cifradas con bcrypt",
      "Documentación interactiva con Swagger",
    ],
    links: {
      github: "https://github.com/juanezzzzz/api_red_social",
    },
    readme: `# API Red Social

API REST modular construida con NestJS para una red social: usuarios, publicaciones, comentarios, reacciones y seguidores.

## Qué incluye
- Módulos independientes por dominio: usuarios, publicaciones, comentarios, reacciones y seguidores.
- Validación de datos de entrada con DTOs.
- Cifrado de contraseñas con bcrypt.
- Documentación interactiva con Swagger.

## Tecnologías
- TypeScript
- NestJS
- MongoDB
- bcrypt
- Swagger / OpenAPI
`,
  },
];

export function isFullProject(p: Project): boolean {
  return !!(p.readme || (p.screenshots && p.screenshots.length));
}
