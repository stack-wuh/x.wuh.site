---
name: openspec-cn
description: >
  OpenSpec 中文工作流 (5 环节): 新需求→需求讨论→开始执行(预估+并行Agent)→代码审查(含ESLint+验收)→归档。
  失败回环: 审查 ✗ → 回到执行修复。
  触发词: 新需求/propose; 需求讨论/explore/design; 开始执行/apply; 代码审查/review/verify; 归档/archive。
  所有输出使用中文，关键字(tasks/proposal/specs/design)保留英文。
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec-cn
  version: "3.0"
---
# OpenSpec 中文工作流

统一入口，按用户意图路由到 5 个子流程。所有文档输出使用中文，结构化关键字（tasks、proposal、specs、design、ADDED、MODIFIED、REMOVED）保留英文。

变更命名: `YYYY-MM-DD-{kebab-case}`，如 `2026-05-01-add-comment-api`。

## 流程状态机

```
propose ──→ discuss ──→ apply ──→ review ──→ archive
 新建需求     需求讨论     开始执行    代码审查      归档
                           ↑            │
                           │   ✓ 通过   │
                           │            │
                           └── ✗ 阻塞 ──┘  (失败回环: 修复后重新审查)
```

- **propose** → **discuss**: 制品创建完成，进入需求讨论细化方案
- **discuss** → **apply**: 方案明确，开始执行
- **apply** → **review**: 所有 task 完成，进入代码审查
- **review ✓** → **archive**: 审查通过，归档
- **review ✗** → **apply**: 有阻塞项，回到执行修复（修复后再次 review）
- **review ⚠** → 用户决定: 修复后归档 / 直接归档

---

## 意图识别

| 用户说 | 子流程 |
|--------|--------|
| "新需求"、"新增需求"、"创建需求"、"propose" | → **propose** |
| "需求讨论"、"讨论一下"、"架构设计"、"技术方案"、"怎么设计"、"explore"、"design" | → **discuss** |
| "开始执行"、"开始前端"、"开始后端"、"执行任务"、"apply" | → **apply** |
| "代码审查"、"review"、"验收"、"verify"、"审查代码" | → **review** |
| "归档"、"需求完成"、"archive" | → **archive** |

已存在的变更名直接使用；否则让用户选择或新建议。

---

## propose — 创建新需求

创建变更目录并生成全部规划制品。

**步骤:**

1. **如果用户未提供需求描述，主动询问**
   > "你想做什么需求？描述一下要构建或修复的内容。"
   从描述提取 kebab-case 名称，组合为 `YYYY-MM-DD-{name}`。

2. **创建变更目录**
   ```bash
   openspec new change "<name>"
   ```

3. **获取制品生成顺序**
   ```bash
   openspec status --change "<name>" --json
   ```
   解析 `applyRequires` 和 `artifacts`。

4. **按依赖顺序创建制品**
   对每个 `ready` 状态的 artifact:
   - `openspec instructions <id> --change "<name>" --json`
   - 读取已完成依赖制品
   - 用 `template` 结构创建文件，`context`/`rules` 作为约束（不写入文件）
   - 重复直到所有 `applyRequires` 制品完成

5. **展示结果**
   ```
   ## 新需求已创建: <name>

   - proposal.md — 为什么做
   - design.md — 技术方案
   - tasks.md — N 个实施步骤
   - specs/ — 增量需求规格

   接下来可以 "需求讨论" 细化方案，或直接 "开始执行"。
   ```

**注意事项:**
- 同名变更存在时，询问继续还是新建
- 制品内容全部使用中文

---

## discuss — 需求讨论

思考模式，只讨论不实现。可读代码、搜索、调研，但不写代码。

根据用户的讨论方向自动调节深度:
- 偏需求 → 聊 WHY/WHAT、用户场景、边界条件
- 偏架构 → 聊 HOW、模块拆分、技术选型、API 设计、数据模型

**立场:**
- 好奇而非指令式 — 自然提问，不照脚本
- 发散 — 给出多个方向，让用户选择
- 可视化 — 善用 ASCII 图表
- 落地 — 必要时探索实际代码库

**工具使用:** Read / Grep / Glob / Bash / WebSearch / WebFetch

**输出语言:** 对话用中文，代码块/命令/路径保留英文。

**讨论方向示例:**
- 需求范围: "这个功能解决什么问题？谁会用？"
- 技术选型: "Redis vs 内存缓存，优缺点对比"
- 模块拆分: "评论模块是独立还是复用 content 模块？"
- 接口设计: "GET /v2/repos 返回什么字段？"

**产出 (可选，视讨论结果):**
- 更新 `proposal.md` — 需求范围变更
- 更新 `design.md` — 技术方案确定
- 创建/更新 `specs/` — 需求规格细化

**讨论结束时:**
- 方案明确 → 建议执行 "开始执行"
- 还需调研 → 列出待调研清单

---

## apply — 开始执行

按 tasks.md 执行代码实现。执行前预估耗时 + 依赖分析，同 Phase 独立 task 并行 Agent 执行。

**步骤:**

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

### 5. 按 Phase 执行

**同一 Phase 内无依赖的 tasks → 并行 Agent 执行**
```
Phase 1: 并行启动
Agent(description="Task: 创建 common 接口", prompt="实现 tasks.md task X: ...", run_in_background=true)
Agent(description="Task: 异常过滤器", prompt="实现 tasks.md task Y: ...", run_in_background=true)
```

