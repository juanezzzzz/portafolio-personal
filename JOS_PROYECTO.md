# JOS — Juan Operating System
### Documento maestro del proyecto

Este documento consolida el concepto original, la especificación técnica completa y el estado real de implementación, para que sirva como única fuente de verdad del proyecto — tanto para retomarlo en Claude Code como para dar contexto a cualquier colaborador.

**Última actualización:** Fase 1-4 completadas (sistema de ventanas + contenido real + terminal avanzada + temas/wallpapers/widgets/notificaciones/buscador/sonidos) + integración de proyectos "completos" (YopVial, Zona Segura, Dulce Encanto) con `fileTree`, demo embebido con animación de instalación y datos reales de GitHub.

---

## 1. Resumen ejecutivo

JOS es un portafolio web que simula un sistema operativo propio, ficticio, con identidad visual única. El usuario no navega páginas: enciende el sistema, desbloquea el escritorio, abre aplicaciones en ventanas reales (arrastrables, redimensionables, superponibles) y explora la información profesional de Juan como si fuera software real, no un currículum disfrazado.

**No debe parecer una copia de Windows, macOS o Linux.** Debe sentirse como su propio sistema operativo, con tipografía, iconografía, paleta de color y lenguaje de animación coherentes en todas las pantallas.

**Criterio de éxito:** el visitante recuerda la experiencia por su originalidad y nivel de detalle, no solo por la información que contiene.

---

## 2. Referencias visuales e inspiración

Se revisaron tres portafolios existentes con el patrón "escritorio simulado" para entender qué funciona y qué evitar:

- **Un portafolio estilo macOS clásico**: dock inferior, barra de menú superior, iconos de carpeta en el escritorio, wallpaper degradado, tipografía display grande centrada como "hero". Funciona bien pero es una réplica casi literal de macOS — es justo el riesgo que este proyecto quiere evitar (parecer copia).
- **Un portafolio con panel de Centro de Control estilo macOS + una app de notas (Bear) como ventana de contenido**: buena idea de usar una app real reconocible como metáfora de "About Me", con sidebar de navegación de tres niveles.
- **Un dashboard tipo "widgets flotantes"**: en vez de una sola ventana, varias tarjetas pequeñas (Website, Projects, Screenshot, My Story, Notifications, Contact) conviven sobre el fondo simultáneamente, con una barra lateral de iconos de navegación. Es una variante interesante del concepto de "múltiples ventanas abiertas a la vez" pero con tarjetas más pequeñas y fijas en vez de ventanas libres.

**Conclusión de diseño para JOS:** tomamos la mecánica de ventanas libres y superponibles (no las tarjetas fijas), pero la paleta, tipografía e iconografía deben ser propias — ya se definió una identidad ámbar-sobre-carbón con JetBrains Mono + Inter (ver sección 12), deliberadamente distinta del azul/vidrio de macOS y del blanco genérico de dashboard.

---

## 3. Stack tecnológico

| Área | Especificado | Implementado actualmente |
|---|---|---|
| Framework | Next.js + React + TypeScript | Vite + React + TypeScript *(ver nota)* |
| Estilos | TailwindCSS | Tailwind CSS v4 ✅ |
| Animaciones | Framer Motion + GSAP (casos complejos) | Framer Motion ✅ / GSAP 🔜 no usado aún |
| Estado global | Zustand | Zustand ✅ |
| Ventanas | React RND o sistema propio | react-rnd ✅ |
| Iconografía | Lucide React | lucide-react ✅ (+ 2 iconos de marca propios en SVG, ver nota) |
| Fuentes | Inter, Geist, IBM Plex Mono | Inter + JetBrains Mono *(ver nota)* |

**Notas de decisiones tomadas:**
- Se usó **Vite** en lugar de Next.js para la Fase 1 porque el proyecto es 100% client-side (sin necesidad de SSR/rutas de servidor) y Vite da una vuelta de desarrollo más rápida. Si más adelante se necesita SEO real de páginas indexables (poco probable en un portafolio de una sola pantalla) o Server Components, migrar a Next.js es viable sin rehacer la lógica de ventanas.
- Se usó **JetBrains Mono** en lugar de IBM Plex Mono / Geist por preferencia de legibilidad en la terminal; es intercambiable en `index.html` y `index.css` sin tocar componentes.
- **lucide-react** eliminó los logos de marca (GitHub, LinkedIn) de su paquete por temas de licencia — se resolvió con dos SVGs propios minimalistas en `src/data/brandIcons.tsx`.

---

## 4. Flujo de la aplicación

### 4.1 Boot Screen — ✅ implementado
Logo "JOS", subtítulo "Juan Operating System", barra de progreso animada con caracteres de bloque, transición de salida con fade. Pendiente del spec ampliado: número de versión visible y sonido opcional de inicio.

### 4.2 Pantalla de bloqueo — ✅ implementado (parcial)
Reloj en vivo, fecha, mensaje "Click to unlock". Se activa automáticamente tras 5 minutos de inactividad y también se usa como pantalla de "apagado". Pendiente: fondo dinámico distinto al del escritorio, mensaje de bienvenida personalizado, y gestos alternativos de desbloqueo (arrastrar hacia arriba, tecla Enter — hoy solo funciona con click).

### 4.3 Escritorio principal — ✅ implementado (base)
Iconos organizados en grid, ventanas flotantes con superposición y foco por z-index, sin scroll vertical. Pendiente: fondo personalizable/wallpapers, widgets flotantes sobre el escritorio, efecto de profundidad (parallax/blur en ventanas inactivas).

