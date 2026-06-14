#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

usage() {
  cat <<'USAGE'
Usage: $(basename "$0") <command>
Commands:
  build          Build all Docker images via docker compose
  build-deps     Install npm dependencies only (caches layer)
  build-next     Build Next.js image only (CI step)
  build-nest     Build NestJS image only (CI step)
  staging-test   Start staging + health check (CI step)
  staging-down   Tear down staging containers
  switch-traffic Stop old containers, start new ones (CI step)
  deploy         Full deploy cycle: build -> staging -> switch
  restart        Shortcut for deploy
  diagnose       Check system health (docker, disk, memory, ports)
  cancel         Force stop all running builds and staging
  run            Start all services (docker compose up -d)
  stop           Stop and remove all services
  push           Push images to registry (docker compose push)
  clean          Remove dangling images + old build cache
  logs           Tail logs from all services
  shell          Launch an interactive shell inside a service
  help           Show this message
USAGE
}

# Remove old images (not the ones currently referenced by containers)
prune_old_images() {
  echo "🧹 Removing dangling images"
  docker image prune --force 2>/dev/null || true
}

# Remove build cache older than 72h
prune_old_cache() {
  echo "🧹 Removing build cache older than 72h"
  docker builder prune --filter "until=72h" --force 2>/dev/null || true
}

# Aggressive cleanup — use when disk is full
prune_all_cache() {
  echo "🧹 Full cache cleanup"
  docker builder prune --all --force 2>/dev/null || true
}

# === Error diagnosis ============================================================

# Scan build/deploy log for known error patterns and output fix commands
diagnose_error() {
  local log="${1:-/dev/stdin}"

  if grep -q "Cannot connect to the Docker daemon" "$log" 2>/dev/null; then
    echo "::error::Docker 服务未运行"
    echo "::fix::sudo systemctl start docker"
    return 0
  fi

  if grep -qE "(No space left on device|ENOSPC: no space left on device)" "$log" 2>/dev/null; then
    echo "::error::磁盘空间不足"
    echo "::fix::docker system prune -af --volumes && docker builder prune -af"
    return 0
  fi

  if grep -qE "bind: address already in use" "$log" 2>/dev/null; then
    echo "::error::端口被占用 (3000/3001/3200/3201)"
    echo "::fix::fuser -k 3000/tcp 3001/tcp 3200/tcp 3201/tcp 2>/dev/null; ./scripts/deploy-docker.sh stop"
    return 0
  fi

  if grep -qE "requested access to the resource is denied" "$log" 2>/dev/null; then
    echo "::error::Docker 权限不足"
    echo "::fix::sudo usermod -aG docker \$USER && echo '请退出重新登录使权限生效'"
    return 0
  fi

  if grep -qE "(npm ERR!|pnpm ERR!)" "$log" 2>/dev/null; then
    if grep -qE "(ETIMEDOUT|ENOTFOUND|ECONNREFUSED|network|EPROTO)" "$log" 2>/dev/null; then
      echo "::error::依赖安装网络错误 (registry 不可达)"
      echo "::fix::ping -c1 registry.npmmirror.com || echo '检查 DNS/网络'; cat .npmrc"
      return 0
    fi
    echo "::error::依赖安装失败 (非网络原因，可能是 lockfile 或版本冲突)"
    echo "::fix::git diff pnpm-lock.yaml; pnpm install --no-frozen-lockfile"
    return 0
  fi

  if grep -qE "(Killed|exit code 137|out of memory)" "$log" 2>/dev/null; then
    echo "::error::内存不足 (OOM)，构建进程被系统 kill"
    echo "::fix::free -h && docker compose down && echo '释放内存后重试'"
    return 0
  fi

  if grep -qE "inotify" "$log" 2>/dev/null; then
    echo "::error::inotify 句柄耗尽"
    echo "::fix::echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p"
    return 0
  fi

  if grep -qE "TS[0-9]{4}:" "$log" 2>/dev/null; then
    echo "::error::TypeScript 编译错误，详见上方日志"
    echo "::fix::pnpm exec tsc --noEmit  # 本地复现并修复类型错误"
    return 0
  fi

  echo "::error::未识别错误，请查看上方完整日志"
  return 1
}

# Standalone system health check — diagnose common server issues
cmd_diagnose() {
  echo "🔍 Checking system health..."

  echo ""
  echo "── Docker ──"
  if docker info >/dev/null 2>&1; then
    echo "  ✅ Docker 运行正常"
  else
    echo "  ❌ Docker 不可用"
    echo "  ::fix::sudo systemctl start docker"
  fi

  echo ""
  echo "── Disk ──"
  df -h / | tail -1 | while read fs size used avail pct mnt; do
    if [ "${pct%%\%}" -gt 90 ]; then
      echo "  ❌ 磁盘使用率 $pct"
      echo "  ::fix::docker system prune -af --volumes"
    else
      echo "  ✅ 磁盘 $avail 可用 ($pct 使用)"
    fi
  done

  echo ""
  echo "── Memory ──"
  free -h | grep Mem | while read _ total used free _; do
    echo "  ℹ️  总量=$total 已用=$used 可用=$free"
  done

  echo ""
  echo "── Ports ──"
  for port in 3000 3001 3200 3201; do
    if fuser "$port/tcp" 2>/dev/null; then
      echo "  ⚠️  端口 $port 被占用"
    else
      echo "  ✅ 端口 $port 空闲"
    fi
  done

  echo ""
  echo "── Containers ──"
  docker compose ps 2>/dev/null || echo "  ⚠️  无运行中容器"
}