**有依赖的 tasks → 串行执行（主 Agent）**
等并行 Agent 完成后继续下一 Phase。

**超时处理:**
- 某 Agent 超过预估 2x 未返回 → 标记 `⚠ 超时`，提示用户
- 不阻塞: 其他独立 Agent 继续执行
- 超时 task 由用户决定: 重试 / 跳过 / 手动处理

### 6. 进度追踪

```
## 执行中: <name>
Phase 1/3 | 总进度: 2/6

✓ Agent-A: 创建 common 接口 (4min)
⏳ Agent-B: 异常过滤器 (预估还剩 2min)
```

每个 task 完成后标记 tasks.md: `- [ ]` → `- [x]`，补写实际耗时。

### 7. 执行完成

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

### 8. 暂停条件
- 任务不清晰 / 设计问题 / 错误阻塞 / 多个超时 / 用户中断

### 9. 审查不通过回环
如果来自 review 的 ✗ 阻塞 → 只执行阻塞项对应的 task，完成后再次 "代码审查"。

---

## review — 代码审查 + 需求验收

apply 完成后的质量门禁，合并代码审查和需求验收。

**触发条件:**
- apply 完成后自动提示进入 review
- 用户主动说 "代码审查" / "review" / "验收"

**审查维度 (7 项):**

### 1. 任务完成度
- tasks.md: 所有 checkbox 是否 `[x]`
- 是否有未完成的遗留任务

### 2. 需求覆盖
- 按 specs 中每个 Requirement 的 GIVEN/WHEN/THEN 检查代码是否覆盖
- 接口路径和响应格式是否匹配 spec

### 3. 设计一致性
- 实现是否匹配 `design.md` 的技术方案
- 模块划分是否符合设计

### 4. ESLint / 代码风格
- 运行 ESLint 检查所有改动文件
  ```bash
  pnpm exec eslint <changed-files> --format stylish 2>&1
  ```
- **error**: 阻塞项，必须修复
- **warning**: 生成 checklist 交给用户决定
- 不在 review 中自动 fix

### 5. 代码质量
- 重复代码、过长函数（>50行）、过深嵌套（>3层）
- 命名是否清晰；有无不必要的抽象
- 错误处理是否完整

### 6. 安全性
- 输入校验、注入风险、敏感信息泄露、权限控制

### 7. 性能 + 变更范围
- N+1 查询、缺失索引、阻塞操作、是否缺分页
- 是否有超出 proposal 范围的改动

**审查方式:**

1. 读取变更制品: `proposal.md`, `design.md`, `tasks.md`, `specs/`
2. `git diff --name-only` 获取改动文件
3. 运行 ESLint 检查改动文件
4. 逐一读取改动文件，对照 7 个维度审查

**输出审查报告:**

```
## 代码审查: <name>

### 任务完成度: 6/6 ✓

### 需求覆盖
- content-api: ✓ 分页格式 / ✓ 404处理 / ✓ 查询校验
- repos-api: ✓ GitHub接口 / ✓ 缓存策略

### 设计一致性 ✓

### ESLint
- ✗ error (1): src/app.service.ts:15 — no-unused-vars
- ⚠ warning (3): 见 checklist

### 代码质量
- ⚠ content.service.ts:42 — findAll 方法 60 行，建议拆分

### 安全性 ✓

### 性能 + 变更范围 ✓

### 审查结论: ✗ 阻塞

阻塞项 (必须修复):
1. [ ] ESLint error: src/app.service.ts:15 no-unused-vars

建议项 (用户决定):
2. [ ] content.service.ts findAll 拆分查询逻辑

ESLint Warning Checklist (用户决定):
3. [ ] src/main.ts:12 — prefer-const
4. [ ] src/repos.service.ts:25 — @typescript-eslint/no-explicit-any
5. [ ] src/content.controller.ts:30 — max-lines-per-function
```

**审查结果分级 + 回环:**

| 结果 | 含义 | 动作 |
|------|------|------|
| ✓ 通过 | 无阻塞项 | → 执行 "归档" |
| ⚠ 建议 | 有建议无阻塞 | 用户决定: 修复→归档 / 直接归档 |
| ✗ 阻塞 | 有必须修复的问题 | → 回到 apply 修复阻塞项 → 重新审查 |

**✗ 阻塞回环流程:**
1. 列出阻塞项清单
2. 用户确认后回到 apply 子流程
3. apply 只执行阻塞项修复 task
4. 修复完成后自动触发重新审查
5. 直到 ✓ 或 ⚠（用户决定停止）

---

## archive — 归档

变更合并到主规范并归档。

**步骤:**

1. 确认: 审查结果为 ✓ 或用户对 ⚠ 决定归档
2. 无名称时 `openspec list --json` 让用户选择（只展示活跃变更）
3. `openspec status --change "<name>" --json` 确认状态
4. 有未完成项时警告并确认
5. `openspec archive "<name>"` 执行归档
6. 验证归档结果

**输出:**
```
## 变更已归档

**变更:** <name>
**归档位置:** openspec/changes/archive/YYYY-MM-DD-<name>/
**合并的 Specs:** xxx
```
