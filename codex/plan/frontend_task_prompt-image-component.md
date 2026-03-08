# Frontend Task Prompt

- **任务背景 / Background**：
  1. 仓库为 pnpm workspace，多包结构中 `packages/wuh.site.next` 运行 Next.js 15 + React 19 站点，`packages/components` 暴露共享 UI 组件；遵循 `CODEX_RULES.md`（Plan→Patch→Tests→Verify→Risks & Rollback→PR Summary、禁止引入新依赖、保持向后兼容）。
  2. 目前直接散落使用 Next.js 原生 `<Image>`，在不同页面有不一致的加载策略、占位图与错误处理；需要封装统一的 Image 组件以提供默认体验并集中维护。
  3. 本次任务在当前 vibe coding 会话（分支 TBD）执行，目标是在组件包中实现 `Image` 组件并在 Next 应用中消费；交付后需在 `codex` 流程内拆分执行（先拆小任务→合并→自检）。

- **目标与范围 / Goals**
  - 必须完成：
    1. 在 `packages/components` 下创建新的 `image/` 模块，导出一个以 Next.js `next/image` 为基础的 `Image` 组件；保留 Next Image 的核心 props，同时提供统一的 `variant`（如 `cover`/`contain`）、`ratio`、`placeholder`、`errorFallback` 等扩展点，内部根据 `packages/components/themes` 的 tokens 设定默认样式。
    2. 实现 loading skeleton/blur placeholder 与错误兜底插画（或 icon），并确保 SSR/CSR 一致；默认 lazy loading、自动推导 `sizes`，允许通过 props 覆盖。
    3. 提供 README/Storybook 或 demo（可在 `packages/wuh.site.next` 内的示例页面）说明 API、示例、响应式策略；更新相关导出索引与类型文件。
  - 可选增强：
    1. 支持 `priority`/`fetchPriority` heuristics（如首屏自动判断）；
    2. 集成 `IntersectionObserver` 细粒度懒加载控制；
    3. 在组件内置埋点 hook 以记录加载失败次数。
  - 不在范围：
    1. 改动 Next.js Image 优化 pipeline 配置（如 `next.config.js` 中 remotePatterns/loader）；
    2. 新增第三方图像处理依赖或服务端代理；
    3. 构建后台上传接口。

- **交互与设计 / UX**：
  - 需对齐现有设计系统：圆角、投影、背景色取自主题变量；在加载/错误状态切换时遵循 reduced-motion（prefers-reduced-motion）
  - 提供可选的 caption/overlay 文案位（如展示版权），在 hover/聚焦时显示；移动端需保持 16:9→1:1 响应式比例。
  - TBD：具体错误图形、skeleton 样式、caption typography；待设计确认。

- **技术栈约束 / Tech Stack**：
  - Next.js 15 + React 19 + TypeScript + styled-components（或项目既有样式方案）；
  - 组件从 `@wuh.site/components` 导出，类型集中在 `packages/components/index.ts`；
  - 禁止引入新依赖（`CODEX_RULES.md` 第2条）；保持 Webpack/Turbopack 兼容；
  - 需考虑 RSC/SSR：仅在 `use client` 组件内使用 DOM API。

- **数据与接口 / Data**：
  - 数据为静态资源 URL、CMS 字段或 Next.js Image loader 生成地址；需记录字段命名（如 `src`, `alt`, `width`, `height`, `sizes`, `priority`）。
  - 若需要从 CMS 拉取 `blurDataURL`，应提供 mock（JSON fixture 或 `packages/wuh.site.next/app/api/mock-images`）。
  - 错误码/异常：加载失败触发 `onError`，需默认 fallback；无额外 API。

- **状态与权限 / State & Auth**：
  - 组件内部维护 loading/error 状态，可暴露 `onLoad`, `onError` callback；
  - 无角色限制，但需避免在 SSR 中访问 `window`；
  - 若需要与全局主题/Feature Flag 联动，透过 props 注入（默认无）。

- **可观测性 / Observability**：
  - 可选地向埋点系统发送 `image_load_error` 事件；如暂不实现，文档需说明如何在使用方通过 props 挂载。
  - 若引入 Feature Flag（如 `enableHighPriorityImages`），记录 flag key 与默认值。

