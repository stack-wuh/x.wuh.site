- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-2026-03-22.md`
- **任务分级与预算 / Sizing & Budget**：`M` 级；预计耗时 0.5-1 天；子任务数 4；默认上下文预算：首轮最多读取 15 个文件或 1500 行；超预算条件：新增页面或组件超过 2 个需确认
- **任务背景 / Background**：用户反馈首页无法看到所有博客，需要在首页添加入口进入新的“博客列表页”；列表页支持分页，按创建时间倒序展示。当前分支 `35-feat-新增博客列表页面`。
- **目标与范围 / Goals**
  - 必须完成：
    1. 首页新增入口，点击进入新博客列表页 `/blog`。
    2. 新博客列表页支持分页（每页 10 条，URL 参数 `?page=`）。
    3. 列表按博客创建时间倒序。
  - 可选增强：无
  - 不在范围：复杂筛选/搜索、标签过滤、后端改造
- **交互与设计 / UX**：沿用首页现有卡片风格与间距；分页使用轻量按钮与页码；响应式沿用项目默认断点；可访问性保持语义化标题与列表结构
- **技术栈约束 / Tech Stack**：Next.js App Router（现有版本）；styled-components；不新增依赖
- **数据与接口 / Data**：GitHub Issues API `https://api.github.com/repos/stack-wuh/blog/issues`；参数 `per_page=10&page=<n>&state=open&sort=created&direction=desc`；字段使用 `id/number/title/html_url/comments/created_at/labels`
- **状态与权限 / State & Auth**：无权限逻辑；页面级数据来自 server 端 fetch
- **可观测性 / Observability**：无新增埋点
- **开发步骤建议 / Execution Order**：新增 `/blog` 页面与数据获取 → 客户端列表 UI → 首页入口调整 → 校验分页行为
- **交付物 / Deliverables**：`packages/wuh.site.next/app/blog/page.tsx`、`packages/wuh.site.next/app/blog/BlogListView.tsx`、首页入口调整（HomeView）
- **校验标准 / Validation**：手动验证分页切换、列表顺序（创建时间倒序）、首页入口跳转；默认浏览器覆盖与现有风格一致
- **验证策略 / Verification Strategy**：子任务增量验证（本地访问 `/blog?page=1`）→ 合并回归（首页到 `/blog` 跳转）→ 最终全量验证命令按项目现有脚本
- **止损与升级 / Stop-Loss**：同一阻塞最多重试 2 次；API 受限时输出降级方案并等待确认
- **依赖与风险 / Dependencies & Risks**：GitHub API 频率限制；Link header 可能缺失导致分页上限未知
- **基础库变更同步 / Skill Sync**：不涉及 `packages/components/**` 或 `packages/hooks/**`（本次仅改 app 层）
- **提交信息规范 / Commit Message**：Conventional Commit + 末尾 `#<issue-id>`；issue-id 来自当前分支开头数字（当前分支 issue-id = `35`）
- **沟通约定 / Communication**：信息不足先列 `缺失信息` 与 `默认假设`；最终交付输出顺序严格遵循 `Plan → Patch → Tests → Verify Commands → Risks & Rollback → PR Summary`
- **执行提示 / Runbook**：按计划顺序执行；子任务阶段做增量验证；最终需 lint/typecheck/test 通过（可本地增量 + CI 全量）

- **Pending Input**：无

- **Assumptions**：
  - 假设：SEO 使用页面 metadata 标题/描述。
  - 假设：分页 URL 仅使用 `?page=`。
