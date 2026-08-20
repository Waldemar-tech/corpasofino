# corpasofino.com — Foodie · Corporación Paso Fino

Sitio estático en Astro. Genera HTML puro, sin framework de JavaScript
en el cliente, y se despliega en Railway detrás de Caddy.

---

## Antes de publicar — pendientes obligatorios

Estos datos no los tengo y el sitio los necesita. Todos están en un
solo archivo: **`src/config/site.js`**. Busca la palabra `REEMPLAZAR`.

| Dato | Dónde | Qué pasa si falta |
|---|---|---|
| Número de WhatsApp | `CONTACTO.whatsapp` | Todos los botones de WhatsApp llevan a un número inexistente |
| Correo de ventas | `CONTACTO.emailVentas` | El enlace de correo del bloque B2B no se muestra |
| Instagram y TikTok | `REDES` | Los iconos de redes no se muestran |
| Dirección de la planta | `SITE.direccion` y `SITE.geo` | El SEO local pierde precisión |
| ID del Meta Pixel | `TRACKING.metaPixelId` | No se mide ninguna conversión de la pauta |
| ID de GTM | `TRACKING.gtmId` | No hay contenedor de etiquetas |
| Clave de Web3Forms | `FORMULARIO.claveAcceso` | El formulario de distribuidores no aparece; sólo quedan WhatsApp y correo |

**Mientras un valor esté en `null` o diga `REEMPLAZAR`, el componente
que lo usa simplemente no se muestra.** El sitio nunca publica un
enlace roto ni un script vacío. Esto es a propósito: es preferible que
falte una sección a que un comprador haga clic en un WhatsApp muerto.

### Otros pendientes de contenido

- **Fotos de producto.** Los siete productos muestran una silueta gris
  con la etiqueta «Foto pendiente». Al colocar la foto real en
  `src/assets/productos/` y referenciarla en el `.md` del producto, la
  etiqueta desaparece sola.
- **Fotos de recetas.** Igual, en `src/assets/recetas/`.
- **Comercios aliados.** El diseño traía Walmart, Target, Walgreens y
  Publix. Son cadenas estadounidenses que no venden Foodie: publicarlas
  sería publicidad engañosa y uso no autorizado de marcas. La sección
  está en `ALIADOS` (vacía). Cuando haya comercios reales con permiso
  para aparecer, se agregan ahí y la sección se activa sola.
- **Ingredientes e información nutricional.** No los inventé: son datos
  de etiquetado con implicaciones legales. Los campos existen en cada
  `.md` de producto; al llenarlos aparecen los acordeones.
- **Política de privacidad.** Está redactada y cubre el uso de Meta
  Pixel, GTM y WhatsApp, pero conviene que la revise un abogado antes
  de publicar.

---

## Cómo trabajar el proyecto

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

Requiere Node 20 o superior.

---

## Cómo agregar contenido sin tocar código

Todo el contenido vive en Markdown con frontmatter.

**Un producto nuevo:** copia cualquier archivo de
`src/contenido/productos/`, cámbiale el nombre (ese nombre es la URL) y
edita los campos. Aparece solo en el listado, en la home y en el
sitemap.

**Una receta nueva:** igual, en `src/contenido/recetas/`. El campo
`productos: [ketchup, mayonesa]` conecta la receta con las fichas de
producto en ambos sentidos, y genera venta cruzada automática.

Si falta un campo obligatorio, el build falla con un mensaje claro en
vez de publicar una página rota.

> **Ojo con YAML:** si un texto contiene dos puntos seguidos de espacio
> (`parece: si no`), hay que ponerlo entre comillas dobles. Si no, el
> build se queja.

---

## SEO — qué quedó implementado

- Meta title y description propios por página, con la marca al final
  (en móvil Google corta por la derecha).
- Canonical limpia, sin `.html` ni parámetros, coincidiendo con el
  sitemap. Una URL por página.
- Open Graph completo con imagen 1200×630 — esto es lo que se ve al
  pegar el enlace en WhatsApp, que es donde más se comparte.
- `sitemap-index.xml` automático y `robots.txt` que bloquea el rastreo
  de URLs con parámetros de campaña, para no diluir señales.
- Datos estructurados JSON-LD:
  - `Organization` y `WebSite` en todas las páginas.
  - `FoodEstablishment` con geolocalización en home, nosotros y
    contacto — para búsquedas locales tipo «salsas Barquisimeto».
  - `Product` en cada ficha de producto.
  - **`Recipe` en cada receta** — este es el que habilita las tarjetas
    con foto, tiempo y porciones en los resultados de Google. Para una
    marca de salsas es el tráfico orgánico más barato que existe.
  - `BreadcrumbList` en todas las páginas internas.
