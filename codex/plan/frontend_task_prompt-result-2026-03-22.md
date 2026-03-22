- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-result-2026-03-22.md`
- **任务分级与预算 / Sizing & Budget**：`M` 级；预计耗时 0.5-1 天；子任务数 4；默认上下文预算：首轮最多读取 15 个文件或 1500 行；超预算条件：新增页面或组件超过 2 个需确认
- **任务背景 / Background**：页面 404/500 错误展示过于简单，需要新增 Result 组件并用于错误页引导用户前往 GitHub 或其他平台查看内容。
- **目标与范围 / Goals**
  - 必须完成：
    1. 新增 Result 组件（含 404/500 展示形态）。
    2. 404/500 页面使用 Result 组件，引导用户去 GitHub/其他平台。
    3. 按场景使用 Result 组件，展示不同内容。先提供404/500 展示形态，后续可根据需求扩展。
    4. 支持自定义内容。
  - 可选增强：`TBD`
  - 不在范围：`TBD`
- **交互与设计 / UX**：GitHub 风格卡片；提供引导链接；视觉上不空洞，强调下一步去向\n+- **技术栈约束 / Tech Stack**：Next.js App Router + styled-components；不新增依赖\n+- **数据与接口 / Data**：纯前端组件，无 API\n+- **状态与权限 / State & Auth**：无权限逻辑\n+- **可观测性 / Observability**：无新增埋点\n+- **开发步骤建议 / Execution Order**：实现 Result 组件 → 404/500 页面接入 → 文档同步\n+- **交付物 / Deliverables**：`packages/components/result/index.tsx`、`packages/components/result/404.tsx`、`packages/components/result/500.tsx`、`packages/components/result/readme.md`、`packages/wuh.site.next/app/not-found.tsx`、`packages/wuh.site.next/app/error.tsx`、`packages/wuh.site.next/app/post/[number]/error.tsx`\n+- **校验标准 / Validation**：404/500 页面展示引导信息与外链；按钮交互正常\n+- **验证策略 / Verification Strategy**：子任务增量验证（访问不存在页面、触发 error）→ 合并回归（全站导航）→ 最终命令按项目现有脚本\n+- **止损与升级 / Stop-Loss**：同一阻塞最多重试 2 次；阻塞时输出替代方案并等待确认\n+- **依赖与风险 / Dependencies & Risks**：深色模式对比度需校验；外链可用性依赖平台状态\n@@
- **基础库变更同步 / Skill Sync**：涉及 `packages/components/result/**`，需同步 `codex/skills/x-wuh-components/SKILL.md` 与 `codex/skills/x-wuh-components/references/component-library-map.md`
- **提交信息规范 / Commit Message**：Conventional Commit + 末尾 `#<issue-id>`；issue-id 来自当前分支开头数字（当前分支 issue-id = `37`）
- **沟通约定 / Communication**：信息不足先列 `缺失信息` 与 `默认假设`；最终交付输出顺序严格遵循 `Plan → Patch → Tests → Verify Commands → Risks & Rollback → PR Summary`
- **执行提示 / Runbook**：按计划顺序执行；子任务阶段做增量验证；最终需 lint/typecheck/test 通过（可本地增量 + CI 全量）\n+\n+- **Pending Input**：无\n+\n+- **Assumptions**：\n+  - 假设：未明确允许前不新增依赖。\n+  - 假设：Result 为纯前端组件，不依赖后端数据。\n+  - 假设：默认上下文预算为首轮 15 文件/1500 行，超预算需先确认。\n*** End Patch"}}
