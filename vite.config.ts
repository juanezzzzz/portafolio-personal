import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` es la subruta donde se sirve el sitio, y cambia segun el destino:
//
//   - Vercel (principal)      -> raiz del dominio        -> "/"   (por defecto)
//   - GitHub Pages de proyecto -> /portafolio-personal/  -> lo inyecta el
//     workflow con la variable de entorno DEPLOY_BASE.
//   - `npm run dev`            -> Vite ignora el base y sirve en "/".
//
// Todo lo que apunte a un archivo de /public debe pasar por `asset()` (ver
// src/lib/asset.ts), que lee este valor desde import.meta.env.BASE_URL.
const base = process.env.DEPLOY_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
