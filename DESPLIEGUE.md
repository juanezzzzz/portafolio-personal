# Despliegue — JOS en GitHub Pages

Guía completa para publicar JOS ("Juan Operating System") en GitHub Pages y
mantenerlo actualizado.

- **Repositorio:** `https://github.com/juanezzzzz/portafolio-personal`
- **URL pública final:** `https://juanezzzzz.github.io/portafolio-personal/`
- **Método:** GitHub Actions (build en la nube, sin rama `gh-pages`, sin subir `dist/`)

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
key, algo que GitHub Pages **no** puede hostear (solo sirve estáticos). Cuando se
llegue a esa fase habrá que:

- o mover el hosting a Vercel/Netlify/Cloudflare Pages (que sí tienen funciones),
- o dejar el sitio en GitHub Pages y hostear solo la función aparte
  (Cloudflare Workers / Vercel Functions) y llamarla por fetch desde el cliente.

Ese cambio no afecta lo descrito aquí hasta que la Fase 3 empiece.
