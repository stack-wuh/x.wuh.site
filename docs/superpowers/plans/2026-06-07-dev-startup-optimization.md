# 开发服务器启动优化 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `pnpm dev` 一次启动 next + nest，清端口 + 退出清理

**Architecture:** Bash 脚本 + trap 信号处理，不改现有 `dev:next`/`dev:nest`

**Tech Stack:** Bash, lsof, trap

**测试说明:** Bash 脚本依赖进程/端口操作，无法用常规测试框架。验证方式为手动执行 `pnpm dev`。

---

### Task 1: 创建 scripts/dev.sh

**Files:**
- Create: `scripts/dev.sh`

- [ ] **Step 1: 创建脚本文件并添加执行权限**

```bash
touch scripts/dev.sh
chmod +x scripts/dev.sh
```

- [ ] **Step 2: 写入脚本内容**

```bash
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
```

- [ ] **Step 3: 验证脚本语法**

Run: `bash -n scripts/dev.sh`
Expected: 无输出（语法正确）

- [ ] **Step 4: 验证脚本功能**

Run: `bash scripts/dev.sh`
Expected: 同时看到 Next.js 和 NestJS 的启动日志

- [ ] **Step 5: 验证 Ctrl+C 清理**

按 `Ctrl+C` 后运行 `lsof -i :3000 -i :3200`，确认端口已释放

- [ ] **Step 6: Commit**

```bash
git add scripts/dev.sh
git commit -m "feat: 添加统一 dev 启动脚本，自动清理端口和子进程"
```

---

### Task 2: 添加 package.json dev 命令

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 在 scripts 中添加 dev 命令**

```json
"scripts": {
  "dev": "bash scripts/dev.sh",
  "build": "pnpm -r build",
  ...
}
```

- [ ] **Step 2: 验证**

Run: `pnpm dev`
Expected: 与 `bash scripts/dev.sh` 行为一致

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: 添加 pnpm dev 统一入口命令"
```
