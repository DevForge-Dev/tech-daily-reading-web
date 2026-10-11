const fs = require('fs');
const WEB = process.env.HOME + '/mnt/DevForge/tech-daily-reading-web/data/articles.json';

// ---- today's articles ----
const cc = {
  date: '2026-10-10', topic: 'Claude Code',
  title: 'Mods が正式リリース — TypeScript で Claude Code 自体を拡張、v2.1.287 以降は既定で有効',
  lede: 'フックの一歩先。シェルを叩いて終わるのでなく、TS関数を常駐させて状態を持ち、UIまで足せる。"何を自動化するか"から"どう操るか"へ軸が動いた版。',
  articleHtml: `<p>背景。Claude Codeは「フックやスキルを自然言語で書いて挙動を縛る」運用がすっかり定着した。その拡張の決定版として、Anthropicが2026/10/1に発表した<strong>Mods</strong>が正式リリースされ、<strong>v2.1.287 以降は既定で有効</strong>になった。追加設定は不要で、CLI・デスクトップ両対応。本日10/10の公式changelogに新バージョンの追加はなく最新は<code>v2.1.296</code>（10/9）のままだが、"今の運用で何が効くか"という視点ではこのMods解禁が一番大きい。</p>
<p><strong>何が新しいか。</strong>Modsは<strong>TypeScriptで書いた「mod」</strong>でClaude Codeの動作とUIを拡張する仕組み。プロンプトの書き換え、ツールの<strong>block/再試行</strong>、権限要求の<strong>自動承認・拒否</strong>、さらに<strong>ボタン・入力フォーム・ペイン</strong>などのUI追加、組み込み機能の置き換えまで行える。Hooksとの決定的な違いは、シェルコマンドを実行して終わるのではなく、<strong>TS関数を登録してセッション内で状態を保持できる</strong>こと。配布は<code>/plugin</code>で入れるプラグイン形式で、マーケットプレイス共有やClaudeディレクトリ掲載申請もできる。</p>
<figure class='fig'><svg viewBox='0 0 600 220' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='300' y='24' text-anchor='middle' font-size='13' fill='#555'>Hooks と Mods の守備範囲</text><rect x='26' y='40' width='266' height='166' rx='6' fill='#eef3fb' stroke='#6b8fd6'/><rect x='308' y='40' width='266' height='166' rx='6' fill='#f3eefb' stroke='#9b6bd6'/><text x='159' y='64' text-anchor='middle' font-size='13' fill='#2f4e8f'>Hooks</text><text x='441' y='64' text-anchor='middle' font-size='13' fill='#5e2f8f'>Mods</text><text x='44' y='92' font-size='11' fill='#333'>・シェルコマンドを実行</text><text x='44' y='114' font-size='11' fill='#333'>・1回きり / 状態を持たない</text><text x='44' y='136' font-size='11' fill='#333'>・lint / 通知 / コマンド遮断</text><text x='44' y='158' font-size='11' fill='#333'>・決定論的に必ず起きる</text><text x='44' y='182' font-size='11' fill='#333'>・UIは足せない</text><text x='326' y='92' font-size='11' fill='#333'>・TS関数を登録</text><text x='326' y='114' font-size='11' fill='#333'>・セッション内で状態保持</text><text x='326' y='136' font-size='11' fill='#333'>・プロンプト書換 / 権限判定</text><text x='326' y='158' font-size='11' fill='#333'>・ボタン / フォーム / ペイン</text><text x='326' y='182' font-size='11' fill='#333'>・v2.1.287+ で既定ON</text></svg><figcaption>図1：Hooks は決定論的な一撃、Mods は状態を持つ常駐拡張。</figcaption></figure>
<p><strong>どう使い分けるか。</strong>同週に出たAnthropic公式の指針が明快だ。「指示は助言でありガードレールではない。<strong>絶対に起きてはならない事はHooks・権限・管理者設定で強制せよ</strong>」。常に必要な事実は<code>CLAUDE.md</code>（短く・目安200行未満）、特定ファイルに触れた時だけの制約は<code>rules</code>の<code>paths:</code>、反復手続きは<code>skills</code>、中間出力が不要な副作業は<code>subagents</code>（最終要約だけ戻る）。そして「状態やUIを足す対話的な拡張」こそがModsの持ち場になる。</p>
<figure class='fig'><pre class='mermaid'>flowchart TD
  Q["拡張したいことは?"] --> A["常に必要な事実"]
  Q --> B["特定ファイルだけ"]
  Q --> C["反復する手続き"]
  Q --> D["中間出力が不要な副作業"]
  Q --> E["絶対に起きてはならない強制"]
  Q --> F["状態やUIを足す対話的拡張"]
  A --> A1["CLAUDE.md (短く)"]
  B --> B1["rules (paths)"]
  C --> C1["skills"]
  D --> D1["subagents"]
  E --> E1["Hooks / 権限 / 管理設定"]
  F --> F1["Mods (TypeScript)"]</pre><figcaption>図2：用途別の選び方。強制は Hooks・権限・設定、対話的拡張は Mods。</figcaption></figure>
<p><strong>落とし穴。</strong>modは<strong>非サンドボックス</strong>で利用中のPCにアクセスできる。信頼できる提供元のmodだけを入れること。あわせて直近の素振りも押さえておきたい：2.1.295（10/8）でフックに<code>onFailure:"block"</code>が入り、起動失敗・タイムアウト・異常終了で操作をブロックできる。Program Status Protocol（OSC 7501）対応で対応ターミナルが「作業中/入力待ち/完了」を表示、ツール検索経由で読むツール説明の上限は16,384字へ拡張された。</p>
<p><strong>自分が試すなら。</strong>まず「1スキル＋1コマンド」程度の小さなプラグインを作り、そこにModsを1つ足す。最初の一撃は"lint/test/git statusの権限を自動承認して承認疲れを消す"か"進捗を出すステータスペイン"あたりが、効果が見えやすく安全。<code>claude plugin validate</code>で検証してから配布する。</p>`,
  sources: [
    {title:'Claude Code Mods 正式リリース (gihyo)', url:'https://gihyo.jp/article/2026/10/claude-code-mods'},
    {title:'Steering Claude Code (Anthropic)', url:'https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more'},
    {title:'Claude Code Changelog', url:'https://code.claude.com/docs/en/changelog'}
  ]
};