- HTML semántico, un solo `<h1>` por página, enlace de salto al
  contenido y foco visible para teclado.
- Imágenes en WebP con `srcset` por tamaño, `width`/`height` para
  evitar saltos de maquetación, y carga diferida bajo el pliegue.
- Fuentes autohospedadas, sólo el subconjunto latino: ninguna petición
  a servidores de Google y menos kilobytes en datos móviles.

**Lo que NO puse a propósito:** precios y reseñas en el schema de
producto. El diseño traía `$0.00` y «4.8 · 126 reseñas». Publicar
precios falsos hace que Google muestre el producto como gratis, y
publicar reseñas inventadas es causa de penalización manual. Los campos
existen en el `.md` y se activan solos cuando los datos sean reales.

---

## Publicidad — qué quedó implementado

Estrategia doble, como se acordó:

1. **Meta Pixel cargado directo** en el `<head>`. Es el que paga las
   campañas; no depende de que GTM cargue bien.
2. **Google Tag Manager** como contenedor para todo lo demás (GA4,
   Google Ads, TikTok Pixel). Permite agregar etiquetas sin redeploy.

### Eventos que se disparan

| Evento | Cuándo | Para qué sirve |
|---|---|---|
| `PageView` | Toda página | Base de audiencias y retargeting |
| `ViewContent` | Ficha de producto o receta | Retargeting a quien vio algo concreto |
| `Contact` | Clic en WhatsApp de consumidor | Interés general |
| **`Lead`** | **Clic en WhatsApp de distribuidores, o envío del formulario** | **Esta es la conversión a optimizar en el administrador de anuncios** |
| `VioBloqueDistribuidores` | El bloque B2B entra en pantalla | Saber si la gente llega hasta ahí o hay que subirlo |
| `ScrollProfundidad` | 25 / 50 / 75 / 90 % | Diagnóstico de la página |

### Atribución de campañas — la pieza que suele faltar

El problema de siempre: alguien llega desde un anuncio, escribe por
WhatsApp, y la conversación aparece en el teléfono sin ninguna pista de
qué anuncio la generó. Sin eso no se puede decidir qué campaña escalar.

La solución implementada: al aterrizar, el sitio captura los parámetros
UTM (más `fbclid`, `gclid`, `ttclid`), los guarda durante la sesión y
los agrega como una línea corta al final del mensaje precargado de
WhatsApp:

```
Hola, soy distribuidor y me interesa vender los productos Foodie.
Quisiera conocer precios por volumen y condiciones.

— vía instagram / distribuidores-lara / video-planta-v2
```

El cliente ve el origen directo en el chat, sin instalar ningún CRM.
El formulario hace lo mismo en un campo oculto.

**Cómo etiquetar los anuncios** para que esto funcione — en el destino
del anuncio de Instagram:

```
https://corpasofino.com/#distribuidores?utm_source=instagram&utm_medium=paid&utm_campaign=distribuidores-lara&utm_content=video-planta-v2
```

Cambia `utm_content` por cada variación creativa y sabrás exactamente
cuál trae conversaciones.

---

## Despliegue en Railway

El repositorio trae `Dockerfile` y `railway.json`. Railway detecta el
Dockerfile y no hay que configurar nada más.

1. Sube el proyecto a un repositorio de GitHub.
2. En Railway: **New Project → Deploy from GitHub repo**.
3. Railway construye y despliega. No hace falta definir `PORT`: Caddy
   lo lee de la variable que Railway inyecta.
4. **Settings → Networking → Custom Domain** → `corpasofino.com`.
5. En el DNS del dominio, crea el `CNAME` que Railway te indique.
   Railway emite el certificado TLS automáticamente.

La imagen final pesa ~50 MB: sólo Caddy y HTML estático. No hay Node
corriendo en producción, así que no hay proceso que se caiga ni memoria
que se fugue, y el consumo de Railway se mantiene en el mínimo.

### Una advertencia honesta sobre Railway

Railway es una buena plataforma, pero para un sitio 100 % estático es
más caro y más lento que las alternativas:

- Cobra un contenedor corriendo 24/7 (~5 USD/mes mínimo) por servir
  archivos que no cambian.
- Sirve desde una sola región. Para un visitante en Venezuela eso son
  entre 100 y 200 ms extra en cada petición, frente a una CDN con nodo
  cercano.

