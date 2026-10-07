import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
export const collections = { mushrooms: defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/mushrooms' }),
  schema: z.object({ name: z.string(), latin: z.string(),
    edibility: z.enum(['edible', 'conditional', 'inedible', 'poisonous']),
    season: z.string(), habitat: z.string(), lookalikes: z.string(), source: z.string().optional() }) }) };