const nx = {
  date: '2026-10-10', topic: 'Next.js',
  title: 'App Router のグローバル・ルート遷移プログレスバー — router.events 無き世界での開始/完了検知',
  lede: 'YouTube風トップローディングバーを App Router で正しく作る鍵は、URLコミットでなく"描画準備完了"を捉えること。React Transition の isPending が完了シグナルになる。',
  articleHtml: `<p>背景。画面上端を左→右に走る細い読み込みバーは、遷移が一瞬で終わらない時でも「いま遷移中」を即座に伝える定番UIだ。Pages Router 時代は<code>Router.events</code>（routeChangeStart/Complete/Error）を購読すれば数行で作れた。ところが<strong>App Router はこの<code>router.events</code>を持たない</strong>。さらに<code>router.push()</code>の戻り値は<strong>void</strong>で「遷移完了」を<code>await</code>でも取れない。加えて prefetch＋<code>loading.tsx</code>で多くの遷移が"ほぼ瞬間"になり、素朴なバーは一瞬チラついて消えるだけの邪魔者になる。<strong>「開始をどう捕まえ／完了をどう知り／速い遷移でチラつかせない」</strong>の3点が本題だ。</p>
<p><strong>開始シグナル。</strong>起点は<code>&lt;Link onNavigate&gt;</code>（Next 15.3+）。<strong>同一オリジンのSPA遷移時だけ</strong>発火し、Cmd/Ctrl+クリック（新規タブ）・外部URL・<code>download</code>付きリンクでは発火しない——バーを出すべきでない遷移で勝手に黙ってくれるので都合がよい。プログラム遷移は<code>onNavigate</code>が効かないので、<code>start()</code>＋<code>startTransition(() =&gt; router.push(href))</code>でラップした薄いwrapperを使う。</p>
<p><strong>完了シグナル（本丸）。</strong>App Routerの遷移は<strong>React Transitionとして走り</strong>、<code>router.push</code>は新しいRSCツリー（＋データ）が準備できるまで"サスペンド"する。だから<code>startTransition</code>で包むと、<code>useTransition()</code>の<strong>isPending が新ページを実際に描画できるまで true</strong>のまま → false に落ちた瞬間が「完了」になる。<strong>URLコミットでなく"描画準備完了"を捉える</strong>ので、streaming下でも破綻しにくい。これがVercel公式例<code>react-transition-progress</code>やbuilduiの「Global progress」記事の肝だ。</p>
<figure class='fig'><pre class='mermaid'>flowchart LR
  L["Link onNavigate (SPA遷移のみ発火)"] --> S["start() 擬似進捗を8%へ"]
  S --> T["startTransition(router.push)"]
  T --> P["isPending=true 90%へ漸近"]
  P --> R["新RSCツリー 描画準備OK"]
  R --> D["isPending=false → done() 100%"]</pre><figcaption>図1：開始は onNavigate、完了は Transition の isPending 立ち下がりで捉える。</figcaption></figure>
<p><strong>擬似進捗。</strong>"本当の進捗%"は取れないので、NProgress流のトリクルで"それらしく"見せる。開始で8%へジャンプ→pending中は90%あたりへ漸近的にincrement→完了で一気に100%→フェードアウト。芯は <code>value = value &gt;= 90 ? value : value + (90 - value) * 0.1 + 0.5</code> の一行だ。</p>
<figure class='fig'><svg viewBox='0 0 600 160' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='300' y='22' text-anchor='middle' font-size='13' fill='#2f6bff'>擬似進捗（トリクル）の3段階</text><text x='30' y='55' font-size='12' fill='#333'>開始</text><rect x='96' y='43' width='470' height='14' rx='7' fill='#e7eefc'/><rect x='96' y='43' width='38' height='14' rx='7' fill='#2f6bff'/><text x='560' y='55' font-size='11' fill='#2f6bff' text-anchor='end'>8%</text><text x='30' y='95' font-size='12' fill='#333'>pending</text><rect x='96' y='83' width='470' height='14' rx='7' fill='#e7eefc'/><rect x='96' y='83' width='423' height='14' rx='7' fill='#2f6bff'/><text x='560' y='95' font-size='11' fill='#2f6bff' text-anchor='end'>~90% へ漸近</text><text x='30' y='135' font-size='12' fill='#333'>完了</text><rect x='96' y='123' width='470' height='14' rx='7' fill='#e7eefc'/><rect x='96' y='123' width='470' height='14' rx='7' fill='#1f49b5'/><text x='560' y='135' font-size='11' fill='#fff' text-anchor='end'>100% → fade</text></svg><figcaption>図2：実進捗は不明。8%へ跳ね→90%へ漸近→完了で一気に100%にして消す。</figcaption></figure>
<p><strong>ドロップイン・ライブラリ。</strong>最速は<code>nextjs-toploader</code>（root layoutに<code>&lt;NextTopLoader /&gt;</code>を置くだけ）。設定したいなら<code>@bprogress/next</code>（<code>ProgressProvider</code>で<code>children</code>をラップ、height/color/showSpinnerなど）。準公式はVercelの<code>react-transition-progress</code>。いずれも内部で<code>Link</code>/<code>router</code>をパッチして全遷移を自動検知する。</p>
<p><strong>アクセシビリティとCLS。</strong>擬似進捗は実進捗を持たない装飾なので、純装飾なら<code>aria-hidden="true"</code>にしてスクリーンリーダーに誤った%を読ませない。ルート変更自体はNext内蔵のRoute Announcerが読むので二重に読ませない。バーは<code>position:fixed; top:0</code>でレイアウトフローから外し<strong>CLSゼロ</strong>、変化は<code>transform: scaleX()</code>でコンポジタ合成し60fps。<code>prefers-reduced-motion</code>ではシマー等を止め「出る→消える」の2状態に寄せる。</p>
<p><strong>自分が試すなら。</strong>まず<code>nextjs-toploader</code>で体感を掴み、挙動を細かく制御したくなったらゼロ依存の方式①（カスタムLink＋<code>startTransition</code>でisPendingを観測）に置き換える。戻る/進む（popstate）でも出したいなら<code>usePathname</code>側でも拾う二段構えにする。</p>`,
  sources: [
    {title:'Linking and Navigating (Next.js)', url:'https://nextjs.org/docs/app/getting-started/linking-and-navigating'},
    {title:'vercel/react-transition-progress', url:'https://github.com/vercel/react-transition-progress'},
    {title:'Global progress in Next.js (buildui)', url:'https://buildui.com/posts/global-progress-in-nextjs'}
  ]
};

