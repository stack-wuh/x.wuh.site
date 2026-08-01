# 滚动部署 + 自动回滚

> 原始变更名：`20260607_P_rolling_deploy`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
当前部署流程（`deploy-docker.sh restart`）是 `down → build → up`。如果新镜像构建成功但容器启动失败（health check 不过），旧容器已被 down，导致服务中断。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1：历史任务
- [ ] `next` 端口改为 `"${PORT_NEXT:-3000}:3000"`
- [ ] `nest` 端口改为 `"${PORT_NEST:-3200}:3200"`
- [ ] 新增 `deploy` case：构建 → tag → staging up → health check → 切换/回滚
- [ ] `restart` 命令改为调用 `deploy`
- [ ] 保留 `prune_old_images` 函数不变
- [ ] script 中 `restart` 改为 `deploy`

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: rolling-deploy
date: 2026-06-07
type: P
status: applied
```

### `design.md`
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

### `proposal.md`
# 滚动部署 + 自动回滚

## 背景

当前部署流程（`deploy-docker.sh restart`）是 `down → build → up`。如果新镜像构建成功但容器启动失败（health check 不过），旧容器已被 down，导致服务中断。

## 方案

采用"先启后切"的滚动部署策略：

1. 构建新镜像，打时间戳 tag
2. 用临时端口（3001/3201）启动 staging 容器
3. 轮询 health check（最长 120s）
4. 通过 → 停旧容器 → staging 容器用正式端口重启 → 删旧镜像
5. 失败 → 删 staging 容器 → 旧容器继续运行

旧容器在整个过程中保持运行，只有在验证通过后才切换，保证零停机。

## 改动范围

- `docker-compose.yml` — 端口从硬编码改为 `${PORT_NEXT:-3000}` / `${PORT_NEST:-3200}`
- `scripts/deploy-docker.sh` — 新增 `deploy` 命令，`restart` 改为调用 `deploy`
- `.github/workflows/ci-cd.yml` — `restart` 改为 `deploy`

### `tasks.md`
# 任务清单

## Task 1: docker-compose.yml 端口环境变量化
- [ ] `next` 端口改为 `"${PORT_NEXT:-3000}:3000"`
- [ ] `nest` 端口改为 `"${PORT_NEST:-3200}:3200"`

## Task 2: deploy-docker.sh 新增 deploy 命令
- [ ] 新增 `deploy` case：构建 → tag → staging up → health check → 切换/回滚
- [ ] `restart` 命令改为调用 `deploy`
- [ ] 保留 `prune_old_images` 函数不变

## Task 3: ci-cd.yml 更新部署命令
- [ ] script 中 `restart` 改为 `deploy`
