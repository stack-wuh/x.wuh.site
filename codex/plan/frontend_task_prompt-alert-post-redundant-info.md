# Frontend Task Prompt — 新增 Alert 组件（博客详情页冗余信息）

- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-alert-post-redundant-info.md`
- **任务分级与预算 / Sizing & Budget**：`M` 级任务；预计 0.5-1 天；拆分 4 个子任务；首轮读取不超过 15 个文件或 1500 行；超预算时先输出差异结论与扩展理由。
- **任务背景 / Background**：
  1. 当前分支：`23-featcm-基于styled-components-实现alert组件`，issue-id 可提取为 `23`。
  2. 博客详情页位于 `packages/wuh.site.next/app/post/PostView.tsx`，当前页面未接入统一的冗余信息提示组件。
  3. 组件库已存在 `packages/components/alert/index.tsx` 占位实现，且引用了不存在的 `../themes/alert.module.scss`，需要改为可用的组件实现并接入页面。
  4. 仓库技术栈为 Next.js 15 + React 19 + TypeScript + styled-components，需遵守 `CODEX_RULES.md`（输出顺序、禁止新增依赖、保持向后兼容、仅改任务范围文件）。
- **目标与范围 / Goals**
  - 必须完成：
    1. `packages/components/alert/` 重构Alert组件, 删除原有的所有文件
    2. 在 `packages/components/alert/` 实现可复用 Alert 组件，满足博客详情页展示冗余信息的首要场景。
    3. Alert 组件样式采用 styled-components（不依赖缺失的 scss 文件），并支持基础可访问性属性（如语义角色与文本可读性）。
    4. 在 `packages/wuh.site.next/app/post/PostView.tsx` 接入 Alert 组件，完成冗余信息展示。
      4.1 需要展示以下字段:更新时间(具体到分钟)、文档原链接(支持点击跳转)、文档标签(labels， 支持点击跳转)
      4.2 文档版权说明
      4.3 将`PostView.tsx`组件中的分享组件放到`Alert`组件中
      4.4 在github中，当前博客归属的`Project`, 支持点击跳转
      4.5 组件位置出现在文档详情的下方，设计实现`Alert`组件注意样式主题一致
      4.6 出现在`PostView.tsx`中的`Alert`组件不需要支持点击关闭
    5. 更新 Alert 组件 README，补充最小使用示例与 Props 说明。
    6. 按规范同步基础库 Skill 文档（见“基础库变更同步 / Skill Sync”）。
  - 可选增强：
    1. 支持多状态样式（`info/success/warning/error`）与可选图标。
    2. 支持可关闭能力（close button）与关闭回调。
    3. 在博客详情页根据数据条件动态展示不同冗余提示。
  - 不在范围：
    1. 后端接口改造或 GitHub Issues 数据结构调整。
    2. 引入新的第三方 UI/图标依赖。
    3. 对博客详情页整体布局进行大规模重构。
- **交互与设计 / UX**：
  - 目标是“可读、低干扰”的冗余提示区块，不影响正文阅读主路径。
  - 组件需兼容桌面与移动端；移动端不应造成横向溢出。
  - 视觉规范（颜色、边框、图标、间距、是否可关闭）当前为 `TBD`，需补充设计基线或示例参考。
- **技术栈约束 / Tech Stack**：
  - Next.js 15 + React 19 + TypeScript + styled-components。
  - 禁止新增依赖；优先复用现有主题 token 与组件代码组织方式。
  - 仅修改任务范围内文件，保持向后兼容。
- **数据与接口 / Data**：
  - 输入：博客详情页渲染所需冗余信息（来源 `TBD`，可为静态文案或 issue 字段映射）。
  - 输出：在 `PostView` 中渲染 Alert 信息区块。
  - 错误/异常：无冗余信息时应安全降级（不渲染或渲染默认提示），不得抛运行时错误。
- **状态与权限 / State & Auth**：
  - 页面局部渲染状态；无角色权限逻辑。
  - 若支持可关闭行为，关闭状态作用域（一次渲染/会话持久）为 `TBD`。
- **可观测性 / Observability**：
  - 当前无强制埋点要求；若新增埋点需保持可选且不影响主链路。
- **开发步骤建议 / Execution Order**：
  1. 定义 Alert 最小 API（内容、类型、可关闭能力、可访问性语义）。
  2. 在 `packages/components/alert/` 完成结构与 styled-components 样式实现。
  3. 在 `PostView.tsx` 接入 Alert，并完成页面位置与响应式验证。
  4. 更新 README 与 skill 映射文档，执行受影响范围验证与手动回归。
- **交付物 / Deliverables**：
  - 代码：
    - `packages/components/alert/index.tsx`
    - `packages/components/alert/styles/index.tsx`
    - `packages/components/alert/readme.md`
    - `packages/wuh.site.next/app/post/PostView.tsx`
    - `packages/wuh.site.next/app/post/styles/index.ts`（若需要新增布局样式）
  - 文档：
    - `codex/plan/frontend_task_prompt-alert-post-redundant-info.md`（本文件）
    - Skill 同步文件（见下）
- **校验标准 / Validation**：
  - 功能验收：博客详情页可正确展示冗余信息 Alert；无数据时降级行为正确；原有正文、标签、分享功能不回归。
  - 测试验收：至少覆盖正常路径、异常路径（空数据/异常文本）、边界路径（超长文本/移动端换行）。
  - 文档验收：Alert README 与 Skill 映射文档同步更新完成。
- **验证策略 / Verification Strategy**：
  - 子任务增量验证命令（必填）：`pnpm --filter @wuh.site/next lint`
  - 合并后模块回归命令（`M/L` 必填）：`pnpm --filter @wuh.site/next lint` + 博客详情页手动回归
  - 最终全量验证命令（必填）：`TBD（请确认是否要求 workspace 级 lint/typecheck/test 全量执行）`
  - CI 验证要求（如适用）：`TBD`
- **止损与升级 / Stop-Loss**：
  - 同一阻塞最大重试次数：2
  - 达到阈值后的升级动作：输出阻塞点、已尝试方案、备选路径，等待用户决策。
  - 需要用户决策的问题：Alert 的视觉规格与内容来源策略。
- **依赖与风险 / Dependencies & Risks**：
  - 当前 Alert 占位实现存在无效样式依赖（missing scss），改造时需避免影响已有导入路径兼容性。
  - 若冗余信息依赖 issue 数据字段，需确认字段稳定性与空值兜底。
  - 新增提示区块可能影响首屏视觉层级，需关注移动端折行与间距回归。
- **基础库变更同步 / Skill Sync**：
  - 本任务改动 `packages/components/**` 时，必须同步更新：
    - `codex/skills/x-wuh-components/SKILL.md`
    - `codex/skills/x-wuh-components/references/component-library-map.md`
  - 若额外改动 `packages/hooks/**`，还需同步更新：
    - `codex/skills/x-wuh-hooks/SKILL.md`
    - `codex/skills/x-wuh-hooks/references/hooks-api-map.md`
- **提交信息规范 / Commit Message**：
  - 必须使用 Conventional Commits，并在末尾追加 issue-id。
  - 当前分支 issue-id 为 `23`，示例：`feat(alert): add reusable alert for post detail redundant info #23`
- **沟通约定 / Communication**：
  - 信息不足时先输出 `Pending Input` 与 `Assumptions`，确认前不编造实现细节。
  - 最终交付需遵守 `CODEX_RULES.md` 输出顺序：
    1) Plan
    2) Patch
    3) Tests
    4) Verify Commands
    5) Risks & Rollback
    6) PR Summary
- **执行提示 / Runbook**：
  - 先完成最小可用版本（可渲染 + 样式 + 页面接入），再做可选增强（多状态/可关闭）。
  - 每个子任务后执行受影响范围验证，最后再做整体验收。
  - 对照 `CODEX_CHECKLIST.md` 完成范围、质量、测试、文档与回滚项自检。

- **Pending Input**：
  1. “冗余信息”具体文案与来源是什么（固定文案 / 配置 / issue 字段映射）？
  2. Alert 在博客详情页的准确位置（标题下方、正文上方、正文下方）？
  3. 需要支持哪些状态类型（仅 `info` 还是 `info/success/warning/error`）？
  4. 是否需要可关闭行为；若需要，关闭状态是否跨路由或刷新持久化？
  5. 是否有明确视觉参考（设计稿/截图/现有组件对齐目标）？
  6. 最终是否要求执行 workspace 级全量验证命令（lint/typecheck/test）？

- **Assumptions**：
  - 假设：本次优先覆盖博客详情页单场景，Alert 先提供最小可用 API，后续再扩展。
  - 假设：不新增任何依赖，完全基于现有 styled-components 与 token 体系实现。
  - 假设：若未明确数据映射规则，首版以静态冗余提示文案落地。
