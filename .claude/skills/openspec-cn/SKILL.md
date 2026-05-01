---
name: openspec-cn
description: >
  OpenSpec 中文工作流。触发词: 新需求/新增需求/开始新需求 → propose;
  需求讨论/开发讨论/任务讨论 → explore; 架构设计/技术方案 → explore(design);
  开始执行/开始前端任务/开始后端任务/开始设计任务 → apply;
  代码审查/code review/审查代码/review → review;
  归档/需求完成 → archive; 需求验收 → verify.
  所有输出使用中文，关键字(tasks/proposal/specs/design)保留英文。
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec-cn
  version: "1.0"
---

# OpenSpec 中文工作流

统一入口，按用户意图路由到 6 个子流程。所有文档输出使用中文，结构化关键字（tasks、proposal、specs、design、ADDED、MODIFIED、REMOVED）保留英文。

变更命名: YYYY-MM-DD-{kebab-case}，如 `2026-05-01-add-comment-api`。

---

## 意图识别

根据用户的第一句话判断属于哪个子流程:

| 用户说 | 子流程 |
|--------|--------|
| "新需求"、"新增需求"、"开始一个新需求"、"创建需求"、"propose" | → **propose** |
| "需求讨论"、"开发讨论"、"任务讨论"、"讨论一下"、"explore" | → **explore** |
| "架构设计"、"技术方案"、"怎么设计"、"模块拆分" | → **design** |
| "开始执行"、"开始前端"、"开始后端"、"开始设计"、"执行任务"、"apply" | → **apply** |
| "代码审查"、"code review"、"审查代码"、"review"、"review代码" | → **review** |
| "需求验收"、"验收"、"验证需求"、"verify" | → **verify** |
| "归档"、"需求完成"、"archive" | → **archive** |

识别后进入对应子流程。如果有已存在的变更名，直接使用；否则先让用户选择或创建。

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

4. **按依赖顺序逐一创建制品**
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

   所有制品已生成。执行 "开始执行" 开始写代码。
   ```

**注意事项:**
- 同名变更存在时，询问继续还是新建
- 制品内容全部使用中文

---

## explore — 需求讨论

进入思考模式，只讨论不实现。可读代码、搜索、调研，但不写代码。

**立场:**
- 好奇而非指令式 — 自然提问，不照脚本
- 发散 — 给出多个方向，让用户选择
- 可视化 — 善用 ASCII 图表
- 落地 — 必要时探索实际代码库

**工具使用:** Read / Grep / Glob / Bash / WebSearch / WebFetch

**输出语言:** 对话用中文，代码块/命令/路径保留英文。

**讨论结束时:**
- 方案明确 → 建议执行 "新需求" 创建变更
- 还需调研 → 列出待调研清单

---

## design — 架构设计

聚焦技术方案设计。比 explore 更偏向技术实现。

**讨论方向:**
- 模块拆分和职责划分
- 技术选型对比（优缺点表格）
- API 接口路径/请求响应格式设计
- 数据模型和索引策略

**结束:** 方案确定后写入 `design.md`，建议创建正式变更。

---

## apply — 开始执行

按 tasks.md 逐任务实现代码。

**步骤:**

1. **选择变更**
   - 有名称直接用
   - 否则从上下文推断，或 `openspec list --json` 让用户选
   - 提示: "将执行变更: <name>"

2. **检查状态**
   ```bash
   openspec status --change "<name>" --json
   ```
   - blocked → 提示先创建制品
   - all_done → 提示已完成，建议归档
   - 否则继续

3. **获取执行指令**
   ```bash
   openspec instructions apply --change "<name>" --json
   ```
   读取所有 `contextFiles`。

4. **展示进度并逐任务实现**
   ```
   ## 执行中: <name>  进度: 2/6

   正在做: 标准化分页响应格式
   [...代码改动...]
   ✓ 完成
   ```

5. **标记 tasks.md:** `- [ ]` → `- [x]`

6. **暂停条件:** 任务不清晰 / 设计问题 / 错误阻塞 / 用户中断

7. **完成后:** 提示执行 "代码审查" 进行 review。

---

## review — 代码审查

apply 完成后的质量门禁，对照制品审查代码。

**触发条件:**
- apply 完成后自动提示进入 review
- 用户主动说 "代码审查" / "review代码"

**审查维度:**

### 与设计一致性
- 实现是否匹配 `design.md` 的技术方案
- 接口路径、请求/响应格式是否与设计一致
- 模块划分是否符合设计的目录结构

### 代码质量
- 是否有重复代码、过长函数（>50行）、过深嵌套（>3层）
- 命名是否清晰、语义化
- 是否有不必要的抽象或过度工程
- 错误处理是否完整（网络异常、空值、边界条件）

### 安全性
- 用户输入是否做了校验（class-validator / zod）
- 是否有 SQL/MongoDB 注入风险
- 敏感信息（token、密钥）是否泄露到日志或前端
- API 接口是否缺少权限控制（Guards）

### 性能
- 是否有 N+1 查询、缺失索引
- 是否有不必要的阻塞操作
- 大数据量接口是否有分页

### 变更范围
- 是否有超出 `proposal.md` 范围的改动（scope creep）
- 是否删除了不应该删除的代码
- 是否修改了与变更无关的模块

**审查方式:**

1. 读取变更的所有制品: `proposal.md`, `design.md`, `tasks.md`, `specs/`
2. 获取变更涉及的文件: `git diff --name-only` 或从 tasks.md 提取
3. 逐一读取改动文件，对照以上 5 个维度审查
4. 输出审查报告

**输出审查报告:**

```
## 代码审查: <name>

