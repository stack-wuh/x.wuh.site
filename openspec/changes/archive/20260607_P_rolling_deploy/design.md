# 设计文档：滚动部署 + 自动回滚

## 流程

```
CI push main
  │
  ▼
SSH 到服务器
  │
  ▼
1. 构建新镜像，打时间戳 tag (xwuhsite-nest:20260607-1200)
  │
  ▼
2. PORT_NEXT=3001 PORT_NEST=3201 启动 staging 容器
   docker compose -p xwuhsite-staging up -d
  │
  ▼
3. 轮询 health check（每 5s，最多 24 次 = 120s）
   curl http://localhost:3201/v2/health
   curl http://localhost:3001/
  │
  ├─ ✅ 通过 ── 4a. 停旧 → staging 用正式端口重启 → 删旧镜像
  │              docker compose down
  │              docker compose -p xwuhsite-staging down
  │              docker compose up -d
  │              docker image prune --force
  │
  └─ ❌ 超时 ── 4b. 删 staging 容器，旧容器继续运行
                 docker compose -p xwuhsite-staging down
                 exit 1
```

## docker-compose.yml

端口改为环境变量，默认值保持向后兼容：

```yaml
services:
  next:
    ports:
      - "${PORT_NEXT:-3000}:3000"
  nest:
    ports:
      - "${PORT_NEST:-3200}:3200"
```

## deploy-docker.sh

新增 `deploy` 命令：

```bash
deploy)
  TIMESTAMP=$(date +%Y%m%d-%H%M%S)

  # 1. 构建 + tag
  docker compose build --progress=plain
  docker tag xwuhsite-next xwuhsite-next:$TIMESTAMP 2>/dev/null || true
  docker tag xwuhsite-nest xwuhsite-nest:$TIMESTAMP 2>/dev/null || true

  # 2. 启动 staging
  PORT_NEXT=3001 PORT_NEST=3201 docker compose -p xwuhsite-staging up -d

  # 3. 等 health check
  for i in $(seq 1 24); do
    if curl -sf http://localhost:3201/v2/health > /dev/null 2>&1 && \
       curl -sf http://localhost:3001/ > /dev/null 2>&1; then
      # 4a. 健康 → 切换
      docker compose down
      docker compose -p xwuhsite-staging down
      docker compose up -d
      prune_old_images
      exit 0
    fi
    sleep 5
  done

  # 4b. 超时 → 回滚
  echo "Health check failed, rolling back"
  docker compose -p xwuhsite-staging down
  exit 1
  ;;
```

`restart` 命令改为调用 `deploy`。

## ci-cd.yml

```yaml
script: |
  set -e
  cd /github/x.wuh.site
  git fetch origin main
  git checkout main
  git reset --hard origin/main
  git clean -fd
  ./scripts/deploy-docker.sh deploy 2>&1 | tee /tmp/deploy.log
  exit_code=${PIPESTATUS[0]}
  if [ $exit_code -ne 0 ]; then
    echo "::error::部署失败，最后 80 行日志："
    tail -80 /tmp/deploy.log
    exit $exit_code
  fi
```
