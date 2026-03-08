# Frontend Task Prompt — 博客详情页接入图片预览组件 ImagePreview

- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-post-image-preview.md`
- **任务分级与预算 / Sizing & Budget**：`M` 级任务；预计 0.5-1 天；拆分 4 个子任务；首轮读取不超过 15 个文件或 1500 行；超预算时先输出差异结论与扩展理由。
- **任务背景 / Background**：
  1. 仓库采用 pnpm workspace，`packages/wuh.site.next` 为 Next.js 15 + React 19 应用，基础组件来自 `packages/components`。
  2. 博客详情页位于 `packages/wuh.site.next/app/post/PostView.tsx`，正文通过 `dangerouslySetInnerHTML` 渲染；当前图片仅普通 `<img>` 展示，未接入统一预览。
  3. 组件库已存在 `@wuh.site/components/image-preview`，hooks 库已存在 `useImagePreview`，本任务目标是把它们接入博客详情页阅读流。
  4. 执行需遵守 `CODEX_RULES.md`：输出顺序、禁止新增依赖、保持向后兼容、受影响范围验证。
  5. 需要注意的是，`dangerouslySetInnerHTML` 使用的数据来自于github，点击图片时不许打开新的页签查看图片，改为使用 `ImagePreview` 组件预览。
  6. 还需要使用`Dialog`组件，点击图片时，会打开一个弹窗，我们可以在弹窗中预览当前博客详情中的所有图片文件。
- **目标与范围 / Goals**
  - 必须完成：
    1. 在博客详情页实现“点击正文图片 -> 打开 `ImagePreview`”的预览链路。
    2. 从正文 DOM 中提取图片列表（至少 `src/alt`），并支持按当前点击图片索引打开。
    3. 使用现有 `ImagePreview`（必要时配合 `useImagePreview`）实现打开、关闭、上一张/下一张、ESC 关闭等基础能力。
    4. 保持现有代码块复制、标题锚点、分享组件逻辑不回归。
    5. 更新相关文档（至少任务说明/变更说明；若改动基础库 API 再更新对应 README/skill）。
    6. 不允许点击图片时打开新的页签查看图片，改为使用 `ImagePreview` 组件预览。
  - 可选增强：
    1. 预览标题/描述与文章图片 `alt/title` 映射。
    2. 移动端手势体验与滚动锁定细节优化。
    3. 对 markdown 图片增加视觉提示（hover cursor/遮罩图标）。
  - 不在范围：
    1. 后端接口改造或文章数据结构改造。
    2. 新增第三方预览库或手势库。
    3. 对整个文章样式系统进行大规模重构。
- **交互与设计 / UX**：
  - 桌面端点击正文任意图片进入预览；支持键盘左右切换、Esc 关闭。
  - 预览 UI 复用现有 `ImagePreview` 默认工具栏与缩略图能力（是否展示缩略图可按正文图片数量决定）。
  - 详情页正文阅读体验不应因接入预览而出现跳动、闪烁或焦点异常。
  - 无障碍要求：点击目标可聚焦/可操作，预览控件需保留 aria-label。
- **技术栈约束 / Tech Stack**：
  - Next.js 15 + React 19 + TypeScript + styled-components。
  - 禁止新增依赖；优先复用 `@wuh.site/components/image-preview` 与 `@wuh.site/hooks/*`。
  - 仅修改任务范围内文件，保持向后兼容。
- **数据与接口 / Data**：
  - 输入：`issue.body_html` 渲染后的正文 DOM 图片节点。
  - 输出：传入 `ImagePreview` 的 `items`（`src/alt/title/...`）与当前索引。
  - 错误/异常：当正文无图片或图片 URL 异常时，预览逻辑应安全降级（不抛运行时错误）。
- **状态与权限 / State & Auth**：
  - 页面局部状态管理（open/index/items）；无角色权限逻辑。
- **可观测性 / Observability**：
  - 当前无强制埋点；如新增交互日志需保持可选且不影响主链路。
- **开发步骤建议 / Execution Order**：
  1. 明确正文图片选择器和索引映射策略。
  2. 接入 `ImagePreview` 与打开/关闭状态管理。
  3. 绑定正文图片点击事件并映射到预览索引。
  4. 回归验证复制按钮、锚点注入、分享模块与整体样式。
- **交付物 / Deliverables**：
  - 主要代码：`packages/wuh.site.next/app/post/PostView.tsx`（以及必要的同目录辅助文件）。
  - 文档：本任务计划文档 + 变更说明。
  - 若改动基础库目录：同步更新 `codex/skills/x-wuh-components` / `codex/skills/x-wuh-hooks`。
- **校验标准 / Validation**：
  - 功能验收：点击正文图片可正确打开对应索引；可关闭；可切图；无图片场景不报错。
  - 测试验收：至少覆盖正常路径、异常路径（坏链/空图）、边界路径（单图/大量图片）。
  - 回归验收：代码块复制、标题锚点、分享区、页面滚动行为正常。
- **验证策略 / Verification Strategy**：
  - 子任务增量验证命令：`pnpm --filter @wuh.site/next lint`
  - 合并后模块回归命令：`pnpm --filter @wuh.site/next lint` + 详情页手动回归
  - 最终全量验证命令：`TBD（请确认是否要求 workspace 全量 lint/typecheck/test）`
  - CI 验证要求：`TBD`
- **止损与升级 / Stop-Loss**：
  - 同一阻塞最大重试次数：2
  - 达到阈值后的升级动作：输出阻塞点、已尝试方案、备选路径，等待用户决策。
  - 需要用户决策的问题：是否需要扩展到首页/列表页图片预览统一行为。
- **依赖与风险 / Dependencies & Risks**：
  - `dangerouslySetInnerHTML` 产出的图片节点事件绑定时机有风险，需要在 DOM 增强逻辑内谨慎处理。
  - 图片列表动态变化可能导致索引错位，需保证提取与点击源一致。
  - 若正文含外链图片，下载或跨域行为可能受浏览器限制。
- **基础库变更同步 / Skill Sync**：
  - 若本任务仅改 `packages/wuh.site.next/**`：无需同步 skill。
  - 若改动 `packages/components/**`：同步更新
    - `codex/skills/x-wuh-components/SKILL.md`
    - `codex/skills/x-wuh-components/references/component-library-map.md`
  - 若改动 `packages/hooks/**`：同步更新
    - `codex/skills/x-wuh-hooks/SKILL.md`
    - `codex/skills/x-wuh-hooks/references/hooks-api-map.md`
- **沟通约定 / Communication**：
  - 信息不足先列 `Pending Input` 与 `Assumptions`，确认前不编造实现细节。
  - 最终交付按 `Plan -> Patch -> Tests -> Verify Commands -> Risks & Rollback -> PR Summary` 输出。
- **执行提示 / Runbook**：
  - 先做最小可用链路（点击打开+切图+关闭），再做增强。
  - 每一步改动后执行受影响范围验证，最后再做整体验收。

- **Pending Input**：
  1. 预览是否仅在博客详情页生效，还是要抽象为通用 markdown 图片预览能力？
  2. 缩略图轨道在正文图片很多时是否默认开启（例如 > 6 张）？
  3. 是否需要禁用下载按钮（`allowDownload`）？
  4. 最终全量验证命令是否要求 workspace 级别执行？
  5. 是否要求补自动化测试（目前更偏手动回归）？

- **Assumptions**：
  - 假设：本次仅接入现有 `ImagePreview` 组件能力，不新增依赖。
  - 假设：核心改动集中在 `PostView.tsx`，不改后端数据结构。
  - 假设：若不改 `packages/components` 与 `packages/hooks`，则不触发 skill 同步更新。
