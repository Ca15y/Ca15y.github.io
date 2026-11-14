import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    /** Two or three short facts shown on the card. */
    headlineFacts: z.array(z.string()).min(1).max(3),
    /** Empty until the owner confirms it; the card then shows a TODO. */
    stack: z.array(z.string()),
    status: z.enum(['not-live', 'internal', 'live']),
    /**
     * devops: shown on the home page and first on /projects/.
     * software: backend/app work, listed under "Other work" on /projects/ only.
     */
    category: z.enum(['devops', 'software']),
    /** Order within its category; the first devops project is the wide feature card. */
    order: z.number().int(),
    links: z
      .object({
        code: z.url().optional(),
        live: z.url().optional(),
      })
      .default({}),
  }),
});

export const collections = { projects };
