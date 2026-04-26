import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://dr-ev-subba-reddy-skin-care.vercel.app",
  // `output: "static"` is the default in Astro 5; the `/api/book` endpoint
  // opts into SSR via `export const prerender = false`. Hybrid by routes.
  output: "static",
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: false,
  }),
  integrations: [svelte(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  build: {
    inlineStylesheets: "auto",
  },
});