const fl = {
  date: '2026-10-11', topic: 'Flutter',
  title: 'Flutter 3.47 — Impeller が全デスクトップ既定に、マルチウィンドウ前進と本番アニメの具体値',
  lede: 'デスクトップの shader jank が構造的に解消。Web は HTML renderer を撤去。3.50（11月）の WasmGC／Android Impeller 一本化へ向けた地ならしの版。',
  articleHtml: `<p>背景。現行安定は<strong>Flutter 3.47.5 / Dart 3.13.4</strong>、betaは3.49系。次期stableの<strong>3.50（11月）</strong>でWeb<strong>WasmGC既定化</strong>・Android<strong>Impeller一本化</strong>・<strong>Material/Cupertinoのcore分離</strong>が出揃うことがDevCon 2026で確定済みで、3.47はその地ならしにあたる。</p>
<p><strong>何が新しいか。</strong>最大の変化は<strong>Impeller が Windows / Linux でも既定レンダラ</strong>になったこと（macOSは既にMetal）。WindowsはOpenGLES＋<strong>SDF</strong>、両OSで<strong>グリフのガンマ補正</strong>が入り、デスクトップの<strong>shader jank が構造的に解消</strong>する。Webエンジンは<strong>HTML rendererを完全撤去</strong>してCanvasKit/Skwasmに一本化。<strong>マルチウィンドウ（windowing）API</strong>も前進し、Win32/Linuxでpopup window、regular/dialogのsized-to-contentに対応。ただし破壊的変更に注意——<code>preferredSize</code>→<strong><code>size</code></strong>、<code>preferredConstraints</code>→<strong><code>constraints</code></strong>、<code>decorated</code>フラグ削除。API追加では<code>AnimatedCrossFade.clipBehavior</code>、<code>ImageIcon.useOriginalColors</code>、Target-Followerより推奨の<code>OverlayPortal.overlayChildLayoutBuilder</code>あたりが実務で効く。プラットフォーム要件は<strong>macOS最低12</strong>、Androidテンプレが<strong>AGP 9+</strong>＋内蔵Kotlinに。</p>
<figure class='fig'><svg viewBox='0 0 600 212' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='300' y='22' text-anchor='middle' font-size='13' fill='#0b63c4'>3.47 の各プラットフォームのレンダラ状況</text><g font-size='11.5'><text x='28' y='58' fill='#333'>macOS</text><rect x='150' y='44' width='420' height='20' rx='4' fill='#d9ead9' stroke='#2e7d32'/><text x='162' y='58' fill='#1b5e20'>Metal（以前から既定）</text><text x='28' y='90' fill='#333'>Windows</text><rect x='150' y='76' width='420' height='20' rx='4' fill='#d7e8fb' stroke='#0b63c4'/><text x='162' y='90' fill='#0b4a93'>Impeller＝OpenGLES＋SDF（新・既定）</text><text x='28' y='122' fill='#333'>Linux</text><rect x='150' y='108' width='420' height='20' rx='4' fill='#d7e8fb' stroke='#0b63c4'/><text x='162' y='122' fill='#0b4a93'>Impeller（新・既定）</text><text x='28' y='154' fill='#333'>Android</text><rect x='150' y='140' width='420' height='20' rx='4' fill='#fde6cc' stroke='#c47f0b'/><text x='162' y='154' fill='#8a5a07'>Impeller 一本化は 3.50 へ</text><text x='28' y='186' fill='#333'>Web</text><rect x='150' y='172' width='420' height='20' rx='4' fill='#efe0f5' stroke='#7b3fa0'/><text x='162' y='186' fill='#5a2d77'>CanvasKit/Skwasm（HTML renderer 撤去）</text></g></svg><figcaption>図1：デスクトップ3OSでImpeller既定が揃い、WebはHTML rendererを撤去。</figcaption></figure>
<p><strong>本番アニメの具体値。</strong>レシピとして覚えておくと速い。<strong>staggeredリスト出現</strong>＝1本の<code>AnimationController</code>＋<code>Interval</code>＋<code>CurvedAnimation(easeOutCubic)</code>で、各アイテムは前の約<strong>60ms後</strong>に開始しフェードイン＋<strong>16px上シフト</strong>、総尺の目安は220ms＋60ms×件数。<strong>スプリングtap</strong>＝押下は80ms/easeOutで0.94倍、離すと<code>SpringSimulation</code>＋<code>SpringDescription(mass:1, stiffness:220, damping:18)</code>。<strong>shimmer</strong>＝<code>ShaderMask</code>＋<code>LinearGradient</code>を約1400msループ。<strong>120Hzの解放</strong>＝iOSは<code>Info.plist</code>に<code>CADisableMinimumFrameDurationOnPhone=YES</code>（ProMotion、予算8.3ms/フレーム）。禁則は、listener内<code>setState</code>・controller未dispose・大ブラー<code>BoxShadow</code>。</p>
<figure class='fig'><svg viewBox='0 0 600 168' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='300' y='22' text-anchor='middle' font-size='13' fill='#b5651d'>リフレッシュレート別・1フレームの予算</text><text x='30' y='57' font-size='12' fill='#333'>60Hz</text><rect x='96' y='44' width='470' height='18' rx='4' fill='#f1e2d0'/><rect x='96' y='44' width='470' height='18' rx='4' fill='#e0a86a'/><text x='560' y='57' font-size='11' fill='#5c3a12' text-anchor='end'>16.6 ms</text><text x='30' y='97' font-size='12' fill='#333'>90Hz</text><rect x='96' y='84' width='470' height='18' rx='4' fill='#f1e2d0'/><rect x='96' y='84' width='314' height='18' rx='4' fill='#d2894a'/><text x='560' y='97' font-size='11' fill='#5c3a12' text-anchor='end'>11.1 ms</text><text x='30' y='137' font-size='12' fill='#333'>120Hz</text><rect x='96' y='124' width='470' height='18' rx='4' fill='#f1e2d0'/><rect x='96' y='124' width='235' height='18' rx='4' fill='#b5651d'/><text x='560' y='137' font-size='11' fill='#5c3a12' text-anchor='end'>8.33 ms</text></svg><figcaption>図2：120Hzでは1フレーム8.33ms。必ず <code>--profile</code> で測る。</figcaption></figure>
<p><strong>実務の土台。</strong>状態管理は新規既定が<strong>Riverpod 3.3系</strong>、監査・大規模は<strong>Bloc 9.2系</strong>。データ層は<strong>Repositoryパターン</strong>でUIがデータ源を直接触らず<code>UserRepository</code>を唯一の窓口にし、データ源をコンストラクタ注入で差し替え可能にしておくと、後からオフライン/キャッシュをUI無改修で足せてテストもfake差し替えで楽になる。</p>
<p><strong>パフォーマンス。</strong>アプリサイズは<code>flutter build --analyze-size</code>→DevToolsのApp Size toolで内訳を見て、配信はAABで端末別に30–50%減。画像は<code>cacheWidth</code>/<code>cacheHeight</code>で表示解像度にデコード（4Kを384×216表示で約1/100）。単発CPU処理は<code>Isolate.run()</code>で本線を止めない。<code>const</code>＋<code>RepaintBoundary</code>、<code>saveLayer</code>回避も定番。</p>
<p><strong>自分が試すなら。</strong>デスクトップ配布があるプロジェクトは3.47へ上げてImpeller既定の恩恵を即受ける。windowingを使っているなら<code>size</code>/<code>constraints</code>へのリネームを先に潰してから上げるのが安全。</p>`,
  sources: [
    {title:'Flutter 3.47.0 release notes', url:'https://docs.flutter.dev/release/release-notes/release-notes-3.47.0'},
    {title:'Flutter animations production patterns 2026', url:'https://theflutterk.it.com/blog/flutter-animations-production-patterns-2026'},
    {title:'Flutter App Architecture (docs)', url:'https://docs.flutter.dev/app-architecture'}
  ]
};

