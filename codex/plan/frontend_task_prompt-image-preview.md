# Frontend Task Prompt — ImagePreview Component

- **任务背景 / Background**：
  1. 仓库为 pnpm workspace：`packages/wuh.site.next` (Next.js 15 + React 19 应用) 消费 `packages/components` 中的通用 UI；所有实现需遵守 `CODEX_RULES.md` 的输出顺序（Plan→Patch→Tests→Verify→Risks & Rollback→PR Summary）、禁止擅自新增依赖并保持向后兼容。
  2. 目前站点在相册/文章/项目页上使用原生 `<img>` 或第三方 Lightbox，体验分散：缺少统一的图片预览组件，缺乏缩略图同步、键盘导览、触屏手势与错误兜底，且各页面手写的 overlay/动画不一致。
  3. 任务目标是在组件包内实现可复用的 `ImagePreview` 组件（含 Hook/上下文）并在 Next 应用中可直接集成；会话分支待定（由执行者在实际开发时创建/填写）。

- **目标与范围 / Goals**
  - 必须完成：
    1. 在 `packages/components/image-preview/` 创建 `ImagePreview` 组件，支持列表/单图两种入口，包含缩略图轨道、主预览视窗、全屏模式与光标/触控导航；默认导出到 `@wuh.site/components`。
    2. 组件需支持键盘（← → Esc Enter）、鼠标滚轮/拖拽、触摸滑动；提供内置 zoom（最少 1x/2x/4x 档位）、双击/双指放大、图片旋转 90° 步进、下载按钮开关。
    3. 提供错误/加载状态（skeleton+错误插画），并保证 SSR/CSR 一致；内置焦点管理与 `prefers-reduced-motion` 处理。
    4. 暴露 `useImagePreview` Hook 或 Context API，供页面控制当前索引、打开/关闭、注入自定义 Toolbar；提供 README/Storybook 或 Next Demo 页展示典型场景。
  - 可选增强：
    1. 多图对比模式（双窗对比/同步缩放）。
    2. 视频或 360° 资源的扩展位。
    3. 与埋点系统集成（如 `image_preview_view` / `image_preview_exit`）。
  - 不在范围：
    1. 后端图片处理/上传接口。
    2. 改动 Next.js Image loader / CDN 配置。
    3. 新增第三方 Lightbox 依赖或浏览器插件能力。

- **交互与设计 / UX**：
  - 需获取设计稿或参考（TBD）；默认遵循设计系统的色板、圆角、阴影，夜间模式保持对比度。
  - 主视窗支持 16:9/4:3/自由比例，缩略图在桌面水平排列、移动端可滑动；全屏模式需在移动端隐藏浏览器 UI。
  - 动画：进入/退出 overlay 使用 fade+scale，尊重 `prefers-reduced-motion`；缩略图切换含 150ms 滑动；zoom 过程带缓动。
  - 无障碍：aria-live 宣告当前索引、焦点环可见、按钮 `aria-label` 完整。

- **技术栈约束 / Tech Stack**：
  - Next.js 15 App Router + React 19 + TypeScript；组件必须 `"use client"` 并兼容 SSR。
  - 样式沿用项目方案（styled-components + CSS 变量）；禁止新增依赖，复杂手势优先使用 Pointer API 自行实现。
  - 状态管理可使用内部 `useReducer`/`useControllableState`；若需共享，限制在组件内部 Context。
  - 构建由 pnpm workspace 驱动；Storybook（若存在）需沿用现有配置。

- **数据与接口 / Data**：
  - 输入：`items: Array<{ id, src, alt, width?, height?, blurDataURL?, meta? }>`；可接受视频等扩展类型（TBD）。
  - 输出：回调 `onChange(index)`, `onOpen`, `onClose`, `onDownload(asset)` 等；需记录错误（加载失败）并允许调用方处理。
  - 错误码/异常：图片加载失败需 fallback；手势冲突需优雅降级。
  - Mock 策略：可在 `packages/wuh.site.next/app/(demo)/image-preview/` 中提供本地 JSON。

- **状态与权限 / State & Auth**：
  - 组件内部维护当前索引、zoom、旋转、全屏状态；支持受控模式（外部传入 index/open）。
  - 无角色限制，但当图片包含私有资源时需由调用方自行鉴权；组件层面仅处理展示。

