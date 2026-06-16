// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages (project site): https://devforge-dev.github.io/tech-daily-reading-web/
export default defineConfig({
  site: 'https://devforge-dev.github.io',
  base: '/tech-daily-reading-web',
  outDir: './docs',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  // 図解のインライン SVG / Mermaid を壊さないよう、HTML はそのまま流し込む。
});
