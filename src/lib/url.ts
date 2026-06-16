// base path を考慮した内部リンク生成
const BASE = import.meta.env.BASE_URL; // 例: "/tech-daily-reading-web/"

export function url(path = ''): string {
  const clean = `${BASE}/${path}`.replace(/\/{2,}/g, '/');
  // 末尾スラッシュは保持（ディレクトリ形式のパーマリンク用）
  return clean;
}
