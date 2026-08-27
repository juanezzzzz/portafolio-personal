# JOS — Juan Operating System

Portafolio interactivo estilo sistema operativo. Fase 1-2 del roadmap: sistema de ventanas funcional + contenido real.

## Como correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Antes de publicarlo

Edita tus datos reales en:
- `src/data/profile.ts` — nombre, correo, GitHub, LinkedIn, bio, experiencia, educacion, skills, stats
- `src/data/projects.ts` — tus proyectos

## Estructura

```
src/
├── store/windowStore.ts      # estado global de ventanas (Zustand)
├── components/
│   ├── Window.tsx             # ventana generica (drag/resize/min/max)
│   ├── Desktop.tsx            # iconos del escritorio
│   ├── Taskbar.tsx            # barra inferior + reloj + start menu
│   ├── StartMenu.tsx
│   ├── WindowManager.tsx      # conecta ventanas del store con su app
│   ├── BootScreen.tsx
│   ├── LockScreen.tsx         # auto-lock a los 5 min de inactividad
│   └── FakeBSOD.tsx           # easter egg
├── apps/                      # contenido de cada ventana
│   ├── About.tsx, Projects.tsx, Experience.tsx, Education.tsx
│   ├── Skills.tsx, Stats.tsx, Contact.tsx, Explorer.tsx, Settings.tsx
│   └── Terminal.tsx           # terminal con comandos + historial
├── data/                      # tus datos editables + registro de apps
└── hooks/                     # useClock, useKonamiCode
```

## Easter eggs ya implementados

- `sudo hire juan` en la terminal
- `sudo rm -rf /` en la terminal -> BSOD falso -> "Just kidding"
- Konami code (flecha arriba, arriba, abajo, abajo, izquierda, derecha, izquierda, derecha, b, a) -> cambia el acento de ambar a cyan

## Roadmap pendiente (Fases 3-5 del plan original)

- [ ] Sonido al abrir/cerrar ventanas (toggle ya existe en Settings, falta el audio)
- [ ] Wallpaper configurable
- [ ] Sistema de versiones evolutivo (v1.0 Estudiante -> v2.0 Monitor -> v3.0 Primer empleo...)
- [ ] Responsive / version mobile del sistema de ventanas
- [ ] Reemplazar datos placeholder por tus datos reales
