import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Drafts show up in `npm run dev` but are left out of the built site.
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["work", "fun"]),
    tags: z.array(z.string()).default([]),
    startDate: z.coerce.date().optional(),
    // Leave endDate out for ongoing projects.
    endDate: z.coerce.date().optional(),
    image: z.string().optional(),
    // Lower numbers sort first; ties fall back to newest startDate.
    order: z.number().default(99),
    // Drafts show up in `npm run dev` but are left out of the built site.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