const gh = {
  date: '2026-10-10', topic: 'GitHub Trending',
  title: '10/10 の話題リポジトリ — AI生成コードを安全実行(mxc)・UI出力を標準化(OpenUI)・AIスロップ排除(anti-slop)',
  lede: 'エージェントに大量のコードとUIを書かせる時代の"品質と安全"を別角度から埋める3本。実行の封じ込め、出力の標準化、見た目の脱・量産臭。',
  articleHtml: `<p>今日の3本を貫くのは「<strong>AIが生み出すもの（コード・UI・文章）をどう御すか</strong>」という一点だ。実行を封じ込める<strong>mxc</strong>、UI出力を共通の型に乗せる<strong>OpenUI</strong>、"いかにもAI製"の量産臭を弾く<strong>anti-slop</strong>。エージェントがコードもUIも書く前提に立つと、どれも素通りできない穴を埋めている。</p>
<figure class='fig'><svg viewBox='0 0 600 250' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'><text x='300' y='22' text-anchor='middle' font-size='13' fill='#1a7f37'>3本の「解決したい課題 → 提供する機能」</text><line x1='24' y1='40' x2='576' y2='40' stroke='#cfd8dc'/><text x='32' y='58' font-size='11' fill='#555'>リポジトリ</text><text x='188' y='58' font-size='11' fill='#555'>解決したい課題</text><text x='400' y='58' font-size='11' fill='#555'>提供する機能</text><line x1='24' y1='66' x2='576' y2='66' stroke='#cfd8dc'/><text x='32' y='104' font-size='11' fill='#1a7f37'>microsoft/mxc</text><text x='188' y='98' font-size='10.5' fill='#333'>信頼できないコードの</text><text x='188' y='114' font-size='10.5' fill='#333'>安全実行が無い</text><text x='400' y='98' font-size='10.5' fill='#333'>OS分離〜VMで宣言的に</text><text x='400' y='114' font-size='10.5' fill='#333'>サンドボックス実行</text><line x1='24' y1='132' x2='576' y2='132' stroke='#eceff1'/><text x='32' y='170' font-size='11' fill='#1a7f37'>thesysdev/openui</text><text x='188' y='164' font-size='10.5' fill='#333'>LLMのUI出力を各FWへ</text><text x='188' y='180' font-size='10.5' fill='#333'>安全に描く型が無い</text><text x='400' y='164' font-size='10.5' fill='#333'>OpenUI Langで範囲定義し</text><text x='400' y='180' font-size='10.5' fill='#333'>React/Vue等へ逐次描画</text><line x1='24' y1='198' x2='576' y2='198' stroke='#eceff1'/><text x='32' y='230' font-size='11' fill='#1a7f37'>anti-slop</text><text x='188' y='224' font-size='10.5' fill='#333'>汎用的な"AI製"の</text><text x='188' y='240' font-size='10.5' fill='#333'>UI/文章/コード</text><text x='400' y='224' font-size='10.5' fill='#333'>38必須ルール＋チェックで</text><text x='400' y='240' font-size='10.5' fill='#333'>スロップだけを除去</text></svg><figcaption>図1：3本の課題と機能の対応。実行・描画・品質の3レイヤを別々に補う。</figcaption></figure>
<h4>microsoft/mxc（Rust・⭐約2.5k）</h4>
<p><strong>解決したい課題。</strong>CIに自動セキュリティ検査が無い、機微データをどう守るか、そして<strong>エージェントが生成したコードを安全に実行する</strong>場所が無い——信頼境界を宣言的に敷ける仕組みが不在だった。<strong>提供する機能。</strong>信頼できないコードをWindows/Linux/macOSでサンドボックス実行する。OSネイティブの<strong>プロセス分離からフルVM</strong>まで複数の封じ込めバックエンドを選べ、ファイル/ネット/UIのアクセスを<strong>ポリシーで宣言的に設定</strong>、拒否時の診断も内蔵。Rust/.NET/Node用SDK付き。本日<strong>+約669（率約27%/日）</strong>と勢いが強く、MIT・Microsoft公式なので製品組み込みもしやすいのが急上昇の理由だ。</p>
<h4>thesysdev/openui（TypeScript・⭐約10.6k）</h4>
<p><strong>解決したい課題。</strong>LLMが吐くUIを各フレームワークへ安全に描画する<strong>共通の型が無く</strong>、モデルが"何を生成してよいか"の範囲も曖昧だった。<strong>提供する機能。</strong>ストリーミング前提の記述言語<strong>OpenUI Lang</strong>で、モデルが生成してよいコンポーネントを定義し、その出力を<strong>React/Vue/Svelte/Angular</strong>のいずれかへ逐次レンダリングする。"生成UIの共通標準"という位置づけで、実測⭐約10.6k・本日+約363、MITで製品に組み込める点が後押ししている。</p>
<h4>miqdadbadjuber/anti-slop（JavaScript・⭐約5.4k）</h4>
<p><strong>解決したい課題。</strong>AIコーディングエージェントが吐きがちな、<strong>"いかにもAI製"の汎用的なUI・文章・コード（スロップ）</strong>をどう弾くか。<strong>提供する機能。</strong><strong>38個の必須ルール＋領域別スキル＋納品前チェックリスト</strong>で汎用AI出力を排除する。特徴は、見た目の方向性は別のデザイン定義に委ね、<strong>視覚スタイルを押し付けずスロップだけをフィルタ</strong>する役割特化。本日<strong>+約535（率約10%/日）</strong>と急伸した新顔で、MITで即導入できる手軽さが話題性につながった。</p>
<p><strong>自分が試すなら。</strong>エージェント生成コードのCI隔離に<strong>mxc</strong>、AI生成UIの画面化に<strong>OpenUI</strong>、納品前の質の最終ゲートに<strong>anti-slop</strong>——役割が綺麗に分かれるので組み合わせて効く。ただしスター数や増加はトラッカー表示と実測の乖離が大きい例が多く、自己申告値も含むため、採用時は実挙動で確かめること。</p>`,
  sources: [
    {title:'microsoft/mxc', url:'https://github.com/microsoft/mxc'},
    {title:'thesysdev/openui', url:'https://github.com/thesysdev/openui'},
    {title:'miqdadbadjuber/anti-slop', url:'https://github.com/miqdadbadjuber/anti-slop'}
  ]
};