# Force cancel all running builds and deployments
cmd_cancel() {
  echo "🛑 Cancelling all running operations..."

  echo "── Killing docker compose build processes ──"
  pkill -f "docker compose build" 2>/dev/null && echo "  ✅ Killed build processes" || echo "  ℹ️  No build processes found"

  echo "── Killing docker compose up processes ──"
  pkill -f "docker compose.*up" 2>/dev/null && echo "  ✅ Killed up processes" || echo "  ℹ️  No up processes found"

  echo "── Stopping staging containers ──"
  docker compose -p xwuhsite-staging down 2>/dev/null || echo "  ℹ️  No staging containers"

  echo "── Cleaning lock file ──"
  rm -f /tmp/git-xwuhsite.lock 2>/dev/null && echo "  ✅ Removed git lock" || echo "  ℹ️  No lock file"

  echo "── Cleaning temp logs ──"
  rm -f /tmp/deploy-*.log 2>/dev/null && echo "  ✅ Removed temp logs" || echo "  ℹ️  No temp logs"

  echo "✅ Cancel complete"
}

case "${1:-help}" in
  build)
    echo "🔧 Building all services"
    docker compose build --progress=plain
    prune_old_images
    ;;

  build-deps)
    echo "📦 Installing dependencies (cached layer)"
    docker build --target deps -t xwuhsite-deps .
    ;;

  run)
    echo "🐳 Starting all services"
    docker compose up -d
    ;;

  stop)
    echo "🛑 Stopping all services"
    docker compose down
    ;;

  deploy)
    echo "🚀 Full deploy cycle"
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    echo "Timestamp: $TIMESTAMP"

    "$0" build-next  || exit 1
    "$0" build-nest  || exit 1
    "$0" staging-test || exit 1
    "$0" switch-traffic || exit 1
    ;;

  restart)
    echo "🔄 Full deploy cycle"
    exec "$0" deploy
    ;;

  push)
    echo "📤 Pushing images"
    docker compose push
    ;;

  clean)
    echo "🧹 Cleaning Docker disk usage"
    prune_old_images
    prune_old_cache
    echo "✅ Done"
    ;;

  clean-all)
    echo "🧹 Aggressive Docker cleanup"
    docker compose down 2>/dev/null || true
    docker image prune --force 2>/dev/null || true
    prune_all_cache
    echo "✅ Done"
    ;;

  logs)
    echo "📋 Tailing logs"
    docker compose logs -f
    ;;

  shell)
    SERVICE=${2:-next}
    echo "🧪 Opening shell in $SERVICE"
    docker compose exec "$SERVICE" /bin/sh
    ;;

  diagnose)
    cmd_diagnose
    ;;

  build-next)
    echo "🔧 Building xwuhsite-next"
    docker compose build --progress=plain next 2>&1 | tee /tmp/deploy-build-next.log
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
      echo ""
      echo "── 错误诊断 ──"
      diagnose_error /tmp/deploy-build-next.log
      exit 1
    fi
    prune_old_images
    ;;

  build-nest)
    echo "🔧 Building xwuhsite-nest"
    docker compose build --progress=plain nest 2>&1 | tee /tmp/deploy-build-nest.log
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
      echo ""
      echo "── 错误诊断 ──"
      diagnose_error /tmp/deploy-build-nest.log
      exit 1
    fi
    prune_old_images
    ;;

  staging-test)
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    echo "🐳 Starting staging (timestamp=$TIMESTAMP)"

    PORT_NEXT=3001 PORT_NEST=3201 docker compose -p xwuhsite-staging up -d 2>&1 | tee /tmp/deploy-staging.log
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
      echo ""
      echo "── 错误诊断 ──"
      diagnose_error /tmp/deploy-staging.log
      exit 1
    fi

    echo "⏳ Waiting for health checks (max 120s)..."
    HEALTHY=false
    for i in $(seq 1 24); do
      if curl -sf http://localhost:3201/v2/health > /dev/null 2>&1 && \
         curl -sf http://localhost:3001/ > /dev/null 2>&1; then
        echo ""
        echo "✅ Health check passed"
        HEALTHY=true
        break
      fi
      printf "."
      sleep 5
    done

    if [ "$HEALTHY" = false ]; then
      echo ""
      echo "❌ Health check failed — staging logs:"
      docker compose -p xwuhsite-staging logs --tail=80
      echo ""
      echo "── 错误诊断 ──"
      diagnose_error /tmp/deploy-staging.log
      docker compose -p xwuhsite-staging down 2>/dev/null
      exit 1
    fi
    ;;

  staging-down)
    echo "🛑 Tearing down staging"
    docker compose -p xwuhsite-staging down 2>/dev/null || true
    ;;

  cancel)
    cmd_cancel
    ;;

  switch-traffic)
    echo "🔁 Switching traffic to new version"
    docker compose down 2>&1 | tee /tmp/deploy-switch.log
    docker compose -p xwuhsite-staging down 2>/dev/null || true
    docker compose up -d 2>&1 | tee -a /tmp/deploy-switch.log
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
      echo ""
      echo "── 错误诊断 ──"
      diagnose_error /tmp/deploy-switch.log
      exit 1
    fi
    prune_old_images
    echo "✅ Deploy complete"
    ;;

  help|--help|-h)
    usage
    ;;

  *)
    echo "Unknown command: $1" >&2
    usage
    exit 1
    ;;
esac