### 设计一致性 ✓/⚠
- 接口路径匹配 design.md ✓
- 响应格式一致 ✓

### 代码质量
- ⚠ content.service.ts:42 — findAll 方法 60 行，建议拆分
- ✓ 命名清晰，无重复代码

### 安全性 ✓
- DTO 校验完整 ✓
- 无敏感信息泄露 ✓

### 性能
- ⚠ repos.service.ts:30 — 缺少索引，建议加 createdAtGitHub 索引

### 变更范围 ✓
- 改动文件均在 proposal 范围内

### 审查结论: ⚠ 2 项建议
1. content.service.ts findAll 方法过长，拆分查询逻辑
2. repos 集合添加 createdAtGitHub 索引

修复后执行 "需求验收"。
```

**审查结果分级:**
- ✓ 通过 — 无问题，可以直接进入验收
- ⚠ 建议 — 有优化建议但不阻塞，建议修复后验收
- ✗ 阻塞 — 有必须修复的问题（安全漏洞、设计不一致），修复后重新审查

**审查完成后:**
- ✓ → 提示执行 "需求验收"
- ⚠ → 列出建议，询问是否修复
- ✗ → 列出阻塞项，必须修复后再次审查

---

## verify — 需求验收

归档前验证代码与制品一致性。

**验收项:**
- tasks.md: 所有 checkbox 是否 `[x]`
- specs: 每个 Requirement 的 GIVEN/WHEN/THEN 是否覆盖
- 代码: 模块注册、类型完整性、文件位置

**输出验收报告:**
```
## 验收报告: <name>

### 任务完成度: 6/6 ✓
### 需求覆盖: 全部通过 ✓
### 代码检查: 通过 ✓

结论: 通过 — 可以执行 "归档"。
```

不通过时列出具体问题和修复建议。

---

## archive — 归档

将变更合并到主规范并归档。

**步骤:**

1. 无名称时 `openspec list --json` 让用户选择（只展示活跃变更）
2. `openspec status --change "<name>" --json` 确认状态
3. 有未完成项时警告并确认
4. `openspec archive "<name>"` 执行归档
5. 验证归档结果

**输出:**
```
## 变更已归档

**变更:** <name>
**归档位置:** openspec/changes/archive/YYYY-MM-DD-<name>/
**合并的 Specs:** xxx
```