---

## 5. Barra inferior (Taskbar / Dock)

| Elemento del spec | Estado |
|---|---|
| Botón Inicio | ✅ |
| Ventanas abiertas | ✅ |
| Hora | ✅ |
| Fecha | ✅ |
| GitHub / LinkedIn | ✅ |
| Botón descargar CV | ✅ PDF real descargable (`/public/cv/CV_JuanEstebanValencia.pdf`, generado del .docx fuente) — el botón de la taskbar abre la app **Resume** (visor embebido), About tiene su propio botón de descarga directa, y el comando `cv` en Terminal abre el PDF en pestaña nueva |
| Buscador | ✅ (`GlobalSearch.tsx`, overlay tipo command palette, atajo Ctrl/Cmd+K) |
| Notificaciones | ✅ (`NotificationCenter.tsx`, campana con contador de no leidos) |
| Configuración rápida | ✅ (popover en la taskbar: tema, sonido, acceso a Settings) |
| Modo oscuro | ✅ resuelto vía el picker de temas (preset "Claro" cubre el caso; no es un toggle binario simple sino parte del sistema de temas) |
| Estado de conexión | ✅ (icono online/offline via `navigator.onLine`) |
| Volumen | ✅ (icono en taskbar, alterna el mismo estado que Settings) |

---

## 6. Menú Inicio — ✅ implementado
Perfil (nombre + rol) arriba, lista de accesos a todas las apps del escritorio, botón Shutdown. Pendiente del spec ampliado: accesos directos a "Terminal" y "CV" dentro del propio menú (hoy solo están como iconos del escritorio/taskbar).

---

## 7. Sistema de ventanas — ✅ implementado
Mover, minimizar, maximizar/restaurar, cerrar, redimensionar, mantener foco (z-index), superposición, animación de apertura/cierre (Framer Motion). **Efecto Glass** implementado como toggle opcional en Settings (`glassEnabled` en `settingsStore.ts`): aplica `backdrop-filter: blur` + transparencia a la barra de titulo y el cuerpo de la ventana via la clase `.jos-glass-on` en `index.css`. Sigue pendiente: sombras mas pronunciadas.

---

## 8. Aplicaciones del sistema — estado por app

| App | Estado | Notas |
|---|---|---|
| **About** | ✅ ampliado | Datos reales del CV: foto (`profile.photoUrl`), bio, fortalezas, objetivos, tecnologías favoritas e idiomas — todo cargado desde `profile.ts` |
| **Projects** | ✅ ampliado | 3 de 5 proyectos son "apps completas" (YopVial, Zona Segura, Dulce Encanto — Storefront): capturas, README embebido, technologies, features, `fileTree` real y demo embebido con animación de instalación (`DemoApp.tsx`). Datos reales de GitHub (estrellas, forks, licencia, último commit, último release) vía `useGithubRepoInfo.ts`, con caché en memoria y fallback silencioso si la API falla. Se corrigió el stack de Jobsy (era Django, en realidad es Go/Gorilla Mux) y se agregaron como apps completas (con README propio) los 2 proyectos backend que faltaban: API de Recursos Humanos (Django) y API Red Social (NestJS). Botón "Compartir" en `ProjectApp.tsx` copia un link directo al proyecto (`?open=project:<id>`, ver "Deep-linking" abajo) |
| **Experience** | ✅ ampliado | Logros (`achievements`) y tecnologías (`tech`) por experiencia, cargados desde `profile.ts` |
| **Education** | ✅ ampliado | Formación académica completa (3 items) + sección de certificaciones y cursos (5 items) con org/periodo/horas, cargadas del CV |
| **Skills** | ✅ ampliado | Categorizado por fin (Lenguajes/Backend & APIs/Frontend/Bases de datos/DevOps & Herramientas/Diseño & Datos), reemplazando la lista plana con nivel 1-5 |
| **Analytics / Stats** | ✅ ampliado | Datos reales de GitHub vía `useGithubProfileStats.ts` (repos públicos, estrellas totales excluyendo forks, lenguajes distintos, seguidores) con animación count-up y barras de "lenguajes principales" animadas. Cae a las cifras estáticas de `profile.ts` (con aviso explícito en la UI) si la API falla — ya no se muestra un número de "Commits" inventado |
| **Resume** | ✅ implementado | App propia (`src/apps/Resume.tsx`): visor de PDF embebido (`<object>`, con fallback si el navegador no puede renderizarlo inline) + botones "Abrir en pestaña" y "Descargar". El botón CV de la taskbar y el ícono del escritorio abren esta app; el comando `cv` de la Terminal sigue abriendo el PDF directo en pestaña nueva |
| **Contact** | ✅ ampliado | Info de contacto real + enlaces a GitHub/LinkedIn/Instagram/WhatsApp (`wa.me`, ícono propio nuevo en `brandIcons.tsx`). Formulario de mensaje real (nombre/correo/mensaje) que arma un `mailto:` con lo escrito y abre el cliente de correo del visitante — honesto sobre que es un sitio 100% estático, no un backend que envía el correo por su cuenta |
| **Explorer** | ✅ implementado | Árbol de carpetas funcional |
| **Terminal** | ✅ Fase 3 completa | Implementados: `help`, `about`, `projects`, `skills`, `experience`, `education`, `github`, `cv`, `contact`, `date`, `time`, `theme`, `music`, `matrix`, `shutdown`, `clear`, `sudo hire juan`. `theme` reutiliza el tema especial del Konami code; `music` alterna el mismo estado de sonido que existe en Settings; `matrix` dispara un overlay de lluvia de caracteres en canvas (nuevo componente `MatrixMode.tsx`); `shutdown` lleva al mismo flujo de apagado que el botón del Taskbar/StartMenu. |
| **Configuración** | ✅ Fase 4 completa | Implementado: tema (6 presets), wallpaper (5 presets + subida propia), efecto Glass, velocidad de animación (conectada a la duración de apertura/cierre de ventanas en `Window.tsx`), toggle de sonido, visibilidad de widgets. Persistido en localStorage via `settingsStore.ts`. Pendiente real: idioma, escala/zoom. |
| **Portfolio Web** (`site`) | ✅ implementado (2026-08-25) | "Portafolio dentro del portafolio": app `src/apps/BrowserApp.tsx` que simula una mini ventana de navegador (barra de direcciones falsa `juanesteban.dev`, botón de recargar que remonta el contenido) y adentro embebe `src/traditional/` — un portafolio scrolleable clásico (Nav/Hero/About/Experience/Projects/Skills/Contact/Footer) que existía en una rama distinta del proyecto como reemplazo *no usado* del punto de entrada de JOS. En vez de reemplazar JOS por el sitio tradicional, quedó anidado como una app más — la idea "metaverso" del usuario. Ver detalle abajo en "Portafolio dentro del portafolio". |
| **Juan AI** | 🔜 no existe | Requiere decidir backend (API de Anthropic vía fetch, ver `anthropic_api_in_artifacts` si se hace como artifact, o un endpoint propio si se hace en Next.js) |

