const fs = require("fs");
const DATA_PATH = process.env.DATA_PATH || (process.env.HOME + "/mnt/DevForge/tech-daily-reading-web/data/articles.json");

const TOPICS = ["Claude Code", "Next.js", "Flutter", "GitHub Trending"];
const SLUG = { "Claude Code": "claude-code", "Next.js": "nextjs", "Flutter": "flutter", "GitHub Trending": "github-trending", "はじめに": "intro" };

// ---- Today's articles (order = newest first: Claude Code -> Next.js -> Flutter -> GitHub Trending) ----
const NEW = [];

// 1) Claude Code (source 2026-09-29)
NEW.push({
  date: "2026-09-29",
  topic: "Claude Code",
  title: "Claude Code v2.1.28x — 管理者モデルガバナンス強化と、4プリミティブの使い分け",
  lede: "新機能ラッシュは一段落。deniedModels・availableModelsMatch=exactで“意図しないモデル切替”を封じ、CLAUDE.md/コマンド/Subagent/Skillの役割を腑分けする定着フェーズ。",
  articleHtml: `<p>背景: 9/29時点で最新は<strong>v2.1.284（9/28）</strong>で、この日の新規リリースは無し。先週の大型更新（Opus 5.5が既定Opus化＝1Mコンテキスト・$4/$20、新既定Sonnet 5.5＝1M・$2/$10）から一段落し、直近は<strong>定着フェーズ</strong>にある。注目は派手な機能より、企業運用に効く「モデルガバナンス」と、カスタマイズ4種の整理だ。</p>

<h4>何が新しい・重要か</h4>
<p>v2.1.282〜283で管理者向けモデルガバナンスが強化された。<code>deniedModels</code>は<code>availableModels</code>で許可済みのモデルでも特定モデルだけを個別ブロックできる。<code>availableModelsMatch:"exact"</code>にすると各エントリは名指しバージョンのみ許可＝<strong>新リリースを一覧へ明示登録するまで自動採用しない</strong>ため、想定外の切替を防げる。加えて<code>/doctor prompt-audit</code>がCLAUDE.md・skills・agents・commandsを走査して「旧モデル向けに書かれたプロンプト」を検出。表示面は<code>maxProseWidth</code>でワイド端末の本文幅を制限しつつ、表やコードブロックはフル幅を維持する。</p>

<figure class='fig'><svg viewBox='0 0 600 268' xmlns='http://www.w3.org/2000/svg'>
<rect x='0' y='0' width='600' height='268' fill='#fff7f2'/>
<text x='300' y='24' text-anchor='middle' font-size='13' font-weight='bold' fill='#7a3b1a'>カスタマイズ4プリミティブの使い分け</text>
<g font-size='11' fill='#3a2416'>
<rect x='24' y='40' width='266' height='96' rx='8' fill='#fdece0' stroke='#d9772e'/>
<text x='36' y='62' font-size='12' font-weight='bold' fill='#b5551a'>CLAUDE.md</text>
<text x='36' y='82'>常に真の短い規約</text>
<text x='36' y='100'>起動時に自動読込</text>
<text x='36' y='118' fill='#8a6a55'>※長時間で文脈ドリフト注意</text>
<rect x='310' y='40' width='266' height='96' rx='8' fill='#fdece0' stroke='#d9772e'/>
<text x='322' y='62' font-size='12' font-weight='bold' fill='#b5551a'>スラッシュコマンド</text>
<text x='322' y='82'>/cmd で明示起動</text>
<text x='322' y='100'>引数付き反復ワークフロー</text>
<text x='322' y='118' fill='#8a6a55'>※入口を手で叩く</text>
<rect x='24' y='150' width='266' height='96' rx='8' fill='#fdece0' stroke='#d9772e'/>
<text x='36' y='172' font-size='12' font-weight='bold' fill='#b5551a'>Subagent</text>
<text x='36' y='192'>独立文脈で走る調査主体</text>
<text x='36' y='210'>本体会話を軽く保つ</text>
<text x='36' y='228' fill='#8a6a55'>※要約だけ本体へ返す</text>
<rect x='310' y='150' width='266' height='96' rx='8' fill='#fdece0' stroke='#d9772e'/>
<text x='322' y='172' font-size='12' font-weight='bold' fill='#b5551a'>Skill</text>
<text x='322' y='192'>タスク一致で自動適用</text>
<text x='322' y='210'>呼出時のみ読込（常時トークン不要）</text>
<text x='322' y='228' fill='#8a6a55'>※SKILL.md＋一文description</text>
</g>
</svg><figcaption>図1：CLAUDE.md／コマンド／Subagent／Skill を「いつ・どう起動するか」で腑分け</figcaption></figure>

<h4>4プリミティブの使い分け</h4>
<p><strong>CLAUDE.md</strong>＝起動時に自動読込される「常に真の短い規約」（長時間セッションでは文脈ドリフトに注意）。<strong>スラッシュコマンド</strong>＝<code>/cmd</code>で明示起動する引数付きの反復ワークフロー。<strong>Subagent</strong>＝独立した文脈で走らせる調査主体で、本体会話を軽く保てる。<strong>Skill</strong>＝タスク記述に一致すると自動適用され、呼出時のみ読込むためCLAUDE.mdと違い常時トークンを消費しない。導入は<code>.claude/skills/&lt;名前&gt;/SKILL.md</code>に一文descriptionを置いて再起動するだけだ。</p>

<h4>実務での使いどころ・自分が試すなら</h4>
<p>ドキュメント取得のような調査は<strong>Subagentに委譲</strong>し、文脈肥大を防いで要約だけ本体へ返す。破壊的コマンドは<code>PreToolUse</code> Hook（終了コード0=成功／2=ブロック／1=非ブロック警告）で<code>rm -rf</code>等を照合・遮断。導入順序は<strong>Skill→Hook→Subagent</strong>が定石。SKILL.mdは1500語以内・番号付き手順・成果志向のdescriptionで確実にロードさせる。</p>

<h4>注意点・落とし穴</h4>
<p>Skillは依存物としてバージョン固定＋セキュリティ監査を徹底する。<code>availableModelsMatch:"exact"</code>は安全な反面、登録漏れで「使えるはずのモデルが一覧に出ない」事故が起きるので、運用手順に“新モデルの明示登録”ステップを組み込むこと。</p>

<p><strong>ひとことまとめ</strong>: 「Skill=やり方を教える／Hook=必ず起こす／Subagent=委譲する」。ガバナンス設定で会社の想定外切替を止め、4プリミティブを組み合わせて本体会話を集中させるのが今の勘所だ。</p>`,
  sources: [
    { title: "Anthropic Claude Code updates (releasebot)", url: "https://releasebot.io/updates/anthropic/claude-code" },
    { title: "Claude Code changelog", url: "https://code.claude.com/docs/en/changelog" },
    { title: "Claude Code customization guide (alexop.dev)", url: "https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/" },
    { title: "Claude Code Skills 2026 guide (totalum)", url: "https://www.totalum.app/blog/claude-code-skills-totalum" }
  ]
});

