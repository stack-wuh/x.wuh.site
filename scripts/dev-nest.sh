#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  echo ""
  echo "🛑 nest 已停止"
}
trap cleanup EXIT INT TERM

PID=$(lsof -ti :3200 2>/dev/null || true)
if [ -n "$PID" ]; then
  echo "⚠️  端口 3200 被占用 (PID: $PID)，正在释放..."
  kill $PID 2>/dev/null || true
  sleep 1
fi

echo "🐳 启动 nest dev..."
pnpm --filter @wuh.site/nest run start:dev