---

## 9. Funcionalidades transversales — estado

Implementadas en Fase 4:

- **Widgets del escritorio** ✅ (7 de 7 de la lista original): reloj, calendario, sistema (CPU/RAM/uptime — explicitamente simulado, no hay backend que medir en un portafolio estatico), notas rápidas (persistidas en localStorage), actividad estilo GitHub (heatmap decorativo con semilla determinística, no llama a la API real de GitHub para no depender de red/rate-limits), reproductor de música (decorativo, pero con audio real sintetizado via Web Audio, no un `<audio>` mudo), **clima** (`WeatherWidget.tsx` + `useWeather.ts`): datos reales via `open-meteo.com` (sin API key). Geolocaliza al visitante con `navigator.geolocation`; si no hay permiso o falla, cae a Yopal, Casanare como ubicación por defecto. Cache en memoria por sesión (mismo patrón que `useGithubRepoInfo`), fallo silencioso ante error de red/permiso denegado. Arrastrables, visibilidad togglable desde Settings. Componentes en `src/components/widgets/`.
- **Centro de notificaciones** ✅: `NotificationCenter.tsx` + `notificationStore.ts`. Push automático en: bienvenida al bootear, Konami code, Modo Matrix, crash falso, y "logro" la primera vez que se abre cada app en la sesión.
- **Buscador global** ✅: `GlobalSearch.tsx`, overlay tipo command palette (Ctrl/Cmd+K o icono en la taskbar). Busca apps, proyectos, skills y comandos de terminal; seleccionar un resultado abre la app correspondiente.
- **Sistema de temas múltiples** ✅: base (ámbar), Claro, Glass, Aurora, Midnight, Minimal — todos como clases CSS con variables en `index.css`, seleccionables desde Settings o desde el popover de configuración rápida en la taskbar. El tema secreto del Konami code sigue existiendo aparte, como easter egg.
- **Wallpapers dinámicos** ✅: 5 presets (Carbon, Grid, Sunset, Aurora, Void) + subida de imagen propia (guardada como data URL en localStorage).
- **Sonidos del sistema** ✅ (con una decisión de diseño): en vez de archivos .mp3/.wav (que requerirían assets externos), `soundManager.ts` genera los efectos con osciladores Web Audio API — blips cortos coherentes con la estética "terminal". Conectados a: abrir/cerrar ventana, boot, unlock, shutdown, error (BSOD), notificación.

Resuelto en Fase 2 del "pase de ruta nueva" (ver sección 12):

- **Accesibilidad** ✅ (alcance acotado, ver sección 12 para el detalle de qué se decidió no hacer y por qué): overlays (`StartMenu`, `GlobalSearch`, `NotificationCenter`, `QuickSettingsPopover`) con `role="dialog"`, foco automático al abrir y Escape para cerrar (hook compartido `useOverlayDismiss.ts`) + devolución de foco al botón que los abrió. Cada `Window` con `role="dialog"`, foco automático al abrir y Escape (local, no global) para minimizarla.

Resuelto en el "Pase de auditoría técnica" (ver sección 12, Fase 1 del pase de pulido premium — Alcance real):

- **Responsividad / modo simplificado en móvil** ✅: cada app abre a pantalla completa tipo "app switcher" en viewports ≤768px (`useIsMobile.ts` + rama mobile en `Window.tsx`), taskbar simplificada (sin preview por hover, sin fecha) y desktop con tap simple en vez de doble-click.
- **Code splitting por app** ✅: `WindowManager.tsx` carga cada app con `React.lazy`/`Suspense` — cada una es su propio chunk en el build.
- **SEO básico** ✅: `index.html` con `og:*`/`twitter:*`. Pendiente real menor: reemplazar `og:image` (hoy usa la foto de perfil como interino) por un gráfico de marca dedicado 1200×630.
- **Error Boundary por ventana** ✅ (`ErrorBoundary.tsx`): un error dentro de una app cierra solo esa ventana, no todo el shell.

