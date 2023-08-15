import * as consts from "@/consts";

import { defineCollection, reference, z } from "astro:content";

const blog = defineCollection({
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z
          .union([z.string(), z.date()])
          .transform((val) => new Date(val)),
        updatedDate: z
          .union([z.string(), z.date()])
          .optional()
          .transform((val) => new Date(val)),
        heroImage: z.union([image(), z.string()]).optional(),
        author: reference("authors").default(consts.DEFAULT_AUTHOR),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
      })
      .transform((obj) => {
        // Add draft tag
        if (obj.draft == true) {
          obj.tags.push("Drafts");
        } else if (obj.pubDate > new Date()) {
          obj.tags.push("Scheduled");
        }
        return obj;
      }),
});

const authors = defineCollection({
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      bio: z.string(),
      avatar: z.union([image(), z.string()]).optional(),
    }),
});

export const collections = { blog, authors };
