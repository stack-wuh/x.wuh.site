---
name: shadow-openspec-superpowers-workflow-apply
description: 开始执行 — 按 tasks.md 执行代码实现，含预估、worktree 隔离、TDD 门禁、并行 Agent 调度
---
# Apply — 开始执行

按 tasks.md 执行代码实现。执行前预估耗时 + 依赖分析，同 Phase 独立 task 并行 Agent 执行。

## 步骤

### 1. 选择变更
- 有名称直接用
- 否则从上下文推断，或 `openspec list --json` 让用户选
- 提示: "将执行变更: <name>"

### 2. 检查状态
```bash
openspec status --change "<name>" --json
```
- blocked → 提示先创建制品
- all_done → 提示已完成，进入审查
- 否则继续

### 3. 获取执行指令
```bash
openspec instructions apply --change "<name>" --json
```
读取所有 `contextFiles`。

### 4. 预估耗时 + 依赖分析

分析 tasks.md 中的每个 task:
- **预估耗时**: 根据文件数、复杂度估算（新建 1 文件 ~5min，修改 ~3min，配置 ~2min）
- **依赖关系**: 标注相互依赖，构建 DAG
- **分组**: 同一层级、无互相依赖的 task 归入同一 Phase

输出预估表:
```
## 执行计划: <name>

| Phase | Task | 预估 | 依赖 |
|-------|------|------|------|
| 1 | 创建 common 接口 | 5min | - |
| 1 | 异常过滤器 | 5min | - |
| 2 | 修复 DTO | 8min | common 接口 |
| 2 | 标准化 service | 8min | common 接口 |
| 3 | 注册全局过滤器 | 3min | Phase 2 |
| 3 | 更新 controller | 5min | Phase 2 |

总预估: 34min | Phase 1 可并行: 2 tasks → Agent A + Agent B

确认执行计划？
```

### 5. 执行前决策

**工作区隔离:** 计划涉及 2+ 文件修改时，调用 `Skill("superpowers:using-git-worktrees")` 创建隔离 worktree。

**TDD 门禁:** 以下情况必须调用 `Skill("superpowers:test-driven-development")`：新功能实现、复杂重构、Bug 修复。流程：先写能复现的测试 → 确认失败 → 写最小实现 → 确认通过。

**反模式:** 跳过 worktree 直接在主干预改多文件、跳过 TDD 直接写实现。

### 6. 按 Phase 执行

**同一 Phase 内无依赖的 tasks → 并行 Agent 执行**

2+ 完全独立任务调用 `Skill("superpowers:dispatching-parallel-agents")`；多步独立任务调用 `Skill("superpowers:subagent-driven-development")`。

```
Phase 1: 并行启动
Agent(description="Task: 创建 common 接口", prompt="实现 tasks.md task X: ...", run_in_background=true)
Agent(description="Task: 异常过滤器", prompt="实现 tasks.md task Y: ...", run_in_background=true)
```

**有依赖的 tasks → 串行执行（主 Agent）**
等并行 Agent 完成后继续下一 Phase。

**反模式:** 能并行却串行执行、改 A 顺手修 B（违反外科手术式修改）。

**超时处理:**
- 某 Agent 超过预估 2x 未返回 → 标记 `⚠ 超时`，提示用户
- 不阻塞: 其他独立 Agent 继续执行
- 超时 task 由用户决定: 重试 / 跳过 / 手动处理

### 7. 进度追踪

```
## 执行中: <name>
Phase 1/3 | 总进度: 2/6

✓ Agent-A: 创建 common 接口 (4min)
⏳ Agent-B: 异常过滤器 (预估还剩 2min)
```

每个 task 完成后标记 tasks.md: `- [ ]` → `- [x]`，补写实际耗时。

### 8. 执行完成

```
## 执行完成: <name>

| Task | 预估 | 实际 | 状态 |
|------|------|------|------|
| 创建 common 接口 | 5min | 4min | ✓ |
| 异常过滤器 | 5min | 7min | ✓ |
| ... | | | |

总预估: 34min | 总实际: 32min | 并行节省: ~10min

6/6 完成 ✓  建议执行 "代码审查"。
```

### 9. 暂停条件
- 任务不清晰 / 设计问题 / 错误阻塞 / 多个超时 / 用户中断

### 10. 审查不通过回环
如果来自 review 的 ✗ 阻塞 → 只执行阻塞项对应的 task，完成后再次 "代码审查"。
