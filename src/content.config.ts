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

    // Case-study sections. The Markdown body is "What I built".
    /** One short paragraph: the situation and what had to change. */
    problem: z.string(),
    /** Top-to-bottom flow drawn as inline SVG by ArchitectureDiagram. */
    architecture: z.object({
      caption: z.string(),
      tiers: z
        .array(
          z
            .array(
              z.object({
                label: z.string().max(26),
                detail: z.string().max(40).optional(),
                /** Label on the arrow coming into this node. */
                via: z.string().max(22).optional(),
                accent: z.boolean().optional(),
                dashed: z.boolean().optional(),
                /** Indexes of the nodes in the tier above that point here; overrides the default wiring. */
                from: z.array(z.number().int().min(0)).optional(),
              }),
            )
            .min(1)
            .max(3),
        )
        .min(2),
    }),
    /** Decision, then why. Empty until the owner supplies them; the page then says so. */
    decisions: z.array(z.object({ decision: z.string(), why: z.string() })).default([]),
    next: z.array(z.string()).default([]),
    /** Optional line shown under the links, e.g. why there are no screenshots. */
    note: z.string().optional(),
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
