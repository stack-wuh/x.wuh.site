# 贡献指南

## OpenSpec 规格驱动开发

本项目使用 OpenSpec 管理需求 → 设计 → 实现 → 审查 → 归档的完整开发流程。所有自然语言指令通过 `/openspec-cn` 技能路由。

### 快速上手

在 Claude Code 中输入以下自然语言指令即可：

| 你说 | 做什么 |
|------|--------|
| "新需求: xxx" | 创建变更，生成 proposal / design / tasks / specs |
| "需求讨论" | 讨论技术方案，不写代码 |
| "开始执行" | 按 tasks.md 逐步实现，并行 Agent 加速 |
| "代码审查" | ESLint + 需求覆盖 + 代码质量 + 安全性检查 |
| "归档" | 变更归档，delta specs 合并到主规格 |

### 流程状态机

```
新需求 → 需求讨论 → 开始执行 → 代码审查 → 归档
  ↑                              │
  └──── ✗ 阻塞，回到执行修复 ────┘
```

- **新需求**：创建 `openspec/changes/<YYYY-MM-DD-name>/` 目录及全部制品
- **需求讨论**：聊需求范围、技术选型、接口设计，更新制品
- **开始执行**：预估耗时 + 依赖分析，同 Phase 内独立 task 并行执行
- **代码审查**：7 维度审查（任务完成度、需求覆盖、设计一致性、ESLint、代码质量、安全性、性能）
- **归档**：变更移入 archive，delta specs 合并到 `openspec/specs/`

## OpenSpec 目录结构

```
openspec/
├── config.yaml              # 项目上下文与制品规则
├── specs/                   # 【当前系统规格】按能力域命名，持续演进
│   ├── content-api/
│   │   └── spec.md          # 内容 API 完整规格
│   ├── error-handling/
│   │   └── spec.md          # 错误处理规格
│   └── repos-api/
│       └── spec.md          # Repos API 规格
└── changes/                 # 【变更记录】按日期命名，一次性
    ├── <YYYY-MM-DD-name>/   # 活跃变更
    │   ├── proposal.md      # 为什么做、做什么
    │   ├── design.md        # 技术方案
    │   ├── tasks.md          # 实施步骤（含预估/实际耗时）
    │   └── specs/           # 此变更的 delta 规格
    │       └── <capability>/
    │           └── spec.md
    └── archive/             # 已归档变更
        └── <YYYY-MM-DD-name>/
```

### 关键约定

| 目录 | 命名规则 | 生命周期 |
|------|----------|----------|
| `changes/<YYYY-MM-DD-name>/` | 日期前缀，如 `2026-05-01-add-repos` | 一次性，完成后归档 |
| `specs/<capability>/` | 能力域名，如 `content-api` | 持续演进，同名合并 |

### 制品说明

| 制品 | 内容 | 关键字 |
|------|------|--------|
| `proposal.md` | 变更原因、影响范围 | `## Why` / `## What Changes` |
| `design.md` | 技术方案、模块影响、API 设计 | 中文 |
| `tasks.md` | Phase 分组、文件路径、预估/实际耗时 | `- [ ]` checkbox |
| `specs/*.md` | 需求规格，GIVEN/WHEN/THEN 格式 | `## ADDED` / `## MODIFIED` / `## REMOVED` |

## 提交规范

使用 conventional commits，commitlint 强制校验。允许的 type：

`build` `feat` `chore` `style` `docs` `ui` `fix` `refactor` `ci` `test`

### 禁止混交

不同类型（type）的改动必须拆分为独立 commit。例如 docs 类型的 `.md` 文件不能和 feat 类型的 `.ts` 文件一起提交。

使用 `/smart-commit` 技能自动完成分组和提交。

## 开发环境

```bash
# 前端 (port 3000)
pnpm dev:next

# 后端 (port 3200)
pnpm dev:nest

# 全量同步 GitHub Issues → MongoDB
pnpm sync:init

# TypeScript 类型检查
pnpm exec tsc --noEmit
```

## 仓库结构

```
packages/
├── wuh.site.next      # 前端 (Next.js 15 App Router)
├── wuh.site.nest      # 后端 (NestJS 10 + Mongoose 8)
├── components         # UI 组件库
├── hooks              # 共享 hooks
├── config             # 类型/配置包
├── shared-contracts   # 前后端共享 DTO 类型
└── docs               # 文档预留
```
