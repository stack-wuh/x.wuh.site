#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

IMAGE_BASE=${IMAGE_BASE:-wuh_site}
DATE_TAG=$(date -u +%F)
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo local)
IMAGE_TAG=${IMAGE_TAG:-${IMAGE_BASE}:${GIT_SHA}}
CONTAINER_NAME=${CONTAINER_NAME:-wuh_site}
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

ensure_local_image() {
  if ! docker image inspect "$IMAGE_TAG" >/dev/null 2>&1; then
    echo "Error: Local image '$IMAGE_TAG' not found. Please run './$(basename "$0") build' first." >&2
    exit 1
  fi
}

maybe_env_args() {
  local env_file=$1
  if [[ -z "$env_file" ]]; then
    return
  fi

  if [[ -f "$env_file" ]]; then
    printf '%s\0' --env-file "$env_file"
  else
    echo "ℹ️  Env file '$env_file' not found. Skipping." >&2
  fi
}

build_image() {
  echo "🔧 Building $IMAGE_TAG"
  docker buildx build -t "$IMAGE_TAG" .
}

push_image() {
  echo "📤 Pushing $IMAGE_TAG"
  ensure_local_image
  docker push "$IMAGE_TAG"
  echo "✅ Push completed"
}

run_container_common() {
  # local env_file=${1:-$DEFAULT_ENV_FILE}
  # mapfile -d '' env_args < <(maybe_env_args "$env_file"; printf '\0')

  ensure_local_image
  echo "🐳 Running local image: $IMAGE_TAG"
  docker run -d --rm --name "$CONTAINER_NAME" -p "$PORT_MAPPING" "$IMAGE_TAG"
}

stop_container() {
  echo "🛑 Stopping $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
}

shell() {
  ensure_local_image
  printf "🧪 Opening shell inside %s\n" "$IMAGE_TAG"
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
  run|run-local)
    run_container_common "${1:-}"
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