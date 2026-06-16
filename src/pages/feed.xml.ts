import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../lib/data';
import { url } from '../lib/url';

export function GET(context: APIContext) {
  const articles = getArticles();
  return rss({
    title: 'デイリー技術深掘り 読み物',
    description:
      'Claude Code / Next.js / Flutter の毎日の技術リサーチを深掘りの読み物として蓄積するアーカイブ。',
    site: context.site ?? 'https://devforge-dev.github.io',
    items: articles.map((a) => ({
      title: a.title,
      description: a.lede,
      pubDate: new Date(`${a.date}T13:30:00+09:00`),
      link: url(`articles/${a.id}/`),
      categories: [a.topic],
    })),
    customData: '<language>ja</language>',
  });
}
