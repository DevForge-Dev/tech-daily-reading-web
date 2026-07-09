#!/usr/bin/env bash
# data/articles.json などの変更を commit して push する。launchd から毎日呼ばれる想定。
# push 後は GitHub Actions (build-docs.yml) が docs/ を再ビルド＆公開する。
#
# 役割分担:
#   Cowork の 13:30 タスク … data/articles.json をローカルに書く（pushしない）
#   このスクリプト(launchd) … その変更を commit + push する  ← ここが「常駐pusher」
#   GitHub Actions          … push を検知して docs/ をビルド＆公開
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
cd "/Users/keita/Develop/DevForge/tech-daily-reading-web" || exit 1

# 0) 残留ロックの掃除
#    過去に git プロセスがクラッシュすると .git/*.lock が残り、以降の
#    commit / rebase が「cannot lock ref」で毎日失敗し続ける（沈黙する）。
#    実際に走っている git プロセスが無ければ、残留ロックだけ除去して自動回復する。
#    ※ プロセス名が厳密に git のものだけを見る（-f だと VS Code や gh の
#      コマンドラインに含まれる "git" を誤検知し、掃除が永久スキップされる）。
if pgrep -x "git" >/dev/null 2>&1 || pgrep -x "git-remote-https" >/dev/null 2>&1; then
  echo "$(date '+%F %T') 他の git プロセスが実行中、ロック掃除をスキップ"
else
  for lock in .git/HEAD.lock .git/index.lock .git/config.lock \
              .git/refs/heads/main.lock .git/ORIG_HEAD.lock; do
    if [ -e "$lock" ]; then
      rm -f "$lock" && echo "$(date '+%F %T') 残留ロック除去: $lock"
    fi
  done
fi

# 1) ローカルの変更を確定
git add -A
if git diff --cached --quiet; then
  echo "$(date '+%F %T') 変更なし、スキップ"
  exit 0
fi
git commit -m "chore: update articles data $(date '+%F')"

# 2) Actions が docs/ を push し返すため、リモートへ追従してから push
git fetch -q origin main || true
if ! git rebase -q origin/main; then
  echo "$(date '+%F %T') rebase 競合、中断（手動確認が必要）"
  git rebase --abort 2>/dev/null
  exit 1
fi

# 3) push（成功すれば Actions が起動して公開まで自動）
if git push origin main; then
  echo "$(date '+%F %T') push 完了 → Actions がビルド＆公開します"
else
  echo "$(date '+%F %T') push 失敗（認証/ネットワークを確認）"
  exit 1
fi
