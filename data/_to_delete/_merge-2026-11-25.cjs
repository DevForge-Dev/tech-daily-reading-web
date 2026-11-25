/* Merge 2026-11-25 articles into articles.json (Web authoritative data) */
const fs = require('fs');
const path = require('path');

const DATA = process.env.DATA_PATH || path.join(process.env.HOME, 'mnt/DevForge/tech-daily-reading-web/data/articles.json');
const D = '2026-11-25';

const topicSlugMap = {
  'Claude Code': 'claude-code',
  'Next.js': 'nextjs',
  'Flutter': 'flutter',
  'GitHub Trending': 'github-trending',
  'はじめに': 'intro',
};

/* ---------- 1) Claude Code ---------- */
const claudeCode = {
  date: D,
  topic: 'Claude Code',
  title: 'Claude Ship ベータ公開 — PR の「レビュー・修正・承認」をAIに回す3本柱と /ship',
  lede: 'コードレビューの“両側”にAIを。Code Review(GA)＋PR Steward(beta)＋Claude Approvals(beta)、そして Claude Code の /ship コマンド。',
  articleHtml: `
<p>2026-11-24、Anthropic が PR のレビュー・修正・ポリシー承認を自動化するエージェント群「<strong>Claude Ship</strong>」をベータ公開した。狙いは一言でいえば「コードレビューの<em>両側</em>にAIを置く」こと——指摘を<em>する</em>側だけでなく、指摘に<em>対応する</em>側、そして定型変更を<em>承認する</em>側までを回す。あわせて Claude Code とデスクトップ版に <code>/ship</code> コマンドのロールアウトが始まった。1人で複数リポジトリを回す開発スタイルでは、PR の往復こそが地味に時間を食う工程なので、そこを自動化する動きは素直に効く。</p>

<h4>何が新しいか — 3本柱</h4>
<p>構成は3つ。(1) すでに一般提供(GA)の <strong>Code Review</strong>：PR をコードベースに照らして複数観点で検査→検証→分類し PR にコメントする。深さは <code>Quick / Standard / Deep</code> をリポジトリ単位で選べる。(2) 新規ベータの <strong>PR Steward</strong>：失敗した CI・マージ競合・レビュー指摘に対応し、push ごとに「何を変えたか／取り消す方法」をコメントする。操作は <code>@claude</code> ／ <code>@claude stop</code>。ただし<strong>承認・マージはしない</strong>。(3) 同じくベータの <strong>Claude Approvals</strong>：リポジトリ内のポリシーファイルに基づいて定型変更を承認し、特定条件は人手承認を要求する。まずは observe-only（観察のみ）運用が推奨されている。</p>

<figure class='fig'>
<svg viewBox='0 0 600 230' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'>
  <rect x='10' y='10' width='580' height='210' rx='10' fill='#f3fbf5' stroke='#1a7f37'/>
  <text x='300' y='34' font-size='14' text-anchor='middle' fill='#1a7f37' font-weight='bold'>Claude Ship = レビューの両側をAIに</text>
  <g>
    <rect x='28' y='54' width='172' height='150' rx='8' fill='#fff' stroke='#3fb950'/>
    <text x='114' y='76' font-size='13' text-anchor='middle' font-weight='bold' fill='#1a7f37'>Code Review</text>
    <text x='114' y='94' font-size='11' text-anchor='middle' fill='#1a7f37'>GA / 一般提供</text>
    <text x='114' y='120' font-size='11' text-anchor='middle' fill='#333'>PRを多観点で検査</text>
    <text x='114' y='138' font-size='11' text-anchor='middle' fill='#333'>→検証→分類しコメント</text>
    <text x='114' y='164' font-size='11' text-anchor='middle' fill='#333'>Quick/Standard/Deep</text>
    <text x='114' y='188' font-size='11' text-anchor='middle' fill='#777'>（指摘する側）</text>
  </g>
  <g>
    <rect x='214' y='54' width='172' height='150' rx='8' fill='#fff' stroke='#3fb950'/>
    <text x='300' y='76' font-size='13' text-anchor='middle' font-weight='bold' fill='#1a7f37'>PR Steward</text>
    <text x='300' y='94' font-size='11' text-anchor='middle' fill='#c26b00'>beta</text>
    <text x='300' y='120' font-size='11' text-anchor='middle' fill='#333'>失敗CI/競合/指摘に対応</text>
    <text x='300' y='138' font-size='11' text-anchor='middle' fill='#333'>pushごとに差分を説明</text>
    <text x='300' y='164' font-size='11' text-anchor='middle' fill='#333'>@claude で操作</text>
    <text x='300' y='188' font-size='11' text-anchor='middle' fill='#777'>承認/マージは不可</text>
  </g>
  <g>
    <rect x='400' y='54' width='172' height='150' rx='8' fill='#fff' stroke='#3fb950'/>
    <text x='486' y='76' font-size='13' text-anchor='middle' font-weight='bold' fill='#1a7f37'>Claude Approvals</text>
    <text x='486' y='94' font-size='11' text-anchor='middle' fill='#c26b00'>beta</text>
    <text x='486' y='120' font-size='11' text-anchor='middle' fill='#333'>ポリシーファイルで</text>
    <text x='486' y='138' font-size='11' text-anchor='middle' fill='#333'>定型変更を承認</text>
    <text x='486' y='164' font-size='11' text-anchor='middle' fill='#333'>条件次第で人手承認</text>
    <text x='486' y='188' font-size='11' text-anchor='middle' fill='#777'>まず observe-only</text>
  </g>
</svg>
<figcaption>図1：Claude Ship の3本柱。指摘→対応→承認を別エージェントに分離している。</figcaption>
</figure>

<h4>仕組み — /ship の一気通貫</h4>
<p>変更が整った状態で <code>/ship</code> を実行すると、Claude がコードを push し、PR を作成し、そのレビューを行い、レビュー指摘や失敗 CI への対応まで進める。マージ可否は<strong>開発者の権限＋リポジトリのブランチ保護ルール</strong>に従う（AIが勝手にマージするわけではない）。<code>/ship</code> の実行は通常の Claude Code 利用として課金される。管理者は <code>/ship</code> を使わせずとも、Code Review と PR Steward をリポジトリ単位で有効化し、PR 上でエージェントを自動稼働させる運用も選べる。</p>

<figure class='fig'>
<pre class='mermaid'>flowchart LR
  A["変更が整う"] --> B["/ship 実行"]
  B --> C["push"]
  C --> D["PR 作成"]
  D --> E["Code Review が検査"]
  E --> F["PR Steward が指摘/失敗CIに対応"]
  F --> G["権限+ブランチ保護でマージ可否判定"]</pre>
<figcaption>図2：/ship の流れ。承認の最終権は人間・ルール側に残る。</figcaption>
</figure>

<h4>実務での使いどころ・自分が試すなら</h4>
<p>提供は GitHub ホスト＋Team/Enterprise 限定で、課金はトークン量ベース。<strong>ZDR（ゼロデータ保持）／HIPAA 構成／顧客管理鍵(CMK)の組織は対象外</strong>なので、まず自分の組織区分を確認するのが先。自分で試すなら、いきなり承認まで任せず <strong>Claude Approvals は observe-only から</strong>、PR Steward は小さな CI 失敗の自動修正から入れて、コメントの質と誤爆率を数日眺めるのが安全。Anthropic 社内では Claude Code チームのマージ済み PR が6→9月で2倍超、revert 率が40%超低下したと主張しているが、これは広いレビュー工程の一部という但し書き付き。</p>

<h4>注意点・落とし穴</h4>
<p>今日の情報源は二次情報（Help Net Security, 2026-11-24）で、Anthropic 公式原典は未照合。数値や挙動は確定として扱わない方がよい。もう一点、npm 側の動き：本日 JST 07:06 頃に <code>v2.1.332</code> が <code>next</code> タグで公開されたが、<code>latest</code> は依然 <code>v2.1.331</code>、<code>stable</code> は <code>v2.1.325</code> のままで、公式 CHANGELOG に v2.1.332 の変更ノートはまだ載っていない。つまり「新版が npm に出た」事実だけで、中身は未掲載。実務の既定導入先は据え置きと見てよい。</p>

<h4>ひとことまとめ</h4>
<p>Claude Ship は「レビューする／直す／承認する」を分離した3エージェント構成。<code>/ship</code> はその入口で、最終的なマージ権は人間とブランチ保護ルールに残る。試すなら observe-only から、対象外組織(ZDR/HIPAA/CMK)かどうかの確認を最初に。</p>
`,
  sources: [
    { title: 'Help Net Security — Anthropic Claude Ship beta', url: 'https://www.helpnetsecurity.com/2026/11/24/anthropic-claude-ship-beta/' },
    { title: '@anthropic-ai/claude-code (npm, dist-tags)', url: 'https://www.npmjs.com/package/@anthropic-ai/claude-code' },
    { title: 'DevelopersIO — Claude Code v2.1.331 主要アップデート', url: 'https://dev.classmethod.jp/articles/20261124-cc-updates-v2-1-331/' },
  ],
};

