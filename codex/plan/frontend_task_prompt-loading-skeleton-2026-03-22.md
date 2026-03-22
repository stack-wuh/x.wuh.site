- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-loading-skeleton-2026-03-22.md`
- **任务分级与预算 / Sizing & Budget**：`M` 级；预计耗时 0.5-1 天；子任务数 4；默认上下文预算：首轮最多读取 15 个文件或 1500 行；超预算条件：新增页面或组件超过 2 个需确认
- **任务背景 / Background**：页面之间切换的 Loading 过渡页过于简单，需要实现一个骨架屏公共组件以提升体验。当前分支 `37-feat-新增博客详情页的loading过渡组件`。
- **目标与范围 / Goals**
  - 必须完成：
    1. 新增可复用骨架屏公共组件，用于页面切换 Loading 过渡。
    2. 接入博客详情页 loading（`packages/wuh.site.next/app/post/[number]/loading.tsx`）。
  - 可选增强：无
  - 不在范围：数据层优化、全站统一 loading 管理
- **交互与设计 / UX**：GitHub 风格灰阶骨架（标题条 + 段落条 + 图文块）；轻微 shimmer 动效；遵循 `prefers-reduced-motion`
- **技术栈约束 / Tech Stack**：Next.js App Router + styled-components；不新增依赖
- **数据与接口 / Data**：纯前端组件，无 API
- **状态与权限 / State & Auth**：无权限逻辑
- **可观测性 / Observability**：无新增埋点
- **开发步骤建议 / Execution Order**：实现 Skeleton 组件 → 接入 loading → 文档同步
- **交付物 / Deliverables**：`packages/components/skeleton/index.tsx`、`packages/components/skeleton/readme.md`、`packages/wuh.site.next/app/post/[number]/loading.tsx`
- **校验标准 / Validation**：页面切换展示骨架；动效可见；`prefers-reduced-motion` 下无动画
- **验证策略 / Verification Strategy**：子任务增量验证（访问博客详情页触发 loading）→ 合并回归（切换页面）→ 最终命令按项目现有脚本
- **止损与升级 / Stop-Loss**：同一阻塞最多重试 2 次；阻塞时输出替代实现并等待确认
- **依赖与风险 / Dependencies & Risks**：styled-components 需保持 client 组件；深色模式对比度需校验
- **基础库变更同步 / Skill Sync**：涉及 `packages/components/skeleton/**`，需同步 `codex/skills/x-wuh-components/SKILL.md` 与 `codex/skills/x-wuh-components/references/component-library-map.md`
- **提交信息规范 / Commit Message**：Conventional Commit + 末尾 `#<issue-id>`；issue-id 来自当前分支开头数字（当前分支 issue-id = `37`）
- **沟通约定 / Communication**：信息不足先列 `缺失信息` 与 `默认假设`；最终交付输出顺序严格遵循 `Plan → Patch → Tests → Verify Commands → Risks & Rollback → PR Summary`
- **执行提示 / Runbook**：按计划顺序执行；子任务阶段做增量验证；最终需 lint/typecheck/test 通过（可本地增量 + CI 全量）

- **Pending Input**：无

- **Assumptions**：
  - 假设：未明确允许前不新增依赖。
  - 假设：骨架屏为纯前端 UI，不依赖后端数据。
  - 假设：默认上下文预算为首轮 15 文件/1500 行，超预算需先确认。
