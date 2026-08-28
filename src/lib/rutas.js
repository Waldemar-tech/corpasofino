/**
 * Helpers de rutas por marca.
 *
 * Viven en un módulo aparte y no en el frontmatter de cada página
 * porque Astro **iza** `getStaticPaths` fuera del frontmatter: esa
 * función sólo ve los imports del archivo, no las constantes
 * declaradas junto a ella. Si se define el helper arriba y se usa
 * dentro de getStaticPaths, el build falla con "no está definido".
 */

/**
 * El contenido vive en carpetas por marca, así que el id de la
 * colección viene como "foodie/ketchup". Esto devuelve "ketchup",
 * que es el último segmento de la URL.
 */
export const slugDe = (id) => id.split('/').pop();

/** URL pública de un producto. */
export const urlProducto = (entrada) =>
  `/${entrada.data.marca}/productos/${slugDe(entrada.id)}`;

/** URL pública de una receta. */
export const urlReceta = (entrada) =>
  `/${entrada.data.marca}/recetas/${slugDe(entrada.id)}`;
