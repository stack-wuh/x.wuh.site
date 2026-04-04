- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-sticky-button-group.md`
- **任务分级与预算 / Sizing & Budget**：`S` 级；预计 0.5 天；子任务 2-3 个（结构调整/样式联动/验证）；首轮读取 ≤15 个文件或 1500 行；需扩展到 `packages/components/**` 或新增交互时再申请扩展。
- **任务背景 / Background**：博客详情页（Next.js 应用 `packages/wuh.site.next`）右下角吸附按钮组目前包含阅读进度按钮、返回首页、回到页头、点赞占位。branch：`45-feat-新增message提示组件`，需遵守 `CODEX_RULES.md`（输出顺序、无新依赖、仅改任务范围）。需求：移除进度按钮，同时保留渐变进度视觉并迁移到“回到页头”按钮，确保吸附/拖拽体验保持一致。
- **目标与范围 / Goals**
  - 必须完成：
    1. 移除浮动按钮组中的阅读进度按钮及相关 DOM/样式。
    2. 复用当前渐变填充逻辑，使“回到页头”按钮根据滚动进度展示渐变背景（含 light/dark 适配）。
    3. 保留并验证回到页头/返回首页/点赞按钮的事件、拖拽吸附逻辑、可访问性（aria-label、focus）。
  - 可选增强：
    1. 在“回到页头”按钮内增加数值/tooltip 提示当前进度（若设计允许）。
    2. 在移动端针对较小宽度优化渐变显示或提供 reduced-motion 兼容。
  - 不在范围：
    1. 新增服务端接口或真实点赞逻辑。
    2. 改动其他页面或全局主题变量。
    3. 为按钮组持久化拖拽位置。
- **交互与设计 / UX**：按钮组固定在右下（可拖拽吸附左右），按钮连续、无缝隙。移除进度按钮后仍保持统一高度与间距。需确认“回到页头”按钮渐变方向（沿按钮宽度）与状态切换（normal/hover/focus/active）如何与滚动百分比耦合。移动端与 dark mode 需视觉一致；拖拽时仍显示 shadow/active 状态。aria-label 与 title 要更新以反映新视觉。
- **技术栈约束 / Tech Stack**：Next.js 15（app router）+ React 19 + styled-components；依赖 `@wuh.site/components`；禁止引入新包。预期修改文件：`packages/wuh.site.next/app/post/PostView.tsx`、`packages/wuh.site.next/app/post/styles/index.ts`（若渐变逻辑抽离，可能新增 util）。
- **数据与接口 / Data**：无外部 API；滚动进度来自 `scrollPercent` state（window/document）。需确认是否仍保留 state 以驱动渐变。
- **状态与权限 / State & Auth**：仅客户端状态（scrollPercent、拖拽定位）。无权限区分。
- **可观测性 / Observability**：暂无新增埋点；如需统计点击需另行确认。
- **开发步骤建议 / Execution Order**：
  1. 梳理并删除 `FloatingProgress` 及引用，确保 `scrollPercent` 仍可复用于样式 props。
  2. 为“回到页头”按钮添加渐变背景/伪元素，支持根据 `scrollPercent` 动态更新，兼容明暗主题与 hover/focus。
  3. 回归测试拖拽、吸附、点击以及 reduced-motion/移动端表现，更新必要文案或 aria。
- **交付物 / Deliverables**：
  - `packages/wuh.site.next/app/post/PostView.tsx`
  - `packages/wuh.site.next/app/post/styles/index.ts`
  - 若新增样式工具或文档，补充相应文件（TBD 根据实现）。
- **校验标准 / Validation**：
  - 正常：滚动从 0→100% 时“回到页头”按钮背景梯度平滑且数值映射正确；点击按钮平滑返回顶部；返回首页/点赞行为不受影响。
  - 异常：在页面高度不足的情况下（不可滚动）渐变应稳定（默认满格或静态）；拖拽后立即点击不触发误操作；suppressClick 逻辑保持。
  - 边界：深浅色主题切换、移动端宽度、prefers-reduced-motion、快速拖拽/点击连击。
- **验证策略 / Verification Strategy**：
  - 子任务增量命令：`pnpm --filter @wuh.site/next lint`。
  - 合并后模块回归：`pnpm --filter @wuh.site/next build`（触发 Next typecheck）。
  - 最终全量验证：`pnpm lint && pnpm typecheck`（待确认仓库是否配置；若无则说明）。
  - CI：遵循现有 pipeline（TBD）。
- **止损与升级 / Stop-Loss**：同一阻塞尝试 ≤2 次；若渐变需求不明确或涉及组件库抽离，先输出阻塞点并等候确认。
- **依赖与风险 / Dependencies & Risks**：
  - 渐变迁移后缺少数字进度反馈，需确认是否接受。
  - `scrollPercent` 仍需保留，否则丢失滚动监听逻辑。
  - CSS 渐变内联传参需注意 SSR/rehydration 一致性。
  - 拖拽/吸附逻辑使用 `window`，需 guard SSR。
- **基础库变更同步 / Skill Sync**：当前仅触及 `packages/wuh.site.next`，无需同步组件/Hook skill；若未来移动到 `packages/components/float-button` 则需更新 `x-wuh-components`。
- **提交信息规范 / Commit Message**：使用 Conventional Commits，末尾追加 `#45`（branch `45-...`）。
- **沟通约定 / Communication**：缺失信息先列于 Pending Input；遵守 `CODEX_RULES.md` 输出顺序；如需扩展上下文或运行受限命令会提前说明。
- **执行提示 / Runbook**：保持 `Plan → Patch → Tests → Verify → Risks & Rollback → PR Summary`；编码前确认 Pending Input；实现后按 `CODEX_CHECKLIST.md` 自检覆盖范围/测试/回滚。

- **Pending Input**：
  1. 回到页头按钮的渐变是否仍需根据滚动百分比实时更新？是否沿用现有 `ProgressShade` 颜色？
  2. 取消进度按钮后，是否需要替代的数值显示（例如 tooltip/label），或完全仅保留渐变视觉？
  3. Hover/focus/active 状态与渐变叠加的具体表现（渐变保持/变暗/增加描边）？
- **Assumptions**：
  - 假设：滚动百分比状态仍可复用，仅改变呈现位置。
  - 假设：无需新增依赖或抽离到 `packages/components`。
  - 假设：按钮尺寸、拖拽手势、吸附逻辑保持现状，仅视觉发生变化。