- **开发步骤建议 / Execution Order**：
  1. 明确 API（必填/可选 props、extends of NextImageProps、扩展 props）并拉通设计确认加载/错误样式；输出草案。
  2. 在 `packages/components/image/` 搭建目录结构（组件主体、styles、types、stories/README），实现基于 `next/image` 的包装逻辑（含 ratio wrapper、skeleton、error fallback）。
  3. 编写示例（Storybook 或 `packages/wuh.site.next/app/(demo)/image/page.tsx`），验证不同尺寸、lazy/priority、错误场景；必要时提供 mock 数据。
  4. 更新导出（`packages/components/index.ts` 等）并在 Next 应用中替换至少一个消费点进行冒烟验证。
  5. 运行 lint/typecheck/tests (`pnpm --filter @wuh.site/next lint`, `pnpm --filter @wuh.site/components test?`)；如测试脚本缺失，说明验证方式并按 `CODEX_CHECKLIST.md` 自检。

- **交付物 / Deliverables**：
  - `packages/components/image/index.tsx` + 样式/类型文件；
  - Storybook/demo 页面或 `packages/wuh.site.next` 示例；
  - README/API 文档，必要时更新设计 tokens 或主题；
  - 验证命令输出记录；
  - 若新增 mock 数据，附 JSON/TS fixture。

- **校验标准 / Validation**：
  - 功能：加载成功显示图片、加载中 skeleton、错误 fallback、ratio 与 variant 执行正确、无布局跳动；
  - 测试：至少覆盖正常 src、无 src/错误 src、极小尺寸/超大尺寸边界；
  - 手动：Chrome/Safari/Edge（桌面+移动模拟）、light/dark 模式、reduced-motion；
  - 自动：`pnpm --filter @wuh.site/next lint`、`pnpm --filter @wuh.site/components test`（如可用），必要时 `pnpm --filter @wuh.site/next typecheck`。

- **依赖与风险 / Dependencies & Risks**：
  - Next.js Image 仅支持 server 知晓尺寸，需确认是否强制 width/height；
  - 服务器 remotePatterns 可能限制外链图；需确认 `next.config.js`；
  - SSR Hydration mismatch 若 skeleton/fallback 在 server/client 不一致；
  - 需确认是否允许在组件内部访问 `window.matchMedia`（reduced-motion）。

- **沟通约定 / Communication**：
  - 信息缺失时先列 Pending Input & Assumptions，再继续（`CODEX_RULES.md` 第4条）；
  - 所有回答遵循 `CODEX_RULES` 的输出顺序；
  - 允许使用 `frontend-prompt-template` skill 生成/更新模板；权限升级（如需额外依赖）须提前告知。

- **执行提示 / Runbook**：
  - 拆分任务：先实现最小可用 Image（包裹 Next Image），再迭代 skeleton/错误处理、最后补文档 + 验证；
  - 在编码前确认 `CODEX_TASK_TEMPLATE` 字段映射；提交前按 `CODEX_CHECKLIST` 勾选范围/质量/测试/发布；
  - 若 lint/typecheck 受历史 `dist` 影响，需在 Verify 中记录并提供处理建议。

- **Pending Input**：
  1. 组件最终命名（`Image`, `SmartImage`, 还是前缀化版本）与导出路径？
  2. Skeleton、错误状态的设计稿或参考链接？
  3. 是否需要内置 caption/overlay、lazy loading 策略、优先级自动化规则？
  4. 需要 Storybook、MDX 文档还是 Next 页面示例？
  5. 目标浏览器/设备清单？

- **Assumptions**：
  - 假设：组件放置于 `packages/components/image/` 并通过 `@wuh.site/components` 默认导出；
  - 假设：沿用 styled-components + CSS 变量，不新增第三方依赖；
  - 假设：Next.js 15 `next/image` 为稳定版本，允许在 app router `use client` 组件中使用；
  - 假设：现有 lint/typecheck/test 脚本可用，若缺少测试脚本，允许暂以 Storybook/manual 验证代替但需在 Verify 中说明。
