/**
 * ─────────────────────────────────────────────────────────────
 *  LAS MARCAS DE CORPORACIÓN PASO FINO
 * ─────────────────────────────────────────────────────────────
 *
 *  Paso Fino es la corporación (la raíz del sitio). De ella
 *  cuelgan dos líneas de producto que le hablan a públicos y
 *  bolsillos distintos:
 *
 *    · Foodie      → línea premium
 *    · Los Lirios  → línea de preparados, precio accesible
 *
 *  Todo lo que distingue a una marca de la otra vive acá: colores,
 *  copy, qué secciones tiene. Las páginas de producto y receta son
 *  las mismas plantillas para ambas y cambian de piel leyendo este
 *  archivo. Agregar una tercera marca mañana es agregar una entrada
 *  acá y una carpeta de contenido.
 */

export const MARCAS = {
  foodie: {
    slug: 'foodie',
    nombre: 'Foodie',
    nombreCompleto: 'Foodie',
    posicionamiento: 'Línea premium',

    titular: 'Un sabor para cada plato',
    descripcion:
      'La línea premium de Corporación Paso Fino. Salsas y aderezos de mesa para quien no negocia el sabor de lo que sirve.',
    descripcionCorta: 'Salsas y aderezos premium.',

    // Paleta definitiva, extraída del PDF original de la diseñadora.
    color: {
      principal: '#138B47',
      brillante: '#18AE59',
      oscuro: '#066A37',
      titulo: '#0F6B37',
      acento: '#E6A633',
    },

    tieneRecetas: true,
    // El lettering manuscrito y las ilustraciones sólo existen para
    // Foodie; Los Lirios los tendrá cuando llegue su diseño.
    tieneLettering: true,
    paletaDefinitiva: true,
  },

  'los-lirios': {
    slug: 'los-lirios',
    nombre: 'Los Lirios',
    nombreCompleto: 'Los Lirios',
    posicionamiento: 'Preparados y salsas de uso diario',

    titular: 'El sabor de todos los días',
    descripcion:
      'La línea de preparados de Corporación Paso Fino. Salsas de uso diario, pensadas para rendir en la cocina de casa y en la de un negocio.',
    descripcionCorta: 'Preparados y salsas de uso diario.',

    // ⚠️ PALETA PROVISIONAL
    // Derivada del verde corporativo Paso Fino hacia un rojo cálido,
    // para que Los Lirios se distinga de Foodie sin salirse de la
    // familia. NO es la identidad final: en cuanto el diseñador
    // entregue logo y colores, se reemplazan estos cinco valores y
    // toda la sección cambia sola.
    color: {
      principal: '#B33A2B',
      brillante: '#D14A36',
      oscuro: '#8A2A1E',
      titulo: '#8A2A1E',
      acento: '#E6A633',
    },

    tieneRecetas: false,
    tieneLettering: false,
    paletaDefinitiva: false,
  },
};

/** Orden en el que se muestran en el portafolio corporativo. */
export const ORDEN_MARCAS = ['foodie', 'los-lirios'];

export const listaMarcas = () => ORDEN_MARCAS.map((s) => MARCAS[s]);

export const getMarca = (slug) => MARCAS[slug];

/**
 * Devuelve las variables CSS de una marca, listas para inyectar en
 * un atributo style. Así una misma plantilla se pinta con la
 * identidad que toque sin duplicar una hoja de estilos por marca.
 */
export function variablesMarca(slug) {
  const m = MARCAS[slug];
  if (!m) return '';
  return [
    `--marca: ${m.color.principal}`,
    `--marca-brillante: ${m.color.brillante}`,
    `--marca-oscuro: ${m.color.oscuro}`,
    `--marca-titulo: ${m.color.titulo}`,
    `--marca-acento: ${m.color.acento}`,
  ].join('; ');
}

/** Navegación interna de una marca. */
export function navMarca(slug) {
  const m = MARCAS[slug];
  const base = [{ texto: 'Productos', href: `/${slug}/productos` }];
  if (m?.tieneRecetas) base.push({ texto: 'Recetas', href: `/${slug}/recetas` });
  return base;
}
