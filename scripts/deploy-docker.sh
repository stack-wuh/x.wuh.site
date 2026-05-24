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
  restart  Stop → build → clean → run (full deploy cycle)
  push     Push images to registry (docker compose push)
  clean    Remove dangling images + old build cache (frees disk space)
  logs     Tail logs from all services
  shell    Launch an interactive shell inside a service
  help     Show this message
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

case "${1:-help}" in
  build)
    echo "🔧 Building all services"
    docker compose build --progress=plain
    prune_old_images
    ;;

  run)
    echo "🐳 Starting all services"
    docker compose up -d
    ;;

  stop)
    echo "🛑 Stopping all services"
    docker compose down
    ;;

  restart)
    echo "🔄 Full deploy cycle"
    docker compose down 2>/dev/null || true
    docker compose build --progress=plain
    prune_old_images
    docker compose up -d
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

  help|--help|-h)
    usage
    ;;

  *)
    echo "Unknown command: $1" >&2
    usage
    exit 1
    ;;
esac
