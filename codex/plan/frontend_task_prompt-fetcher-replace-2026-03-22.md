- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-fetcher-replace-2026-03-22.md`
- **任务分级与预算 / Sizing & Budget**：`M` 级（初判）；预计耗时 `TBD`；子任务数 `TBD`；默认上下文预算：首轮最多读取 15 个文件或 1500 行；超预算条件：`TBD`
- **任务背景 / Background**：当前应用内存在多处直接使用 `fetch` 的调用，希望全局替换为统一封装的 `useFetch`（或 `fetcher`），便于后续埋点、入参/出参统一和错误处理。当前分支 `40-featfetcher-新增请求工具库`。
- **目标与范围 / Goals**
  - 必须完成：
    1. 全局替换页面内直接 `fetch` 为统一封装（按规则区分 Server/Client）。
    2. 保持现有行为（缓存/排序/字段）不变。
  - 可选增强：`TBD`
  - 不在范围：新增鉴权、埋点平台接入
- **交互与设计 / UX**：非 UI 任务 `N/A`
- **技术栈约束 / Tech Stack**：Next.js App Router + React 19；不新增依赖
- **数据与接口 / Data**：保持现有 API URL 与 query 参数不变
- **状态与权限 / State & Auth**：不处理鉴权注入
- **可观测性 / Observability**：仅使用 `onStart/onSuccess/onError/onFinally` 预留回调
- **开发步骤建议 / Execution Order**：梳理 fetch 调用点 → 按 Server/Client 选择 `fetcher/useFetch` → 替换并验证
- **交付物 / Deliverables**：替换后的页面代码；必要的说明文档（如有）
- **校验标准 / Validation**：首页/博客列表/详情/404/500 正常工作
- **验证策略 / Verification Strategy**：子任务增量验证（访问 `/`、`/blog`、`/post/[number]`）→ 合并回归（导航跳转）→ 最终命令按项目现有脚本
- **止损与升级 / Stop-Loss**：同一阻塞最多重试 2 次；阻塞时输出替代实现并等待确认
- **依赖与风险 / Dependencies & Risks**：GitHub API 限流；Server Components 不可使用 hooks
- **基础库变更同步 / Skill Sync**：若改动 `packages/hooks/**`，需同步 `x-wuh-hooks` 文档（本任务是否涉及：`TBD`）
- **提交信息规范 / Commit Message**：Conventional Commit + 末尾 `#<issue-id>`；issue-id 来自当前分支开头数字（当前分支 issue-id = `40`）
- **沟通约定 / Communication**：信息不足先列 `缺失信息` 与 `默认假设`；最终交付输出顺序严格遵循 `Plan → Patch → Tests → Verify Commands → Risks & Rollback → PR Summary`
- **执行提示 / Runbook**：缺信息先列 Pending Input；补齐后再执行编码；子任务阶段需做增量验证；最终需 lint/typecheck/test 通过（可本地增量 + CI 全量）

- **Pending Input**：
  - `useFetch` 是否仅用于客户端页面？Server Components 是否统一使用 `fetcher` 代替
  - 是否要替换所有 `fetch` 调用（含 `packages/wuh.site.next/app/*` 以外）
  - 验证命令（lint/typecheck/test）
  - 是否允许新增依赖（默认否）

- **Assumptions**：
  - 假设：Server Components 使用 `fetcher`，Client Components 使用 `useFetch`。
  - 假设：仅替换 `packages/wuh.site.next/app` 内的请求点。
  - 假设：保持现有 `revalidate`、`sort`、`state` 等参数不变。