---

## 10. Easter eggs

| Easter egg | Estado |
|---|---|
| Comando secreto en terminal (`sudo hire juan`) | ✅ |
| Pantalla de error falsa (BSOD) | ✅ (`sudo rm -rf /` en terminal) |
| Tema oculto (Konami code) | ✅ |
| Modo Matrix (`matrix` en terminal) | ✅ |
| Juego oculto | 🔜 |
| Logros desbloqueables | 🔜 (existía en el concepto original como centro de notificaciones con logros) |

---

## 11. Diseño — dirección visual definida

- **Paleta**: carbón azulado (`#12141c` / `#0a0b10`) con acento ámbar (`#f2a93b`) y cyan secundario (`#5eead4`) — deliberadamente distinta del azul/vidrio de macOS y del verde-neón típico de "terminal hacker".
- **Tipografía**: JetBrains Mono para toda la chrome del sistema (barras de título, taskbar, terminal) + Inter para contenido de lectura dentro de las ventanas.
- **Textura de firma**: scanlines sutiles sobre el fondo del escritorio (mezcla `overlay`, muy baja opacidad) — un guiño a monitor CRT sin caer en el cliché de fondo verde matrix.
- **Esquinas redondeadas (revisado)**: la nota original de este documento decía "sin border-radius, todo en ángulo recto" — eso describía el chrome flotante (taskbar, Start menu, buscador, notificaciones, popover rápido), que en la práctica siempre usó `rounded-xl`/`rounded-2xl`. Lo que sí estaba 100% recto era el *contenido* de las apps (Settings, About, Skills, Contact, Stats, Experience, pestañas de Projects, widgets flotantes) — puro `border` sin radio, lo que en una sesión posterior (ver sección 12, pase "des-cuadriculado") se identificó como el motivo de que la UI se sintiera "vieja"/tipo Tetris. Se corrigió extendiendo el mismo lenguaje redondeado del chrome al contenido (`rounded-lg` en tarjetas/cards, `rounded-full` en chips/pills, `rounded-xl` en paneles). La única esquina 100% recta que queda a propósito es el marco de una ventana **maximizada** (`Window.tsx`: `win.isMaximized ? "" : "rounded-xl"`) — edge-to-edge, como cualquier OS real.

Este resultado ya cumple el objetivo de "no parecer copia de Windows/macOS": no hay dock curvo tipo macOS ni barra de tareas tipo Windows — es una taskbar plana propia.

---

## 12. Roadmap de fases (visión completa del proyecto)

**Fase 1 — Esqueleto funcional** ✅ completa
Store de ventanas, componente Window, taskbar básica.

**Fase 2 — Contenido real** ✅ completa (base)
Apps con datos reales de Juan, Explorer, Terminal con comandos base.

**Fase 3 — Terminal avanzada + comandos del spec ampliado** ✅ completa
`experience`, `education`, `theme`, `date`, `time`, `matrix`, `shutdown`, `music` — todos implementados como comandos de la Terminal. Nota: `theme` y `music` hoy alternan los mismos estados globales que ya existían (Konami/Settings) en lugar de crear sistemas nuevos; el sistema de temas múltiples completo (Claro, Glass, Aurora, Midnight, Minimal) sigue siendo trabajo de Fase 4.

**Fase 4 — Pulido, personalidad y configuración real** ✅ completa
Sonidos reales (sintetizados via Web Audio, sin assets externos), wallpapers (6 presets + subida propia), sistema de temas múltiples (6 presets, Settings deja de ser solo un toggle), efecto Glass opcional, widgets de escritorio (6 de 7 — sin clima), centro de notificaciones, buscador global. Todo persistido en localStorage via `settingsStore.ts`.

**Mejoras integradas de una rama alterna** (revisada y fusionada): `safeStorage.ts` (wrapper de localStorage que nunca lanza, protege contra cuota excedida por wallpapers custom grandes), límite de 3MB + validación en la subida de wallpaper, botón para quitar wallpaper personalizado, preview real (no solo texto) en el selector de wallpaper, wallpaper "Puntos" nuevo, `Wallpaper.tsx` separado de `Desktop.tsx` como capa propia, efecto Glass reescrito por-componente con sombra real (`shadow-[0_24px_70px_-20px_rgba(0,0,0,0.75)]`) en 3 capas (titlebar/superficie/contenido), y `soundManager.ts` refactorizado para chequear `soundEnabled` internamente (en vez de en cada punto de llamada) con try/catch defensivo, más sonidos de minimizar/maximizar/restaurar.

**Mejoras integradas sobre el sistema de Projects** (sesión posterior a Fase 4):
- **Demo embebido con animación de instalación**: nuevo tipo de ventana `demo:<projectId>` (`DemoApp.tsx` + `openDemoApp` en `windowStore.ts`). El botón "Run Application" de `ProjectApp` ya no abre una pestaña externa — dispara una animación de 5 pasos ("Resolviendo dependencias" → "Listo") y luego carga el demo real en un `<iframe>` dentro de la propia ventana JOS. Si el sitio bloquea el embed (X-Frame-Options/CSP), se detecta por timeout y cae a un aviso con botón para abrir en pestaña nueva.
- **Datos reales de GitHub** (`useGithubRepoInfo.ts`): estrellas, forks, issues abiertos, licencia, último commit (sha/mensaje/fecha) y último release, vía la API pública sin autenticar. Caché en memoria por sesión (no localStorage, para no gastar cuota de rate limit de más al reabrir la misma app) y fallo silencioso (offline, repo privado, sin releases) sin romper el resto de la UI.
- **`fileTree` como campo real de `Project`**: la pestaña "Files" de `ProjectApp` ya no simula una estructura genérica — muestra el árbol de archivos real de cada proyecto completo.
- **YopVial, Zona Segura y "Dulce Encanto — Storefront" (boutique)** pasaron a ser proyectos "completos" (capturas, README embebido, technologies, features, fileTree, links de demo/github). Jobsy y API CRUD Tienda siguen pendientes de este mismo tratamiento.