// 2) Next.js (source 2026-09-29)
NEW.push({
  date: "2026-09-29",
  topic: "Next.js",
  title: "Motion の useScroll — スクロール進捗を「0→1」に一元化してパララックス/プログレスバー",
  lede: "scrollイベントの自前購読を卒業。位置をMotionValue(0→1)へ変換→useTransformで任意の出力に写像→useSpringで慣性。CSSの穴を埋めるJSルートの定番。",
  articleHtml: `<p>背景: 「スクロール量に比例して動く」演出——プログレスバー・パララックス（前景が速く背景が遅い視差）・要素通過のフェード/スケール——はモダンLPやストーリーテリング系の中核だ。CSSの<code>animation-timeline</code>はJSゼロで書けるが、2026-09時点で<strong>Firefoxが未対応</strong>のため、全ブラウザで確実に効かせたい本番案件ではJSライブラリの出番が残る。その定番が<strong>Motion（旧Framer Motion、importは <code>motion/react</code>）</strong>の<code>useScroll</code>だ。</p>

<h4>何が新しい・重要か — 一本道のデータフロー</h4>
<p>核心は「スクロール位置を<strong>MotionValue</strong>（0→1の進捗、またはpx）に変換 → <code>useTransform</code>で任意の出力（<code>y</code>/<code>scale</code>/<code>opacity</code>/<code>blur()</code>/色）へ写像 → 必要なら<code>useSpring</code>で慣性を足す」という一本道だ。命令的なscroll購読＋毎フレームの<code>getBoundingClientRect</code>を書かずに済み、しかも<strong>可能な場合はネイティブ<code>ScrollTimeline</code>にオフロード</strong>して完全ハードウェア合成＝メインスレッドを塞がない。</p>

<figure class='fig'><pre class='mermaid'>flowchart LR
  A["スクロール位置"] --> B["MotionValue 0→1 (scrollYProgress)"]
  B --> C["useTransform で写像"]
  C --> D["y / scale / opacity / blur / 色"]
  B --> E["useSpring 慣性"]
  E --> D</pre><figcaption>図1：位置→進捗→写像→出力。慣性が要る所だけ useSpring を挟む</figcaption></figure>

<h4>仕組みのポイント</h4>
<p><code>useScroll</code>は<code>scrollY/scrollX</code>（絶対px）と<code>scrollYProgress/scrollXProgress</code>（正規化0→1）を返す。<code>target</code> refで「その要素がcontainerを横切る進捗」を測り、<code>offset:["start end","end start"]</code>で「下から入る→上へ抜ける」全区間を0→1にできる。<code>useTransform</code>は入力配列と出力配列を対応させるだけで多段キーフレームも表現できる。</p>

<pre><code>const { scrollYProgress } = useScroll({ target: ref, offset: ['start end','end start'] })
const y       = useTransform(scrollYProgress, [0,1], ['-20%','20%'])   // パララックス
const opacity = useTransform(scrollYProgress, [0,0.25,0.75,1], [0,1,1,0]) // 多段</code></pre>

<figure class='fig'><svg viewBox='0 0 600 168' xmlns='http://www.w3.org/2000/svg'>
<rect x='0' y='0' width='600' height='168' fill='#f4f8ff'/>
<text x='300' y='22' text-anchor='middle' font-size='13' font-weight='bold' fill='#123a7a'>scroll-linked と scroll-triggered の使い分け</text>
<rect x='24' y='40' width='266' height='108' rx='8' fill='#e7f0ff' stroke='#2f6fe0'/>
<text x='36' y='62' font-size='12' font-weight='bold' fill='#1c4fb0'>scroll-linked（useScroll）</text>
<text x='36' y='84' font-size='11' fill='#22314a'>値がスクロール位置に連続的に紐づく</text>
<text x='36' y='104' font-size='11' fill='#22314a'>パララックス／プログレスバー</text>
<text x='36' y='124' font-size='11' fill='#22314a'>スクラブ再生向き</text>
<rect x='310' y='40' width='266' height='108' rx='8' fill='#e7f0ff' stroke='#2f6fe0'/>
<text x='322' y='62' font-size='12' font-weight='bold' fill='#1c4fb0'>scroll-triggered（whileInView）</text>
<text x='322' y='84' font-size='11' fill='#22314a'>入った/出た瞬間に単発発火</text>
<text x='322' y='104' font-size='11' fill='#22314a'>フェードイン／リビール</text>
<text x='322' y='124' font-size='11' fill='#22314a'>連続追従が不要なら軽い</text>
</svg><figcaption>図2：連続追従なら useScroll、単発の「出すだけ」なら whileInView</figcaption></figure>

<h4>App Router での組み込み</h4>
<p><code>useScroll</code>系はブラウザAPI依存なので、使うコンポーネントは<code>'use client'</code>。ただし<strong>演出の「島」だけをクライアント化</strong>し、ページ本体・データ取得はRSCのまま<code>children</code>で流し込むのが定石だ。バンドル削減は<code>LazyMotion</code>＋<code>m</code>で機能を遅延ロード。単純な「出すだけ」はCSS <code>animation-timeline:view()</code>に寄せ、Motionは連続追従が本当に要る所だけに絞る。</p>

<h4>注意点・落とし穴</h4>
<p>MotionValueを<strong>render中に<code>.get()</code>で読まない</strong>（再レンダーが走らず値が外れる）。<code>style</code>にMotionValueのまま渡すか<code>useTransform</code>経由にする。SSRでは初期進捗が0なので、重要コンテンツは初期可視にしてエンハンスで動きを足す。<code>prefers-reduced-motion</code>時は<code>useReducedMotion()</code>で移動レンジを0に潰し<code>opacity</code>のみに落とす。</p>

<p><strong>ひとことまとめ</strong>: scroll-linked＝<code>useScroll</code>（連続追従）、scroll-triggered＝<code>whileInView</code>（単発リビール）。この使い分けが、軽さと表現力の分岐点になる。</p>`,
  sources: [
    { title: "Motion: React scroll animations", url: "https://motion.dev/docs/react-scroll-animations" },
    { title: "Motion: useScroll API", url: "https://motion.dev/docs/react-use-scroll" },
    { title: "Motion: useReducedMotion", url: "https://motion.dev/docs/react-use-reduced-motion" }
  ]
});

