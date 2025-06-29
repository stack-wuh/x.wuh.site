// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcssPlugin from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/blog/about': 'https://wuh.site'
  },
  site: 'https://wuh.site',
  server: {
    port: 4040
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    plugins: [
      tailwindcssPlugin()
    ]
  }
});