**Fase 5 — Sistema de versiones evolutivo** ✅
Nueva app `Versions` (`src/apps/Versions.tsx` + `src/data/versions.ts`), ícono propio en el escritorio, ventana registrada en `WindowManager`/`windowStore`/`apps.ts`/`icons.tsx`, y comando `version`/`changelog` en la Terminal. v1.0 Estudiante ADSO (released) → v2.0 Monitor SENA (current) → v3.0 Primer empleo / v4.0 Nuevas certificaciones / v5.0 Metas futuras (roadmap, marcadas explícitamente como no logradas aún). El changelog de v1.0/v2.0 esta anclado a hechos reales ya presentes en `profile.ts` (incluida la certificación de Marketing Digital, que estaba en el CV pero faltaba en el proyecto — se agregó). No gatea ni oculta ninguna app real detrás de una versión: es un historial/roadmap narrativo, no un sistema de desbloqueo funcional (decisión consciente: un portafolio para reclutadores no debe esconder contenido).

**Fase 6 — Juan AI + responsividad + optimización** 🔜 (en curso)
Asistente conversacional dentro del sistema, lazy loading por app, auditoría de accesibilidad y SEO.

*Modo mobile* ✅ — resuelto sin encoger el escritorio. Por debajo de 768px (`useIsMobile`)
`App.tsx` deja de montar el escritorio y sirve `MobileShell.tsx`, que envuelve el
portafolio tradicional que ya existía en `src/traditional/`. El razonamiento: un sistema
de ventanas arrastrables está pensado para ratón y pantalla grande, y la mayoría de
visitas llegan desde un móvil (enlace compartido en LinkedIn/WhatsApp) — encoger JOS lo
volvía inservible, así que el móvil recibe el mismo contenido en el formato que esa
pantalla sí sabe mostrar. Detalles: el escritorio sigue accesible con un botón flotante y
esa elección se recuerda (`jos-force-desktop` en localStorage); los deep links
(`?open=project:agroia`) se traducen a la sección equivalente de la página vía
`DEEP_LINK_SECTION`, en vez de ignorarse; el auto-lock, la notificación de bienvenida y la
apertura de ventanas se desactivan en móvil. `MobileShell` va en `lazy()`, así que el
escritorio no arrastra el portafolio tradicional en su bundle de arranque
(`TraditionalPortfolio` quedó en un chunk propio de 16 kB, compartido con `BrowserApp`).

**Pase de pulido premium** (sesión posterior a Fase 5, en curso, fase a fase):

*Fase 1 — corrección de layout antinatural + profundidad* ✅
El spawn de ventanas nuevas (`nextSpawnOffset` en `windowStore.ts`) y el layout por defecto de los iconos del escritorio (`computeDefaultLayout` en `Desktop.tsx`) centraban todo como bloque simétrico — en monitores grandes se sentía artificial, como una isla flotando en escritorio vacío en vez de un sistema operativo real. Ahora los iconos anclan a la esquina superior-izquierda (llenando filas, envolviendo hacia abajo) y las ventanas nuevas cascadean desde ahí con un margen de respiro, en vez de nacer centradas. El contenido de las apps de una columna (`Window.tsx`) ya no se centra verticalmente (`my-auto`) — se alinea arriba como cualquier app real, solo el ancho de lectura sigue centrado. Se sumó el efecto de profundidad que quedaba pendiente de la sección 4.3: las ventanas sin foco bajan brillo/saturación (`brightness-90 saturate-75`) para que la activa haga "pop" por contraste.

*Fase 2 — completar apps existentes* ✅
Stats/Analytics reescrito para usar datos reales de GitHub (`useGithubProfileStats.ts`: repos, estrellas propias sin forks, lenguajes distintos, seguidores) con animación count-up y barras de "lenguajes principales" — se eliminó el número de "Commits" que era inventado. Contact ahora tiene un formulario real (arma un `mailto:` con lo escrito) y enlace de WhatsApp (ícono propio nuevo). Nueva app **Resume** (`src/apps/Resume.tsx`) con visor de PDF embebido — antes el botón CV solo abría About. De paso se corrigió `JOS_PROYECTO.md`: las notas de "falta foto/objetivos/idiomas" en About y "falta logros/tecnologías" en Experience estaban desactualizadas, esos datos ya estaban implementados en `profile.ts`.

**Pase de "ruta nueva" — auditoría técnica y UX profesional** (sesión posterior, en curso, fase a fase): tras una auditoría del código real (no solo de este documento) se definió un roadmap en 3 fases — Alcance real → Robustez de código → Wow factor (Juan AI) — a implementar una por sesión.

