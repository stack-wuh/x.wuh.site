# Statusline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Claude Code 配置底部状态栏，显示模型、Git 分支、Token 进度条、会话时长、项目名。

**Architecture:** 创建一个 shell 脚本接收 Claude Code 传入的 JSON（stdin），解析后渲染带颜色和进度条的 statusline 字符串，输出到 stdout。settings.json 引用该脚本路径。

**Tech Stack:** bash, jq (JSON 解析), ANSI escape codes (颜色), git (分支名)

**设计修正：** 设计文档中提及 `type: "string"` 模板，实际 Claude Code 的 statusLine 配置格式为 `type: "command"` — 通过 shell 脚本接收 JSON stdin 并输出文本。

---

### Task 1: 创建 statusline 脚本

**Files:**
- Create: `~/.claude/statusline.sh`

- [ ] **Step 1: 创建脚本文件，编写 JSON 解析与变量提取**

```bash
#!/bin/bash
# Claude Code Statusline
# 输入：Claude Code 通过 stdin 传入 JSON
# 输出：单行 statusline 文本

input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name // "?"')
CWD=$(echo "$input" | jq -r '.workspace.current_dir // "."')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0')
TOTAL_DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')
REPO_DIR=$(echo "$input" | jq -r '.workspace.project_dir // ""')

# Git 分支（从文件系统获取，因为 JSON 可能不包含）
if [ -n "$REPO_DIR" ]; then
  BRANCH=$(cd "$REPO_DIR" 2>/dev/null && git branch --show-current 2>/dev/null || echo "-")
else
  BRANCH="-"
fi

# 项目名
if [ -n "$REPO_DIR" ]; then
  PROJECT=$(basename "$REPO_DIR")
else
  PROJECT=$(basename "$CWD")
fi

# 进度条：10 格
PCT_INT=$(echo "$PCT" | cut -d. -f1)
FILLED=$(( PCT_INT / 10 ))
EMPTY=$(( 10 - FILLED ))

# 颜色规则
if [ "$PCT_INT" -ge 95 ]; then
  BAR_COLOR="\033[31m"  # 红
elif [ "$PCT_INT" -ge 80 ]; then
  BAR_COLOR="\033[33m"  # 黄
else
  BAR_COLOR="\033[32m"  # 绿
fi
RESET="\033[0m"

# 构建进度条字符串
BAR=""
for i in $(seq 1 $FILLED); do BAR="${BAR}█"; done
for i in $(seq 1 $EMPTY); do BAR="${BAR}░"; done

# 会话时长格式化
DURATION_SEC=$(( TOTAL_DURATION_MS / 1000 ))
if [ "$DURATION_SEC" -lt 3600 ]; then
  DURATION="$(( DURATION_SEC / 60 ))m"
else
  H=$(( DURATION_SEC / 3600 ))
  M=$(( (DURATION_SEC % 3600) / 60 ))
  DURATION="${H}h ${M}m"
fi

# 输出
printf "◇ %-6s  ⎇ %s  ${BAR_COLOR}%s${RESET} %3d%%  ◷ %s  ◆ %s\n" \
  "$MODEL" "$BRANCH" "$BAR" "$PCT_INT" "$DURATION" "$PROJECT"
```

- [ ] **Step 2: 设置脚本可执行权限**

Run: `chmod +x ~/.claude/statusline.sh`
Expected: 无输出，exit 0

---

### Task 2: 配置 settings.json

**Files:**
- Modify: `~/.claude/settings.json`

- [ ] **Step 3: 添加 statusLine 配置项**

在 `~/.claude/settings.json` 中添加：

```json
"statusLine": {
  "type": "command",
  "command": "~/.claude/statusline.sh",
  "refreshInterval": 15
}
```

刷新间隔 15 秒用于更新会话时长，其他字段（模型、分支、token 用量）由事件驱动更新。

- [ ] **Step 4: 验证 JSON 合法性**

Run: `python3 -m json.tool ~/.claude/settings.json > /dev/null && echo "OK"`
Expected: `OK`

---

### Task 3: 手动验证

- [ ] **Step 5: 模拟 JSON 输入验证脚本输出**

Run:
```bash
echo '{
  "model": {"display_name": "Sonnet"},
  "workspace": {"current_dir": "/Users/wuhong/shadow-desktop/github/x.wuh.site", "project_dir": "/Users/wuhong/shadow-desktop/github/x.wuh.site"},
  "context_window": {"used_percentage": 45.2},
  "cost": {"total_duration_ms": 720000}
}' | ~/.claude/statusline.sh
```

Expected: 类似 `◇ Sonnet  ⎇ 143-feat-代码拆分优化  ████░░░░░░  45%  ◷ 12m  ◆ x.wuh.site`（前 4 格为绿色 `█`，后跟百分比和分析项目名）

- [ ] **Step 6: 验证高用量颜色（模拟 >80%）**

Run:
```bash
echo '{
  "model": {"display_name": "Sonnet"},
  "workspace": {"current_dir": "/Users/wuhong/shadow-desktop/github/x.wuh.site", "project_dir": "/Users/wuhong/shadow-desktop/github/x.wuh.site"},
  "context_window": {"used_percentage": 89.0},
  "cost": {"total_duration_ms": 3723000}
}' | ~/.claude/statusline.sh
```

Expected: 进度条为黄色 ████████░░ 89%，时长为 `1h 2m`

- [ ] **Step 7: 验证极限用量颜色（模拟 >95%）**

Run:
```bash
echo '{
  "model": {"display_name": "Opus"},
  "workspace": {"current_dir": "/tmp", "project_dir": ""},
  "context_window": {"used_percentage": 97.5},
  "cost": {"total_duration_ms": 45000}
}' | ~/.claude/statusline.sh
```

Expected: 进度条为红色 █████████░ 97%，时长 `0m`（<1分钟取整为0m），模型 Opus

---

### Task 4: 提交

- [ ] **Step 8: 提交实现**

```bash
git add ~/.claude/statusline.sh
# settings.json 在 home 目录下是个人配置，不在 git 仓库内，手动备份或单独管理
git commit -m "feat: 添加 Claude Code statusline 配置"
```
