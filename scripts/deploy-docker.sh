#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

IMAGE_BASE=${IMAGE_BASE:-wuh.site}
DATE_TAG=$(date -u +%F)
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo local)
IMAGE_TAG=${IMAGE_TAG:-${IMAGE_BASE}.${DATE_TAG}:${GIT_SHA}}
CONTAINER_NAME=${CONTAINER_NAME:-wuh-site}
PORT_MAPPING=${PORT_MAPPING:-3000:3000}
DEFAULT_ENV_FILE=${DEFAULT_ENV_FILE:-./packages/wuh.site.next/.env}

usage() {
  cat <<'USAGE'
Usage: $(basename "$0") <command> [options]

Commands:
  build               Build the Docker image and tag it with $IMAGE_TAG.
  push                Push the Docker image to the remote registry.
  run [env-file]      Run the container (default env-file is $DEFAULT_ENV_FILE).
  stop                Stop and remove the running container named $CONTAINER_NAME.
  shell               Launch an interactive shell inside the image (requires existing image).
  info                Print the resolved image/command metadata.
  help                Show this message.
USAGE
}

ensure_env_file() {
  local env_file=$1
  if [[ -n "$env_file" && ! -f "$env_file" ]]; then
    echo "Warning: env-file '$env_file' does not exist" >&2
  fi
}

build_image() {
  echo "🔧 Building $IMAGE_TAG"
  docker buildx build -t "$IMAGE_TAG" .
}

push_image() {
  echo "📤 Pushing $IMAGE_TAG"
  # 检查本地镜像是否存在
  if ! docker image inspect "$IMAGE_TAG" >/dev/null 2>&1; then
    echo "Error: Image $IMAGE_TAG not found locally. Please run 'build' first." >&2
    exit 1
  fi
  docker push "$IMAGE_TAG"
  echo "✅ Push completed"
}

run_container() {
  local env_file=${1:-$DEFAULT_ENV_FILE}
  ensure_env_file "$env_file"
  local env_args=()
  if [[ -n "$env_file" && -f "$env_file" ]]; then
    env_args=(--env-file "$env_file")
  fi
  echo "🐳 Running $IMAGE_TAG"
  docker run -d --rm --name "$CONTAINER_NAME" -p "$PORT_MAPPING" "${env_args[@]}" "$IMAGE_TAG"
}

stop_container() {
  echo "🛑 Stopping $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
}

shell() {
  echo "🧪 Opening shell inside $IMAGE_TAG"
  docker run --rm -it --entrypoint /bin/sh "$IMAGE_TAG"
}

info() {
  cat <<-INFO
  Image: $IMAGE_TAG
  Container name: $CONTAINER_NAME
  Port mapping: $PORT_MAPPING
  Env file: $DEFAULT_ENV_FILE
INFO
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

COMMAND=$1
shift

case "$COMMAND" in
  build)
    build_image
    ;;
  push)
    push_image
    ;;
  run)
    if [[ $# -ge 1 ]]; then
      run_container "$1"
    else
      run_container
    fi
    ;;
  stop)
    stop_container
    ;;
  shell)
    shell
    ;;
  info)
    info
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    echo "Unknown command: $COMMAND" >&2
    usage
    exit 1
    ;;
esac