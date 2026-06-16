# tech-daily-reading-web

「デイリー技術深掘り 読み物」の**Web版（公開ブログ）**。Claude Code / Next.js / Flutter の毎日の自動リサーチを、自分用の深掘り記事として蓄積・公開する静的サイトです。**Astro** 製。

## 公開URL

https://devforge-dev.github.io/tech-daily-reading-web/

## 仕組み

- **データ供給（Cowork）**: 毎日13:30のスケジュールタスクが3トピックを調査し、`data/articles.json` に追記する。
- **表示（このリポ / Astro）**: `data/articles.json` を読んでリッチな静的サイトを生成し、`docs/` に出力 → GitHub Pages で公開。

データと表示が分離しているので、デザインや機能はこのリポ側で自由に進化させられます。

## 実装した機能

- **一覧 → 記事詳細**（固定パーマリンク `/articles/<id>/`）
- **トピック別ヒーローバナー**（topic色グラデーション＋グリフ。記事先頭に大、カードに小）
- **全文検索**（クライアントサイド。`/search-index.json` を読む簡易インデックス）
- **アーカイブ**（トピック別フィルタ＋月別グルーピング、トピック別ページ `/topics/<slug>/`）
- **RSS フィード** `/feed.xml`
- **ダークモード**（OS追従＋手動トグル、localStorage 永続化）
- **目次（TOC）・読了時間・見出しアンカー**
- **コードのシンタックスハイライト**（highlight.js、テーマ追従）
- **傾向グラフ**（Chart.js：トピック別本数の積み上げ＋内訳ドーナツ）／**図解描画**（インラインSVG＋Mermaid `mermaid.run()`、`securityLevel:'strict'`）
- **PWA**（manifest＋軽量 Service Worker、オフライン閲覧）

## 開発

Node 22 を使用（`.node-version` 参照）。

```bash
npm install
npm run dev      # ローカルプレビュー（http://localhost:4321/tech-daily-reading-web）
npm run build    # docs/ に静的サイトを出力
npm run preview  # ビルド結果のプレビュー
```

## ディレクトリ

```
data/articles.json   ← 唯一のデータソース（Coworkが毎日更新。中身は触らない）
src/                 ← Astro のページ・コンポーネント・ロジック
  lib/data.ts        ← articles.json を読み込み、TOC/読了時間/検索テキストを生成
  pages/             ← index / articles/[id] / topics/[slug] / archive / trends / search / feed.xml
public/              ← favicon・manifest・sw.js・.nojekyll
docs/                ← 公開する静的サイトの出力先（GitHub Pages: /docs 配信）
astro.config.mjs     ← site / base(/tech-daily-reading-web) / outDir(docs) 設定
```

## デプロイ / 自動公開

GitHub Pages は **Settings → Pages → Source: Deploy from a branch → `main` / `/docs`** で配信。

自動公開は `.github/workflows/build-docs.yml` が担当：`data/**` や `src/**` の push を検知して `docs/` を再ビルドし、コミット＆プッシュする（`[skip ci]` で再帰回避）。Cowork が `data/articles.json` を push すれば、サイトが自動更新されます。

> ローカルで `data/articles.json` だけ更新した場合は `npm run build` → commit → push で反映できます。

## ポリシー

自分用の知識アーカイブです。広告・アフィリエイト・トラッキングは入れません。記事データを外部に送信しません（図のCDN：Mermaid のみ jsDelivr から読み込み）。
