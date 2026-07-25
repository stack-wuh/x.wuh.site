#!/usr/bin/env bash
set -euo pipefail

root_dir=$(cd "$(dirname "$0")/.." && pwd)
child_pids=()

stop_tree() {
  local pid="$1"
  local children
  children=$(pgrep -P "$pid" 2>/dev/null || true)

  for child in $children; do
    stop_tree "$child"
  done

  kill "$pid" 2>/dev/null || true
}

release_port() {
  local port="$1"
  local pids
  pids=$(lsof -ti :"$port" 2>/dev/null || true)

  if [ -n "$pids" ]; then
    echo "⚠️  端口 $port 被占用 (PID: $pids)，正在释放..."
    for pid in $pids; do
      stop_tree "$pid"
    done
    sleep 1
  fi
}

cleanup() {
  trap - EXIT INT TERM
  echo ""
  echo "🛑 正在停止所有 dev 服务..."

  for pid in "${child_pids[@]}"; do
    stop_tree "$pid"
  done

  wait 2>/dev/null || true
  echo "✅ 已停止"
}
trap cleanup EXIT INT TERM

release_port 3000
release_port 3200
release_port 3300

echo "🐳 启动 dev 服务..."
bash "$root_dir/scripts/dev-next.sh" &
child_pids+=("$!")

bash "$root_dir/scripts/dev-nest.sh" &
child_pids+=("$!")

( cd "$root_dir" && pnpm dev:console ) &
child_pids+=("$!")

wait "${child_pids[@]}"
