import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Data de cada guia (atualizado ou publicado) para o lastmod do mapa do site.
const PASTA_GUIAS = './src/content/guias';
const datasGuias = Object.fromEntries(
  readdirSync(PASTA_GUIAS).filter((f) => f.endsWith('.md')).map((f) => {
    const t = readFileSync(`${PASTA_GUIAS}/${f}`, 'utf8');
    const d = (t.match(/^atualizado:\s*(\S+)/m) ?? t.match(/^publicado:\s*(\S+)/m))?.[1];
    return [`https://mlseguros.pt/guias/${f.replace(/\.md$/, '')}/`, d];
  }),
);

export default defineConfig({
  site: 'https://mlseguros.pt',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/obrigado/'),
      serialize(item) {
        const d = datasGuias[item.url];
        if (d) item.lastmod = new Date(d).toISOString();
        return item;
      },
    }),
  ],
});
