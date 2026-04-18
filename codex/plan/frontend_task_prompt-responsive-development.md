- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-responsive-development.md`
- **任务分级与预算 / Sizing & Budget**：`M`；预计 0.5-1.5 天；拆分 3 个子任务（结构调整、样式逻辑、验证）；首轮读取不超过 15 个文件或 1500 行；超预算时先列出分析结果再请求扩展。
- **任务背景 / Background**：`packages/wuh.site.next` 是 Next.js 15 个人站，目前 `HomeView` 使用固定 980px 宽度、三栏网格和大段留白；需要优化代码结构（分段/组件清晰）并实现手机（≤640px）、平板（<=1024px）和桌面三档响应式体验，以便在不同设备保持可读、可交互的排版.
- **目标与范围 / Goals**
  - 必须完成：
    1. 将 `HomeView` 栅格/CTA/列表部分拆分为易维护的容器 + 内容片段并统一响应式断点（手机/平板/桌面）。
    2. 重新定义 padding/margin/字体/按钮排列，确保手机堆叠、平板双列、桌面三列且 CTA 不溢出。
    3. 维护现有主题变量，避免新增依赖，保持 current Components API。
    4. 将`blog/page.tsx`组件也完成响应式布局
  - 可选增强：逐步抽象出响应式辅助 mixin 或 `@media` 变量便于复用；在大屏下添加 `max-width` 限制以提升可读度。
  - 不在范围：新增 API 接口、构建额外页面/功能、替换全局主题系统。
- **交互与设计 / UX**：参考当前 `HomeView` 视觉，保持 logo/cta/项目卡统一风格；手机端 CTA 按钮换行，列表卡片全幅展示；平板/桌面保持间距；按钮/Tag/Meta 信息之间通过 `gap`、`flex-wrap` 适配；确保暗黑模式下的背景/边界在 `prefers-color-scheme` 下保留.
- **技术栈约束 / Tech Stack**：Next.js 15 + React 19 + styled-components；不能新增依赖；样式仍用 CSS 变量；布局组件保持在 `HomeView` 中，但可以引入辅助 styled components 文件.
- **数据与接口 / Data**：仅静态从 `repos`/`posts` props 渲染，无 API 调用变更；不改动 `fetcher`。
- **状态与权限 / State & Auth**：只涉及 `HomeView` 的本地 `useState` 用于 dialog；响应式改变不需要新增状态/权限。
- **可观测性 / Observability**：无新增埋点或日志。
- **开发步骤建议 / Execution Order**：
  1. 梳理现有 `HomeView` DOM/网格、确认 card、section、cta 的最小结构；
  2. 设计并实现全局响应式变量（breakpoint map 以及 `Main`/`Hero` Padding、`Grid` 结构）；
  3. 微调 card/cta/section 样式（gap、font-size、align）满足三设备；
  4. 本地校验 `pnpm --filter @wuh.site/next lint` + 观察 `HomeView` 在不同 viewport 中是否有 horizontal scroll；
  5. 记录 `HOME` 复杂区域在文档/README 或 PR Summary 中注明响应式决策。
- **交付物 / Deliverables**：`packages/wuh.site.next/app/HomeView.tsx`（结构+样式）；必要时新增样式片段文件（保持 `styled-components`）；`codex/plan/frontend_task_prompt-responsive-development.md`（本 doc）；如有需要可补充 `packages/wuh.site.next/app/components/responsive-grid.tsx` demo.
- **校验标准 / Validation**：
  - 手动：手机/平板/桌面各自 `HomeView` 布局（CTA、grid、dialog 触发位）正常。
  - 自动：`pnpm --filter @wuh.site/next lint`；若触发 `dist` 相关 lint 噪音则说明并记录。
  - 设备：使用浏览器 devtools 轮流设置 390px、768px、1440px 宽度确认无水平滚动。
  - 无障碍：保持按钮/链接 tabbable；不用新增 aria 标签.
- **验证策略 / Verification Strategy**：
  - 子任务增量验证：每次结构/样式变动后运行 `pnpm --filter @wuh.site/next lint`; 若只改样式可进行 `pnpm --filter @wuh.site/next lint --filter HomeView`（若支持）;
  - 合并后模块回归：`pnpm --filter @wuh.site/next lint`; 若影响 `components` 需要额外 `pnpm --filter @wuh.site/components lint`;
  - 最终全量验证：`pnpm --filter @wuh.site/next lint` + optional `pnpm --filter @wuh.site/next test`（如果已有测试覆盖）;
  - CI：遵循现有 repo lint/typecheck/test 组合.
- **止损与升级 / Stop-Loss**：
  - 重试次数 2；遇到响应式布局冲突或 `styled-components` 变量缺失记录并回退到前一状态。
  - 阻塞后汇报当前状态 + 尝试方案 + 可选 fallback（如 revert 分支、保留 desktop-only layout）.
  - 需用户决策：是否允许在现有 `HomeView` 之外新建多个 `styled` 文件，或是否接受某一特定 breakpoint 不精细适配的 fallback.
- **输出要求 / Required Output**：限制参考 `CODEX_RULES.md` 输出顺序（Plan→Patch→Tests→Verify→Risks & Rollback→PR Summary）；中间进度回复为“当前进展 + 下一步 + 阻塞点”。
- **验证命令 / Commands**：`pnpm --filter @wuh.site/next lint`, `pnpm --filter @wuh.site/next test` (if available), `pnpm --filter @wuh.site/components lint` (if components touched).

## Pending Input
- 手机 / 平板 / 桌面具体断点（目前假设 640px、1024px 参考常见标准）需要确认。
- 是否需要单独移动/平板特定组件（比如 CTA 重新排版）或只依赖 `styled-components` breakpoints？
- 需否为 dialog/contact dialog 添加响应式调整？目前 focus on sections listed.

## Assumptions
- 假设：响应式优化仅针对 `HomeView` 入口页、`blog/page.tsx`文档详情页, Next 站点其他页面不受影响。
- 假设：无需新增全局主题变量、API、外部组件库。
- 假设：如需调查更多设备尺寸，可先以 640px（手机）、1024px（平板）、1440px（桌面）为主要参考。
