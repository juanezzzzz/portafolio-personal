import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` es la subruta donde se sirve el sitio. En GitHub Pages de proyecto
// (juanezzzzz.github.io/portafolio-personal/) tiene que coincidir con el nombre
// del repo. En dev Vite lo ignora y sirve en "/". Si algun dia se pasa a dominio
// propio o a un repo <usuario>.github.io, cambiar a "/".
export default defineConfig({
  base: "/portafolio-personal/",
  plugins: [react(), tailwindcss()],
})