// 3) Flutter (source 2026-09-30)
NEW.push({
  date: "2026-09-30",
  topic: "Flutter",
  title: "Flutter 3.47安定/3.48beta — primary constructorsとRiverpod codegen、isolateでUIスレッドを守る",
  lede: "11月の次期安定へbeta 3.48/Dart 3.14が進行。言語はprimary constructorsが正式ドキュメント化、DIは@riverpod codegen、体感はisolate＋RepaintBoundaryで守る。",
  articleHtml: `<p>背景: 現行安定は<strong>Flutter 3.47.4 / Dart 3.13.3</strong>（2026-09-11 patch）、betaは<strong>3.48 / Dart 3.14</strong>、次の安定機能リリースは<strong>2026年11月</strong>。この時期は派手な新機能より「仕上げ」の実務ノウハウが効く。言語・状態管理・パフォーマンスの3面で今日の要点を押さえる。</p>

<h4>言語 — ボイラープレート削減</h4>
<p><strong>primary constructors</strong>が正式ドキュメント化された。クラスヘッダに主コンストラクタを書く簡潔記法で<code>class Point(int x, int y)</code>的に宣言でき、enum・const constructorでの使い方も追記。<strong>private named parameters</strong>（Dart 3.12〜）は<code>Foo({this._value})</code>のように名前付き引数へ直接privateフィールドを初期化でき、公開setterが要らない。ビルドは<code>pubspec.yaml</code>のuser-defined variablesをネイティブへ渡し、link hooksが<strong>ネイティブコードのtree-shaking</strong>（未使用シンボル除去）に対応。macrosは無期限ポーズのままで、生成は<code>build_runner</code>＋<code>source_gen</code>が主軸だ。</p>

<h4>状態管理 — @riverpod codegen を DI コンテナに</h4>
<p>推奨は<code>@riverpod</code> code generation（<code>riverpod_generator 4.0.9</code>／2026-09-04）。関数・クラスに注釈を付けるだけでProviderを自動生成し、型・family・autoDisposeを<strong>Provider種別の手選びなし</strong>で得られる。外部依存を<code>@riverpod Dio dio(Ref ref)=&gt;Dio()</code>で公開して<code>ref.watch(dioProvider)</code>で注入、テストは<code>ProviderContainer(overrides:[dioProvider.overrideWithValue(mock)])</code>で差し替え＝<strong>get_it無しでDIとテスト差し替えを一本化</strong>できる。Riverpod 3で<code>Ref</code>が統一されAPIが単純化した。</p>

<figure class='fig'><svg viewBox='0 0 600 210' xmlns='http://www.w3.org/2000/svg'>
<rect x='0' y='0' width='600' height='210' fill='#f2fbfd'/>
<text x='300' y='24' text-anchor='middle' font-size='13' font-weight='bold' fill='#02569b'>フレーム予算 — リフレッシュレート別の1フレーム時間</text>
<g font-size='11' fill='#0b3b52'>
<text x='60' y='64'>60fps</text>
<rect x='110' y='52' width='420' height='20' rx='4' fill='#7fd4e8' stroke='#02569b'/>
<text x='540' y='67'>16.6ms</text>
<text x='60' y='114'>90fps</text>
<rect x='110' y='102' width='281' height='20' rx='4' fill='#4cbcd6' stroke='#02569b'/>
<text x='400' y='117'>11.1ms</text>
<text x='60' y='164'>120fps</text>
<rect x='110' y='152' width='211' height='20' rx='4' fill='#1f9fc4' stroke='#02569b'/>
<text x='330' y='167'>8.33ms</text>
</g>
<text x='300' y='196' text-anchor='middle' font-size='10' fill='#4a6b7a'>この時間内に build+layout+paint を収める。超過＝jank（赤フレーム）</text>
</svg><figcaption>図1：高リフレッシュほど予算は厳しい。重い処理はisolateへ逃がす</figcaption></figure>

<h4>パフォーマンス — フレーム予算とスレッド分離</h4>
<p>フレーム予算は<strong>60fps=16.6 / 90=11.1 / 120=8.33ms</strong>。重いJSONデコードや画像処理は<code>compute()</code>や<code>Isolate.run(() =&gt; heavyWork())</code>で背景isolateへ逃がし、UIスレッド（Dart実行）を空ける。DevTools PerformanceはUIスレッドとRasterスレッド（GPU送出）を分けて表示するので、赤フレームから原因の<code>build()</code>/<code>paint()</code>を特定できる。<code>ShaderMask</code>/<code>BackdropFilter</code>/<code>saveLayer</code>はRasterを圧迫するので多用を避け、アニメする部分は<code>RepaintBoundary</code>で再描画を隔離する。</p>

<h4>注意点・落とし穴</h4>
<p>計測は必ず<strong>profileモード</strong>で行う（debugは遅く数値が当てにならない）。土台のImpellerがshader compile jankを排除。長リストは<code>ListView.builder</code>＋<code>itemExtent</code>/<code>cacheExtent</code>で軽く保つ。explicitアニメは<code>dispose</code>忘れに注意。</p>

<p><strong>ひとことまとめ</strong>: 言語はprimary constructorsで短く、DIは@riverpod codegenで一本化、体感はisolate＋RepaintBoundary＋profile計測で守る——これが今のFlutterの“仕上げ”の型だ。</p>`,
  sources: [
    { title: "Dart what's new", url: "https://dart.dev/resources/whats-new" },
    { title: "What's new in Flutter 3.47", url: "https://flutter.dev/blog/whats-new-in-flutter-3-47" },
    { title: "Riverpod generator (Code With Andrea)", url: "https://codewithandrea.com/articles/flutter-riverpod-generator/" },
    { title: "Improving rendering performance (Flutter docs)", url: "https://docs.flutter.dev/perf/rendering-performance" }
  ]
});

