// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.js';

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  build: {
    // Genera /productos/ketchup.html en vez de /productos/ketchup/index.html
    // para que Caddy pueda servir URLs limpias sin redirecciones extra.
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      i18n: undefined,
      filter: (page) => !page.includes('/gracias'),
      serialize(item) {
        // La home y las páginas comerciales pesan más para el rastreador.
        if (item.url === `${SITE.url}/`) item.priority = 1.0;
        else if (item.url.includes('/productos')) item.priority = 0.9;
        else if (item.url.includes('/recetas')) item.priority = 0.7;
        else item.priority = 0.5;
        item.changefreq = 'weekly';
        return item;
      },
    }),
  ],
  image: {
    // AVIF primero, WebP de respaldo. Astro los genera en build.
    responsiveStyles: true,
  },
});
