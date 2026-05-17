---
name: shadow-openspec-superpowers-workflow-propose
description: 创建新需求 — 支持 full 模式（brainstorming + 完整制品）和 ff 模式（快进一键生成）
---
# Propose — 创建新需求

## 模式判断

开场根据上下文判断模式：
- 入口路由传来 "ff" / "快进" → **ff 模式**（跳至下方 ff 章节）
- 入口路由传来 "propose" / "新需求" 或无上下文 → **full 模式**（默认）
- 无法判断 → AskUserQuestion：「完整需求对齐还是快进生成？」

---

## Full 模式 — 完整需求创建

### 1. 需求对齐（brainstorming 门禁）

调用 `Skill("superpowers:brainstorming")` 对齐需求：
- 探索项目上下文（现有文件、文档、最近改动）
- 逐一提问澄清需求（一次一个问题）
- 提出 2-3 个方案，标注推荐方案和理由
- AskUserQuestion 让用户确认需求摘要

**反模式:** 用户说"简单"就跳过 brainstorming — 简单需求往往埋着最多未对齐的假设。

### 2. 确定变更命名和目录

**必读 `openspec/config.yaml`** 的 `rules.proposal` 确认命名规则。常见格式：`{project-name}_{yyyy_MM_DD}` 或 `YYYY-MM-DD-{kebab}`，以 config.yaml 为准。

brainstorming skill 默认写 `docs/superpowers/specs/`，但 openspec 变更必须产出到 `openspec/changes/<name>/`。brainstorming 结束后，将产出的设计文档转化为 openspec 格式：
- `.openspec.yaml` — project/change/date/type/status
- `proposal.md` — 动机、变更范围、非目标
- `design.md` — 技术方案、影响分析
- `tasks.md` — 按 Phase 组织，标注涉及文件、预计耗时
- `specs/<domain>/spec.md` — ## ADDED/MODIFIED/REMOVED + GIVEN/WHEN/THEN

### 3. 创建变更目录

```bash
mkdir -p openspec/changes/<name>/specs/<domain>
```

### 4. 写入全部制品

按上述模板写入 proposal.md、design.md、tasks.md、specs/ 和 .openspec.yaml。

### 5. 展示结果

```
## 新需求已创建: <name>

- proposal.md — 为什么做
- design.md — 技术方案
- tasks.md — N 个实施步骤
- specs/ — 增量需求规格

接下来可以 "需求讨论" 细化方案，或直接 "开始执行"。
```

**注意事项:** 同名变更存在时，询问继续还是新建。

---

## ff 模式 — 快进生成

简单变更跳过 discuss 直接生成全部规划制品。适用条件：单文件修改、输入输出明确、无架构影响、无需技术选型讨论。

### 1. 快速对齐（轻量 brainstorming）

不调用完整 brainstorming，只做一次 AskUserQuestion 确认需求和方案。

### 2. 一键生成制品

遵循 openspec/config.yaml 命名规则，创建 `openspec/changes/<name>/` 目录并写入 .openspec.yaml、proposal.md、design.md、tasks.md、specs/。

### 3. 展示结果

```
## 变更已快进生成: <name>
- proposal.md / design.md / tasks.md / specs/ 已全部生成
建议直接 "开始执行"。
```

复杂变更（多模块、数据模型变更、技术选型）应走完整 propose → discuss 流程。
