# Frontend Task Prompt — 新增 Empty 组件并接入博客详情页留言占位

- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-empty-component-post-comment-slot-20260308.md`
- **任务分级与预算 / Sizing & Budget**：`S` 级任务；预计 0.5 天；拆分 3 个子任务；首轮读取不超过 15 个文件或 1500 行；若发现组件导出链路缺失或详情页结构冲突，则先回传缺口再扩展读取。
- **任务背景 / Background**：当前分支 `6-featcomponent-基于styled-components实现empty组件`；项目是 pnpm monorepo，`packages/components` 为基础组件库，`packages/wuh.site.next` 为博客站点。你要求新增一个基于现有样式 token 的 `Empty` 展示组件，并在博客详情页底部接入，用作留言系统预留区域。执行需遵守 `CODEX_RULES.md`（输出顺序、禁止新增依赖、增量验证与最终验证）。
- **目标与范围 / Goals**
  - 必须完成：
    1. 在 `packages/components/empty/` 实现可复用 `Empty` 组件，样式优先使用现有 CSS 变量 token（例如 `--space-*`、`--font-size-*`、`--normal-*`、`--background-*`、`--text-*`）。
    2. 在博客详情页底部接入该组件，明确“留言系统预留区”的占位语义。
    3. 保持现有页面主流程（正文渲染、冗余信息、分享、上下篇导航）不回归。
  - 可选增强：
    1. 为 `Empty` 提供可选 `title/description/icon` 插槽，便于后续复用。
    2. 将详情页已有本地空态样式统一到组件库 `Empty`，减少重复实现。
  - 不在范围：
    1. 不接入真实留言系统接口与数据存储。
    2. 不新增第三方 UI 依赖或评论 SDK。
    3. 不重构博客详情页整体布局信息架构。
- **交互与设计 / UX**：无 Figma 强依赖，沿用当前站点视觉语言；留言占位区需在桌面与移动端均可读；语义需清晰传达“留言功能预留/建设中”；遵守基本可访问性（语义标签、文本可读性、对比度不低于现有页面基线）。
- **技术栈约束 / Tech Stack**：Next.js App Router + React 19 + TypeScript + styled-components；禁止新增依赖；保持 `@wuh.site/components/*` 的目录与导入约定；仅改动任务相关文件。
- **数据与接口 / Data**：本任务无需新增 API；留言占位区采用静态文案；不得修改现有 GitHub Issues 拉取与渲染契约。
- **状态与权限 / State & Auth**：无需新增全局状态与权限逻辑；占位区为纯展示组件。
- **可观测性 / Observability**：暂无新增埋点要求；如后续接入留言系统，可在该区域补埋点。
- **开发步骤建议 / Execution Order**：
  1. 设计 `Empty` 最小可用 API（默认文案 + 可选标题/描述或 children）。
  2. 在 `packages/components/empty/index.tsx` 实现 token 驱动样式，并补充 `readme.md` 最小使用说明。
  3. 在 `packages/wuh.site.next/app/post/PostView.tsx` 底部接入 `Empty` 作为留言占位，必要时调整 `app/post/styles/index.ts`。
  4. 执行增量 lint 与页面手动回归，确认主链路稳定。
- **交付物 / Deliverables**：
  1. `packages/components/empty/index.tsx`
  2. `packages/components/empty/readme.md`
  3. `packages/wuh.site.next/app/post/PostView.tsx`
  4. `packages/wuh.site.next/app/post/styles/index.ts`（如需）
  5. `codex/skills/x-wuh-components/SKILL.md`（若改动 `packages/components/**`，需同步）
  6. `codex/skills/x-wuh-components/references/component-library-map.md`（若改动 `packages/components/**`，需同步）
- **校验标准 / Validation**：
  - 功能验收：博客详情页底部可见留言预留 `Empty` 区域；样式与现有 token 体系一致；空态文案可读。
  - 测试验收：至少覆盖正常场景（详情页正常渲染）、异常场景（文章缺失时空态显示不冲突）、边界场景（移动端窄屏换行与间距）。
  - 性能验收：不引入额外请求，不增加明显渲染阻塞。
  - 文档验收：`Empty` 组件 README 包含基础示例与核心 props（若扩展 API）。
- **验证策略 / Verification Strategy**：
  - 子任务增量验证命令（必填）：`pnpm --filter @wuh.site/next lint`
  - 合并后模块回归命令（`M/L` 必填）：`pnpm --filter @wuh.site/next lint` + 手动回归 `/post/[number]`
  - 最终全量验证命令（必填）：`pnpm --filter @wuh.site/next lint`（若仓库具备统一 typecheck/test 命令则追加执行并记录结果）
  - CI 验证要求：PR 检查需通过 lint/构建相关检查。
- **止损与升级 / Stop-Loss**：
  - 同一阻塞最大重试次数：2 次。
  - 达到阈值后的升级动作：输出阻塞点、已尝试方案、候选替代实现并等待你决策。
  - 需要用户决策的问题：若“底部”位置定义与现有 Toolbar 冲突，需要你确认留言占位区在 Toolbar 上方还是下方。
- **依赖与风险 / Dependencies & Risks**：
  - 组件 API 设计过度会导致当前任务范围膨胀，需控制在最小可用。
  - 详情页样式若直接复用旧 `Empty` 命名，可能与组件导入命名冲突。
  - 若未同步组件技能文档，后续基于 skill 的自动实现可能出现认知偏差。
- **基础库变更同步 / Skill Sync**：
  - 本任务涉及 `packages/components/**`，完成编码后需同步更新：
    1. `codex/skills/x-wuh-components/SKILL.md`
    2. `codex/skills/x-wuh-components/references/component-library-map.md`
  - 若最终未改动 `packages/components/**`，可在交付说明中标记“无需同步”并给出依据。
- **提交信息规范 / Commit Message**：
  - 使用 Conventional Commits，末尾追加 `#<issue-id>`。
  - 当前分支 `6-featcomponent-基于styled-components实现empty组件`，issue-id 为 `6`。
  - 示例：`feat(post): add token-based empty placeholder for comment slot #6`
- **沟通约定 / Communication**：缺失信息先列 `Pending Input`，默认值放入 `Assumptions`；未确认前不编造接口与交互细节；中间进度保持“当前进展 + 下一步 + 阻塞点”。
- **执行提示 / Runbook**：先按本文件补齐关键决策（占位位置、文案、组件 API 最小边界），确认后再进入编码；实现阶段遵循 `CODEX_RULES.md` 的最终输出顺序（Plan -> Patch -> Tests -> Verify Commands -> Risks & Rollback -> PR Summary）。

- **Pending Input**：
  1. 留言占位 `Empty` 在博客详情页“底部”的精确位置：`Toolbar` 上方还是下方？
  2. 占位文案是否固定为“留言系统预留中/建设中”，是否需要双行（标题 + 描述）？
  3. 是否要求本次把详情页其他空态（如文章加载失败）也统一替换为组件库 `Empty`？
- **Assumptions**：
  - 假设：优先实现最小可用 `Empty`（支持 children + 可选 description），避免过度设计。
  - 假设：留言占位默认放在详情页主内容尾部并保留现有 `Toolbar` 导航。
  - 假设：本次不引入真实留言功能，仅做视觉与语义占位。
