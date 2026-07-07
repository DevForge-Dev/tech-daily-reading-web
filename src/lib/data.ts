import { parse } from 'node-html-parser';
// 唯一のデータソース。Cowork が毎日更新する。中身は読むだけ。
import raw from '../../data/articles.json';

export interface Source {
  title: string;
  url: string;
}

export interface RawArticle {
  id: string;
  date: string;
  topic: string;
  title: string;
  lede: string;
  articleHtml: string;
  sources: Source[];
}

export interface TocItem {
  id: string;
  text: string;
}

export interface Article extends RawArticle {
  topicSlug: string;
  /** 見出し id を付与し、コードブロックに data 属性を足した本文 HTML */
  html: string;
  toc: TocItem[];
  readingMinutes: number;
  /** 検索用プレーンテキスト */
  plainText: string;
  hasMermaid: boolean;
}

export interface TopicMeta {
  name: string;
  slug: string;
  color: string;
  /** ヒーロー/チップ用グラデーション */
  gradient: [string, string];
  glyph: string;
}

const TOPIC_META: Record<string, TopicMeta> = {
  'Claude Code': {
    name: 'Claude Code',
    slug: 'claude-code',
    color: '#7b3fe4',
    gradient: ['#8b5cf6', '#5b21b6'],
    glyph: '✶',
  },
  'Next.js': {
    name: 'Next.js',
    slug: 'nextjs',
    color: '#1f6feb',
    gradient: ['#3b82f6', '#0b3d91'],
    glyph: '▲',
  },
  Flutter: {
    name: 'Flutter',
    slug: 'flutter',
    color: '#0277bd',
    gradient: ['#29b6f6', '#01579b'],
    glyph: '◆',
  },
  'GitHub Trending': {
    name: 'GitHub Trending',
    slug: 'github-trending',
    color: '#238636',
    gradient: ['#3fb950', '#1a7f37'],
    glyph: '★',
  },
  'はじめに': {
    name: 'はじめに',
    slug: 'intro',
    color: '#64748b',
    gradient: ['#94a3b8', '#475569'],
    glyph: '✦',
  },
};

const FALLBACK_META: TopicMeta = {
  name: 'その他',
  slug: 'other',
  color: '#64748b',
  gradient: ['#94a3b8', '#475569'],
  glyph: '•',
};

export function topicMeta(topic: string): TopicMeta {
  return TOPIC_META[topic] ?? { ...FALLBACK_META, name: topic };
}

export function topicSlug(topic: string): string {
  return topicMeta(topic).slug;
}

/** 日本語想定: 1分あたりの文字数で読了時間を概算 */
function estimateMinutes(text: string): number {
  const chars = text.replace(/\s+/g, '').length;
  return Math.max(1, Math.round(chars / 500));
}

/** articleHtml を加工: h4 に id 付与、TOC 抽出、読了時間・検索テキスト算出 */
function processHtml(html: string): {
  html: string;
  toc: TocItem[];
  readingMinutes: number;
  plainText: string;
  hasMermaid: boolean;
} {
  const root = parse(html, {
    // figure 内のインライン SVG / Mermaid を保持する
    blockTextElements: { script: true, style: true, pre: true, code: true },
  });

  const toc: TocItem[] = [];
  const headings = root.querySelectorAll('h4');
  headings.forEach((h, i) => {
    const id = `sec-${i + 1}`;
    h.setAttribute('id', id);
    const text = h.text.trim();
    if (text) toc.push({ id, text });
  });

  const hasMermaid = root.querySelectorAll('pre.mermaid').length > 0;

  const plainText = root.text.replace(/\s+/g, ' ').trim();

  return {
    html: root.toString(),
    toc,
    readingMinutes: estimateMinutes(plainText),
    plainText,
    hasMermaid,
  };
}

let cache: Article[] | null = null;

export function getArticles(): Article[] {
  if (cache) return cache;
  const rawArticles = (raw as { articles: RawArticle[] }).articles ?? [];
  cache = rawArticles.map((a) => {
    const processed = processHtml(a.articleHtml);
    return {
      ...a,
      topicSlug: topicSlug(a.topic),
      ...processed,
    };
  });
  return cache;
}

export function getTopics(): string[] {
  return (raw as { topics: string[] }).topics ?? [];
}

export function getGeneratedAt(): string {
  return (raw as { generatedAt: string }).generatedAt ?? '';
}

/** YYYY-MM 単位のアーカイブ集計 */
export interface MonthGroup {
  month: string; // YYYY-MM
  label: string; // 2026年6月
  articles: Article[];
}

export function groupByMonth(articles: Article[]): MonthGroup[] {
  const map = new Map<string, Article[]>();
  for (const a of articles) {
    const month = a.date.slice(0, 7);
    if (!map.has(month)) map.set(month, []);
    map.get(month)!.push(a);
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([month, arts]) => {
      const [y, m] = month.split('-');
      return { month, label: `${y}年${Number(m)}月`, articles: arts };
    });
}

export interface TopicGroup {
  topic: string;
  meta: TopicMeta;
  articles: Article[];
}

export function groupByTopic(articles: Article[]): TopicGroup[] {
  const order = getTopics();
  const map = new Map<string, Article[]>();
  for (const a of articles) {
    if (!map.has(a.topic)) map.set(a.topic, []);
    map.get(a.topic)!.push(a);
  }
  // topics の並び順を尊重しつつ、未知トピックは後ろに
  const keys = [...map.keys()].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
  return keys.map((topic) => ({
    topic,
    meta: topicMeta(topic),
    articles: map.get(topic)!,
  }));
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
}
