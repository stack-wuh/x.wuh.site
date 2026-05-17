#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

usage() {
  cat <<'USAGE'
Usage: $(basename "$0") <command>
Commands:
  build    Build all Docker images via docker compose
  run      Start all services (docker compose up -d)
  stop     Stop and remove all services
  push     Push images to registry (docker compose push)
  clean    Prune Docker buildx cache (frees disk space)
  logs     Tail logs from all services
  shell    Launch an interactive shell inside a service
  help     Show this message
USAGE
}

case "${1:-help}" in
  build)
    echo "🔧 Building all services"
    docker compose build
    ;;
  clean)
    echo "🧹 Pruning stale Docker buildx cache (keep last 24h)"
    docker buildx prune --filter "until=24h" --force 2>/dev/null || true
    echo "✅ Build cache cleaned"
    ;;
  run)
    echo "🐳 Starting all services"
    docker compose up -d
    ;;
  stop)
    echo "🛑 Stopping all services"
    docker compose down
    ;;
  push)
    echo "📤 Pushing images"
    docker compose push
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
  help|--help|-h)
    usage
    ;;
  *)
    echo "Unknown command: $1" >&2
    usage
    exit 1
    ;;
esac
