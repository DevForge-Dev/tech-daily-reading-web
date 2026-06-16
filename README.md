# tech-daily-reading-web

「デイリー技術深掘り 読み物」の**Web版（公開ブログ）**。Claude Code / Next.js / Flutter の毎日の自動リサーチを、自分用の深掘り記事として蓄積・公開するための静的サイトです。

## 仕組み

- **データ供給（Cowork）**: 毎日13:30のスケジュールタスクが3トピックを調査し、`data/articles.json` に追記する。
- **表示（このリポ / Claude Code）**: `data/articles.json` を読んでリッチな静的サイトを生成し、GitHub Pages で公開する。

データと表示が分離しているので、デザインや機能はこのリポ側で自由に進化させられます。

## ディレクトリ

```
data/articles.json   ← 唯一のデータソース（Coworkが毎日更新。中身は触らない）
docs/                ← 公開する静的サイトの出力先（GitHub Pages: /docs 配信）
CLAUDE.md            ← Claude Code 向けの構築ガイド & データ契約
```

## はじめかた（Claude Code）

このフォルダを Claude Code で開き、こう頼んでください:

> `CLAUDE.md` を読んで、`data/articles.json` を使ったリッチな静的ブログを構築して。Astroで、パーマリンク・全文検索・アーカイブ・RSS・ダークモード・目次・コードハイライト・傾向グラフ・図解(SVG/Mermaid)描画まで。`docs/` に出力してGitHub Pagesで公開できる形にして。

## 公開（初回のみ・要 GitHub 認証）

```bash
gh repo create DevForge-Dev/tech-daily-reading-web --public --source=. --remote=origin --push
# GitHub の Settings → Pages で Source を /docs（または Actions）に設定
```

## ポリシー

自分用の知識アーカイブです。広告・アフィリエイト・トラッキングは入れません。記事データを外部に送信しません。
