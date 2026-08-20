import { CONTACTO, MENSAJES_WA } from '../config/site.js';

/**
 * Construye un enlace wa.me con el mensaje precargado.
 * Se usa wa.me y no api.whatsapp.com porque wa.me abre la app nativa
 * en móvil sin pasar por una página intermedia — menos fricción,
 * que es donde se pierden los leads.
 *
 * @param {'general'|'distribuidor'} tipo
 * @param {string} [nombreProducto] si se pasa, usa la plantilla de producto
 */
export function enlaceWhatsApp(tipo = 'general', nombreProducto) {
  const mensaje = nombreProducto
    ? MENSAJES_WA.producto(nombreProducto)
    : MENSAJES_WA[tipo] || MENSAJES_WA.general;

  return `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
