# Despliegue — JOS

JOS se publica **en dos sitios a la vez** desde el mismo repositorio y la misma
rama `main`:

| Destino | URL | Se sirve en | Método |
| --- | --- | --- | --- |
| **Vercel** (principal) | *(pendiente de conectar)* | la raíz del dominio | Integración con GitHub: cada push a `main` despliega |
| **GitHub Pages** | `https://juanezzzzz.github.io/portafolio-personal/` | la subruta `/portafolio-personal/` | GitHub Actions (`.github/workflows/deploy.yml`) |

- **Repositorio:** `https://github.com/juanezzzzz/portafolio-personal`
- Ninguno de los dos versiona `dist/` ni usa rama `gh-pages`.

## La pieza clave: el `base` cambia según el destino

Vite necesita saber bajo qué ruta se sirve el sitio para escribir bien los
`<script src>` y `<link href>`. Y no es la misma en los dos destinos:

```
Vercel        -> https://<dominio>/              -> base "/"
GitHub Pages  -> https://…/portafolio-personal/  -> base "/portafolio-personal/"
```

Por eso `vite.config.ts` **no** lo tiene fijo, sino que lo lee del entorno:

```ts
const base = process.env.DEPLOY_BASE ?? "/";
```

- **Vercel** compila sin la variable → `base = "/"`. Correcto, sin configurar nada.
- **GitHub Pages**: el workflow exporta `DEPLOY_BASE: /portafolio-personal/` en el
  paso de build.
- **`npm run dev`**: Vite ignora el `base` y sirve en `/`.

> Si algún día se rompe el sitio de Pages con pantalla en blanco y 404 de
> `assets/*.js`, lo primero que hay que mirar es que el workflow siga
> exportando `DEPLOY_BASE`.

---

## 1. Cómo funciona

JOS es una app 100 % client-side (Vite + React). No hay servidor: el build
genera archivos estáticos (`dist/`) que GitHub Pages sirve tal cual.

```
push a main ──> GitHub Actions ──> npm ci + npm run build ──> sube dist/ ──> GitHub Pages
                (.github/workflows/deploy.yml)                                juanezzzzz.github.io/portafolio-personal/
```

Cada vez que hagas `git push` a la rama `main`, el sitio se recompila y se
vuelve a publicar solo. No hay que compilar en local ni versionar `dist/`.

---

## 2. Cambios ya aplicados al proyecto para el despliegue

Estos cambios ya están en el código; se documentan para que se entienda por qué
están y qué tocar si cambia la URL:

| Archivo | Cambio | Motivo |
| --- | --- | --- |
| `vite.config.ts` | `base: "/portafolio-personal/"` | Pages de proyecto sirve el sitio bajo `/<nombre-repo>/`, no en la raíz del dominio. Sin esto, todos los `assets/*.js` y `*.css` dan 404 y sale pantalla en blanco. |
| `src/lib/asset.ts` | Helper `asset()` nuevo | Prefija rutas de `/public` (wallpapers, CV, foto, capturas) con el `base` real. Las rutas absolutas tipo `/wallpapers/x.webp` apuntarían a la raíz del dominio y darían 404 bajo subruta. |
| `src/store/settingsStore.ts` | `WALLPAPER_IMAGES` envuelto en `asset()` | Fondos de pantalla. |
| `src/data/profile.ts` | `cvUrl` y `photoUrl` envueltos en `asset()` | PDF del CV y foto de About. |
| `src/apps/ProjectApp.tsx` | `project.screenshots.map(asset)` | Capturas de cada proyecto (galería y overview). |
| `index.html` | `og:image` / `twitter:image` / `og:url` con URL absoluta completa | Las metaetiquetas de redes sociales necesitan URL absoluta; Vite no las reescribe. |
| `public/404.html` | Redirección a `/portafolio-personal/` conservando `?query` | Red de seguridad para deep-links (`?open=project:yopvial`) si alguien entra por una ruta inexistente. |
| `.github/workflows/deploy.yml` | Workflow de build + deploy | La automatización en sí. |
| `.gitignore` | Ignora `node_modules/`, `dist/`, `.env`, herramientas locales | — |

**Regla de oro:** cualquier ruta nueva a un archivo de `/public` debe pasar por
`asset("/ruta/al/archivo")`. Nunca `"/ruta/al/archivo"` a secas.

---

## 2.5 Conectar Vercel (una sola vez)

Vercel se conecta desde su panel, importando el repo de GitHub. No hace falta
CLI ni tocar el código: `vercel.json` ya está en el repo.

1. Entra a `https://vercel.com/new` con tu cuenta de GitHub.
2. **Import Git Repository** → elige `juanezzzzz/portafolio-personal`.
3. Vercel detecta Vite solo. Deja los valores por defecto:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - **No** definas la variable `DEPLOY_BASE` — su ausencia es lo que hace que
     el `base` quede en `/`, que es lo correcto para Vercel.
4. **Deploy**. En 1–2 minutos queda en `https://<proyecto>.vercel.app`.

A partir de ahí, cada push a `main` despliega en Vercel **y** en Pages, en
paralelo e independientes.

### Qué aporta `vercel.json`

| Clave | Para qué |
| --- | --- |
| `rewrites` | JOS es una SPA: cualquier ruta debe servir `index.html` para que los deep-links (`?open=project:agroia`) no den 404. Es el equivalente en Vercel al `public/404.html` de Pages. |
| `headers` | Caché inmutable de un año para `/assets/*`, que ya llevan hash en el nombre. |

### Después del primer deploy