// order: Claude Code -> Next.js -> Flutter -> GitHub Trending (newest first, preserved at front)
const todays = [cc, nx, fl, gh];

const slug = { 'Claude Code':'claude-code', 'Next.js':'nextjs', 'Flutter':'flutter', 'GitHub Trending':'github-trending', 'はじめに':'intro' };

const o = JSON.parse(fs.readFileSync(WEB, 'utf8'));
const arr = o.articles;
const existsKey = new Set(arr.map(a => a.date + '|' + a.topic));
const usedIds = new Set(arr.map(a => a.id).filter(Boolean));

function mkId(a){
  let base = a.date + '-' + slug[a.topic];
  if(!usedIds.has(base)){ usedIds.add(base); return base; }
  let n=2; while(usedIds.has(base+'-'+n)) n++;
  const id=base+'-'+n; usedIds.add(id); return id;
}

const toAdd = [];
const skipped = [];
for(const a of todays){
  const k = a.date + '|' + a.topic;
  if(existsKey.has(k)){ skipped.push(a.topic+' ('+a.date+')'); continue; }
  existsKey.add(k);
  a.id = mkId(a);
  toAdd.push(a);
}

o.articles = [...toAdd, ...arr];
o.schema = 'tech-daily-reading/v1';
o.generatedAt = new Date().toISOString();
o.topics = ['Claude Code','Next.js','Flutter','GitHub Trending'];

const out = JSON.stringify(o, null, 2);
fs.writeFileSync(WEB, out);

// validate round-trip
const re = JSON.parse(fs.readFileSync(WEB, 'utf8'));
console.log('OK. total articles:', re.articles.length, '(+' + toAdd.length + ' new)');
console.log('added:', toAdd.map(a=>a.id).join(', ') || '(none)');
console.log('skipped(dup):', skipped.join(', ') || '(none)');
for(const a of toAdd){
  const open=(a.articleHtml.match(/<figure/g)||[]).length, close=(a.articleHtml.match(/<\/figure>/g)||[]).length;
  const so=(a.articleHtml.match(/<svg/g)||[]).length, sc=(a.articleHtml.match(/<\/svg>/g)||[]).length;
  const po=(a.articleHtml.match(/<pre/g)||[]).length, pc=(a.articleHtml.match(/<\/pre>/g)||[]).length;
  console.log('  '+a.id+' chars='+a.articleHtml.length+' fig='+open+'/'+close+' svg='+so+'/'+sc+' pre='+po+'/'+pc);
}
