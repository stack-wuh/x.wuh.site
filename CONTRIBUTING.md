# 贡献指南

## 变更管理

本项目使用 `shadow-docs/` 目录管理需求 → 方案 → 执行 → 审查 → 发布的完整流程。

### 快速上手

| 你说 | 做什么 |
|------|--------|
| "新需求: xxx" | 需求对齐 + 方案设计，生成 `shadow-docs/changes/<name>/brief.md` |
| "开始执行" | 按 Phase 逐步实现，支持并行 Agent |
| "代码审查" | 验证 + 6 维审查 + 结论分级 |
| "提交" | 归档 brief → commit → PR |

### 目录结构

```
shadow-docs/
├── INDEX.md              # 变更索引
├── knowledge/            # 项目领域知识片段
├── menu.md               # 项目路由表
├── changes/              # 变更记录
│   ├── <date>-<slug>/
│   │   └── brief.md      # 动机 + 决策 + 任务 + 结果
│   └── archive/
```

### brief.md 格式

每个变更一个文件，包含：动机、引用规范、决策（含方案对比和论据）、任务（Phase 分组）、结果。

## 提交规范

使用 conventional commits，commitlint 强制校验。允许的 type：

`build` `feat` `chore` `style` `docs` `ui` `fix` `refactor` `ci` `test`

### 禁止混交

不同类型（type）的改动必须拆分为独立 commit。

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