/* ---------- 2) Next.js ---------- */
const nextjs = {
  date: D,
  topic: 'Next.js',
  title: '読書進捗バー＋スクロールスパイ目次 — 純CSS scroll() と IntersectionObserver の正しい組み方',
  lede: '進捗バーは JS ゼロのコンポジタ駆動へ、スパイは IO の“取りこぼし”を Set で潰す。App Router の RSC 境界まで一気に整理。',
  articleHtml: `
<p>技術記事サイトを Next.js(App Router / MDX)で作ると、ほぼ必ず要求されるのが2点セット——ページ上端の<strong>読書進捗バー</strong>と、読み進みに合わせて現在地が光る<strong>スクロールスパイ(Scrollspy)目次</strong>。2024〜2026年のトレンドは明確に「JS を減らす」方向で、進捗バーは CSS Scroll-driven Animations で<strong>JavaScript ゼロ・コンポジタ駆動</strong>にできるようになった。ただしスパイの方はまだ純CSS化が未成熟で、現行ブラウザで確実に動かすなら IntersectionObserver(IO)併用が実務解。この“ちょうど良い”構成を、落とし穴込みで押さえる。</p>

<h4>何が新しいか — 進捗バーは純CSS scroll()</h4>
<p>やることは <code>transform: scaleX(0)→scaleX(1)</code> の <code>@keyframes</code> を、無名スクロールタイムライン <code>animation-timeline: scroll()</code> で駆動するだけ。<code>scroll()</code> は引数なしで「直近のブロック軸スクローラ＝通常はルート」を追跡する。アニメするのは <code>transform</code> だけなのでコンポジタで動き、メインスレッドを使わず軽い。<strong>最大の落とし穴</strong>は、<code>animation</code> ショートハンドが <code>animation-timeline</code> を <code>auto</code> に<strong>リセット</strong>すること。必ず <code>animation-timeline</code> は<em>ショートハンドの後</em>に書く。</p>

<figure class='fig'>
<svg viewBox='0 0 600 150' xmlns='http://www.w3.org/2000/svg' font-family='monospace'>
  <rect x='10' y='10' width='580' height='130' rx='10' fill='#fef6f6' stroke='#d14'/>
  <text x='300' y='34' font-size='13' text-anchor='middle' font-family='sans-serif' fill='#d14' font-weight='bold'>プロパティの順序が結果を決める</text>
  <rect x='28' y='48' width='262' height='78' rx='6' fill='#fff' stroke='#d14'/>
  <text x='40' y='68' font-size='11' fill='#d14'>animation-timeline: scroll();</text>
  <text x='40' y='86' font-size='11' fill='#999'>animation: grow auto linear;</text>
  <text x='40' y='112' font-size='11' font-family='sans-serif' fill='#d14'>✗ timeline が auto に戻り動かない</text>
  <rect x='310' y='48' width='262' height='78' rx='6' fill='#fff' stroke='#1a7f37'/>
  <text x='322' y='68' font-size='11' fill='#999'>animation: grow auto linear;</text>
  <text x='322' y='86' font-size='11' fill='#1a7f37'>animation-timeline: scroll();</text>
  <text x='322' y='112' font-size='11' font-family='sans-serif' fill='#1a7f37'>✓ ショートハンドの後に書く</text>
</svg>
<figcaption>図1：animation ショートハンドは animation-timeline を auto にリセットする。順序が命。</figcaption>
</figure>

<p>対応は Chromium 系と Firefox(near-current)まで。全ブラウザではないので <code>@supports (animation-timeline: scroll())</code> で機能検出し、装飾目的なら「非対応は何もしない」プログレッシブ・エンハンスメントで十分。公式は polyfill を非推奨としている。実データ連動が要るなら、非対応時だけ <code>scroll</code> イベントで <code>scaleX</code> を更新する軽いフォールバックを足す。</p>

<h4>仕組み — スパイは「中央線」と Set</h4>
<p>現在地判定のキモは IO の <code>rootMargin: '-50% 0px -50% 0px'</code>。上下を50%削ると判定帯が<strong>ビューポート中央の1本線</strong>になり、「その線を跨いでいる節＝現在地」で1つに絞れる。固定ヘッダがあれば上側だけオフセットする（例 <code>-80px 0px -50% 0px</code>）。</p>
<p><strong>典型バグ</strong>：IO コールバックの <code>entries</code> には「前回から交差状態が変化した要素だけ」が来る。これを <code>findIndex(e =&gt; e.isIntersecting)</code> で選ぶと、上スクロール時に取りこぼす。堅牢なのは<strong>交差中の要素を Set で保持し、毎回 DOM 順で先頭を現在地に採る</strong>パターン。</p>

<figure class='fig'>
<svg viewBox='0 0 600 180' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'>
  <rect x='120' y='12' width='360' height='156' rx='8' fill='#f6f8ff' stroke='#5b8cff'/>
  <text x='300' y='30' font-size='11' text-anchor='middle' fill='#5b8cff'>viewport</text>
  <line x1='120' y1='90' x2='480' y2='90' stroke='#d14' stroke-width='2' stroke-dasharray='6 4'/>
  <text x='488' y='94' font-size='11' fill='#d14'>中央線</text>
  <rect x='150' y='40' width='300' height='34' rx='4' fill='#fff' stroke='#bbb'/>
  <text x='300' y='61' font-size='11' text-anchor='middle' fill='#777'>§2（上に抜けた）</text>
  <rect x='150' y='78' width='300' height='56' rx='4' fill='#eef7f0' stroke='#1a7f37'/>
  <text x='300' y='110' font-size='12' text-anchor='middle' fill='#1a7f37' font-weight='bold'>§3 = 現在地（中央線を跨ぐ）</text>
  <rect x='150' y='138' width='300' height='20' rx='4' fill='#fff' stroke='#bbb'/>
  <text x='300' y='152' font-size='10' text-anchor='middle' fill='#777'>§4（まだ下）</text>
</svg>
<figcaption>図2：rootMargin -50% 上下で判定帯を中央1本線にし、跨ぐ節を一意に現在地化する。</figcaption>
</figure>

<h4>App Router での組み込み</h4>
<p>目次の<strong>マークアップ生成はサーバー側(RSC/MDX)</strong>で行い、<strong>現在地検出だけを小さな <code>'use client'</code> アイランド</strong>に閉じ込めるのが定石。本文（長文）は Server Component のまま＝JS を増やさない。手順は、(1) <code>rehype-slug</code> 等で見出しに id を付与し ToC を<em>サーバーで</em>生成、(2) 進捗バーは <code>globals.css</code> だけ（<code>'use client'</code> 不要）、(3) スパイは <code>IntersectionObserver</code>／<code>window</code> を使うので Client Component 必須、SSR 時は現在地を計算せず <code>useEffect</code> 内でのみ observe（ハイドレーション mismatch 回避）、(4) 固定ヘッダ下に見出しが隠れないよう <code>scroll-margin-top</code> を当てる。スパイは純クライアント挙動なので ISR / <code>revalidate</code> / <code>use cache</code> とは無干渉。</p>

<h4>注意点・アクセシビリティ</h4>
<p>進捗バーの <code>@keyframes</code> 適用は <code>@media (prefers-reduced-motion: no-preference)</code> で囲い、削減時は非アニメに。ハイライトは<strong>色だけに頼らない</strong>（font-weight / 下線 / インジケーター併用）。将来の純CSSスパイ（<code>scroll-target-group</code> / <code>:target-current</code>）は支援技術に露出しないため、使うなら <code>aria-current</code> の併用が必須。当面は IO 併用が無難。</p>

<h4>ひとことまとめ</h4>
<p>進捗バー＝純CSS <code>scroll()</code>（順序に注意）、スパイ＝IO の中央線＋Set、マークアップはサーバー・検出だけクライアント。この3点で、JS を増やさず堅い「進捗＋目次」が組める。</p>
`,
  sources: [
    { title: 'Chrome — Build a Scroll Progress Indicator', url: 'https://developer.chrome.com/docs/modern-web-guidance/guides/ui-atoms/scroll-progress-indicator' },
    { title: 'Chrome — Build a Scrollspy Navigation', url: 'https://developer.chrome.com/docs/modern-web-guidance/guides/ui-components/scrollspy' },
    { title: 'Maxime Heckel — Scrollspy demystified', url: 'https://blog.maximeheckel.com/posts/scrollspy-demystified/' },
    { title: 'MDN Blog — Scroll progress animations in CSS', url: 'https://developer.mozilla.org/en-US/blog/scroll-progress-animations-in-css' },
  ],
};