// 4) GitHub Trending (source 2026-09-29) — 3 repos in one article
NEW.push({
  date: "2026-09-29",
  topic: "GitHub Trending",
  title: "9/29の話題リポジトリ — ニュース自動キュレーション・AIロゴ設計スキル・エージェント司令塔",
  lede: "この日の3本を貫くのは「AIエージェントを実務に載せる」流れ。ネタ収集の自動化、プロ品質スキルの付与、複数エージェントの観測/指揮という三層。",
  articleHtml: `<p>今日の急上昇を貫くのは<strong>「AIエージェントを“実務に載せる”」</strong>という共通項だ。ネタを自動で集めて記事化する基盤、エージェントに専門技能を与えるスキル、走る複数エージェントを1画面で観測・指揮する司令塔——収集・能力・運用の三層が揃った。各リポジトリを「解決したい課題」と「提供する機能」で腑分けする。</p>

<figure class='fig'><svg viewBox='0 0 640 250' xmlns='http://www.w3.org/2000/svg'>
<rect x='0' y='0' width='640' height='250' fill='#f2fbf4'/>
<text x='320' y='22' text-anchor='middle' font-size='13' font-weight='bold' fill='#1a7f37'>リポジトリ × 「解決したい課題／提供する機能」</text>
<g font-size='10.5' fill='#0f3d1e'>
<rect x='16' y='34' width='150' height='34' fill='#d7f0dd' stroke='#3fb950'/>
<text x='26' y='55' font-weight='bold'>リポジトリ</text>
<rect x='166' y='34' width='230' height='34' fill='#d7f0dd' stroke='#3fb950'/>
<text x='176' y='55' font-weight='bold'>解決したい課題</text>
<rect x='396' y='34' width='228' height='34' fill='#d7f0dd' stroke='#3fb950'/>
<text x='406' y='55' font-weight='bold'>提供する機能</text>

<rect x='16' y='68' width='150' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='26' y='90' font-weight='bold'>AIHOT</text>
<text x='26' y='108' fill='#3a6b48'>TS ・ ⭐約3.0k</text>
<rect x='166' y='68' width='230' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='176' y='90'>情報源が散在し収集→選別</text>
<text x='176' y='106'>→まとめが毎日手作業</text>
<rect x='396' y='68' width='228' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='406' y='90'>源と基準を差し替えるだけの</text>
<text x='406' y='106'>自動ニュース局(RSS/MCP/LLM)</text>

<rect x='16' y='124' width='150' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='26' y='146' font-weight='bold'>logo-design-skill</text>
<text x='26' y='164' fill='#3a6b48'>HTML ・ ⭐約836</text>
<rect x='166' y='124' width='230' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='176' y='146'>AIのロゴ/ブランドが素人品質</text>
<text x='176' y='162'>原則・SVG・検証手順が無い</text>
<rect x='396' y='124' width='228' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='406' y='146'>設計力を与える包括スキル</text>
<text x='406' y='162'>1,400+ロゴ参照集を同梱</text>

<rect x='16' y='180' width='150' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='26' y='202' font-weight='bold'>agent-office</text>
<text x='26' y='220' fill='#3a6b48'>TS ・ ⭐約383</text>
<rect x='166' y='180' width='230' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='176' y='202'>複数エージェントが不可視で</text>
<text x='176' y='218'>指揮が分散する</text>
<rect x='396' y='180' width='228' height='56' fill='#ffffff' stroke='#3fb950'/>
<text x='406' y='202'>3Dオフィスで雇用・端末共有</text>
<text x='406' y='218'>音声/PR追跡の司令塔</text>
</g>
</svg><figcaption>図1：3本を「なぜ存在するか（課題）」と「何ができるか（機能）」で一望</figcaption></figure>

<h4>KKKKhazix/AIHOT（TypeScript・⭐約3.0k）</h4>
<p><strong>解決したい課題</strong>: 業界トレンドの把握は情報源が散在し、収集→選別→まとめが毎日の手作業になりがち。<strong>提供する機能</strong>: 情報源と精選基準を差し替えるだけで「自分の業界のホットニュース局」になるセルフホスト型Webフレームワーク。RSS/MCP/LLM連携で収集→選別→日報生成まで自動で回す。<strong>なぜ今急上昇か</strong>: 公開約1日で約3.0k（実測で本日最速級の増加率）、MIT・fork約870と実体を伴い、self-host×LLM×MCPというテンプレ性が刺さった。</p>

<h4>kaankiziltug/logo-design-skill（HTML・⭐約836）</h4>
<p><strong>解決したい課題</strong>: AIエージェントはロゴ/ブランディングで素人品質になりがちで、設計原則もSVGクラフトも検証手順も持たない。<strong>提供する機能</strong>: Claude/Codex/Gemini CLIなどに設計力を与える包括スキル。原則・制作プロセス・SVG制作・検証ツール・<strong>1,400以上のロゴ参照集</strong>を同梱する。<strong>なぜ今急上昇か</strong>: 公開約3日で約836（平均約279★/日）と本日トップ級の増加率。実務直結の完成度で、Claude Codeスキルとして横展開しやすい（MIT）。</p>

<h4>AgentSystemLabs/agent-office（TypeScript・⭐約383）</h4>
<p><strong>解決したい課題</strong>: 複数のコーディングエージェントを回すと、どれが何をしているか見えず指揮も分散する。<strong>提供する機能</strong>: マンガ調3Dオフィスに「Claude Codeワーカー」を席で雇い、ライブ端末共有・音声会話・GitHubのissue/PR追跡を1画面へ集約するビジュアル司令塔。<strong>なぜ今急上昇か</strong>: 公開約3日で約383（平均約128★/日）、fork約84。多数エージェント運用の観測性という空白に直撃した（MIT）。</p>

<h4>まとめ — 自分が試すなら</h4>
<p>まず<strong>AIHOT</strong>を自分の技術領域に差し替えて日報自動化の土台にし、次に<strong>logo-design-skill</strong>をブランド資産の内製に、規模が出たら<strong>agent-office</strong>でフリート観測へ。エージェントを「動かす」から「運用する」へ——その実例が揃った一日だった。</p>`,
  sources: [
    { title: "KKKKhazix/AIHOT", url: "https://github.com/KKKKhazix/AIHOT" },
    { title: "kaankiziltug/logo-design-skill", url: "https://github.com/kaankiziltug/logo-design-skill" },
    { title: "AgentSystemLabs/agent-office", url: "https://github.com/AgentSystemLabs/agent-office" }
  ]
});

