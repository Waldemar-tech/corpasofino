/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN CENTRAL DEL SITIO
 * ─────────────────────────────────────────────────────────────
 *  Este es el único archivo que hay que tocar para cambiar
 *  dominio, teléfonos, redes sociales o IDs de publicidad.
 *  Todo lo demás lee de aquí.
 *
 *  ⚠️  PENDIENTE DE COMPLETAR — buscar "REEMPLAZAR"
 */

export const SITE = {
  url: 'https://corpasofino.com',
  nombreLegal: 'Corporación Paso Fino, C.A.',
  nombreCorto: 'Paso Fino',
  marca: 'Foodie',
  rif: 'J-500092210',
  idioma: 'es-VE',
  ciudad: 'Barquisimeto',
  estado: 'Lara',
  pais: 'VE',
  // Coordenadas del centro de Barquisimeto. Reemplazar por las de la planta
  // cuando el cliente confirme la dirección exacta (mejora el SEO local).
  geo: { lat: 10.0647, lng: -69.3301 },
  direccion: 'REEMPLAZAR: dirección de la planta, Barquisimeto, estado Lara',
};

export const CONTACTO = {
  // ⚠️ REEMPLAZAR: número real con código de país, solo dígitos.
  // Venezuela = 58, y el móvil va SIN el 0 inicial.
  // Ejemplo: 0424-1234567  ->  584241234567
  whatsapp: '584240000000',
  telefonoVisible: '+58 424 000 0000',
  email: 'REEMPLAZAR@corpasofino.com',
  emailVentas: 'REEMPLAZAR@corpasofino.com',
  horario: 'Lunes a viernes, 8:00 a.m. – 5:00 p.m.',
};

export const REDES = {
  instagram: 'https://instagram.com/REEMPLAZAR',
  tiktok: 'https://tiktok.com/@REEMPLAZAR',
};

/**
 * Mensajes que se precargan en WhatsApp según desde dónde hace clic
 * el visitante. Sirve para dos cosas: le baja la fricción a la persona
 * y le dice al cliente qué parte del sitio generó la conversación.
 */
export const MENSAJES_WA = {
  general: 'Hola, vengo de la página web de Foodie y quiero más información.',
  distribuidor:
    'Hola, soy distribuidor y me interesa vender los productos Foodie. Quisiera conocer precios por volumen y condiciones.',
  producto: (nombre) =>
    `Hola, vengo de la página web y me interesa el producto ${nombre}. ¿Me pueden dar más información?`,
};

/**
 * ─── FORMULARIO DE DISTRIBUIDORES ─────────────────────────────
 * Un sitio estático no puede recibir formularios por sí solo.
 * Para no montar un servidor sólo por esto, se usa un servicio
 * externo que reenvía el formulario por correo.
 *
 * Recomendado: Web3Forms (gratis, sin cuenta, sin límite razonable).
 *   1. Entrar a https://web3forms.com
 *   2. Poner el correo donde deben llegar los leads
 *   3. Pegar aquí la clave que te envían
 *
 * Mientras esté en null, la sección de distribuidores muestra sólo
 * los botones de WhatsApp y correo — que igual funcionan.
 */
export const FORMULARIO = {
  endpoint: 'https://api.web3forms.com/submit',
  claveAcceso: null, // REEMPLAZAR: clave de Web3Forms
};

/**
 * ─── PUBLICIDAD Y ANALÍTICA ───────────────────────────────────
 * Estrategia doble, como se acordó:
 *   · Meta Pixel cargado directo  → no depende de que GTM cargue.
 *   · GTM como contenedor         → agregar/cambiar etiquetas sin redeploy.
 *
 * Mientras estén en null, NO se inyecta ningún script. El sitio
 * funciona igual y no ensucia los datos con eventos de prueba.
 */
export const TRACKING = {
  metaPixelId: null, // REEMPLAZAR: '123456789012345'
  gtmId: null, // REEMPLAZAR: 'GTM-XXXXXXX'
  ga4Id: null, // REEMPLAZAR: 'G-XXXXXXXXXX'  (opcional si ya va por GTM)
  // Dominio al que Meta debe atribuir las conversiones. Debe estar
  // verificado en Business Manager para que funcione la atribución iOS.
  dominioVerificado: 'corpasofino.com',
};

/**
 * ─── COMERCIOS ALIADOS ────────────────────────────────────────
 * ⚠️ El diseño trae Walmart, Target, Walgreens y Publix como
 * MAQUETA. Son cadenas estadounidenses y no venden Foodie:
 * publicarlas sería publicidad engañosa y, además, uso no
 * autorizado de marcas registradas.
 *
 * Cuando el cliente confirme qué comercios sí lo venden y den
 * permiso para aparecer, se agregan aquí y la sección se muestra
 * sola. Mientras el arreglo esté vacío, el sitio no la publica.
 *
 * Formato:
 *   { nombre: 'Central Madeirense', logo: 'central-madeirense.png' }
 *   (el archivo va en src/assets/aliados/)
 */
export const ALIADOS = [];

/**
 * Navegación corporativa — la de la raíz del sitio, donde Paso Fino
 * habla como fabricante y las marcas son su portafolio.
 */
export const NAV = [
  { texto: 'Inicio', href: '/' },
  { texto: 'Nuestras marcas', href: '/#marcas' },
  { texto: 'Nosotros', href: '/nosotros' },
  { texto: 'Contacto', href: '/contacto' },
];

export const NAV_FOOTER = [
  { texto: 'Nuestras marcas', href: '/#marcas' },
  { texto: 'Foodie', href: '/foodie' },
  { texto: 'Los Lirios', href: '/los-lirios' },
  { texto: 'Nosotros', href: '/nosotros' },
  { texto: 'Contacto', href: '/contacto' },
  { texto: 'Distribuidores', href: '/#distribuidores' },
  { texto: 'Política de privacidad', href: '/politica-de-privacidad' },
];