*Fase 1 — Alcance real* ✅
Ver el detalle recién agregado en la sección 9: modo mobile real (`useIsMobile.ts` + rama mobile en `Window.tsx`/ajustes en `Taskbar.tsx`/`Desktop.tsx`), code splitting por app (`React.lazy` en `WindowManager.tsx`), meta tags OG/Twitter en `index.html`, y `ErrorBoundary.tsx` por ventana. Verificado con `npm run build` (chunks separados por app, confirmados en el output) y `npm run lint` (sin hallazgos nuevos en `src/`). Pendiente de verificación manual en navegador real (extensión Claude in Chrome no estaba conectada en esta sesión): comportamiento táctil real en un dispositivo, y el fallback visual del Error Boundary disparado por un error real.

*Fase 2 — Robustez de código* ✅
`Taskbar.tsx` (492→198 líneas) partido en `src/components/taskbar/`: `TaskbarPreview.tsx` (clon de DOM para el hover-preview), `OpenWindowsGroup.tsx`, `QuickLinksGroup.tsx`, `SystemGroup.tsx`, `QuickSettingsPopover.tsx`. `ProjectApp.tsx` (573→130 líneas) partido en `src/apps/project/`: `MiniMarkdown.tsx`, `GithubBadges.tsx`, `FileTree.tsx`, y una pieza por tab (`OverviewTab`, `ReadmeTab`, `ModulesTab`, `ArchitectureTab`, `GalleryTab`, `FilesTab`). Accesibilidad: ver detalle en sección 9 — alcance deliberadamente acotado a roles/foco/Escape, sin un patrón ARIA `menu` completo (roving tabindex con flechas), porque un rol a medias confunde más a un lector de pantalla que uno simple pero honesto. Verificado con `npm run build` + `npm run lint` + `tsc -b` (con `noUnusedLocals`/`noUnusedParameters` activos, así que no quedaron símbolos huérfanos del split). Pendiente de verificación manual en navegador real (igual que Fase 1).

*Fase 2.5 — Refactor UI/UX "des-cuadriculado" + fixes de maximizado* ✅ (sesión posterior, insertada antes de Fase 3 a pedido explícito del usuario tras reportar que la UI se sentía "cuadriculada"/tipo Tetris y poco profesional)
- **Rediseño de Settings**: pasó de una lista vertical de secciones bordeadas a un panel de 2 columnas (categorías a la izquierda + detalle a la derecha, como Windows/macOS Settings) — `Settings.tsx` ahora es `fullBleed` en `WindowManager.tsx` (antes compartía el ancho máximo centrado de 760px de About/Skills, que es justo lo que hacía que maximizar no reorganizara nada). Usa `@container`/`@lg:` de Tailwind v4 (no breakpoints de viewport) para que el layout reaccione al ancho real de la ventana, no al del navegador — se apila en una barra de categorías horizontal cuando la ventana es angosta (incluido el `MIN_WIDTH` de 320px). El toggle a mano pasó de un rectángulo sin redondear a un switch tipo píldora.
- **Barrido visual "des-cuadriculado" en el resto del sistema**: mismo patrón mecánico (paneles → `rounded-xl` + fondo tonal sutil, tarjetas → `rounded-lg`, chips/tags/badges → `rounded-full`, botones/inputs → `rounded-lg`) aplicado a About, Skills, Contact, Stats, Experience, las pestañas de Projects (`Overview/Modules/GithubBadges/MiniMarkdown/Gallery`), los widgets flotantes (`FloatingWidget`/`MusicWidget`/`NotesWidget`/`CalendarWidget`), `QuickSettingsPopover`, `ErrorBoundary`, `Resume`, `DemoApp` y `ProjectApp`. De paso se encontró y corrigió un caso que la identidad de diseño original no reflejaba: **`GlobalSearch.tsx`** (el command palette de Ctrl/Cmd+K) no tenía ningún redondeo pese a ser un overlay flotante — a diferencia de StartMenu/NotificationCenter/QuickSettingsPopover, que sí lo tenían.
- **Bug de maximizado corregido** (colisión intermitente con la taskbar / "parte de la ventana queda flotando"): causa raíz confirmada — `getMaximizedRect()` (`windowStore.ts`) lee `window.innerWidth/innerHeight` en el momento del render, pero nada forzaba un re-render de una ventana ya maximizada cuando el viewport cambiaba de alto sin que otro evento disparara un re-render (típico: la barra de direcciones de un navegador móvil se oculta/muestra). La taskbar (puro CSS) sí seguía el viewport real al instante, así que el rect maximizado quedaba "viejo" y parecía chocar. Fix: `Window.tsx` ahora escucha `resize` mientras `win.isMaximized` es true y fuerza el recálculo. Se sumó `App.tsx`: `h-screen` (100vh) → `h-dvh`, que es la causa clásica de ese mismo síntoma en navegadores móviles (100vh puede exceder el viewport visible real cuando el chrome del navegador está mostrando su barra de direcciones).
- **Embeds de proyecto bloqueados (`DemoApp.tsx`)**: no es un bug — se confirmó que el código ya detecta el bloqueo por `X-Frame-Options`/CSP del sitio de destino (timeout de carga) y cae a un botón "abrir en pestaña nueva", que es el máximo que se puede hacer desde el cliente sin acceso al hosting del proyecto embebido. Sigue pendiente de una solución real (permitir `frame-ancestors` desde el hosting de cada proyecto, o un proxy propio) — depende de la función serverless de Fase 3.
- **Bug encontrado durante la verificación visual (Claude in Chrome sí se conectó esta vez)**: el panel de 2 columnas de Settings no se activaba al maximizar — quedaba un hueco vacío enorme arriba del contenido. Causa: `@container` y `@lg:flex-row` estaban en el mismo `<div>` (`className="@container flex h-full flex-col @lg:flex-row"`). Un elemento que declara `@container` no puede reaccionar a su propia consulta de tamaño — una container query siempre mira al contenedor ANCESTRO más cercano, nunca a sí mismo (por eso `nav`, que sí era hijo de ese div, reaccionaba bien a `@lg:flex-col`/`@lg:w-52`, pero el propio div con `@container` nunca activaba su `@lg:flex-row`). Fix: separar en dos divs — uno externo solo con `@container`, uno interno (hijo) con `flex-col @lg:flex-row`. Confirmado visualmente después: maximizar Settings ahora sí muestra el sidebar de categorías a la izquierda + contenido a la derecha sin hueco, y restaurar a tamaño chico vuelve a la barra de categorías horizontal compacta. También se confirmó a ojo que el buscador global (`GlobalSearch.tsx`) ya se ve con esquinas redondeadas y que About/Contact muestran los chips como píldoras.
- Verificado con `tsc -b` + `npm run build` (chunks intactos) + `npm run lint` (limpio en `src/`) + verificación visual manual en navegador real.