/* ---------- 3) Flutter ---------- */
const flutter = {
  date: D,
  topic: 'Flutter',
  title: 'Material/Cupertino が正式 deprecated — material_ui へ移行と、素の Flutter リアクティブ2種',
  lede: '3.50 で SDK 同梱の material.dart が正式非推奨。dart fix 一発で移行。あわせて TweenAnimationBuilder と ValueNotifier を押さえる。',
  articleHtml: `
<p>stable は <code>3.50.1</code>／beta は <code>3.51.0-0.2.pre</code> で5日連続“据え置き”。版の動きが薄い日なので、今日は 3.50（11/11 公開）が持ち込んだ<strong>構造変化</strong>を深掘りする。公式 blog いわく「Flutter 3.50 は結合した <code>package:flutter/material.dart</code> と <code>package:flutter/cupertino.dart</code> を正式に deprecated にする」。つまり SDK 同梱の Material/Cupertino（＋ localization delegate）が<strong>正式に非推奨</strong>になり、移行先は pub.dev のスタンドアロン <code>material_ui</code> ／ <code>cupertino_ui</code>（1.0 は 3.47 で launch 済み）になった。</p>

<h4>何が変わるか — import の付け替え</h4>
<p>移行には自動化がある。公式は「<code>dart fix --apply --code=migrate_design_widgets</code> を実行すれば、既存 import と localization delegate を自動で書き換える」と明記。<code>flutter create</code> の新規プロジェクトは既定で <code>package:material_ui</code> を import し、DevTools 自身も material_ui/cupertino_ui へ移行済み。<strong>削除リリース/日付は未アナウンス</strong>なので今すぐ全面移行の緊急性は低いが、新規コードは material_ui 前提で書くのが無難。この材料パッケージ分離が、go_router 18.0.0 / animations 3.0.0 が material_ui 依存になった背景でもある。</p>

<figure class='fig'>
<svg viewBox='0 0 600 150' xmlns='http://www.w3.org/2000/svg' font-family='monospace'>
  <rect x='10' y='10' width='580' height='130' rx='10' fill='#f4f9ff' stroke='#0468d7'/>
  <text x='300' y='32' font-size='13' text-anchor='middle' font-family='sans-serif' fill='#0468d7' font-weight='bold'>dart fix --apply --code=migrate_design_widgets</text>
  <rect x='28' y='48' width='250' height='78' rx='6' fill='#fff' stroke='#999'/>
  <text x='40' y='74' font-size='11' fill='#777'>import 'package:flutter/</text>
  <text x='40' y='92' font-size='11' fill='#777'>material.dart';</text>
  <text x='153' y='118' font-size='11' font-family='sans-serif' fill='#999' text-anchor='middle'>これまで（deprecated）</text>
  <text x='295' y='92' font-size='22' fill='#0468d7'>→</text>
  <rect x='322' y='48' width='250' height='78' rx='6' fill='#fff' stroke='#0468d7'/>
  <text x='334' y='74' font-size='11' fill='#0468d7'>import 'package:material_ui/</text>
  <text x='334' y='92' font-size='11' fill='#0468d7'>material_ui.dart';</text>
  <text x='447' y='118' font-size='11' font-family='sans-serif' fill='#0468d7' text-anchor='middle'>新規は既定でこちら</text>
</svg>
<figcaption>図1：ワンコマンドで import と delegate を自動移行。除去時期は未アナウンス＝将来の破壊的変更。</figcaption>
</figure>

<p>3.50 の他ヘッドラインも軽く：Direct native interop（FFIgen for Obj-C＋JNIgen for Java/Kotlin）が stable、Wasm web が Safari 26.2+・Firefox 147+ で JS 比2倍超 fps（opt-in）、iOS タッチ入力が 60Hz で 16ms・120Hz ProMotion で 8ms 高速化。Dart 3.14 は <code>dart:html</code>/<code>dart:js</code> 系を deprecated（<code>dart:js_interop</code>＋<code>package:web</code> へ）。</p>

<h4>仕組み — 素の Flutter リアクティブ2種</h4>
<p>状態管理ライブラリの前に押さえておきたいのが、依存ゼロの2つ。<strong>TweenAnimationBuilder&lt;T&gt;</strong> は「target 値が変わるたびに widget のプロパティを新しい値へ自動アニメする implicit builder」。内部に <code>AnimationController</code> を持ち、尺・curve・target を渡すだけ。アニメ版が無いプロパティ（サードパーティ widget 含む）を後付けでアニメ化できる。注意は「<strong>渡した tween の所有権を奪い mutate する</strong>」点——tween はインスタンス変数に持たず build 内で都度生成する。より細かい制御が要るなら <code>AnimatedBuilder</code>＋自前 <code>AnimationController</code> へ。</p>
<p>もう一つが <strong>ValueNotifier&lt;T&gt; ＋ ValueListenableBuilder&lt;T&gt;</strong>＝「単一値の最小リアクティブ」。<code>.value</code> 代入が <code>==</code> 判定で変化していれば listener へ通知し、builder だけ再描画する。<strong>落とし穴</strong>は in-place mutation が通知されないこと：<code>ValueNotifier&lt;List&gt;</code> で <code>list.add(x)</code> しても参照同一で発火しない。新 List を代入し直すか、複数フィールドなら <code>ChangeNotifier</code> を直接 extend する。<code>dispose()</code> は必須。</p>

<figure class='fig'>
<pre class='mermaid'>flowchart LR
  A["counter.value++ (新しい値を代入)"] --> B["== 判定で変化あり"]
  B --> C["listener へ通知"]
  C --> D["ValueListenableBuilder の builder だけ再実行"]
  E["list.add(x) (参照は同一)"] --> F["通知されない"]</pre>
<figcaption>図2：ValueNotifier は「代入」で発火、「中身の mutation」では発火しない。</figcaption>
</figure>

<h4>パフォーマンスの軸</h4>
<p>公式「Performance best practices」の軸は <code>build()</code> を速く小さく保つこと。<code>setState()</code> は変化する subtree に局所化し、再利用は<strong>関数ではなく StatelessWidget</strong>に。変わらない child を同一インスタンス（const／親から受け渡し）で保てば再 build traversal が止まる。<code>Opacity</code>/clip/<code>saveLayer()</code> は節約、大リストは lazy builder。60Hz のフレーム予算は <strong>16ms（build 8ms＋render 8ms）</strong>。render を下げれば見た目不変でも電池・発熱が改善する。</p>

<h4>ひとことまとめ</h4>
<p>3.50 の本丸は material_ui へのパッケージ分離（移行は <code>dart fix</code> 一発、除去時期は未定）。新規コードは material_ui 前提で。状態は素の ValueNotifier/TweenAnimationBuilder を土台に、「代入で発火・mutation は無通知」だけは体に入れておく。</p>
`,
  sources: [
    { title: "What's new in Flutter 3.50 (flutter.dev)", url: 'https://flutter.dev/blog/whats-new-in-flutter-3-50' },
    { title: 'material_ui / cupertino_ui 移行ガイド (docs.flutter.dev)', url: 'https://docs.flutter.dev/release/breaking-changes/material-ui-and-cupertino-ui' },
    { title: 'TweenAnimationBuilder class (api.flutter.dev)', url: 'https://api.flutter.dev/flutter/widgets/TweenAnimationBuilder-class.html' },
    { title: 'ValueListenableBuilder class (api.flutter.dev)', url: 'https://api.flutter.dev/flutter/widgets/ValueListenableBuilder-class.html' },
    { title: 'Performance best practices (docs.flutter.dev)', url: 'https://docs.flutter.dev/perf/best-practices' },
  ],
};