Las metaetiquetas `og:url`, `og:image` y `twitter:image` de `index.html` siguen
apuntando a la URL de GitHub Pages. Cuando exista el dominio de Vercel hay que
cambiarlas a la URL canónica, porque son absolutas y Vite no las reescribe.

---

## 3. Requisitos previos (una sola vez)

- Cuenta de GitHub `juanezzzzz` con el repo `portafolio-personal` **creado y vacío**
  (sin README, sin licencia, sin `.gitignore` — para que el primer push no
  choque).
- Git configurado en local con tu identidad:

  ```bash
  git config --global user.name "Juan Esteban Valencia"
  git config --global user.email "jv2063616@gmail.com"
  ```

- Autenticación con GitHub desde la terminal (Personal Access Token como
  contraseña al hacer `git push`, o GitHub CLI con `gh auth login`).

---

## 4. Subir el proyecto al repositorio (una sola vez)

Desde la carpeta del proyecto (`.../jos`):

```bash
git init -b main
git add .
git commit -m "chore: configuración inicial de despliegue en GitHub Pages"
git remote add origin https://github.com/juanezzzzz/portafolio-personal.git
git push -u origin main
```

> Si el repo ya tenía commits (por ejemplo un README creado desde la web),
> primero `git pull --rebase origin main` y luego el push.

---

## 5. Activar GitHub Pages (una sola vez)

1. En GitHub, abre el repo → **Settings** → **Pages** (menú lateral).
2. En **Build and deployment** → **Source**, elige **GitHub Actions**.
   (NO "Deploy from a branch".)
3. Listo. No hay que elegir carpeta ni rama.

En cuanto termine el primer workflow, el sitio queda en:
`https://juanezzzzz.github.io/portafolio-personal/`

---

## 6. Verificar el despliegue

1. Repo → pestaña **Actions** → debería estar corriendo (o ya en verde) el
   workflow **"Deploy a GitHub Pages"**.
2. Al terminar, el job `deploy` muestra la URL publicada.
3. Abre `https://juanezzzzz.github.io/portafolio-personal/` y comprueba:
   - Carga el escritorio (no pantalla en blanco).
   - Abre **Ajustes → Fondo** y cambia el wallpaper → la imagen carga.
   - Abre un **proyecto** con capturas → la galería muestra las imágenes.
   - Abre **About** → se ve la foto y el botón de CV descarga el PDF.
   - Prueba un deep-link: `https://juanezzzzz.github.io/portafolio-personal/?open=project:yopvial`

---

## 7. Actualizaciones futuras

```bash
git add .
git commit -m "feat: describe el cambio"
git push
```

El push a `main` dispara el workflow y republica en 1–2 minutos. También se
puede lanzar a mano desde **Actions → Deploy a GitHub Pages → Run workflow**.

---

## 8. Probar el build de producción en local (opcional)

Antes de pushear un cambio grande, se puede reproducir exactamente lo que verá
Pages:

```bash
npm run build
npm run preview
```

`preview` respeta el `base`, así que la URL local será algo como
`http://localhost:4173/portafolio-personal/`.

---

## 9. Si algún día cambia la URL

| Escenario | Qué cambiar |
| --- | --- |
| Repo se renombra (ej. `jos`) | `base: "/jos/"` en `vite.config.ts` + las URLs absolutas de `index.html` + `public/404.html` |
| Se pasa a repo `juanezzzzz.github.io` | `base: "/"` en todo lo anterior (queda servido en la raíz) |
| Dominio propio (ej. `juanesteban.dev`) | `base: "/"`, añadir archivo `public/CNAME` con el dominio, y configurar DNS + Settings → Pages → Custom domain |

Tras cualquiera de estos cambios: `npm run build` local para verificar, commit y push.

---

## 10. Problemas frecuentes

| Síntoma | Causa / solución |
| --- | --- |
| **Pantalla en blanco**, consola con 404 de `assets/index-*.js` | `base` no coincide con el nombre del repo. Revisar `vite.config.ts`. |
| **Sitio carga pero sin wallpapers / fotos / CV** (404 en `/wallpapers/...`) | Alguna ruta de asset no pasa por `asset()`. Buscar strings `"/` con `wallpapers|projects|profile|cv` en `src/`. |
| **404 de GitHub al entrar directo a un deep-link** | `public/404.html` no se subió o el `base` dentro de él no coincide. |
| **El workflow falla en `npm ci`** | `package-lock.json` desincronizado. Corre `npm install` en local, commitea el lock y vuelve a pushear. |
| **Cambios no se ven** | Caché del navegador (Ctrl+F5) o el workflow todavía corriendo (pestaña Actions). |
| **La imagen de preview en WhatsApp/Twitter no aparece** | Las metaetiquetas `og:image` usan URL absoluta fija; si cambió la URL del sitio hay que actualizarlas en `index.html`. |

---

## 11. Nota sobre la Fase 3 (Juan AI)

El asistente conversacional planeado necesita una función serverless con una API
key, algo que GitHub Pages **no** puede hostear (solo sirve estáticos).

Con Vercel ya conectado, esto deja de ser un bloqueo: las funciones van en
`api/` en la raíz del repo y Vercel las despliega solas, con la API key guardada
en sus *Environment Variables* (nunca en el repo).

Ojo: esa función **solo** existirá en Vercel. La copia servida por GitHub Pages
seguirá siendo estática, así que Juan AI no funcionará ahí — habrá que decidir
si se apaga Pages en ese momento o si la app degrada la funcionalidad cuando el
endpoint no responde.
