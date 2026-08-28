/**
 * Constructores de JSON-LD (schema.org).
 *
 * Por qué importa aquí y no es adorno:
 *  · Recipe  → habilita las tarjetas de receta con foto, tiempo y estrellas
 *              en los resultados de Google. Es el tráfico orgánico más
 *              barato que puede conseguir una marca de salsas.
 *  · Product → habilita precio y disponibilidad en los resultados.
 *  · Organization + LocalBusiness → alimenta el panel de conocimiento
 *              y el SEO local de "salsas Barquisimeto".
 */

import { SITE, CONTACTO, REDES } from '../config/site.js';

const abs = (ruta) => new URL(ruta, SITE.url).href;

/** Identidad de la empresa. Va en todas las páginas. */
export function organizacion() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organizacion`,
    name: SITE.nombreLegal,
    alternateName: [SITE.nombreCorto, SITE.marca],
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: abs('/og/logo.png'),
    },
    taxID: SITE.rif,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.ciudad,
      addressRegion: SITE.estado,
      addressCountry: SITE.pais,
    },
    sameAs: [REDES.instagram, REDES.tiktok].filter(
      (u) => u && !u.includes('REEMPLAZAR')
    ),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: `+${CONTACTO.whatsapp}`,
      areaServed: 'VE',
      availableLanguage: ['Spanish'],
    },
  };
}

/** Ficha de negocio local: alimenta Google Maps y las búsquedas locales. */
export function negocioLocal() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': `${SITE.url}/#negocio`,
    name: SITE.nombreLegal,
    image: abs('/og/default.jpg'),
    url: SITE.url,
    telephone: `+${CONTACTO.whatsapp}`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.direccion,
      addressLocality: SITE.ciudad,
      addressRegion: SITE.estado,
      addressCountry: SITE.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Venezuela',
    },
  };
}

/** Habilita la caja de búsqueda de sitio en Google. */
export function sitioWeb() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#sitio`,
    url: SITE.url,
    name: `${SITE.marca} · ${SITE.nombreCorto}`,
    inLanguage: SITE.idioma,
    publisher: { '@id': `${SITE.url}/#organizacion` },
  };
}

/**
 * Migas de pan. Google las usa para mostrar la ruta en vez de la URL cruda.
 * @param {{nombre: string, href: string}[]} items
 */
export function migas(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nombre,
      item: abs(item.href),
    })),
  };
}

/**
 * Ficha de producto.
 *
 * `nombreMarca` es Foodie o Los Lirios — la línea a la que pertenece.
 * Va como `brand` y no como fabricante: para Google, la marca es la
 * línea comercial y el fabricante es Paso Fino. Separarlo bien es lo
 * que permite que las dos líneas coexistan sin canibalizarse en los
 * resultados.
 */
export function producto(p, urlRelativa, nombreMarca = SITE.marca) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.nombre} ${nombreMarca}`,
    description: p.descripcionCorta,
    sku: p.sku ?? undefined,
    url: abs(urlRelativa),
    image: p.imagenOg ? [abs(p.imagenOg)] : undefined,
    brand: { '@type': 'Brand', name: nombreMarca },
    manufacturer: { '@id': `${SITE.url}/#organizacion` },
    category: p.categoria ?? 'Salsas y aderezos',
  };

  // Sólo declaramos precio si es real. Publicar $0.00 como en el diseño
  // haría que Google muestre "gratis" y castigaría la ficha.
  if (typeof p.precio === 'number' && p.precio > 0) {
    schema.offers = {
      '@type': 'Offer',
      price: p.precio.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: abs(urlRelativa),
      seller: { '@id': `${SITE.url}/#organizacion` },
    };
  }

  // Igual con las reseñas: inventar un 4.8 con 126 reseñas es motivo de
  // penalización manual por parte de Google. Sólo si son reales.
  if (p.calificacion && p.numResenas) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.calificacion,
      reviewCount: p.numResenas,
    };
  }

  return schema;
}

/** Ficha de receta: la que gana las tarjetas visuales en Google. */
export function receta(r, urlRelativa) {
  const total = (r.tiempoPreparacion ?? 0) + (r.tiempoCoccion ?? 0);
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: r.titulo,
    description: r.descripcion,
    url: abs(urlRelativa),
    image: r.imagenOg ? [abs(r.imagenOg)] : undefined,
    author: { '@id': `${SITE.url}/#organizacion` },
    inLanguage: SITE.idioma,
    recipeCategory: r.categoria ?? 'Plato principal',
    recipeCuisine: r.cocina ?? 'Venezolana',
    keywords: (r.etiquetas ?? []).join(', ') || undefined,
    prepTime: r.tiempoPreparacion ? `PT${r.tiempoPreparacion}M` : undefined,
    cookTime: r.tiempoCoccion ? `PT${r.tiempoCoccion}M` : undefined,
    totalTime: total ? `PT${total}M` : undefined,
    recipeYield: r.raciones ? `${r.raciones} raciones` : undefined,
    recipeIngredient: r.ingredientes?.map(
      (i) => `${i.cantidad ? i.cantidad + ' ' : ''}${i.item}`
    ),
    recipeInstructions: r.pasos?.map((paso, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: paso,
    })),
  };
}