/* ---------- 4) GitHub Trending ---------- */
const githubTrending = {
  date: D,
  topic: 'GitHub Trending',
  title: '11/25の話題リポジトリ — 広告なしデスクトップ実用3本と、エージェント開発を支える基盤3本',
  lede: 'Rust/Tauri 製の“軽いデスクトップ道具”と、iOSテスト・ローカルモデル継続学習・一貫ビジュアル生成という開発基盤。消費者向けの快適さと、エージェント開発の地味な穴埋めが同じ日に並んだ。',
  articleHtml: `
<p>今日の6本を貫くのは2つの流れ。前半は <strong>Rust/Tauri でネイティブに作り直した“軽いデスクトップ道具”</strong>——広告やブラウザのタブから逃れる方向。後半は <strong>エージェント開発の地味だが効く穴埋め</strong>——Mac なしの iOS テスト、遊休GPUでのローカルモデル継続学習、一貫したビジュアル生成。消費者の快適さと開発基盤が同じ日に並んだ格好だ。各リポジトリについて「どんな課題を解こうとしているか」「何ができるか」を押さえる。<em>（本日は daily 未掲載のため、増加は日平均★で代替評価。数値はリポジトリ実測。）</em></p>

<figure class='fig'>
<svg viewBox='0 0 600 300' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'>
  <rect x='6' y='6' width='588' height='288' rx='8' fill='#f3fbf5' stroke='#1a7f37'/>
  <line x1='168' y1='30' x2='168' y2='288' stroke='#cde8d4'/>
  <line x1='384' y1='30' x2='384' y2='288' stroke='#cde8d4'/>
  <text x='87' y='24' text-anchor='middle' font-weight='bold' fill='#1a7f37'>リポジトリ</text>
  <text x='276' y='24' text-anchor='middle' font-weight='bold' fill='#1a7f37'>解決したい課題</text>
  <text x='489' y='24' text-anchor='middle' font-weight='bold' fill='#1a7f37'>提供する機能</text>
  <line x1='10' y1='32' x2='590' y2='32' stroke='#1a7f37'/>
  <g fill='#222'>
    <text x='14' y='56'>Stream-Tube-Desktop</text><text x='14' y='70' fill='#777'>Rust ⭐857</text>
    <text x='176' y='52'>YouTube を広告/追跡なし・</text><text x='176' y='64'>タブ開きっぱなしなしで観たい</text>
    <text x='392' y='52'>gpui+mpv ネイティブ再生。</text><text x='392' y='64'>SponsorBlock/DeArrow 内蔵</text>
    <line x1='10' y1='82' x2='590' y2='82' stroke='#e0efe4'/>
    <text x='14' y='104'>kurocat</text><text x='14' y='118' fill='#777'>TS/Tauri ⭐602</text>
    <text x='176' y='100'>配信オーバーレイ(Bongo Cat)を</text><text x='176' y='112'>OSS・多OSで手軽に</text>
    <text x='392' y='100'>キー可視化の猫ペット＋</text><text x='392' y='112'>OBS透明ソース・覗き見防止</text>
    <line x1='10' y1='130' x2='590' y2='130' stroke='#e0efe4'/>
    <text x='14' y='152'>navier-stokes</text><text x='14' y='166' fill='#777'>Lean ⭐424</text>
    <text x='176' y='148'>数学の大問題を機械検証可能に</text><text x='176' y='160'>(N-S 有限時間爆発の主張)</text>
    <text x='392' y='148'>79p論文＋Lean4形式化。</text><text x='392' y='160'>許容公理を限定する comparator</text>
    <line x1='10' y1='178' x2='590' y2='178' stroke='#e0efe4'/>
    <text x='14' y='200'>agent-sim</text><text x='14' y='214' fill='#777'>Rust ⭐544</text>
    <text x='176' y='196'>Mac/GPU なしで iOS を</text><text x='176' y='208'>CI/クラウドで E2E したい</text>
    <text x='392' y='196'>x86 Linux上の iOS Sim を</text><text x='392' y='208'>エージェントが操作(導入/読取/タップ)</text>
    <line x1='10' y1='226' x2='590' y2='226' stroke='#e0efe4'/>
    <text x='14' y='248'>songe</text><text x='14' y='262' fill='#777'>Python ⭐631</text>
    <text x='176' y='244'>ローカルモデルでトークン代を</text><text x='176' y='256'>継続的に削りたい</text>
    <text x='392' y='244'>遊休GPUで観察→継続学習</text><text x='392' y='256'>(distill/LoRA/MLX)・OpenAI互換</text>
    <line x1='10' y1='270' x2='590' y2='270' stroke='#e0efe4'/>
    <text x='14' y='288'>papercraft</text>
    <text x='176' y='284'>エージェント生成物の見た目を</text>
    <text x='392' y='284'>ポップアップ紙工作風で統一生成</text>
  </g>
</svg>
<figcaption>図1：6本の「解決したい課題 × 提供する機能」対応表。</figcaption>
</figure>

<h4>Avaneesh-Inamdar/Stream-Tube-Desktop（Rust・⭐約857）</h4>
<p><strong>解決したい課題：</strong>「ブラウザのタブを開きっぱなしにせず、広告も自動再生もなしで YouTube を観たい」という素朴な不便。<strong>提供する機能：</strong>gpui(Rust GUI)＋mpv のネイティブ再生で、広告・トラッキングなし(Windows/Linux)。SponsorBlock・DeArrow・Return YouTube Dislike を標準内蔵。作成約3日で日平均約286★＝本日クリーン新星の最速級。非AIの消費者向け道具が純粋なモメンタムで伸びた例。</p>

<h4>qianyiai/kurocat（TypeScript/Tauri・⭐約602）</h4>
<p><strong>解決したい課題：</strong>配信者が使う Bongo Cat 系オーバーレイを、OSS・クロスプラットフォーム・MCP 対応で手軽に。<strong>提供する機能：</strong>キー入力に合わせて動く透明・最前面のデスクトップ「打字猫」兼 OBS 透明ソース。6種の猫＋鯨娘、パスワード入力時の覗き見防止、AI での見た目生成(MCP)に対応(Win/Mac/Linux/Android)。Tauri v2＋Rust/TS。可愛さと実用の合わせ技で急伸。</p>

<h4>tristanbuckmaster/navier-stokes（Lean・⭐約424）</h4>
<p><strong>解決したい課題：</strong>ミレニアム級の未解決問題（ナビエ–ストークス正則性）に関わる主張を、人手の査読だけでなく<em>機械検証可能</em>な形に落とす。<strong>提供する機能：</strong>Alpöge・Buckmaster の「有限時間爆発」を主張する79ページ論文と、Lean 4 形式化を同梱。各定理の形式ステートメント・証明に加え、使用公理を <code>propext</code>/<code>Quot.sound</code>/<code>Classical.choice</code> に限定する comparator を持つ。先の Riemann 予想 Lean 形式化と同じ Alpöge による「大問題を Lean で」潮流の中核。<em>（主張の真偽判断はせず、話題化している事実のみを扱う。）</em></p>

<h4>Developing-Gamer/agent-sim（Rust・⭐約544）</h4>
<p><strong>解決したい課題：</strong>iOS の E2E/ビジュアルテストは Mac 必須で CI に載せづらい、という長年の壁。<strong>提供する機能：</strong>Mac も GPU も使わず x86-64 Linux VM 上で iOS シミュレータ(x86Sim)を動かし、AI エージェントに「.ipa インストール→画面をテキストで読む→タップ/入力/スクロール→ブラウザで目視」をさせるエージェント層。Apache-2.0。モバイル E2E をクラウド/CI で回す将来の土台になり得る。</p>

<h4>sous-labs/songe（Python・⭐約631）</h4>
<p><strong>解決したい課題：</strong>「1人×エージェント×多プロジェクト」で効いてくるトークンコストを、ローカルモデルで削りたい。<strong>提供する機能：</strong>普段使いのローカルモデルを opencode/pi 等 OpenAI 互換ツール越しに使いつつ、各アクション後の結果・エラー・次指示を観察し、エージェントが空いている間に<strong>遊休GPUで継続学習</strong>(蒸留/LoRA/MLX)してモデルを鍛える学習エンジン。既存ワークフローに非侵襲。生徒モデルのローカル実行基盤が前提な点は要注意。</p>

<h4>xikhar/papercraft（JavaScript・⭐約606）</h4>
<p><strong>解決したい課題：</strong>エージェントに作らせるビジュアルが毎回バラバラで、統一した“らしさ”を出しにくい。<strong>提供する機能：</strong>ゲーム・インタラクティブシーン・Web・アニメ・動画を、立体の「飛び出す絵本(ポップアップ紙工作)」風の統一スタイルで生成させるエージェントスキル。出荷済み three.js ゲームの「写真に写った紙模型に見せる」ノウハウ（マット紙・薄い切り口・世界の色で染まる影・ティルトシフト）を数値化して移植。MIT。</p>

<h4>まとめ — 自分が試すなら</h4>
<p>消費者枠なら <strong>Stream-Tube-Desktop</strong> を一度入れて SponsorBlock 内蔵の快適さを体感するのが手軽。開発基盤として本命は <strong>agent-sim</strong>——Mac 不要の iOS テストは CI に組めれば効果が大きい。コスト最適化に興味があれば <strong>songe</strong> を小さなローカルモデルで観察運用から。いずれも作成数日のクリーン新星で、採用判断は自動実行せず様子見から。</p>
`,
  sources: [
    { title: 'Avaneesh-Inamdar/Stream-Tube-Desktop', url: 'https://github.com/Avaneesh-Inamdar/Stream-Tube-Desktop' },
    { title: 'qianyiai/kurocat', url: 'https://github.com/qianyiai/kurocat' },
    { title: 'tristanbuckmaster/navier-stokes', url: 'https://github.com/tristanbuckmaster/navier-stokes' },
    { title: 'Developing-Gamer/agent-sim', url: 'https://github.com/Developing-Gamer/agent-sim' },
    { title: 'sous-labs/songe', url: 'https://github.com/sous-labs/songe' },
    { title: 'xikhar/papercraft', url: 'https://github.com/xikhar/papercraft' },
  ],
};

