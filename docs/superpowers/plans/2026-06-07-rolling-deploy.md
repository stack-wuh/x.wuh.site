# 滚动部署 + 自动回滚 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 部署时先启 staging 容器验证 health check，通过后才切换正式端口，失败自动回滚

**Architecture:** docker compose 端口环境变量化，deploy 脚本新增 staging 阶段，CI/CD 调用 deploy 命令

**Tech Stack:** Docker Compose, Bash, GitHub Actions

---

### Task 1: docker-compose.yml 端口环境变量化

**Files:**
- Modify: `docker-compose.yml:8-9, 22-23`

- [ ] **Step 1: 修改 next 端口**

```yaml
# 旧：
    ports:
      - "3000:3000"
# 新：
    ports:
      - "${PORT_NEXT:-3000}:3000"
```

- [ ] **Step 2: 修改 nest 端口**

```yaml
# 旧：
    ports:
      - "3200:3200"
# 新：
    ports:
      - "${PORT_NEST:-3200}:3200"
```

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "feat: docker compose 端口改为环境变量，支持 staging 部署"
```

---

### Task 2: deploy-docker.sh 新增 deploy 命令

**Files:**
- Modify: `scripts/deploy-docker.sh`

- [ ] **Step 1: 在 case 语句中，`restart` 之前新增 `deploy` 命令**

```bash
  deploy)
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)

    # 1. 构建 + tag
    echo "🔧 Building for deploy"
    docker compose build --progress=plain
    docker tag xwuhsite-next xwuhsite-next:$TIMESTAMP 2>/dev/null || true
    docker tag xwuhsite-nest xwuhsite-nest:$TIMESTAMP 2>/dev/null || true

    # 2. 启动 staging（临时端口）
    echo "🐳 Starting staging containers"
    PORT_NEXT=3001 PORT_NEST=3201 docker compose -p xwuhsite-staging up -d

    # 3. 等 health check
    echo "⏳ Waiting for health checks..."
    for i in $(seq 1 24); do
      if curl -sf http://localhost:3201/v2/health > /dev/null 2>&1 && \
         curl -sf http://localhost:3001/ > /dev/null 2>&1; then
        # 4a. 健康 → 切换
        echo "✅ Health check passed, switching traffic"
        docker compose down
        docker compose -p xwuhsite-staging down
        docker compose up -d
        prune_old_images
        echo "✅ Deploy complete"
        exit 0
      fi
      printf "."
      sleep 5
    done

    # 4b. 超时 → 回滚
    echo ""
    echo "❌ Health check failed, rolling back"
    docker compose -p xwuhsite-staging down
    exit 1
    ;;
```

- [ ] **Step 2: `restart` 改为调用 `deploy`**

```bash
  restart)
    echo "🔄 Full deploy cycle"
    exec "$0" deploy
    ;;
```

- [ ] **Step 3: Commit**

```bash
git add scripts/deploy-docker.sh
git commit -m "feat: deploy 命令支持滚动部署 + 健康检查自动回滚"
```

---

### Task 3: ci-cd.yml 更新部署命令

**Files:**
- Modify: `.github/workflows/ci-cd.yml:24`

- [ ] **Step 1: `restart` 改为 `deploy`**

```yaml
# 旧：
            ./scripts/deploy-docker.sh restart 2>&1 | tee /tmp/deploy.log
# 新：
            ./scripts/deploy-docker.sh deploy 2>&1 | tee /tmp/deploy.log
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci-cd.yml
git commit -m "feat(ci): CI/CD 改用 deploy 命令，支持自动回滚"
```
