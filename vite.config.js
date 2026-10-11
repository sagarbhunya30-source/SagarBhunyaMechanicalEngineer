import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SITE_URL (absolute, trailing slash) is used for social-sharing image links.
// The deploy workflow sets it from the repository name.
const siteUrl = process.env.SITE_URL || '/';

export default defineConfig({
  // Relative base: works at a domain root or under /<repository>/ on GitHub Pages.
  base: './',
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
  ],
});