/* order: newest-first = Claude Code, Next.js, Flutter, GitHub Trending */
const todays = [claudeCode, nextjs, flutter, githubTrending];

/* ---------- merge ---------- */
const obj = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const existing = obj.articles;

function assignId(a, arr) {
  const slug = topicSlugMap[a.topic] || 'misc';
  let base = a.date + '-' + slug;
  let id = base, n = 1;
  const taken = new Set(arr.map(x => x.id));
  while (taken.has(id)) { n++; id = base + '-' + n; }
  return id;
}

let added = 0;
const toPrepend = [];
for (const a of todays) {
  const dup = existing.some(x => x.date === a.date && x.topic === a.topic);
  if (dup) { console.log('SKIP dup:', a.date, a.topic); continue; }
  const article = {
    id: assignId(a, existing.concat(toPrepend)),
    date: a.date, topic: a.topic, title: a.title, lede: a.lede,
    articleHtml: a.articleHtml.trim(), sources: a.sources,
  };
  toPrepend.push(article);
  added++;
}

const merged = toPrepend.concat(existing);
// cap at 90? Task says artifact caps at 90; web data keeps full history (518 already). Keep full.
const out = {
  schema: 'tech-daily-reading/v1',
  generatedAt: new Date().toISOString(),
  topics: ['Claude Code', 'Next.js', 'Flutter', 'GitHub Trending'],
  articles: merged,
};

// backup
const bak = DATA + '.bak-run-' + D;
fs.copyFileSync(DATA, bak);

const json = JSON.stringify(out, null, 2);
fs.writeFileSync(DATA, json);

// validate re-read
const check = JSON.parse(fs.readFileSync(DATA, 'utf8'));
console.log('added:', added, '/ total now:', check.articles.length);
console.log('new ids:', toPrepend.map(a => a.id).join(', '));
console.log('backup:', path.basename(bak));
// tag balance check per new article
for (const a of toPrepend) {
  const h = a.articleHtml;
  const open = (h.match(/<svg/g) || []).length, close = (h.match(/<\/svg>/g) || []).length;
  const fo = (h.match(/<figure/g) || []).length, fc = (h.match(/<\/figure>/g) || []).length;
  const mo = (h.match(/<pre class='mermaid'>/g) || []).length, mc = (h.match(/<\/pre>/g) || []).length;
  console.log(' ', a.topic, 'svg', open + '/' + close, 'figure', fo + '/' + fc, 'mermaid-pre', mo + '/' + mc);
}
console.log('OK');
