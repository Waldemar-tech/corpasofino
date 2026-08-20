/**
 * ─────────────────────────────────────────────────────────────
 *  ATRIBUCIÓN DE CAMPAÑAS  ·  Foodie / Paso Fino
 * ─────────────────────────────────────────────────────────────
 *
 *  El problema que resuelve este archivo:
 *
 *  Cuando alguien llega desde un anuncio de Instagram y termina
 *  escribiendo por WhatsApp, la conversación aparece en el teléfono
 *  del cliente sin ninguna pista de qué anuncio la generó. Sin eso
 *  no se puede decidir qué campaña escalar y cuál apagar — se estaría
 *  pagando a ciegas.
 *
 *  La solución: capturar los parámetros UTM al aterrizar, guardarlos
 *  durante la sesión, y meterlos como una línea corta al final del
 *  mensaje precargado de WhatsApp. El cliente ve de dónde viene cada
 *  persona directo en el chat, sin instalar ningún CRM.
 *
 *  Además dispara los eventos de conversión hacia Meta y GTM.
 */

const CLAVE = 'pf_atribucion';
const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'ttclid',
];

/** Lee UTMs de la URL y los persiste durante la sesión. */
function capturarAtribucion() {
  let guardado = {};
  try {
    guardado = JSON.parse(sessionStorage.getItem(CLAVE) || '{}');
  } catch {
    guardado = {};
  }

  const url = new URLSearchParams(window.location.search);
  let nuevo = false;

  for (const p of PARAMS) {
    const v = url.get(p);
    if (v) {
      guardado[p] = v.slice(0, 120);
      nuevo = true;
    }
  }

  // Primera visita sin UTMs: al menos registramos de dónde vino el clic.
  if (!guardado.referencia) {
    guardado.referencia = document.referrer
      ? new URL(document.referrer).hostname
      : 'directo';
    nuevo = true;
  }

  if (nuevo) {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(guardado));
    } catch {
      /* modo incógnito con storage bloqueado: seguimos sin persistir */
    }
  }

  return guardado;
}

/** Convierte la atribución en una línea legible para el chat. */
function lineaAtribucion(datos) {
  const origen = datos.utm_source || datos.referencia;
  const campana = datos.utm_campaign;
  const anuncio = datos.utm_content;

  if (!origen || origen === 'directo') return '';

  const partes = [origen];
  if (campana) partes.push(campana);
  if (anuncio) partes.push(anuncio);

  return `\n\n— vía ${partes.join(' / ')}`;
}

/** Dispara un evento hacia Meta Pixel y hacia el dataLayer de GTM. */
export function evento(nombre, datos = {}) {
  // Meta Pixel: distingue eventos estándar de personalizados.
  const estandar = [
    'PageView',
    'ViewContent',
    'Lead',
    'Contact',
    'AddToCart',
    'InitiateCheckout',
    'Search',
    'CompleteRegistration',
  ];

  if (typeof window.fbq === 'function') {
    if (estandar.includes(nombre)) window.fbq('track', nombre, datos);
    else window.fbq('trackCustom', nombre, datos);
  }

  // GTM / GA4
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: nombre, ...datos });
}

/**
 * Enriquece todos los enlaces de WhatsApp del documento con la
 * atribución de campaña y les engancha el evento de conversión.
 *
 * Los enlaces se marcan en el HTML con:
 *   data-wa="general" | "distribuidor" | "producto"
 *   data-wa-etiqueta="Ketchup"   (opcional, para el evento)
 */
function prepararEnlacesWhatsApp(atribucion) {
  const sufijo = lineaAtribucion(atribucion);
  const enlaces = document.querySelectorAll('a[data-wa]');

  enlaces.forEach((enlace) => {
    if (sufijo) {
      try {
        const url = new URL(enlace.href);
        const textoActual = url.searchParams.get('text') || '';
        if (!textoActual.includes('— vía')) {
          url.searchParams.set('text', textoActual + sufijo);
          enlace.href = url.toString();
        }
      } catch {
        /* href malformado: lo dejamos como está */
      }
    }

    enlace.addEventListener('click', () => {
      const tipo = enlace.dataset.wa;
      const etiqueta = enlace.dataset.waEtiqueta || tipo;

      // "Lead" para el flujo de distribuidores — es la conversión que
      // de verdad importa para el objetivo comercial del cliente, y es
      // la que hay que optimizar en el administrador de anuncios.
      // "Contact" para consultas generales de consumidor.
      const nombreEvento = tipo === 'distribuidor' ? 'Lead' : 'Contact';

      evento(nombreEvento, {
        content_name: etiqueta,
        canal: 'whatsapp',
        origen_seccion: tipo,
        utm_source: atribucion.utm_source || atribucion.referencia,
        utm_campaign: atribucion.utm_campaign,
      });
    });
  });
}

/** Marca la vista de una ficha de producto o receta. */
function marcarVistaContenido() {
  const nodo = document.querySelector('[data-contenido-tipo]');
  if (!nodo) return;

  evento('ViewContent', {
    content_type: nodo.dataset.contenidoTipo,
    content_name: nodo.dataset.contenidoNombre,
    content_ids: nodo.dataset.contenidoId
      ? [nodo.dataset.contenidoId]
      : undefined,
  });
}

/** Registra hasta dónde bajó la gente. Sirve para saber si el bloque
 *  de distribuidores está siendo visto o si hay que subirlo. */
function medirProfundidad() {
  const hitos = [25, 50, 75, 90];
  const vistos = new Set();

  const alScroll = () => {
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    if (alto <= 0) return;
    const pct = Math.round((window.scrollY / alto) * 100);

    for (const h of hitos) {
      if (pct >= h && !vistos.has(h)) {
        vistos.add(h);
        evento('ScrollProfundidad', { profundidad: h });
      }
    }
    if (vistos.size === hitos.length) {
      window.removeEventListener('scroll', alScroll);
    }
  };

  window.addEventListener('scroll', alScroll, { passive: true });
}

/** Avisa cuando el bloque de distribuidores entra en pantalla. */
function observarBloqueDistribuidores() {
  const bloque = document.getElementById('distribuidores');
  if (!bloque || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          evento('VioBloqueDistribuidores');
          obs.disconnect();
        }
      }
    },
    { threshold: 0.4 }
  );

  obs.observe(bloque);
}

function iniciar() {
  const atribucion = capturarAtribucion();
  prepararEnlacesWhatsApp(atribucion);
  marcarVistaContenido();
  medirProfundidad();
  observarBloqueDistribuidores();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciar);
} else {
  iniciar();
}
