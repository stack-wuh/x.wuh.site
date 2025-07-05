// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcssPlugin from '@tailwindcss/vite';
import solid from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/blog/about': 'https://wuh.site'
  },
  site: 'https://wuh.site',
  server: {
    port: 4040
  },
  integrations: [solid()],
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    plugins: [
      tailwindcssPlugin()
    ],
  }
});
