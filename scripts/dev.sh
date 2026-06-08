#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  echo ""
  echo "🛑 正在停止所有 dev 服务..."
  kill %1 %2 2>/dev/null || true
  wait 2>/dev/null || true
  echo "✅ 已停止"
}
trap cleanup EXIT INT TERM

for port in 3000 3200; do
  PID=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$PID" ]; then
    echo "⚠️  端口 $port 被占用 (PID: $PID)，正在释放..."
    kill $PID 2>/dev/null || true
    sleep 1
  fi
done

echo "🐳 启动 dev 服务..."
pnpm dev:next &
pnpm dev:nest &

wait
