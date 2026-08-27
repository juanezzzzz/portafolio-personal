/**
 * Prefija una ruta de asset estatico (archivos de /public) con el base URL
 * que Vite inyecta en build. En `npm run dev` el base es "/", pero al
 * desplegar en GitHub Pages bajo una subruta (p. ej. "/portafolio-personal/") las
 * rutas absolutas tipo "/wallpapers/x.webp" apuntarian a la raiz del dominio
 * y darian 404. Envolviendolas con `asset()` quedan relativas al base real.
 *
 * Acepta rutas con o sin "/" inicial y las deja idempotentes.
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