Como vas a pagar publicidad para traer tráfico, cada milisegundo de
carga se traduce en conversión perdida. **Cloudflare Pages o Netlify
servirían este mismo sitio gratis y desde el nodo más cercano.**

Si quieres quedarte en Railway, el término medio es poner **Cloudflare
por delante** (plan gratuito): apuntas el dominio a Cloudflare, activas
el proxy, y el HTML se cachea en el borde. Railway queda de origen y la
latencia baja muchísimo. Cinco minutos de configuración.

### Verificar después del primer despliegue

```bash
curl -I https://corpasofino.com/productos/ketchup   # 200, sin redirección
curl -I https://corpasofino.com/no-existe           # 404
curl -s https://corpasofino.com/sitemap-index.xml   # XML válido
```

Y en el navegador, pega el enlace en un chat de WhatsApp: debe aparecer
la tarjeta con la imagen verde de la hamburguesa.

### Después de publicar

1. Dar de alta el sitio en **Google Search Console** y enviar el
   sitemap.
2. Verificar el dominio en **Meta Business Manager** (obligatorio para
   que la atribución funcione bien en iOS).
3. Probar el schema de recetas en el
   [validador de resultados enriquecidos de Google](https://search.google.com/test/rich-results).

---

## Estructura

```
src/
  config/site.js          ← ÚNICO archivo a editar para datos del negocio
  contenido/
    productos/*.md        ← 7 productos
    recetas/*.md          ← 6 recetas
  assets/                 ← imágenes originales (Astro las optimiza en el build)
  components/
    Seo.astro             ← meta tags, Open Graph, JSON-LD
    Analytics.astro       ← Meta Pixel + GTM
    Distribuidores.astro  ← bloque B2B (se reutiliza en 4 páginas)
    Header / Footer / Tarjeta* / Migas / Icono
  layouts/Base.astro
  lib/
    schema.js             ← constructores de JSON-LD
    whatsapp.js           ← enlaces con mensaje precargado
  scripts/tracking.js     ← atribución UTM + eventos de conversión
  styles/global.css       ← tokens del diseño (colores, tipografías, escala)
  pages/
Caddyfile                 ← servidor de producción
Dockerfile                ← build para Railway
```

---

## Sistema de diseño

Extraído del PDF original de la diseñadora, no aproximado a ojo.

**Tipografías** (las tres gratuitas en Google Fonts, autohospedadas):

- `Anton` — titulares
- `Barlow Condensed` — navegación, botones, etiquetas
- `DM Sans` — cuerpo de texto

**Colores:**

| Token | Hex | Uso |
|---|---|---|
| `--verde` | `#138B47` | Header, footer, hero |
| `--verde-brillante` | `#18AE59` | Franja «Un sabor para cada plato» |
| `--verde-oscuro` | `#066A37` | Sección «Modo Foodie» |
| `--verde-titulo` | `#0F6B37` | Titulares sobre fondo claro |
| `--ambar` | `#E6A633` | Lettering manuscrito, acentos |
| `--tinta` | `#231F20` | Texto y bloque de distribuidores |
| `--gris-fondo` | `#F2F2F4` | Fondos de sección y tarjetas |

El lettering manuscrito («Ponle sabor!», «Dale el toque final con
Foodie») no es una fuente: son imágenes vectorizadas que venían en los
assets. Están en `src/assets/lettering/`.

---

## Decisiones que se apartan del diseño, y por qué

**Carrito, cuenta de usuario y buscador.** El diseño los muestra en el
header, con un carrito marcando «3». No hay backend, ni pasarela de
pago, ni inventario: un carrito que no cobra y un buscador que no busca
son promesas rotas en la cara del visitante. Se sacaron del header y en
su lugar quedó un CTA de «¿Eres distribuidor?», que sí sirve al
objetivo comercial. Cuando entre el e-commerce de verdad, se agregan.

**Precios y reseñas.** El diseño muestra `$0.00` y «4.8 · 126 reseñas».
Ver arriba, en la sección de SEO.

**Comercios aliados.** Ver arriba, en pendientes de contenido.

**Bloque de distribuidores sobre fondo casi negro.** El diseño no lo
contemplaba porque el diseño es 100 % B2C. Todo el resto del sitio le
habla al consumidor; este bloque le habla a un comprador mayorista. El
cambio de registro visual evita que se lea como «más de lo mismo» y
hace que resalte el CTA.

**El titular del bloque B2B no dice «buscamos distribuidores».** Dice
«Lleva Foodie a tu zona de venta». Nadie hace clic en la necesidad
ajena; un comprador mayorista evalúa qué gana él y qué capacidad hay
detrás para respaldarlo.