*Pase "Portafolio dentro del portafolio"* ✅ (sesión posterior, fuera de la numeración de fases — pedido explícito del usuario)
- **Origen**: el usuario apuntó a una carpeta distinta del proyecto (`jos-portfolio-updated (7)`, una rama divergente de esta) donde en algún momento se había construido un **portafolio tradicional scrolleable** (`src/traditional/`: Nav/Hero/About/Experience/Projects/Skills/Contact/Footer) y se había reemplazado `App.tsx` para que ese fuera el punto de entrada en vez de JOS — decisión documentada solo en un comentario de código ("no apostar la primera impresión de un reclutador a un sistema de ventanas"), nunca en este documento, y nunca fusionada con el trabajo hecho en esta carpeta. Primera idea del usuario fue literalmente al revés de lo que se terminó construyendo: pidió "un portafolio dentro del portafolio, tipo metaverso" pensando en JOS como el mundo escondido *dentro* del sitio tradicional — pero al aclarar, lo que en realidad quería era mantener JOS como shell principal (como está hoy) y meter el portafolio tradicional *adentro* de JOS, como una app más.
- **Qué se hizo**: se copió `src/traditional/` de la rama (7) hacia esta carpeta y se montó como una app nueva, `site` (ícono `Globe`, título "Portfolio Web", entrada en `DESKTOP_ICON_ORDER` justo antes de Settings). Se presenta dentro de una ventana con chrome de mini-navegador (`src/apps/BrowserApp.tsx`): barra de direcciones falsa (`juanesteban.dev`, ícono de candado), botones de atrás/adelante decorativos, y un botón de recargar real que remonta `<TraditionalPortfolio>` (vuelve al tope de scroll) para vender la sensación de "se recargó la página".
- **Bugs de integración corregidos** (el código traído de (7) asumía ser una página top-level, no una app embebida):
  - `Nav.tsx` usaba `position: fixed` + `window.scrollY`/`window.addEventListener("scroll")` + `IntersectionObserver` sin `root` — todo eso apunta al viewport/documento real, que en JOS nunca scrollea (`body { overflow: hidden }` en `index.css`; lo que scrollea es el div interno de la ventana). Fix: `Nav` ahora recibe un `scrollContainerRef` (creado en `BrowserApp`, pasado por `TraditionalPortfolio`) — `fixed` pasó a `sticky`, y tanto el listener de scroll como el `root` del `IntersectionObserver` apuntan a ese contenedor real en vez de a `window`.
  - `min-h-screen` (100vh real) en `Hero.tsx`/`TraditionalPortfolio.tsx` asumía página completa → `min-h-full` (llena el alto disponible de la ventana, no el monitor). Se sacó el `pt-20` del Hero que compensaba el nav `fixed` — ya no hace falta porque `sticky` ocupa su propio espacio en el flujo normal.
  - Mismo barrido visual "des-cuadriculado" de la Fase 2.5 aplicado a los 8 archivos de `src/traditional/` (venían con el estilo viejo de cajas 100% rectas, sin tocar desde su sesión original).
- Verificado con `tsc -b` + `npm run build` (chunk propio `BrowserApp-*.js`) + `npm run lint` (limpio en `src/`) + prueba visual real en navegador: la app abre, el nav se pega al tope *de la ventana* (no de toda la pantalla) y resalta la sección correcta al hacer scroll, maximizar/restaurar funciona, y los links de contacto (WhatsApp) abren correctamente en pestaña nueva.
- Pendiente/fuera de alcance de este pase: la carpeta (7) sigue teniendo su propio historial divergente (aún sin el refactor de Fase 2.5) — no se tocó, solo se copió `traditional/` desde ahí. Si en el futuro hay más contenido en (7) que valga la pena traer, hay que revisarlo caso por caso.

