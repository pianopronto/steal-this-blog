import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  experimental: {
    assets: true,
  },
  vite: {
    resolve: {
      alias: [
        {
          find: "@",
          replacement: "src",
        },
      ],
    },
  },
  integrations: [mdx(), sitemap(), tailwind()],
});
