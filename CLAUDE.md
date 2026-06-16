# CLAUDE.md — tech-daily-reading-web

このリポジトリは「デイリー技術深掘り 読み物」のWeb版（公開ブログ）です。**Claude Code でこのブログ本体を本格的に構築・デプロイしてください。** データ供給は別系統（Cowork）が担います。あなたの仕事は「`data/articles.json` を読んで、リッチな静的サイトとして見せる」ことです。

## 全体アーキテクチャ（重要）

```
[Cowork スケジュールタスク]            [このリポ / Claude Code 担当]
 毎日13:30 3トピックを調査         →   data/articles.json を読む
 → data/articles.json に追記            → 静的サイトを生成/描画
 （Cowork が書き込む唯一のファイル）     → GitHub Pages で公開
```

- **データと表示は分離**。あなたは `data/articles.json` を**読むだけ**。中身を生成・改変しない（毎日Coworkが上書き追記する）。
- 表示・デザイン・機能・ビルド・デプロイは全部このリポの責務。
- 公開先は **GitHub Pages**（org: `DevForge-Dev`、想定リポ名: `tech-daily-reading-web`）。

## データ契約（`data/articles.json`）

形式は固定。壊さないこと。サイト側はこのスキーマに合わせて作る。

```jsonc
{
  "schema": "tech-daily-reading/v1",
  "generatedAt": "ISO8601",
  "topics": ["Claude Code", "Next.js", "Flutter"],
  "articles": [
    {
      "id": "2026-06-16-claude-code",   // 安定ID。パーマリンクに使う（date + topicSlug, 衝突時 -2…）
      "date": "2026-06-16",             // YYYY-MM-DD
      "topic": "Claude Code",           // "Claude Code" | "Next.js" | "Flutter" | "はじめに"
      "title": "…",
      "lede": "…",                      // カード/メタ用の1〜2文
      "articleHtml": "…",               // 本文HTML。下記の図解を含む
      "sources": [{ "title": "…", "url": "…" }]
    }
  ]
}
```

- 配列は**新しい順（先頭が最新）**。Coworkが先頭に積む。最大90本。
- `topicSlug`: Claude Code→`claude-code` / Next.js→`nextjs` / Flutter→`flutter` / はじめに→`intro`。
- トピック色（チップ・ヒーロー）: Claude Code=紫(#7b3fe4) / Next.js=青(#1f6feb) / Flutter=水色(#0277bd)。

### `articleHtml` に含まれるもの（そのまま描画してOK）
- 見出し `<h4>`、段落 `<p>`、`<ul>/<ol>`、`<pre><code>`、`<blockquote>`
- **図解** `<figure class="fig">…</figure>`：
  - インライン `<svg>`（属性はシングルクォート。CSSで `figure.fig svg{max-width:100%}` を当てる）
  - Mermaid `<pre class="mermaid">…</pre>`（**詳細表示時に** `mermaid.run()` で描画。`securityLevel:'strict'`, `htmlLabels:false`）
- `articleHtml` は信頼できる自前生成コンテンツだが、念のためサニタイズ方針は自分で決めてよい（図のSVG/Mermaidは残すこと）。

## このブログに欲しい機能（静的・バックエンド不要）

優先度順。フレームワークは任意（**Astro 推奨**。Eleventy / Next.js static export でも可）。

1. **一覧 → 記事詳細**。詳細は**固定URL（パーマリンク）** `/articles/<id>/` でシェア・ブックマーク可能に。
2. **トピック別ヒーローバナー**（topic色のグラデーション＋グリフ）。記事先頭に大きく、カードに小さく。
3. **全文検索**（クライアントサイド。Pagefind か簡易インデックスで可）。
4. **アーカイブ**：トピック別・月別の絞り込み。
5. **RSS/Atom フィード** `/feed.xml`（ビルド時生成）。
6. **ダークモード**トグル（OS設定追従＋手動）。
7. 記事内**目次（TOC）**・**読了時間**・見出しアンカー。
8. **コードのシンタックスハイライト**（Shiki/Prism/highlight.js）。
9. **傾向グラフ**：トピック別の本数推移など（Chart.js）。Mermaid図はそのまま描画。
10. **PWA**（manifest＋軽いService Worker、オフライン閲覧）。任意。

### やらないこと / 制約
- **AIチャット（Q&A）は静的サイト単体では作らない**。APIキーを露出できないため。やるなら別途サーバーレス関数（Cloudflare Workers / Vercel）＋ユーザーのAPIキーが必要 ＝ 別タスク。
- 外部に記事データを送らない。広告・アフィリエイト・トラッキングは入れない（自分用アーカイブ）。

## ビルド / デプロイ

- 出力は **`docs/`** に吐く設定が最短（GitHub Pages の "Deploy from branch → /docs" を使う）。または GitHub Actions で `gh-pages` でも可。あなたの判断でよい。
- 毎日 Cowork が `data/articles.json` を更新する。**公開を自動化**するには次のどちらかを用意:
  - (a) GitHub Actions：`data/articles.json` の push をトリガに再ビルド＆Pagesデプロイ（ただし push 自体は別途必要）。
  - (b) ローカル launchd：このフォルダを監視して `build → commit → push` する（同org `flutter-research-scheduler` の `auto-push.sh` / `*.plist` が参考になる）。
- 初回セットアップ（あなた＝Claude Code がMacの認証で実行）:
  ```bash
  gh repo create DevForge-Dev/tech-daily-reading-web --public --source=. --remote=origin --push
  # その後 Settings → Pages で Source を /docs（または Actions）に設定
  ```

## キックオフ手順（このリポを開いたら）
1. `data/articles.json` を読み、スキーマと図解（SVG/Mermaid）の実例を把握する。
2. フレームワークを選定（Astro推奨）し、上記「欲しい機能」の1〜8をまず実装。
3. ローカルプレビューで図解・パーマリンク・検索・ダークモードを確認。
4. `gh repo create` → push → Pages 有効化。
5. 自動公開（Actions か launchd）を用意し、`data/articles.json` 更新が反映されることを確認。
6. README に公開URLと運用メモを追記。

不明点があっても、この `data/articles.json` のスキーマと上のリストだけで自走できるように作ってあります。