*Pase "Deep-linking"* ✅ (sesión posterior — pedido explícito del usuario: "¿qué más podemos hacer para llevar esto al siguiente nivel? no hablo del chatbot")
- **Motivación**: hoy todo visitante entra al mismo escritorio vacío sin importar por qué llegó — si Juan quiere mandarle a un reclutador el link directo a un proyecto puntual, no existía forma de hacerlo sin que la persona tuviera que bootear el sistema y clickear hasta encontrarlo. No requiere backend: es 100% client-side, funciona en cualquier hosting estático.
- **Cómo funciona**: `src/lib/deepLink.ts` expone `getDeepLinkTarget()` (lee `?open=<appId>` de la URL, valida que sea una app fija real de `APPS` o tenga forma `project:`/`demo:`) y `buildDeepLink(appId)` (arma la URL absoluta compartible). `App.tsx` lee el target una sola vez al montar (`useRef`): si hay uno, arranca el `systemState` directo en `"running"` (se saltea `BootScreen` y el tour de `Onboarding`) y un efecto de una sola vez resuelve el id contra `APPS`/`projects.ts` y llama `openApp`/`openProjectApp`/`openDemoApp` — la ventana se abre con su animación normal, solo se salteó la introducción del sistema operativo. Un id inválido o desconocido simplemente se ignora (bootea normal).
- **Botón "Compartir"**: `ProjectApp.tsx` tiene un botón en el header (ícono `Link2`, feedback visual "Copiado" con `Check` por ~1.8s) que copia `buildDeepLink('project:<id>')` al portapapeles — el lado "generar el link" de la funcionalidad, sin el cual el deep-linking solo serviría si Juan escribiera la URL a mano.
- **Bug real encontrado y corregido de paso** (no relacionado al deep-linking en sí, pero se topó al probar `ProjectApp` en el navegador): `useGithubRepoInfo.ts` tenía un loop infinito de renders (`Maximum update depth exceeded`) — el `useEffect` dependía de `parsed`, un objeto que `parseOwnerRepo()` recrea en cada render (nunca es referencialmente igual al anterior aunque tenga los mismos valores), así que el efecto se disparaba en cada render, sin importar si `githubUrl` había cambiado. Pasaba **siempre** que se abría cualquier proyecto con link de GitHub, no solo con deep-linking. Fix: el efecto ahora depende solo de `githubUrl` (string, se compara por valor) y recalcula `parsed`/`cacheKey` adentro del propio efecto.
- Verificado con `tsc -b` + `npm run build` (chunk `BrowserApp`/`ProjectApp` sin cambios de tamaño relevantes) + `npm run lint` (limpio en `src/`) + prueba real en navegador: `?open=project:yopvial` abre directo esa ventana sin boot ni onboarding; el botón Compartir cambia a "Copiado" y genera la URL correcta (verificado disparando el click y leyendo `buildDeepLink` desde consola — la lectura del portapapeles en sí no se pudo verificar por una limitación del entorno de automatización, "Document is not focused", no del código).

*Fase 3 — Juan AI + wow factor* 🔜 (sesión futura)
Asistente conversacional vía función serverless propia (queda pendiente decidir dónde se deploya el sitio, ya que Vite es 100% client-side y no puede guardar una API key de forma segura). Detalles adicionales de "realismo de OS": menú contextual, reordenar iconos, micro-interacciones.

*Despliegue — GitHub Pages* ✅ configurado 2026-08-27 (fuera de la numeración de fases)
Sitio estático publicado en **GitHub Pages** vía **GitHub Actions** (build en la nube, sin rama `gh-pages`).
- **Repo:** `github.com/juanezzzzz/portafolio-personal` · **URL:** `https://juanezzzzz.github.io/portafolio-personal/`
- **Guía completa y troubleshooting:** `DESPLIEGUE.md` en la raíz.
- Cambios de código que exige el Pages de proyecto (subruta `/portafolio-personal/`, no raíz de dominio): `vite.config.ts` con `base: "/portafolio-personal/"`; nuevo helper `src/lib/asset.ts` (`asset()`) que prefija toda ruta de `/public` con `import.meta.env.BASE_URL` — aplicado en `settingsStore.ts` (wallpapers), `profile.ts` (`cvUrl`/`photoUrl`) y `ProjectApp.tsx` (`screenshots.map(asset)`). **Regla:** cualquier ruta nueva a `/public` va envuelta en `asset("/...")`, nunca string absoluto pelado.
- `index.html`: `og:image`/`twitter:image`/`og:url` pasados a URL absoluta completa (Vite no reescribe metaetiquetas).
- `public/404.html`: redirige a `/portafolio-personal/` conservando `?query` (red de seguridad para deep-links).
- `.github/workflows/deploy.yml` (Node 22, `npm ci`, `npm run build`, `upload-pages-artifact` + `deploy-pages`). Dispara en push a `main`.
- **En vivo y funcionando (2026-08-27).** El usuario activó Pages (Settings → Pages → Source → "GitHub Actions"); el workflow pasa `build` + `deploy` y `https://juanezzzzz.github.io/portafolio-personal/` sirve el sitio con todos los assets (wallpapers, CV, foto, 404.html) en 200. El primer run falló solo en el paso deploy por no tener Pages activo todavía; se re-lanzó con un commit vacío tras activarlo.
- Verificado: `tsc -b` + `npm run build` (rutas `/portafolio-personal/…` correctas en `dist/index.html`) + `npm run preview` con `curl` + la URL pública real con `curl` (todo 200).
- La Fase 3 (Juan AI) sigue necesitando decidir hosting con funciones serverless — Pages solo sirve estáticos; opciones en `DESPLIEGUE.md` §11.

---

## 13. Cómo retomar el proyecto

```bash
cd jos
npm install
npm run dev
```

Estructura completa documentada en `README.md`. Los datos editables (perfil, proyectos) están aislados en `src/data/` para que cualquier cambio de contenido no toque lógica de componentes.
