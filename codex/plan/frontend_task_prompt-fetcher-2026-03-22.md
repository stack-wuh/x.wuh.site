- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-fetcher-2026-03-22.md`
- **任务分级与预算 / Sizing & Budget**：`M` 级；预计耗时 0.5-1 天；子任务数 4；默认上下文预算：首轮最多读取 15 个文件或 1500 行；超预算条件：替换超过 6 个请求点需确认
- **任务背景 / Background**：当前页面内直接使用 `fetch` 请求数据，缺少统一封装与治理能力；希望新增 `useFetch` hooks 统一管理请求、入参/出参结构，并便于后续埋点扩展。当前分支 `40-featfetcher-新增请求工具库`。
- **目标与范围 / Goals**
  - 必须完成：
    1. 新增 `useFetch` hooks 封装 `fetch`。
    2. 统一入参/出参结构，便于后续埋点与统一错误处理。
    3. 提供基础用法示例或文档。
    4. 替换现有页面中的直接 `fetch` 调用为统一封装。
  - 可选增强：无
  - 不在范围：鉴权注入、复杂缓存策略、全链路埋点实现
- **交互与设计 / UX**：非 UI 任务 `N/A`
- **技术栈约束 / Tech Stack**：Next.js App Router + React 19；支持未来 React Native/Electron；不新增依赖
- **数据与接口 / Data**：统一 `RequestOptions` 入参（method/headers/query/body/parse/timeout）；输出 `FetchResult<T>`（data/error/status/ok/headers）
- **状态与权限 / State & Auth**：暂不处理鉴权注入，支持 headers 透传
- **可观测性 / Observability**：预留 `onStart/onSuccess/onError/onFinally` 回调，不接入真实埋点
- **开发步骤建议 / Execution Order**：实现 fetcher → 封装 useFetch → 替换现有页面请求 → 文档同步
- **交付物 / Deliverables**：`packages/hooks/useFetch/*`、替换 `packages/wuh.site.next/app/*.tsx` 中 fetch、`codex/skills/x-wuh-hooks/*` 文档更新
- **校验标准 / Validation**：基础请求链路可用（首页/博客列表/详情）；错误时有统一结构
- **验证策略 / Verification Strategy**：子任务增量验证（本地访问 `/`、`/blog`、`/post/[number]`）→ 合并回归（页面跳转）→ 最终命令按项目现有脚本
- **止损与升级 / Stop-Loss**：同一阻塞最多重试 2 次；阻塞时输出替代实现并等待确认
- **依赖与风险 / Dependencies & Risks**：`useFetch` 为客户端 hook，Server Components 使用 fetcher；GitHub API 限流
- **基础库变更同步 / Skill Sync**：涉及 `packages/hooks/**`，需同步 `codex/skills/x-wuh-hooks/SKILL.md` 与 `codex/skills/x-wuh-hooks/references/hooks-api-map.md`
- **提交信息规范 / Commit Message**：Conventional Commit + 末尾 `#<issue-id>`；issue-id 来自当前分支开头数字（当前分支 issue-id = `40`）
- **沟通约定 / Communication**：信息不足先列 `缺失信息` 与 `默认假设`；最终交付输出顺序严格遵循 `Plan → Patch → Tests → Verify Commands → Risks & Rollback → PR Summary`
- **执行提示 / Runbook**：按计划顺序执行；子任务阶段做增量验证；最终需 lint/typecheck/test 通过（可本地增量 + CI 全量）

- **Pending Input**：无

- **Assumptions**：
  - 假设：未明确允许前不新增依赖。
  - 假设：`useFetch` 作为 hooks 放在 `packages/hooks` 内。
  - 假设：入参/出参参考 GitHub API 常见字段（`message` 等）进行容错。
  - 假设：默认上下文预算为首轮 15 文件/1500 行，超预算需先确认。
