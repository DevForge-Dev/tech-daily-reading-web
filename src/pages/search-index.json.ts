import type { APIRoute } from 'astro';
import { getArticles, topicMeta } from '../lib/data';

// クライアントサイド全文検索用の軽量インデックス
export const GET: APIRoute = () => {
  const index = getArticles().map((a) => ({
    id: a.id,
    title: a.title,
    lede: a.lede,
    topic: a.topic,
    topicSlug: a.topicSlug,
    color: topicMeta(a.topic).color,
    glyph: topicMeta(a.topic).glyph,
    date: a.date,
    // 本文は検索用に上限を設けて軽量化
    text: a.plainText.slice(0, 4000),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
