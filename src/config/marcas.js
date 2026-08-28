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
      claro: '#F2F2F4',
    },

    // Cabecera verde con el logotipo corporativo en blanco, tal como
    // se diseñó: Foodie no tiene logotipo propio en el header.
    header: {
      fondo: '#138B47',
      texto: '#FFFFFF',
      logo: 'pasofino-blanco',
      // Píldora del CTA de distribuidores: blanca sobre el verde.
      pastillaFondo: '#FFFFFF',
      pastillaTexto: '#138B47',
    },

    tipografia: {
      display: "'Anton', 'Arial Narrow', sans-serif",
      ancho: 'normal',
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

    /**
     * Paleta real, muestreada del PDF «Home - Los Lirios».
     *
     * OJO con la historia de este color: en el PDF corporativo el
     * logotipo de Los Lirios aparecía en MARRÓN, y aquí en su propio
     * PDF aparece en ROJO. Se resolvió a favor del rojo — el archivo
     * de la marca manda sobre cómo la pinta otro documento — y hay
     * que avisarle a la diseñadora de la inconsistencia.
     */
    color: {
      principal: '#B72325', // rojo de marca
      brillante: '#ED3324', // rojo vivo de las ondas
      oscuro: '#61100B', // texto y fondos profundos
      titulo: '#B72325',
      acento: '#F1BF21', // amarillo de botones y gotas
      claro: '#F5E9DF', // crema de fondo
    },

    // Cabecera crema con el logotipo propio de la marca. A diferencia
    // de Foodie, Los Lirios sí tiene logotipo y lo usa en el header.
    header: {
      fondo: '#F5E9DF',
      texto: '#61100B',
      logo: 'los-lirios',
      // Sobre el crema una píldora blanca desaparecería: va roja.
      pastillaFondo: '#B72325',
      pastillaTexto: '#FFFFFF',
    },

    // Fredoka es variable y trae eje de ancho: el diseño usa la
    // versión condensada, que se consigue con font-stretch en vez de
    // cargar una familia aparte.
    tipografia: {
      display: "'Fredoka Variable', 'Trebuchet MS', sans-serif",
      ancho: '82%',
    },

    tieneRecetas: false,
    tieneLettering: false,
    paletaDefinitiva: true,
  },
};

/**
 * Logotipos de cada marca, para el portafolio del home corporativo.
 * Se importan desde los componentes que los usan (Astro necesita el
 * import estático para poder optimizarlos en el build).
 */
export const LOGOS = {
  foodie: 'logo-foodie.png',
  'los-lirios': 'logo-los-lirios.png',
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
    `--marca-claro: ${m.color.claro}`,
    `--marca-header-fondo: ${m.header.fondo}`,
    `--marca-header-texto: ${m.header.texto}`,
    `--marca-pastilla-fondo: ${m.header.pastillaFondo}`,
    `--marca-pastilla-texto: ${m.header.pastillaTexto}`,
    `--marca-display: ${m.tipografia.display}`,
    `--marca-display-ancho: ${m.tipografia.ancho}`,
  ].join('; ');
}

/** Navegación interna de una marca. */
export function navMarca(slug) {
  const m = MARCAS[slug];
  const base = [{ texto: 'Productos', href: `/${slug}/productos` }];
  if (m?.tieneRecetas) base.push({ texto: 'Recetas', href: `/${slug}/recetas` });
  return base;
}