- **可观测性 / Observability**：
  - 提供可选 `onEvent(eventName, payload)` 钩子或埋点回调，默认不上报。
  - 若结合 Feature Flag（如启用新手势），注明 Flag key + 默认值。

- **开发步骤建议 / Execution Order**：
  1. 对齐需求：梳理 props、状态图、交互流程，确认设计稿/响应式规范；补全 Pending Input。
  2. 搭建目录结构：组件主体、子组件（Toolbar、ThumbnailRail、Viewport）、hooks、styles、types。
  3. 实现基础流：受控/非受控预览、键盘+点击导航、overlay 动画、loading/fallback。
  4. 扩展交互：zoom/rotate/drag、手势支持、全屏 API、下载按钮。
  5. 集成 Demo/Storybook + README，验证桌面/移动/无障碍；运行 lint/typecheck/tests，记录命令输出。

- **交付物 / Deliverables**：
  - 代码：`packages/components/image-preview/*.tsx` + 样式 + hooks + index 导出；必要的类型/常量文件。
  - Demo/Storybook：`packages/wuh.site.next/app/(demo)/image-preview/page.tsx` 或现有 Storybook；截图或录屏可选。
  - 文档：README（API, Props 表, 用法示例）、设计对齐说明。
  - 验证命令：`pnpm --filter @wuh.site/next lint`, `pnpm --filter @wuh.site/next test?`, `pnpm --filter @wuh.site/components lint/test`（依据实际脚本）；如缺少脚本需在 Verify 中说明。

- **校验标准 / Validation**：
  - 功能：缩略图与主图同步、键盘/触摸/鼠标可导航、zoom/rotate/下载、错误 fallback、全屏切换、可控/不可控互不冲突。
  - 测试：正常（多图）/异常（加载失败）/边界（单图、超大图、无尺寸）；如无自动测试需提供手动步骤与录屏。
  - 可用性：Chrome/Safari/Firefox/Edge 最新版本 + iOS/Android；light/dark；`prefers-reduced-motion`。
  - 质量门禁：lint/typecheck/test 全绿并对照 `CODEX_CHECKLIST.md` 勾选。

- **依赖与风险 / Dependencies & Risks**：
  - 全屏/手势 API 在 SSR 不可用，需 lazy attach（`useEffect`); 需要 `window` 守卫避免 hydration mismatch。
  - 大图内存占用/性能风险，需考虑懒加载/预加载策略；在低端设备需降级。
  - 如果缺设计稿，需与产品对齐；若 timeline 紧张，可先交付 MVP（仅键盘/点击），在模板中记录里程碑。

- **沟通约定 / Communication**：
  - 遵循 `CODEX_RULES`：若信息不足，先输出缺失清单与假设；所有后续回复也按 Plan→Patch→Tests→Verify→Risks & Rollback→PR Summary。
  - 允许使用 `frontend-prompt-template` skill 复用/更新模板；升级权限（装依赖、修改配置）前需与 Reviewer 确认。

- **执行提示 / Runbook**：
  - 编码前列出 props/state 机表，拆分子组件，优先完成最小可用版本；再叠加 zoom/手势等高级特性。
  - 交付前复查 README/Storybook/验证记录，按 `CODEX_CHECKLIST` 勾选 A-F；有无法执行的测试需在 Verify 注记原因。
  - 若 lint 因历史 `dist` 噪音失败，记录处理策略（清理/忽略）。

- **Pending Input**：
  1. 设计稿、交互动效与缩略图布局规格？
  2. 是否必须支持视频/GIF/360° 资源？
  3. 下载/分享按钮的权限策略？
  4. 目标浏览器与设备列表、性能预算（首帧/交互响应时间）？
  5. 是否需要埋点或 A/B Flag，对接哪套监控？

- **Assumptions**：
  - 假设：组件位于 `packages/components/image-preview/` 并通过 `@wuh.site/components` 导出，Next 应用通过别名引用。
  - 假设：不新增第三方预览/手势依赖；必要功能由原生事件实现。
  - 假设：Storybook 已配置，可新增 `ImagePreview` stories；若不存在则通过 Next demo 页面满足演示需求。
  - 假设：所有图片数据由上游提供完整 `alt`/尺寸信息，组件仅做展示与交互控制。
