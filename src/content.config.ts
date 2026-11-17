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
    /** May be empty while the owner confirms it; the card then shows "to be confirmed". */
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

const labs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/labs' }),
  schema: z.object({
    title: z.string(),
    /** One sentence, taken from the repository README or description. */
    description: z.string(),
    stack: z.array(z.string()).min(1),
    repo: z.url(),
    order: z.number().int(),
  }),
});

export const collections = { projects, labs };
