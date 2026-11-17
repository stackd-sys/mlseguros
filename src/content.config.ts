import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Guias (blog). Um guia aparece no site publicado a partir da data "publicado";
// "rascunho: true" segura-o. Nas pré-visualizações (sem PUBLIC_PUBLICADO) aparecem todos.
const guias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guias' }),
  schema: z.object({
    titulo: z.string(),
    tituloSeo: z.string().optional(),
    descricao: z.string(),
    resumo: z.string(),
    foto: z.string(),
    foto2: z.string().optional(),
    ramo: z.string().optional(),
    publicado: z.coerce.date(),
    atualizado: z.coerce.date().optional(),
    rascunho: z.boolean().default(false),
    perguntas: z.array(z.tuple([z.string(), z.string()])).default([]),
  }),
});

export const collections = { guias };
