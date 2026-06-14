#!/usr/bin/env bash
set -euo pipefail

root_dir=$(cd "$(dirname "$0")/.." && pwd)
child_pid=""

stop_tree() {
  local pid="$1"
  local children
  children=$(pgrep -P "$pid" 2>/dev/null || true)

  for child in $children; do
    stop_tree "$child"
  done

  kill "$pid" 2>/dev/null || true
}

cleanup() {
  trap - EXIT INT TERM

  if [ -n "$child_pid" ]; then
    echo ""
    echo "🛑 next 已停止"
    stop_tree "$child_pid"
    wait "$child_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

pids=$(lsof -ti :3000 2>/dev/null || true)
if [ -n "$pids" ]; then
  echo "⚠️  端口 3000 被占用 (PID: $pids)，正在释放..."
  for pid in $pids; do
    stop_tree "$pid"
  done
  sleep 1
fi

echo "🐳 启动 next dev..."
MAX_RETRIES=3
retry=0
while true; do
  if [ $retry -gt 0 ]; then
    echo "⚠️  next 异常退出 (139)，第 $retry 次重试..."
    sleep 1
  fi
  (
    cd "$root_dir/packages/wuh.site.next"
    node --no-concurrent-sweeping --no-concurrent-marking ./node_modules/next/dist/bin/next dev
  ) &
  child_pid="$!"
  set +e
  wait "$child_pid"
  ec=$?
  set -e
  # 0=正常退出, 130=SIGINT, 143=SIGTERM → 不重试
  if [ "$ec" -ne 139 ]; then
    break
  fi
  retry=$((retry + 1))
  if [ "$retry" -gt "$MAX_RETRIES" ]; then
    echo "❌ next 多次异常退出，放弃重试" >&2
    break
  fi
done
