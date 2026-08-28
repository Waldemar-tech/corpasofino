import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * El contenido vive en archivos Markdown con frontmatter para que el
 * cliente (o quien le lleve el sitio después) pueda agregar un producto
 * o una receta sin tocar una línea de código: se copia un archivo,
 * se cambian los campos y se sube. Astro lo valida en el build — si
 * falta un campo obligatorio, el build falla en vez de publicar algo roto.
 */

const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/contenido/productos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      /** A qué línea pertenece. Define la URL y la identidad visual. */
      marca: z.enum(['foodie', 'los-lirios']),
      /** Orden en el listado. Menor número = aparece primero. */
      orden: z.number().default(99),
      descripcionCorta: z.string().max(180),
      /** Frase destacada en cursiva sobre la descripción larga. */
      gancho: z.string().optional(),
      medidas: z.array(z.string()).default([]),
      categoria: z.string().default('Salsas y aderezos'),
      sku: z.string().optional(),
      /** Sólo poner si es un precio real y vigente. Ver nota en schema.js */
      precio: z.number().positive().optional(),
      ingredientes: z.string().optional(),
      informacionNutricional: z.string().optional(),
      imagen: image().optional(),
      imagenAlt: z.string().optional(),
      destacado: z.boolean().default(false),
      /** Se muestra en el SEO como meta description si está presente. */
      metaDescripcion: z.string().max(160).optional(),
    }),
});

const recetas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/contenido/recetas' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      /** Hoy sólo Foodie tiene recetario; el campo deja la puerta
          abierta a que Los Lirios tenga el suyo más adelante. */
      marca: z.enum(['foodie', 'los-lirios']).default('foodie'),
      orden: z.number().default(99),
      descripcion: z.string(),
      /** Minutos. Alimentan el schema Recipe de Google. */
      tiempoPreparacion: z.number().int().positive(),
      tiempoCoccion: z.number().int().nonnegative().default(0),
      dificultad: z.enum(['Fácil', 'Medio', 'Difícil']).default('Fácil'),
      raciones: z.number().int().positive().default(4),
      categoria: z.string().default('Plato principal'),
      cocina: z.string().default('Venezolana'),
      etiquetas: z.array(z.string()).default([]),
      /** Slugs de productos Foodie que usa la receta — genera venta cruzada. */
      productos: z.array(z.string()).default([]),
      ingredientes: z
        .array(
          z.object({
            cantidad: z.string().optional(),
            item: z.string(),
          })
        )
        .min(1),
      pasos: z.array(z.string()).min(1),
      imagen: image().optional(),
      imagenAlt: z.string().optional(),
      destacada: z.boolean().default(false),
      metaDescripcion: z.string().max(160).optional(),
    }),
});

export const collections = { productos, recetas };
