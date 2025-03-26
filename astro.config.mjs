import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://emekaallison.com",
  integrations: [mdx(), sitemap()],
  image: {
    domains: [],
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  vite: {
    plugins: [
      tailwindcss({
        // Add explicit configuration for Tailwind v4
        content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
        cssFilePath: './src/styles/global.css', // Point to your CSS file
      })
    ],
  },
  experimental: {},
});