// ---- Merge ----
const raw = fs.readFileSync(DATA_PATH, "utf8");
const obj = JSON.parse(raw);
const existing = Array.isArray(obj.articles) ? obj.articles : [];

const existingKeys = new Set(existing.map(a => a.date + "|" + a.topic));
const existingIds = new Set(existing.map(a => a.id).filter(Boolean));

const toAdd = [];
const skipped = [];
for (const n of NEW) {
  const key = n.date + "|" + n.topic;
  if (existingKeys.has(key)) { skipped.push(key); continue; }
  toAdd.push(n);
  existingKeys.add(key);
}

// assign stable ids
function assignId(a) {
  const base = a.date + "-" + (SLUG[a.topic] || "misc");
  let id = base, i = 2;
  while (existingIds.has(id)) { id = base + "-" + i; i++; }
  existingIds.add(id);
  return id;
}
for (const a of toAdd) { a.id = assignId(a); }

// prepend (newest first): today's in order CC, NX, FL, GH
const finalArticles = [...toAdd, ...existing];

// ensure every article has an id (backfill any legacy ones missing it, without disturbing order)
for (const a of finalArticles) {
  if (!a.id) { a.id = assignId(a); }
}

const out = {
  schema: "tech-daily-reading/v1",
  generatedAt: new Date().toISOString(),
  topics: TOPICS,
  articles: finalArticles
};

const outStr = JSON.stringify(out, null, 2);

if (process.env.DRY_RUN === "1") {
  console.log("DRY_RUN — not writing.");
} else {
  fs.writeFileSync(DATA_PATH, outStr);
}

// validate by re-parse
const check = JSON.parse(process.env.DRY_RUN === "1" ? outStr : fs.readFileSync(DATA_PATH, "utf8"));
console.log("existing count:", existing.length);
console.log("added:", toAdd.map(a => a.date + "|" + a.topic + " (id=" + a.id + ")"));
console.log("skipped (dup):", skipped);
console.log("final count:", check.articles.length);
console.log("front 6:", check.articles.slice(0, 6).map(a => a.date + "|" + a.topic).join("  ,  "));
console.log("generatedAt:", check.generatedAt);
console.log("VALID JSON: yes");
